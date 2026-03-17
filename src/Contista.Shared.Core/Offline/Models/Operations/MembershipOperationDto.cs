namespace Contista.Shared.Core.Offline.Models.Operations;

public sealed class CreateMembershipOperationDto
{
    public string MembershipName { get; set; } = "";
    public string MembershipType { get; set; } = "";
    public double MembershipPrice { get; set; } = 0.0;
    public int MaxExtraCalendars { get; set; } = 0;
    public int MaxEventQuota { get; set; } = 100;
    public bool IsActive { get; set; } = true;
}
