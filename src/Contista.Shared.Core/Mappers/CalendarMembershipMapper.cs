using Contista.Shared.Core.DTO.Calendar;
using Contista.Shared.Core.Models;
using Contista.Shared.Core.Models.Calendar;

public static class CalendarMembershipMapper
{
    public static FirestoreDocument FromCalendarMembership(CalendarMembershipDto m)
    {
        m.UpdatedAtUtc = DateTime.UtcNow;

        return new FirestoreDocument
        {
            Fields = new Dictionary<string, FirestoreValue>
            {
                ["Role"] = ((int)m.Role).ToFirestoreValue(),
                ["CanEdit"] = m.CanEdit.ToFirestoreValue(),
                ["CanShare"] = m.CanShare.ToFirestoreValue(),
                ["CanSeeDetails"] = m.CanSeeDetails.ToFirestoreValue(),
                ["UpdatedAtUtc"] = m.UpdatedAtUtc.ToFirestoreTimestamp(),
                ["LastMutationId"] = (m.LastMutationId ?? "").ToFirestoreValue(),
                ["InviteStatus"] = ((int)m.InviteStatus).ToFirestoreValue()
            }
        };
    }

    public static CalendarMembershipDto ToCalendarMembership(FirestoreDocument doc)
    {
        var f = doc.Fields ?? new();

        return new CalendarMembershipDto
        {
            Role = (CalendarMemberRole)f.GetInt("Role"),
            CanEdit = f.GetBool("CanEdit"),
            CanShare = f.GetBool("CanShare"),
            CanSeeDetails = f.GetBool("CanSeeDetails"),
            UpdatedAtUtc = f.GetDate("UpdatedAtUtc"),
            LastMutationId = f.GetOptionalString("LastMutationId"),
            InviteStatus = f.ContainsKey("InviteStatus")
                ? (CalendarInviteStatus)f.GetInt("InviteStatus")
                : CalendarInviteStatus.Accepted
        };
    }
}
