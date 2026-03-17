using Contista.Infrastructure.Firestore.Repos;
using Contista.Shared.Core.DTO;
using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Interfaces.Calendar;
using Contista.Shared.Core.Interfaces.Firebase;
using Contista.Shared.Core.Interfaces.Sync;
using Contista.Shared.Core.Models.Calendar;
using Contista.Shared.Core.Offline.Models;
using Contista.Shared.Core.Offline.Models.Calendar;
using Contista.Shared.Core.Offline.Models.Operations;
using Contista.Shared.Core.Offline.Models.Sync;
using System.Text.Json;

namespace Contista.Infrastructure.Firestore.Services
{
    public sealed class SyncApplyService : ISyncApplyService
    {
        private readonly ISyncOpLogRepository _log;
        private readonly ContentPostRepository _posts;
        private readonly UserRepository _users;
        private readonly RoleRepository _roles;
        private readonly MembershipRepository _memberships;
        private readonly ICommonMetaVersionBumper _meta;
        private readonly ICalendarRepository _cal;
        private readonly ICalendarMembershipRepository _calMemberships;
        private readonly ICalendarSettingsRepository _calSettings;
        private readonly ICalendarRefRepository _calRef;

        private static readonly JsonSerializerOptions JsonOpts =
            new(JsonSerializerDefaults.Web);

        public SyncApplyService(
            ISyncOpLogRepository log,
            ContentPostRepository posts,
            UserRepository users,
            RoleRepository roles,
            MembershipRepository memberships,
            ICommonMetaVersionBumper meta,
            ICalendarRepository cal,
            ICalendarMembershipRepository calMemberships,
            ICalendarSettingsRepository calSettings,
            ICalendarRefRepository calRef)
        {
            _log = log;
            _posts = posts;
            _users = users;
            _roles = roles;
            _memberships = memberships;
            _meta = meta;
            _cal = cal;
            _calMemberships = calMemberships;
            _calSettings = calSettings;
            _calRef = calRef;
        }

        public async Task<ApplySyncResponse> ApplyAsync(
            SyncOperation op,
            CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(op.UserId))
                throw new InvalidOperationException("Operation.UserId saknas.");

            if (string.IsNullOrWhiteSpace(op.ClientOperationId))
                throw new InvalidOperationException("Operation.ClientOperationId saknas.");

            // 🔒 Idempotens
            if (await _log.ExistsAsync(op.UserId, op.ClientOperationId, ct))
            {
                return new ApplySyncResponse
                {
                    Applied = false,
                    DuplicateIgnored = true
                };
            }

            string? entityId = null;

