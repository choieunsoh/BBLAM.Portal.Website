#region Using Directives
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI.HtmlControls;

#endregion

namespace BBLAM.Web.UI
{
    public class MasterPageBase : System.Web.UI.MasterPage
    {
        #region Private Members

        #endregion

        #region Web Controls
        protected global::System.Web.UI.HtmlControls.HtmlInputHidden myObject;
        protected global::System.Web.UI.HtmlControls.HtmlGenericControl pageHeader;
        protected global::System.Web.UI.HtmlControls.HtmlGenericControl breadcrumb;
        protected global::System.Web.UI.HtmlControls.HtmlGenericControl serviceManager;

        #endregion

        #region Properties
        #region Page Header
        #region PageTitle
        public string PageTitle
        {
            get { return this.GetViewState("PageTitle"); }
            set { this.SetViewState("PageTitle", value); this.Page.Title = value; }
        }

        #endregion

        #region MetaDescription
        public string MetaDescription
        {
            get { return this.Page.MetaDescription; }
            set { this.Page.MetaDescription = value; }
        }

        #endregion

        #region MetaKeywords
        public string MetaKeywords
        {
            get { return this.Page.MetaKeywords; }
            set { this.Page.MetaKeywords = value; }
        }

        #endregion

        #endregion

        #region ThaiBMA Content
        #region ServiceManager
        public string ServiceManager
        {
            get { return this.GetViewState("ServiceManager"); }
            set { this.SetViewState("ServiceManager", value); }
        }

        #endregion

        #region MainMenuTitle
        public string MainMenuTitle
        {
            get { return this.GetViewState("MainMenuTitle"); }
            set { this.SetViewState("MainMenuTitle", value); }
        }

        #endregion

        #region ContentTitle
        public string ContentTitle
        {
            get { return this.GetViewState("ContentTitle"); }
            set { this.SetViewState("ContentTitle", value); }
        }

        #endregion

        #region Breadcrumb
        /*public List<PageInfo> Breadcrumb
        {
            get { return this.GetViewState<List<PageInfo>>("Breadcrumb"); }
            set { this.SetViewState("Breadcrumb", value); }
        }*/

        #endregion

        #region RenderMaster
        public bool RenderMaster
        {
            get { return this.GetViewState<bool>("RenderMaster", false); }
            set { this.SetViewState("RenderMaster", value); }
        }

        #endregion

        #region User
        //public UserInfo User
        //{
        //    get { return (UserInfo)Session["SECURE_USER_OBJECT"]; }
        //    set { Session["SECURE_USER_OBJECT"] = value; }
        //}
        
        #endregion

        #region Breadcrumb
        /*
        public List<PageInfo> Breadcrumb
        {
            get { return this.GetViewState<List<PageInfo>>("Breadcrumb"); }
            set { this.SetViewState("Breadcrumb", value); }
        }
        */
        #endregion

        #endregion

        #region CurrentUrl
        public string CurrentUrl
        {
            get { return Request.Url.GetLeftPart(UriPartial.Path).ToLower(); }
        }

        #endregion

        #endregion

        #region Override Methods
        #region OnLoad
        protected override void OnLoad(EventArgs e)
        {
            if (!Page.IsPostBack && this.Master == null)
            {
                if (myObject != null)
                {
                }
            }

            base.OnLoad(e);
        }

        #endregion

        #endregion

        #region Protected Methods
        #region Get / Set ViewState
        #region GetViewState<T> Method
        protected string GetViewState(string key)
        {
            return GetViewState<string>(key);
        }
        protected string GetViewState(string key, string defaultValue)
        {
            return GetViewState<string>(key, defaultValue);
        }
        protected T GetViewState<T>(string key)
        {
            T defaultValue = default(T);
            return GetViewState<T>(key, defaultValue);
        }
        protected T GetViewState<T>(string key, T defaultValue)
        {
            return GetViewState<T>(key, defaultValue, false);
        }
        protected T GetViewState<T>(string key, T defaultValue, bool clearValue)
        {
            T ret = default(T);
            if (this.ViewState[key] != null)
            {
                ret = (T)this.ViewState[key];
                if (clearValue)
                    this.ViewState.Remove(key);
                return ret;
            }
            else
                return defaultValue;
        }

        #endregion

        #region SetViewState Method
        protected void SetViewState(string key, object value)
        {
            this.ViewState[key] = value;
        }

        #endregion

        #endregion

        #endregion

        #region Public Methods
        #region GetAbsoluteUrl
        public string GetAbsoluteUrl(string url)
        {
            if (url.StartsWith("http"))
                return url;
            url = ResolveUrl(url);
            return new System.Uri(Page.Request.Url, url).AbsoluteUri;
        }

        #endregion

        #region Config
        public string Config(string key)
        {
            return Config(key, "");
        }
        public string Config(string key, string defaultvalue)
        {
            return ConfigurationManager.AppSettings[key] ?? defaultvalue;
        }

        #endregion

        #endregion

        #region Private Methods
        /*
        #region RenderPageHeader
        private void RenderPageHeader()
        {
            if (string.IsNullOrEmpty(this.PageTitle))
            {
                PageController controller = new PageController();
                var col = controller.GetParentPage(this.Request.Url.AbsolutePath);
                if (col != null && col.Count > 0)
                {
                    this.Breadcrumb = col;
                    foreach (var o in col)
                    {
                        if (o.Depth > 0 && !o.Current)
                        {
                            HtmlGenericControl li = new HtmlGenericControl("li");
                            li.InnerText = o.TitleEn;
                            if (o.Current)
                                li.Attributes["class"] = "active";
                            breadcrumb.Controls.Add(li);
                        }
                    }

                    var result = col.Last();

                    // Page
                    if (!string.IsNullOrEmpty(result.TitleEn))
                        this.PageTitle = result.TitleEn;
                    if (!string.IsNullOrEmpty(result.DescriptionEn))
                        this.MetaDescription = result.DescriptionEn;
                    if (!string.IsNullOrEmpty(result.KeywordsEn))
                        this.MetaKeywords = result.KeywordsEn;

                    // Service Manager
                    if (serviceManager != null)
                    {
                        if (result.ServiceManagerEn.IndexOf('|') != -1)
                        {
                            StringBuilder sb = new StringBuilder();
                            string[] sm = result.ServiceManagerEn.Split('|');
                            for (int i = 0; i < sm.Length; i++)
                            {
                                sb.AppendFormat("<span class='sm-{0}'>{1}</span>", i + 1, sm[i]);
                            }
                            serviceManager.InnerHtml = sb.ToString();
                        }
                        else
                        {
                            serviceManager.InnerText = result.ServiceManagerEn;
                        }
                    }
                    if (pageHeader != null)
                        pageHeader.Attributes["class"] = pageHeader.Attributes["class"].Replace("invisible ", "");
                    //this.ContentTitle = result.ContentTitleEn;
                    //this.MainMenuTitle = col.Count > 1 ? col[1].ContentTitleEn : result.ContentTitleEn;
                }
            }
        }

        #endregion
        */
        #endregion

    }
}