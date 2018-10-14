#region Using Directives
using System;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Http;
using System.ServiceModel.Channels;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

#endregion

namespace BBLAM.Web.Controllers
{
    //[Authorize]
    public class ApiControllerBase : ApiController
    {
        #region Protected Members
        protected CultureInfo enus = new CultureInfo("en-US");

        #endregion

        #region Protected Properties
        #region UserName
        protected string UserName
        {
            get { return this.User.Identity.Name; }
        }

        #endregion

        #region ROOT
        protected string ROOT { get { return this.Config("TempUpload", "~/Temp"); } }

        #endregion

        #endregion

        #region ThrowException
        public HttpResponseException ThrowException(Exception ex)
        {
            var errorResponse = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            errorResponse.Content = new StringContent(ex.Message);
            return new HttpResponseException(errorResponse);
        }

        #endregion

        #region Protected Methods
        #region Config
        protected string Config(string key)
        {
            return Config<string>(key);
        }
        protected string Config(string key, string defaultValue)
        {
            return Config<string>(key, defaultValue);
        }
        protected T Config<T>(string key)
        {
            var value = System.Web.Configuration.WebConfigurationManager.AppSettings.Get(key);
            return MyExtension.ChangeType<T>(value);
        }
        protected T Config<T>(string key, T defaultValue)
        {
            var value = System.Web.Configuration.WebConfigurationManager.AppSettings.Get(key);
            if (string.IsNullOrEmpty(value))
                return defaultValue;
            else
                return MyExtension.ChangeType<T>(value);
        }

        #endregion

        #region IsPhysicalPath
        protected bool IsPhysicalPath(string path)
        {
            return path.StartsWith(@"\\") || path.Contains(@":\");
        }

        #endregion

        #region GetPhysicalPath
        protected string GetPhysicalPath(string path)
        {
            if (!this.IsPhysicalPath(path))
            {
                string url = VirtualPathUtility.ToAbsolute(path);
                path = HttpContext.Current.Server.MapPath(path);
            }
            return path;
        }

        #endregion

        #region GetClientIP
        protected string GetClientIP()
        {
            //return this.Request.GetClientIpString();
            return GetClientIPAdress();
        }

        #endregion

        #region GetReturnedVersionParameter
        protected SqlParameter GetReturnedVersionParameter()
        {
            return new SqlParameter { ParameterName = "@ReturnedVersion", Direction = ParameterDirection.Output, SqlDbType = SqlDbType.Timestamp, Size = 8 };
        }

        #endregion

        #region GetReturnedParameter
        protected SqlParameter GetReturnedParameter(string name)
        {
            return new SqlParameter { ParameterName = name, Direction = ParameterDirection.Output, SqlDbType = SqlDbType.UniqueIdentifier };
        }

        #endregion

        #region GetReturnedParameter INT
        protected SqlParameter GetReturnedParameterINT(string name)
        {
            return new SqlParameter { ParameterName = name, Direction = ParameterDirection.Output, SqlDbType = SqlDbType.Int };
        }

        #endregion

        #endregion

        #region Save File Methods
        #region Save File
        protected async Task<NameValueCollection> UploadFile()
        {
            return await UploadFile(ROOT);
        }
        protected async Task<NameValueCollection> UploadFile(string folder)
        {
            try
            {
                NameValueCollection data = new NameValueCollection();
                bool hasfile = Request.Content.IsMimeMultipartContent();
                if (hasfile)
                {
                    HttpServerUtility server = HttpContext.Current.Server;
                    HttpRequest request = HttpContext.Current.Request;

                    string root = server.MapPath(folder);
                    if (!Directory.Exists(root))
                        Directory.CreateDirectory(root);

                    var provider = new MultipartFormDataStreamProvider(root);

                    // Read the form data.
                    await Request.Content.ReadAsMultipartAsync(provider);

                    // Read Custom Parameters
                    data.Add(request.Params);

                    // Create Folder
                    try
                    {
                        if (data["subfolder"] != null)
                        {
                            root = Path.Combine(root, data["subfolder"]);
                            if (!Directory.Exists(root))
                            {
                                Directory.CreateDirectory(root);
                            }
                        }
                    }
                    catch { }

                    // This illustrates how to get the file names.
                    foreach (MultipartFileData file in provider.FileData)
                    {
                        var fileName = file.Headers.ContentDisposition.FileName.Replace("\"", string.Empty);
                        data.Add("file_name", Path.GetFileName(fileName));
                        data.Add("name", Path.GetFileNameWithoutExtension(fileName));

                        fileName = Path.Combine(root, Path.GetFileName(fileName));
                        data.Add("full_path", fileName);

                        try
                        {
                            // Delete existing file
                            if (File.Exists(fileName))
                            {
                                File.Delete(fileName);
                            }
                        }
                        catch { }

                        byte[] fileBytes = File.ReadAllBytes(file.LocalFileName);
                        File.WriteAllBytes(fileName, fileBytes);
                        data.Add("file_size", fileBytes.Length.ToString());

                        try
                        {
                            // Delete Kendo temp file
                            fileName = file.LocalFileName;
                            if (File.Exists(fileName))
                            {
                                File.Delete(fileName);
                            }
                        }
                        catch { }
                    }
                }
                return data;
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region Remove File
        protected bool RemoveFile(string[] fileNames)
        {
            return RemoveFile(ROOT, fileNames);
        }
        protected bool RemoveFile(string folder, string[] fileNames)
        {
            try
            {
                // The parameter of the Remove action must be called "fileNames"
                if (fileNames != null)
                {
                    foreach (var fileName in fileNames)
                    {
                        var root = HttpContext.Current.Server.MapPath(folder);
                        var physicalPath = Path.Combine(root, fileName);

                        try
                        {
                            if (File.Exists(physicalPath))
                            {
                                File.Delete(physicalPath);
                            }
                        }
                        catch { }
                    }
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion

        #endregion

        #region Private Methods
        #region GetClientIPAdress
        private string GetClientIPAdress(HttpRequestMessage request = null)
        {
            request = request ?? Request;

            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            }
            else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
            {
                RemoteEndpointMessageProperty prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
                return prop.Address;
            }
            else if (HttpContext.Current != null)
            {
                return HttpContext.Current.Request.UserHostAddress;
            }
            else
            {
                return "";
            }
        }

        #endregion

        #endregion

    }
}