            switch (op.OperationType)
            {
                // ---------------- POSTS ----------------
                case SyncOperationType.CreatePost:
                    {
                        var dto = JsonSerializer.Deserialize<CreatePostOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid CreatePost payload.");

                        entityId = await _posts.CreateAsync(op.UserId, dto, ct);
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.UpdatePost:
                    {
                        var dto = JsonSerializer.Deserialize<UpdatePostOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid UpdatePost payload.");

                        entityId = dto.PostId;
                        await _posts.UpdateAsync(op.UserId, dto, ct);
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.DeletePost:
                    {
                        var dto = JsonSerializer.Deserialize<DeletePostOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid DeletePost payload.");

                        entityId = dto.PostId;
                        await _posts.DeleteAsync(op.UserId, dto.PostId, ct);
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                // ---------------- USER ----------------
                case SyncOperationType.UpdateUserProfile:
                    {
                        var dto = JsonSerializer.Deserialize<User>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid UpdateUserProfile payload.");

                        entityId = dto.UserId;
                        await _users.UpdateAsync(dto);
                        break;
                    }

                // ---------------- ADMIN ----------------
                case SyncOperationType.CreateRole:
                    {
                        var dto = JsonSerializer.Deserialize<CreateRoleOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid CreateRole payload.");

                        if (string.IsNullOrWhiteSpace(dto.RoleName))
                            throw new InvalidOperationException("RoleName saknas.");

                        var role = new Role
                        {
                            RoleName = dto.RoleName.Trim()
                        };

                        entityId = await _roles.CreateAsync(role);
                        await _meta.TouchRolesAsync(ct);
                        break;
                    }

                case SyncOperationType.CreateMembership:
                    {
                        var dto = JsonSerializer.Deserialize<CreateMembershipOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid CreateMembership payload.");

                        if (string.IsNullOrWhiteSpace(dto.MembershipName))
                            throw new InvalidOperationException("MembershipName saknas.");

                        if (string.IsNullOrWhiteSpace(dto.MembershipType))
                            throw new InvalidOperationException("MembershipType saknas.");

                        if (dto.MembershipPrice < 0)
                            throw new InvalidOperationException("MembershipPrice kan inte vara negativ.");

                        var membership = new Membership
                        {
                            MembershipName = dto.MembershipName.Trim(),
                            MembershipType = dto.MembershipType.Trim(),
                            MembershipPrice = dto.MembershipPrice,
                            MaxExtraCalendars = dto.MaxExtraCalendars,
                            MaxEventQuota = dto.MaxEventQuota <= 0 ? 100 : dto.MaxEventQuota,
                            IsActive = dto.IsActive,
                            CreateDate = DateTime.UtcNow
                        };

                        entityId = await _memberships.CreateAsync(membership);
                        await _meta.TouchMembershipsAsync(ct);
                        break;
                    }
                // ---------------- CALENDAR ----------------
                case SyncOperationType.CreateCalendar:
                    {
                        var dto = JsonSerializer.Deserialize<CreateCalendarOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid CreateCalendar payload.");
                        dto.Calendar.OwnerUserId = op.UserId;
                        dto.Calendar.LastMutationId = op.ClientOperationId;
                        var id = await _cal.CreateCalendarAsync(dto.Calendar, ct);
                        entityId = id;
                        // Skapa membership åt ägaren
                        if (!string.IsNullOrWhiteSpace(id))
                        {
                            await _calMemberships.UpsertMemberAsync(id, op.UserId, new CalendarMembershipDto
                            {
                                Role = CalendarMemberRole.Owner,
                                CanEdit = true,
                                CanShare = true,
                                CanSeeDetails = true,
                                LastMutationId = op.ClientOperationId
                            }, ct);
                        }

                        await _calRef.UpsertRefAsync(op.UserId, new CalendarRefDto
                        {
                            CalendarId = id,
                            Role = CalendarMemberRole.Owner,
                            CanEdit = true,
                            CanShare = true,
                            CanSeeDetails = true,

                            IsSelectedByDefault = false, // nya kalendrar brukar inte auto-aktiveras
                            DefaultView = CalendarViewMode.Month, // eller från settings
                            UpdatedAtUtc = DateTime.UtcNow,
                            LastMutationId = op.ClientOperationId
                        }, ct);

                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.UpdateCalendar:
                    {
                        var dto = JsonSerializer.Deserialize<UpdateCalendarOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid UpdateCalendar payload.");
                        dto.Calendar.LastMutationId = op.ClientOperationId;
                        await _cal.UpdateCalendarAsync(dto.Calendar, ct);
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.DeleteCalendar:
                    {
                        var dto = JsonSerializer.Deserialize<DeleteCalendarOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid DeleteCalendar payload.");
                        await _cal.DeleteCalendarAsync(dto.CalendarId, ct);
                        await _calRef.RemoveRefAsync(op.UserId, dto.CalendarId, ct);
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.UpsertCalendarMembership:
                    {
                        var dto = JsonSerializer.Deserialize<UpsertCalendarMembershipOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid UpsertCalendarMembership payload.");
                        dto.Membership.LastMutationId = op.ClientOperationId;
                        await _calMemberships.UpsertMemberAsync(dto.CalendarId, dto.UserId, dto.Membership, ct);
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.RemoveCalendarMembership:
                    {
                        var dto = JsonSerializer.Deserialize<RemoveCalendarMembershipOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid RemoveCalendarMembership payload.");
                        await _calMemberships.RemoveMemberAsync(dto.CalendarId, dto.UserId, ct);
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.UpdateCalendarSettings:
                    {
                        var dto = JsonSerializer.Deserialize<UpdateCalendarSettingsOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid UpdateCalendarSettings payload.");
                        dto.Settings.UserId = op.UserId;
                        dto.Settings.LastMutationId = op.ClientOperationId;
                        await _calSettings.UpsertSettingsAsync(dto.Settings, ct);
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.CreateCalendarEvent:
                    {
                        var dto = JsonSerializer.Deserialize<CreateCalendarEventOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid CreateCalendarEvent payload.");

                        dto.Event.LastMutationId = op.ClientOperationId;

                        var createdId = await _cal.CreateEventAsync(dto.Event, ct);

                        if (string.IsNullOrWhiteSpace(createdId))
                            throw new InvalidOperationException("CreateEventAsync misslyckades (ingen eventId).");

                        entityId = createdId;

                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);

                        break;
                    }

                case SyncOperationType.UpdateCalendarEvent:
                    {
                        var dto = JsonSerializer.Deserialize<UpdateCalendarEventOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid UpdateCalendarEvent payload.");

                        dto.Event.LastMutationId = op.ClientOperationId;

                        if (string.IsNullOrWhiteSpace(dto.Event.EventId))
                            throw new InvalidOperationException("UpdateCalendarEvent: EventId saknas.");

                        entityId = dto.Event.EventId;

                        var ok = await _cal.UpdateEventAsync(dto.Event, ct);
                        if (!ok)
                            throw new InvalidOperationException("UpdateEventAsync misslyckades.");

                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.DeleteCalendarEvent:
                    {
                        var dto = JsonSerializer.Deserialize<DeleteCalendarEventOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid DeleteCalendarEvent payload.");

                        if (string.IsNullOrWhiteSpace(dto.EventId))
                            throw new InvalidOperationException("DeleteCalendarEvent: EventId saknas.");

                        entityId = dto.EventId;

                        var ok = await _cal.DeleteEventAsync(dto.CalendarId, dto.EventId, ct);
                        if (!ok)
                            throw new InvalidOperationException("DeleteEventAsync misslyckades.");

                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }

                case SyncOperationType.AcknowledgeCalendarConflict:
                    {
                        var dto = JsonSerializer.Deserialize<AcknowledgeCalendarConflictOperationDto>(
                                      op.PayloadJson, JsonOpts)
                                  ?? throw new InvalidOperationException("Invalid AcknowledgeCalendarConflict payload.");

                        // Enkel första version: hämta event i minnet i klient, men här kan du:
                        // 1) läsa event doc
                        // 2) uppdatera fields ConflictAcknowledgedByUserIds + HasConflict + ConflictWithEventIds
                        // För nu: du kan göra detta i UpdateEventAsync från klienten istället.
                        await _users.TouchUpdatedAtAsync(op.UserId, DateTime.UtcNow, ct);
                        break;
                    }
                case SyncOperationType.DeleteCalendarWithMove:
                    {
                        var dto = JsonSerializer.Deserialize<DeleteCalendarWithMoveOperationDto>(op.PayloadJson, JsonOpts)
                                    ?? throw new InvalidOperationException("Invalid DeleteCalendarWithMove payload.");

                        if (string.IsNullOrWhiteSpace(dto.SourceCalendarId))
                            throw new InvalidOperationException("SourceCalendarId saknas.");

                        var sourceCal = await _cal.GetCalendarByIdAsync(dto.SourceCalendarId, ct);
                        if (sourceCal is null)
                            throw new InvalidOperationException("Source calendar finns inte.");

                        // server MUST validate owner + not primary
                        if (!string.Equals(sourceCal.OwnerUserId, op.UserId, StringComparison.Ordinal))
                            throw new UnauthorizedAccessException("Endast owner kan ta bort kalendern.");

                        if (sourceCal.IsPrimary)
                            throw new InvalidOperationException("Primary calendar kan inte tas bort.");

                        string? targetId = null;
                        if (string.Equals(dto.Mode, "move", StringComparison.OrdinalIgnoreCase))
                        {
                            targetId = dto.TargetCalendarId;
                            if (string.IsNullOrWhiteSpace(targetId))
                                throw new InvalidOperationException("TargetCalendarId krävs när Mode=move.");

                            if (string.Equals(targetId, dto.SourceCalendarId, StringComparison.Ordinal))
                                throw new InvalidOperationException("TargetCalendarId kan inte vara samma som source.");

                            var targetCal = await _cal.GetCalendarByIdAsync(targetId, ct);
                            if (targetCal is null)
                                throw new InvalidOperationException("Target calendar finns inte.");

                            if (!string.Equals(targetCal.OwnerUserId, op.UserId, StringComparison.Ordinal))
                                throw new UnauthorizedAccessException("Du kan bara flytta till en kalender du själv äger.");
                        }

                        var sourceEvents = await _cal.GetAllEventsAsync(dto.SourceCalendarId, ct);

                        if (!string.IsNullOrWhiteSpace(targetId))
                        {
                            foreach (var ev in sourceEvents)
                            {
                                var newId = DeterministicMovedEventId(op.ClientOperationId, dto.SourceCalendarId, ev.EventId);

                                var copy = CloneEventForMove(ev);
                                copy.CalendarId = targetId;
                                copy.EventId = newId;

                                if (dto.SetHasConflictOnMovedEvents)
                                {
                                    copy.HasConflict = true;
                                    copy.ConflictWithEventIds = new List<string>();
                                }

                                copy.LastMutationId = op.ClientOperationId;

                                await _cal.UpsertEventWithIdAsync(targetId, newId, copy, ct);
                            }
                        }

                        foreach (var ev in sourceEvents)
                        {
                            if (!string.IsNullOrWhiteSpace(ev.EventId))
                                await _cal.DeleteEventAsync(dto.SourceCalendarId, ev.EventId!, ct);
                        }

                        await _cal.DeleteCalendarAsync(dto.SourceCalendarId, ct);

                        // memberships + settings cleanup
                        var memberRows = await _calMemberships.GetMemberRowsAsync(dto.SourceCalendarId, ct);
                        var memberUserIds = memberRows
                            .Select(x => x.UserId)
                            .Where(x => !string.IsNullOrWhiteSpace(x))
                            .Distinct(StringComparer.Ordinal)
                            .ToList();

                        foreach (var memberUserId in memberUserIds)
                        {
                            await _calMemberships.RemoveMemberAsync(dto.SourceCalendarId, memberUserId!, ct);
                            await _calRef.RemoveRefAsync(memberUserId!, dto.SourceCalendarId, ct);

                            var settings = await _calSettings.GetSettingsAsync(memberUserId!, ct);
                            if (settings is not null)
                            {
                                settings.SelectedCalendarIds = (settings.SelectedCalendarIds ?? new List<string>())
                                    .Where(x => !string.Equals(x, dto.SourceCalendarId, StringComparison.Ordinal))
                                    .ToList();

                                if (string.Equals(settings.PrimaryCalendarId, dto.SourceCalendarId, StringComparison.Ordinal))
                                    settings.PrimaryCalendarId = "";

                                settings.LastMutationId = op.ClientOperationId;
                                await _calSettings.UpsertSettingsAsync(settings, ct);
                            }
                        }

                        entityId = dto.SourceCalendarId;
                        break;
                    }


                default:
                    throw new NotSupportedException(
                        $"OperationType not supported: {op.OperationType}");
            }

            // 🧾 Logga alltid EFTER lyckad apply
            var log = new SyncOpLog
            {
                UserId = op.UserId,
                OperationId = op.ClientOperationId,
                OperationType = op.OperationType,
                EntityId = entityId,
                ClientTimestampUtc = op.ClientTimestampUtc,
                AppliedAtUtc = DateTime.UtcNow,
                DetailsJson = op.PayloadJson
            };

            await _log.MarkAppliedAsync(log, ct);

            return new ApplySyncResponse
            {
                Applied = true,
                DuplicateIgnored = false
            };
        }


        private static string DeterministicMovedEventId(string opId, string sourceCalId, string? sourceEventId)
        {
            var raw = $"{opId}|{sourceCalId}|{sourceEventId ?? ""}";
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(raw));
            // 20 chars is plenty and keeps URL short
            return "mv_" + Convert.ToHexString(bytes).ToLowerInvariant().Substring(0, 20);
        }

        private static CalendarEventDto CloneEventForMove(CalendarEventDto e)
        {
            return new CalendarEventDto
            {
                // ids set outside
                Type = e.Type,
                Title = e.Title,
                Description = e.Description,
                Location = e.Location,

                StartUtc = e.StartUtc,
                EndUtc = e.EndUtc,
                IsAllDay = e.IsAllDay,

                Availability = e.Availability,
                Visibility = e.Visibility,

                Reminders = e.Reminders?.Select(r => new ReminderDto
                {
                    Channel = r.Channel,
                    MinutesBeforeStart = r.MinutesBeforeStart
                }).ToList() ?? new List<ReminderDto>(),

                Recurrence = e.Recurrence is null ? null : new RecurrenceDto
                {
                    Frequency = e.Recurrence.Frequency,
                    Interval = e.Recurrence.Interval,
                    ByWeekDays = e.Recurrence.ByWeekDays?.ToList() ?? new List<DayOfWeek>(),
                    UntilUtc = e.Recurrence.UntilUtc,
                    Count = e.Recurrence.Count,
                    SeriesId = e.Recurrence.SeriesId
                },

                IsDone = e.IsDone,
                Checklist = e.Checklist?.Select(c => new ChecklistItemDto
                {
                    Id = c.Id,
                    Text = c.Text,
                    Done = c.Done,
                    Order = c.Order
                }).ToList() ?? new List<ChecklistItemDto>(),

                ContentPostId = e.ContentPostId,

                // conflict handled outside (you wanted HasConflict=true on moved)
                HasConflict = e.HasConflict,
                ConflictWithEventIds = e.ConflictWithEventIds?.ToList() ?? new List<string>(),
                ConflictAcknowledgedByUserIds = e.ConflictAcknowledgedByUserIds?.ToList() ?? new List<string>(),

                CreatedAtUtc = e.CreatedAtUtc,
                UpdatedAtUtc = DateTime.UtcNow,

                CreatedById = e.CreatedById, // NEW
            };
        }


    }
}
