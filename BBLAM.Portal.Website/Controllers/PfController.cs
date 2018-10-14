#region Using DIrectives
using BBLAM.Portal.Models;
using BBLAM.Web.Controllers;
using Newtonsoft.Json;
using Oracle.DataAccess.Client;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using Telerik.Windows.Documents.Spreadsheet.FormatProviders;
using Telerik.Windows.Documents.Spreadsheet.FormatProviders.OpenXml.Xlsx;
using Telerik.Windows.Documents.Spreadsheet.Model;

#endregion

namespace BBLAM.Portal.Controllers
{
    [RoutePrefix("api/pf")]
    public class PFController : ApiControllerBase
    {
        #region Private Members
        private string CONN = "BBLAM";

        #endregion

        #region Properties
        private string ROOT { get { return base.Config("TempUpload", "~/Temp"); } }

        #endregion

        #region PF Return

        #region GetPfReturn
        [HttpGet, Route("return/list")]
        public IHttpActionResult GetPfReturn(DateTime from, DateTime to, string port_code)
        {
            try
            {
                string usp = "PF_PERF_REPORT.GetPFReturn";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_START_DATE", from),
                    new OracleParameter("P_END_DATE", to),
                    new OracleParameter("P_PORT_CODE", port_code ?? ""),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<PFUploadReturn>(CONN, usp, PFUploadReturn.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SavePfReturn
        [HttpPost, Route("return/save")]
        public IHttpActionResult SavePfReturn([FromBody]PFUploadReturn req)
        {
            try
            {
                string usp = "PF_PERF_REPORT.SavePFReturn";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_ASOF", req.Asof),
                    new OracleParameter("P_PORT_CODE", req.PortfolioCode),
                    new OracleParameter("P_TOTAL_NAV", req.TotalNav),
                    new OracleParameter("P_DAILY_RETURN", req.DailyReturn),
                    new OracleParameter("P_YTD_RETURN", req.YTDReturn),
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

        #region SavePfReturnFile
        [HttpPost, Route("return/file-save")]
        public async Task<IHttpActionResult> SavePfReturnFile()
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
                        List<PFUploadReturn> col = ReadExcel(filepath);

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "PF_PERF_REPORT.SavePFReturn";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_ASOF", OracleDbType.Date, col.Select(x => x.Asof).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_PORT_CODE", OracleDbType.Varchar2, col.Select(x => x.PortfolioCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_TOTAL_NAV", OracleDbType.Double, col.Select(x => x.TotalNav).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_DAILY_RETURN", OracleDbType.Double, col.Select(x => x.DailyReturn).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_YTD_RETURN", OracleDbType.Double, col.Select(x => x.YTDReturn).ToArray(), ParameterDirection.Input),
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

                        #region Delete Excel
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

        #region DeletePfReturn
        [HttpPost, Route("return/delete")]
        public IHttpActionResult DeletePfReturn([FromBody]PVDUploadReturn req)
        {
            try
            {
                string usp = "PF_PERF_REPORT.DeletePFReturn";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_ASOF", req.Asof),
                    new OracleParameter("P_PORT_CODE", req.PortfolioCode),
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

        #region Remove File API
        [HttpPost, Route("file-remove")]
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

        #region ReadExcel
        private List<PFUploadReturn> ReadExcel(string filepath)
        {
            string ext = Path.GetExtension(filepath).ToLower();
            if (ext == ".xlsx")
                return ReadXlsx(filepath);
            else
                return new List<PFUploadReturn>();
        }

        #endregion

        #region ReadXlsx
        private List<PFUploadReturn> ReadXlsx(string filepath)
        {
            List<PFUploadReturn> col = new List<PFUploadReturn>();
            using (Stream input = new FileStream(filepath, FileMode.Open))
            {
                IWorkbookFormatProvider formatProvider = new XlsxFormatProvider();
                Workbook workbook = formatProvider.Import(input);
                if (workbook.Sheets.Count > 1)
                {
                    Worksheet worksheet = null;
                    try { worksheet = workbook.Worksheets["RptReturn"]; }
                    catch { worksheet = workbook.Worksheets[1]; }
                    if (worksheet != null)
                    {
                        RowSelection rowAsof = worksheet.Rows[3];
                        RangePropertyValue<ICellValue> rangeValue = worksheet.Cells[3, 1].GetValue();
                        DateTime asof = DateTime.ParseExact(rangeValue.Value.RawValue.Split(' ')[1], "dd/MM/yyyy", enus);

                        try
                        {
                            string clientip = this.GetClientIP();
                            for (int i = 5; i < worksheet.Rows.Count; i++)
                            {
                                PFUploadReturn obj = new PFUploadReturn();
                                obj.Asof = asof;

                                // Port Code
                                RangePropertyValue<ICellValue> cell = worksheet.Cells[i, 1].GetValue();
                                ICellValue cellValue = cell.Value;
                                obj.PortfolioCode = cellValue.RawValue;

                                // Total NAV
                                cell = worksheet.Cells[i, 3].GetValue();
                                obj.TotalNav = cell.Value.RawValue.ToDouble();

                                // Daily Return
                                cell = worksheet.Cells[i, 5].GetValue();
                                obj.DailyReturn = cell.Value.RawValue.ToDouble();

                                // YTD Return
                                cell = worksheet.Cells[i, 6].GetValue();
                                obj.YTDReturn = cell.Value.RawValue.ToDouble();

                                obj.UpdatedBy = this.UserName;
                                obj.UpdatedSource = clientip;

                                col.Add(obj);
                            }
                        }
                        catch (Exception ex1)
                        {
                            string error = ex1.Message;
                        }
                    }
                }
            }
            return col;
        }

        #endregion

        #endregion

    }

}

