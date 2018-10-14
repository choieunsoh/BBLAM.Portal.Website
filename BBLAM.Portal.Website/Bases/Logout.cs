#region Using Directives
using System;
using System.Web.Http.Results;
using System.Web.Security;
using ThaiBMA.Security.Controllers;
using ThaiBMA.Web.Security.WebApi.Controllers;
using ThaiBMA.Web.Security.WebApi.Models;

#endregion

namespace BBLAM.Web.UI
{
    public class LogoutPage : PageBase
    {
        #region Private Members

        #endregion

        #region Web Controls
        protected global::System.Web.UI.HtmlControls.HtmlGenericControl userName;
        protected global::System.Web.UI.HtmlControls.HtmlGenericControl loginTime;
        protected global::System.Web.UI.HtmlControls.HtmlGenericControl logoutTime;

        #endregion

        #region Properties
        #region User
        public UserInfo User
        {
            get
            {
                return (UserInfo)Session["SECURE_USER_OBJECT"];
            }
        }

        #endregion

        #region LoggedInDate
        public DateTime? LoggedInDate
        {
            get
            {
                return (DateTime?)Session["SECURE_USER_LOGIN_TIME"];
            }
        }

        #endregion

        #endregion

        #region Override Methods
        #region OnLoad
        protected override void OnLoad(EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                if (userName != null && this.User != null)
                {
                    userName.InnerText = this.User.UserName;
                    if (logoutTime != null)
                        logoutTime.InnerText = DateTime.Now.ToString(logoutTime.Attributes["format"]);

                    DateTime? time = this.LoggedInDate;
                    if (loginTime != null && time != null)
                        loginTime.InnerText = time.Value.ToString(loginTime.Attributes["format"]);
                }
                Logout();
            }

            base.OnLoad(e);
        }

        #endregion

        #endregion

        #region Control Events

        #endregion

        #region Protected Methods

        #endregion

        #region Private Methods
        #region Logout
        private void Logout()
        {
            Session.Clear();
            Session.Abandon();

            if (this.Page.User.Identity.IsAuthenticated)
                FormsAuthentication.SignOut();
        }

        #endregion

        #endregion

    }
}