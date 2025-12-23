using Microsoft.AspNetCore.Mvc;
using Shared.ErrorModels;

namespace TalabatDemo.Factories
{
    public static class ApiResponseFactory
    {
        public static IActionResult GenerateApiValidationErrorResponse(ActionContext context)
        {
            var errors = context.ModelState.Where(e => e.Value.Errors.Any())
                .Select(m => new ValidationError()
                {
                    Field = m.Key,
                    Errors = m.Value.Errors.Select(e => e.ErrorMessage)
                });

            var response = new ValidationErrorResponse()
            {
                ValidationErrors = errors
            };

            return new BadRequestObjectResult(response);
        }
    }
}