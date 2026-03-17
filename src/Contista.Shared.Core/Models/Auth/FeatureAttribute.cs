namespace Contista.Shared.Core.Models.Auth;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
public sealed class FeatureAttribute : Attribute
{
    public FeatureKey Feature { get; }
    public FeatureAttribute(FeatureKey feature) => Feature = feature;
}
