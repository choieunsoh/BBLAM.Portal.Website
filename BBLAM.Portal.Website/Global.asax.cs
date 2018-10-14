#region Using Directives
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;

#endregion

namespace BBLAM.Portal.Website
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            GlobalConfiguration.Configure(WebApiConfig.Register);

            SetEnvironmentVariable();
        }

        void SetEnvironmentVariable()
        {
            // Workaround on Oracle issue 
            // We need to specify here 2 environment variables 
            Environment.SetEnvironmentVariable("PATH", @"D:\app\Administrator\product\11.2.0\client_1;D:\app\Administrator\product\11.2.0\client_1\bin;", EnvironmentVariableTarget.Process);
            Environment.SetEnvironmentVariable("ORACLE_HOME", @"D:\app\Administrator\product\11.2.0\client_1;", EnvironmentVariableTarget.Process);

            Environment.SetEnvironmentVariable("ORA_TZFILE", null);
            Environment.SetEnvironmentVariable("NLS_LANG", "AMERICAN_AMERICA.AL32UTF8");
            Environment.SetEnvironmentVariable("NLS_DATE_FORMAT", "DD-MON-RR");
            Environment.SetEnvironmentVariable("NLS_TIME_FORMAT", "HH.MI.SSXFF AM");
            Environment.SetEnvironmentVariable("NLS_TIMESTAMP_FORMAT", "DD-MON-RR HH.MI.SSXFF AM");
            Environment.SetEnvironmentVariable("NLS_TIMESTAMP_TZ_FORMAT", "DD-MON-RR HH.MI.SSXFF AM TZR");
        }

    }
}