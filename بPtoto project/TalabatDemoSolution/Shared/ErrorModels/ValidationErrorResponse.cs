using System.Net;

namespace Shared.ErrorModels
{
    public class ValidationErrorResponse
    {
        public int StatusCode { get; set; } = (int)HttpStatusCode.BadRequest;
        public string ErrorMessage { get; set; } = "One or more validation errors occurred";
        public IEnumerable<ValidationError> ValidationErrors { get; set; }
    }

    public class ValidationError
    {
        public string Field { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }
}