#region Using Directives
using System;
using System.Web.Http.Results;
using System.Web.Security;

#endregion

namespace BBLAM.Web.UI
{
    public class LoginPage : PageBase
    {
        #region Private Members

        #endregion

        #region Web Controls
        protected global::System.Web.UI.HtmlControls.HtmlHead Head1;
        protected global::System.Web.UI.HtmlControls.HtmlInputText txtUserName;
        protected global::System.Web.UI.HtmlControls.HtmlInputPassword txtPassword;
        protected global::System.Web.UI.WebControls.Button btnLogin;

        #endregion

        #region Properties

        #endregion

        #region Page Load
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            string token = Request.QueryString["token"];
            if (!String.IsNullOrEmpty(token))
            {
                byte[] data = Convert.FromBase64String(token);
                string userName = System.Text.Encoding.UTF8.GetString(data);
                TokenLogin(userName);
            }

        }

        #endregion

        #region Control Events
        protected void btnLogin_Click(object sender, EventArgs e)
        {
            try
            {
                /*UserInfo obj = (UserInfo)Context.Session["SECURE_USER_OBJECT"];
                if (obj == null)
                {
                    UserToken user = new UserToken { UserName = txtUserName.Value.Trim(), Password = txtPassword.Value.Trim() };
                    SecurityController controller = new SecurityController();
                    OkNegotiatedContentResult<UserInfo> result = (OkNegotiatedContentResult<UserInfo>)controller.ValidateUser(user);
                    obj = result.Content;
                }

                DateTime? loginTime = (DateTime?)Context.Session["SECURE_USER_LOGIN_TIME"];
                if (loginTime == null)
                {
                    Context.Session["SECURE_USER_LOGIN_TIME"] = DateTime.Now;
                }

                if (obj != null)
                {
                    FormsAuthentication.RedirectFromLoginPage(obj.UserName, false);
                }*/
                FormsAuthentication.RedirectFromLoginPage(txtUserName.Value.Trim(), false);
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
        }

        #endregion

        #region Protected Methods

        #endregion

        #region Private Methods
        #region TokenLogin
        private void TokenLogin(string userName)
        {
            try
            {
                /*UserInfo obj = UserController.GetByUserName(userName);
                if (obj != null)
                {
                    Context.Session["SECURE_USER_LOGIN_TIME"] = DateTime.Now;
                    Context.Session["SECURE_USER_OBJECT"] = obj;
                    FormsAuthentication.RedirectFromLoginPage(obj.UserName, false);
                }*/
            }
            catch (Exception ex)
            {
                string error = ex.Message;
            }
        }

        #endregion

        #endregion

    }
}