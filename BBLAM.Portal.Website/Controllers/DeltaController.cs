#region Using DIrectives
using BBLAM.Portal.Models;
using BBLAM.Web.Controllers;
using Newtonsoft.Json;
using Oracle.DataAccess.Client;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Security;

#endregion

namespace BBLAM.Portal.Controllers
{
    [RoutePrefix("api/delta")]
    public class DeltaController : ApiControllerBase
    {
        #region Private Members
        private string CONN = "BBLAM";

        #endregion

        #region Properties
        private string ROOT { get { return base.Config("TempUpload", "~/Temp"); } }

        #endregion

        #region Equity Delta

        #region GetEquityDelta
        [HttpGet, Route("equity/list")]
        public IHttpActionResult GetEquityDelta()
        {
            try
            {
                string usp = "DELTA.GetEquityDelta";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityDelta>(CONN, usp, EquityDelta.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveEquityDelta
        [HttpPost, Route("equity/save")]
        public IHttpActionResult SaveEquityDelta([FromBody]EquityDelta req)
        {
            try
            {
                string usp = "DELTA.SaveEquityDelta";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_ASOF", req.Asof),
                    new OracleParameter("P_STOCK_NAME", req.StockName),
                    new OracleParameter("P_MASTER_STOCK", req.MasterStock),
                    new OracleParameter("P_DELTA", req.Delta),
                    new OracleParameter("P_UPDATED_BY", this.UserName),
                    new OracleParameter("P_UPDATED_SOURCE", this.GetClientIP()),
                };
                var list = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region DeleteEquityDelta
        [HttpPost, Route("equity/delete")]
        public IHttpActionResult DeleteEquityDelta([FromBody]EquityDelta req)
        {
            try
            {
                string usp = "DELTA.DeleteEquityDelta";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_ASOF", req.Asof),
                    new OracleParameter("P_STOCK_NAME", req.StockName),
                };
                var list = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveEquityDeltaFile
        [HttpPost, Route("equity/file-save")]
        public async Task<IHttpActionResult> SaveEquityDeltaFile()
        {
            bool success = false;
            try
            {
                NameValueCollection data = await UploadFile();
                if (data.Count > 0 && !string.IsNullOrEmpty(data["full_path"]))
                {
                    string filepath = data["full_path"];
                    if (File.Exists(filepath))
                    {
                        #region Convert CSV to Object
                        string clientip = this.GetClientIP();
                        List<EquityDelta> col = new List<EquityDelta>();
                        string[] lines = File.ReadAllLines(filepath);
                        foreach (string line in lines)
                        {
                            EquityDelta o = EquityDelta.FromCSV(line, this.UserName, clientip);
                            if (o != null)
                                col.Add(o);
                        }
                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "DELTA.SaveEquityDelta";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_ASOF", OracleDbType.Date, col.Select(x => x.Asof).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_STOCK_NAME", OracleDbType.Varchar2, col.Select(x => x.StockName).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_MASTER_STOCK", OracleDbType.Varchar2, col.Select(x => x.MasterStock).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_DELTA", OracleDbType.Double, col.Select(x => x.Delta).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_UPDATED_BY", OracleDbType.Varchar2, col.Select(x => x.UpdatedBy).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_UPDATED_SOURCE", OracleDbType.Varchar2, col.Select(x => x.UpdatedSource).ToArray(), ParameterDirection.Input),
                                };
                                var list = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, col.Count, p);
                                success = true;
                            }
                            catch (Exception ex)
                            {
                                throw ThrowException(ex);
                            }
                        }
                        #endregion

                        #region Delete CSV
                        try
                        {
                            File.Delete(filepath);
                        }
                        catch { }
                        #endregion
                    }
                }
                return Ok(success);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region Remove File API
        [HttpPost, Route("equity/file-remove")]
        public IHttpActionResult RemoveDeltaFile([FromBody]string[] fileNames)
        {
            // The parameter of the Remove action must be called "fileNames"
            if (fileNames != null)
            {
                foreach (var fullName in fileNames)
                {
                    var fileName = Path.GetFileName(fullName);
                    var physicalPath = Path.Combine(ROOT, fileName);

                    // TODO: Verify user permissions
                    if (File.Exists(physicalPath))
                    {
                        // The files are not actually removed in this demo
                        File.Delete(physicalPath);
                    }
                }
            }

            // Return an empty string to signify success
            return Ok("");
        }

        #endregion

        #endregion

        #region Private Methods
        #region Save File
        private async Task<NameValueCollection> UploadFile()
        {
            return await UploadFile(ROOT);
        }
        private async Task<NameValueCollection> UploadFile(string folder)
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
        public bool RemoveFile(string[] fileNames)
        {
            return RemoveFile(ROOT, fileNames);
        }
        public bool RemoveFile(string folder, string[] fileNames)
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

    }

}

