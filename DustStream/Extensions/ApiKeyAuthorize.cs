using DustStream.Interfaces;
using DustStream.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DustStream.Extensions
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class ApiKeyAuthorize : Attribute, IAsyncActionFilter
    {
        private const string ApiKeyHeaderName = "X-Api-Key";
        public string RouteName { get; set; }
        
        public ApiKeyAuthorize(string routeName)
        {
            this.RouteName = routeName;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.HttpContext.Request.Headers.TryGetValue(ApiKeyHeaderName, out var apiKeyInRequest))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // Get the value from configuration
            string projectName = context.HttpContext.GetRouteValue(RouteName)?.ToString();
            if (projectName == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var projectDataService = context.HttpContext.RequestServices.GetService<IProjectDataService>();
            var tableStorageConfig = context.HttpContext.RequestServices.GetService<IOptions<TableStorageOptions>>();
            var project = await projectDataService.GetAsync(tableStorageConfig.Value.DomainString, projectName);
            MD5 md5 = MD5.Create();
            var hashedApiKeyInRequest = Encoding.UTF8.GetString(md5.ComputeHash(Encoding.UTF8.GetBytes(apiKeyInRequest)));
            if (project == null || !hashedApiKeyInRequest.Equals(project.HashedApiKey))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            await next();
        }
    }
}
