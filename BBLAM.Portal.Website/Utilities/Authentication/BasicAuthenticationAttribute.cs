using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Net;
using System.Text;
using System.Threading;
using System.Security.Principal;

namespace System.Web.Http.Filters
{
    public class BasicAuthenticationAttribute : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext.Request.Headers.Authorization != null)
            {
                string authenticationToken = actionContext.Request.Headers.Authorization.Parameter;
                string decodeAuthenticationToken = Encoding.UTF8.GetString(Convert.FromBase64String(authenticationToken));
                string[] token = decodeAuthenticationToken.Split(':');
                if (token.Length == 2)
                {
                    string username = token[0];
                    string password = token[1];
                    Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(username), null);

                }
            }
            actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
            //base.OnAuthorization(actionContext);
        }
    }
}