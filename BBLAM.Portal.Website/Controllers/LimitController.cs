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
    [RoutePrefix("api/limit")]
    public class LimitController : ApiControllerBase
    {
        #region Private Members
        private string CONN = "BBLAM";

        #endregion

        #region Equity Limit

        #region GetLatestEquityLimit
        [HttpGet, Route("equity/latest")]
        public IHttpActionResult GetLatestEquityLimit(DateTime asof, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}.GetLatestEquityLimit", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_ASOF", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityLimit>(CONN, usp, EquityLimit.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityLimitByFund
        [HttpGet, Route("equity/list")]
        public IHttpActionResult GetEquityLimitByFund(string fund_type, string fund_code)
        {
            try
            {
                string usp = string.Format("{0}.GetEquityLimitByFund", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityLimit>(CONN, usp, EquityLimit.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveEquityLimit
        [HttpPost, Route("equity/save")]
        public IHttpActionResult SaveEquityLimit([FromBody]EquityLimit req)
        {
            try
            {
                string usp = string.Format("{0}.SaveEquityLimit", req.FundType.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FUND_CODE", req.FundCode),
                    new OracleParameter("P_ASOF", req.Asof),
                    new OracleParameter("P_EQ_LIMIT_MIN", req.MinLimit),
                    new OracleParameter("P_EQ_LIMIT_MAX", req.MaxLimit),
                    new OracleParameter("P_EQ_VAR_LIMIT", req.VaRLimit.HasValue ? (object)req.VaRLimit.Value : DBNull.Value),
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

        #region DeleteEquityLimit
        [HttpPost, Route("equity/delete")]
        public IHttpActionResult DeleteEquityLimit([FromBody]EquityLimit req)
        {
            try
            {
                string usp = string.Format("{0}.DeleteEquityLimit", req.FundType.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FUND_CODE", req.FundCode),
                    new OracleParameter("P_ASOF", req.Asof),
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

        #region SaveEquityLimieFile
        [HttpPost, Route("equity/file-save")]
        public async Task<IHttpActionResult> SaveEquityLimieFile()
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
                        List<EquityLimit> col = new List<EquityLimit>();
                        string[] lines = File.ReadAllLines(filepath);
                        foreach (string line in lines)
                        {
                            EquityLimit o = EquityLimit.FromCSV(line, data["fund_type"], this.UserName, clientip);
                            if (o != null)
                                col.Add(o);
                        }
                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = string.Format("{0}.SaveEquityLimit", data["fund_type"].ToUpper());
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_FUND_CODE", OracleDbType.Varchar2, col.Select(x => x.FundCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_ASOF", OracleDbType.Date, col.Select(x => x.Asof).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_EQ_LIMIT_MIN", OracleDbType.Double, col.Select(x => x.MinLimit).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_EQ_LIMIT_MAX", OracleDbType.Double, col.Select(x => x.MaxLimit).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_EQ_VAR_LIMIT", OracleDbType.Double, col.Select(x => x.VaRLimit.HasValue ? (object)x.VaRLimit.Value : DBNull.Value).ToArray(), ParameterDirection.Input),
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
        public IHttpActionResult RemoveEquityFile([FromBody]string[] fileNames)
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

        #region Liquidity Limit

        #region GetLatestLiquidityLimit
        [HttpGet, Route("liquidity/latest")]
        public IHttpActionResult GetLatestLiquidityLimit(DateTime asof, string fund_type)
        {
            try
            {
                string usp = "MF.GetLatestLiquidityLimit";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_ASOF", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<LiquidityLimit>(CONN, usp, LiquidityLimit.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetLiquidityLimitByFund
        [HttpGet, Route("liquidity/list")]
        public IHttpActionResult GetLiquidityLimitByFund(string fund_type, string fund_code)
        {
            try
            {
                string usp = "MF.GetLiquidityLimitByFund";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<LiquidityLimit>(CONN, usp, LiquidityLimit.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveLiquidityLimit
        [HttpPost, Route("liquidity/save")]
        public IHttpActionResult SaveLiquidityLimit([FromBody]LiquidityLimit req)
        {
            try
            {
                string usp = "MF.SaveLiquidityLimit";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FUND_CODE", req.FundCode),
                    new OracleParameter("P_ASOF", req.Asof),
                    new OracleParameter("P_SOFT_LIMIT", req.SoftLimit),
                    new OracleParameter("P_HARD_LIMIT", req.HardLimit),
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

        #region DeleteLiquidityLimit
        [HttpPost, Route("liquidity/delete")]
        public IHttpActionResult DeleteLiquidityLimit([FromBody]LiquidityLimit req)
        {
            try
            {
                string usp = "MF.DeleteLiquidityLimit";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FUND_CODE", req.FundCode),
                    new OracleParameter("P_ASOF", req.Asof),
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

        #region SaveLiquidityLimieFile
        [HttpPost, Route("liquidity/file-save")]
        public async Task<IHttpActionResult> SaveLiquidityLimieFile()
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
                        List<LiquidityLimit> col = new List<LiquidityLimit>();
                        string[] lines = File.ReadAllLines(filepath);
                        foreach (string line in lines)
                        {
                            LiquidityLimit o = LiquidityLimit.FromCSV(line, data["fund_type"], this.UserName, this.GetClientIP());
                            if (o != null)
                                col.Add(o);
                        }
                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "MF.SaveLiquidityLimit";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_FUND_CODE", OracleDbType.Varchar2, col.Select(x => x.FundCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_ASOF", OracleDbType.Date, col.Select(x => x.Asof).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_SOFT_LIMIT", OracleDbType.Double, col.Select(x => x.SoftLimit).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_HARD_LIMIT", OracleDbType.Double, col.Select(x => x.HardLimit).ToArray(), ParameterDirection.Input),
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
        [HttpPost, Route("liquidity/file-remove")]
        public IHttpActionResult RemoveLiquidityFile([FromBody]string[] fileNames)
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

        #region Counterparty Limit

        #region GetCounterpartyAvailablePeriod
        [HttpGet, Route("counterparty/avail")]
        public IHttpActionResult GetCounterpartyAvailablePeriod()
        {
            try
            {
                string usp = "MF_COUNTERPARTY_REPORT.GetAvailablePeriod";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<string>(CONN, usp, null, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetCounterpartyLine
        [HttpGet, Route("counterparty/line-matrix")]
        public IHttpActionResult GetCounterpartyLine(string period)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = "MF_COUNTERPARTY_REPORT.GetCounterpartyLineMatrix";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_PERIOD_CODE", (object)period ?? DBNull.Value),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<DynamicEntity>(CONN, usp, DynamicEntity.FillObject, p);
                foreach (var o in list)
                    result.Add(o.Values);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveCounterpartyLineFile
        [HttpPost, Route("counterparty/line-file-save")]
        public async Task<IHttpActionResult> SaveCounterpartyLineFile()
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
                        List<CounterpartyLine> col = new List<CounterpartyLine>();
                        string[] lines = File.ReadAllLines(filepath);
                        foreach (string line in lines)
                        {
                            CounterpartyLine o = CounterpartyLine.FromCSV(line, this.UserName, clientip);
                            if (o != null)
                                col.Add(o);
                        }
                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "MF_COUNTERPARTY_REPORT.SaveCounterpartyLine";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_PERIOD_CODE", OracleDbType.Varchar2, col.Select(x => x.PeriodCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_TRANSACTION_TYPE", OracleDbType.Varchar2, col.Select(x => x.TransactionType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_COUNTERPARTY_TYPE", OracleDbType.Varchar2, col.Select(x => x.CounterpartyType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_FUND_TYPE", OracleDbType.Varchar2, col.Select(x => x.FundType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_TIER_LEVEL", OracleDbType.Int32, col.Select(x => x.TierLevel).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_LINE_AMOUNT", OracleDbType.Double, col.Select(x => x.LineAmount).ToArray(), ParameterDirection.Input),
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

        #region GetCounterpartyList
        [HttpGet, Route("counterparty/list")]
        public IHttpActionResult GetCounterpartyList(string period)
        {
            try
            {
                string usp = "MF_COUNTERPARTY_REPORT.GetCounterpartyListMatrix";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_PERIOD_CODE", (object)period ?? DBNull.Value),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<CounterpartyTier>(CONN, usp, CounterpartyTier.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveCounterpartyList
        [HttpPost, Route("counterparty/list-save")]
        public IHttpActionResult SaveCounterpartyList([FromBody]CounterpartyTier req)
        {
            try
            {
                string usp = "MF_COUNTERPARTY_REPORT.SaveCounterpartyList";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_PERIOD_CODE", req.PeriodCode),
                    new OracleParameter("P_COUNTER_PARTY", req.CounterParty),
                    new OracleParameter("P_COUNTERPARTY_TYPE", req.CounterpartyType),
                    new OracleParameter("P_FUND_TYPE", req.FundType),
                    new OracleParameter("P_TRANSACTION_TYPE", req.TransactionType),
                    new OracleParameter("P_TIER_LEVEL", req.TierLevel),
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

        #region DeleteCounterpartyList
        [HttpPost, Route("counterparty/list-delete")]
        public IHttpActionResult DeleteCounterpartyList([FromBody]CounterpartyTier req)
        {
            try
            {
                string usp = "MF_COUNTERPARTY_REPORT.DeleteCounterpartyList";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_PERIOD_CODE", req.PeriodCode),
                    new OracleParameter("P_COUNTER_PARTY", req.CounterParty),
                    new OracleParameter("P_COUNTERPARTY_TYPE", req.CounterpartyType.Substring(0, 1)),
                    new OracleParameter("P_FUND_TYPE", req.FundType.Substring(0, 1)),
                    new OracleParameter("P_TRANSACTION_TYPE", req.TransactionType.Substring(0, 1)),
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

        #region SaveCounterpartyListFile
        [HttpPost, Route("counterparty/list-file-save")]
        public async Task<IHttpActionResult> SaveCounterpartyListFile()
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
                        List<CounterpartyTier> col = new List<CounterpartyTier>();
                        string[] lines = File.ReadAllLines(filepath);
                        foreach (string line in lines)
                        {
                            CounterpartyTier o = CounterpartyTier.FromCSV(line, this.UserName, clientip);
                            if (o != null)
                                col.Add(o);
                        }
                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "MF_COUNTERPARTY_REPORT.SaveCounterpartyList";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_PERIOD_CODE", OracleDbType.Varchar2, col.Select(x => x.PeriodCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_COUNTER_PARTY", OracleDbType.Varchar2, col.Select(x => x.CounterParty).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_COUNTERPARTY_TYPE", OracleDbType.Varchar2, col.Select(x => x.CounterpartyType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_FUND_TYPE", OracleDbType.Varchar2, col.Select(x => x.FundType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_TRANSACTION_TYPE", OracleDbType.Varchar2, col.Select(x => x.TransactionType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_TIER_LEVEL", OracleDbType.Int32, col.Select(x => x.TierLevel).ToArray(), ParameterDirection.Input),
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

