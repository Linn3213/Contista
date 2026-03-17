using System.ComponentModel.DataAnnotations;
using Contista.Shared.UI.Resources; 

namespace Contista.Shared.UI.Models;

public sealed class RegisterModel
{
    [Required(
        ErrorMessageResourceType = typeof(AppResources),
        ErrorMessageResourceName = "Page_Register_FirstNameRequierment_Message")]
    public string FirstName { get; set; } = "";

    [Required(
        ErrorMessageResourceType = typeof(AppResources),
        ErrorMessageResourceName = "Page_Register_LastNameRequierment_Message")]
    public string LastName { get; set; } = "";

    [Required(
        ErrorMessageResourceType = typeof(AppResources),
        ErrorMessageResourceName = "Page_Register_EmailRequierment_Message")]
    [EmailAddress(
        ErrorMessageResourceType = typeof(AppResources),
        ErrorMessageResourceName = "Page_Register_EmailInvalid_Message")]
    public string Email { get; set; } = "";

    [Required(
        ErrorMessageResourceType = typeof(AppResources),
        ErrorMessageResourceName = "Page_Register_PasswordRequierment_Message")]
    [MinLength(6,
        ErrorMessageResourceType = typeof(AppResources),
        ErrorMessageResourceName = "Page_Register_PasswordMinLength_Message")]
    public string Password { get; set; } = "";

    [Required(
        ErrorMessageResourceType = typeof(AppResources),
        ErrorMessageResourceName = "Page_Register_ConfirmPasswordRequierment_Message")]
    public string ConfirmPassword { get; set; } = "";
}
