namespace DomainLayer.Exceptions
{

    public sealed class BadRequestException(List<string> Errors)
        : Exception($"Validation Failed")
    {
        public List<string> Errors { get; } = Errors;
    }
}