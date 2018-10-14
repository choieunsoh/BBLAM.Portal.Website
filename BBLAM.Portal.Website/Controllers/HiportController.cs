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
using System.Diagnostics;
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
    [RoutePrefix("api/hiport")]
    public class HiportController : ApiControllerBase
    {
        #region Private Members
        private string CONN = "BBLAM";

        #endregion

        #region Properties
        private string ROOT { get { return base.Config("TempUpload", "~/Temp"); } }

        #endregion

        #region WebAPI

        #endregion

        #region UploadFile API
        #region ExecSqlLoader
        [HttpGet, Route("run-sqlldr")]
        public IHttpActionResult ExecSqlLoader()
        {
            try
            {
                string exePath = Config("HIPORT_EXE");

                // Use ProcessStartInfo class
                ProcessStartInfo startInfo = new ProcessStartInfo();
                startInfo.CreateNoWindow = false;
                startInfo.UseShellExecute = false;
                startInfo.FileName = @"C:\HIPORT\APP\run_sqlldr.bat";
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;
                startInfo.RedirectStandardError = true;
                using (Process exeProcess = Process.Start(startInfo))
                {
                    exeProcess.WaitForExit();
                    if (exeProcess.ExitCode == 0)
                    {
                        return Ok(true);
                    }
                    else
                    {
                        return Ok(exeProcess.StandardError.ReadToEnd());
                    }
                }
                //return Ok(exePath);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GenerateReport
        [HttpGet, Route("gen-report")]
        public IHttpActionResult GenerateReport(DateTime asof)
        {
            try
            {
                string usp = "MF.GenerateReport";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                };
                var list = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);

                usp = "PVD.GenerateReport";
                p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                };
                var list2 = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);

                return Ok(true);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region ReGenerateReport
        [HttpGet, Route("regen-report")]
        public IHttpActionResult ReGenerateReport(DateTime asof)
        {
            try
            {
                string usp = "MF.ReGenerateReport";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                };
                var list = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);

                usp = "PVD.ReGenerateReport";
                p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                };
                var list2 = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);

                return Ok(true);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveHiportFile
        [HttpPost, Route("file-save")]
        public async Task<IHttpActionResult> SaveHiportFile()
        {
            try
            {
                NameValueCollection data = await UploadFile();
                if (data.Count > 0 && !string.IsNullOrEmpty(data["full_path"]))
                {
                    string filepath = data["full_path"];
                    if (File.Exists(filepath))
                    {
                        string dataFolder = Config("HIPORT_DATA");
                        string fund_type = data["fund_type"].ToUpper();
                        string asof = data["asof"];

                        #region Import Data by SQL Loader
                        if (fund_type == "MF")
                        {
                            int delay = data["delay"].ToInt32();
                            string filename = Config(string.Format("HIPORT_DELAY{0}_FILE", delay));
                            string datafilepath = Path.Combine(dataFolder, filename);

                            try
                            {
                                File.Copy(filepath, datafilepath, true);
                                RunSqlLoader(asof, string.Format("{0}{1}", fund_type, delay));
                                //SaveMF2DB(DateTime.ParseExact(asof ,"yyyy-MM-dd", enus));
                            }
                            catch (Exception ex)
                            {
                                throw ThrowException(ex);
                            }
                        }
                        else
                        {
                            string filename = Config("PVD_FILE");
                            string datafilepath = Path.Combine(dataFolder, filename);

                            try
                            {
                                File.Copy(filepath, datafilepath, true);
                                RunSqlLoader(asof, fund_type);
                                //SavePVD2DB(DateTime.ParseExact(asof, "yyyy-MM-dd", enus));
                            }
                            catch (Exception ex)
                            {
                                throw ThrowException(ex);
                            }
                        }
                        #endregion

                        #region Delete HIPORT File
                        try
                        {
                            File.Delete(filepath);
                        }
                        catch { }
                        #endregion
                    }
                }
                return Ok(data["asof"]);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region Remove File API
        [HttpPost, Route("file-remove")]
        public IHttpActionResult Remove([FromBody]string[] fileNames)
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


        #region GetHiportFileLog
        [HttpGet, Route("file-log")]
        public IHttpActionResult GetHiportFileLog()
        {
            try
            {
                string usp = "HIPORTFILE.GetHiportFileLog";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<HiportLog>(CONN, usp, HiportLog.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetReportLog
        [HttpGet, Route("report-log")]
        public IHttpActionResult GetReportLog()
        {
            try
            {
                string usp = "HIPORTFILE.GetReportLog";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<HiportLog>(CONN, usp, HiportLog.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
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

        #region RunSqlLoader
        private void RunSqlLoader(string asof, string type)
        {
            string exePath = Config("HIPORT_EXE");

            // import_hiport.exe yyyy-MM-dd [MF0,MF1,MF2,PVD]
            string args = asof + " " + type.ToUpper();

            // Use ProcessStartInfo class
            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.CreateNoWindow = false;
            startInfo.UseShellExecute = false;
            startInfo.FileName = exePath;
            startInfo.WindowStyle = ProcessWindowStyle.Hidden;
            startInfo.Arguments = args;

            try
            {
                // Start the process with the info we specified.
                // Call WaitForExit and then the using statement will close.
                using (Process exeProcess = Process.Start(startInfo))
                {
                    exeProcess.WaitForExit();
                }
            }
            catch
            {
                // Log error.
            }
        }

        #endregion

        #region RunSqlLoader (All)
        private void RunSqlLoader()
        {
            string exePath = Config("HIPORT_EXE");

            // Use ProcessStartInfo class
            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.CreateNoWindow = false;
            startInfo.UseShellExecute = false;
            startInfo.FileName = exePath;
            startInfo.WindowStyle = ProcessWindowStyle.Hidden;
            //startInfo.Arguments = args;

            try
            {
                // Start the process with the info we specified.
                // Call WaitForExit and then the using statement will close.
                using (Process exeProcess = Process.Start(startInfo))
                {
                    exeProcess.WaitForExit();
                }
            }
            catch
            {
                // Log error.
            }
        }

        #endregion

        #region GetValuationDate
        private DateTime? GetValuationDate(string[] lines)
        {
            string[] token = lines[1].Split(',').Select(x => x.Trim()).ToArray();
            if (token.Length >= 2)
            {
                string[] token2 = token[1].Split(':').Select(x => x.Trim()).ToArray();
                return DateTime.ParseExact(token2[1], "dd/MM/yyyy", enus);
            }
            return null;
        }

        #endregion

        #region TryDate
        private object TryDate(string value)
        {
            try
            {
                return DateTime.ParseExact(value, "dd/MM/yyyy", enus);
            }
            catch
            {
                return DBNull.Value;
            }
        }

        #endregion

        #region TryNumber
        private object TryNumber(string value)
        {
            try
            {
                return value.ToDouble();
            }
            catch
            {
                return DBNull.Value;
            }
        }

        #endregion

        #region SaveMF2DB
        private void SaveMF2DB(DateTime asof)
        {
            try
            {
                string usp = "MF.GenerateReport";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                };
                var result = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SavePVD2DB
        private void SavePVD2DB(DateTime asof)
        {
            try
            {
                string usp = "PVD.GenerateReport";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                };
                var result = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #endregion

    }

}

