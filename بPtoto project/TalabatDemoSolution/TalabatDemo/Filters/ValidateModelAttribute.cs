using Microsoft.AspNetCore.Mvc.Filters;
using TalabatDemo.Factories;

namespace TalabatDemo.Filters
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                context.Result = ApiResponseFactory.GenerateApiValidationErrorResponse(context);
            }
        }
    }
}

