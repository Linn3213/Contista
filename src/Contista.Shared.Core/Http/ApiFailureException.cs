namespace Contista.Shared.Core.Http;

public sealed class ApiFailureException : Exception
{
    public ApiFailure Failure { get; }

    public ApiFailureException(ApiFailure failure, string? message = null, Exception? inner = null)
        : base(message ?? failure.Message, inner)
    {
        Failure = failure with { Exception = inner ?? this };
    }
}
