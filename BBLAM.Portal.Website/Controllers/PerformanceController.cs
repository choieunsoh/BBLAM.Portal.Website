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
    [RoutePrefix("api/perf")]
    public class PerformanceController : ApiControllerBase
    {
        #region Private Members
        private string CONN = "BBLAM";

        #endregion

        #region Properties

        #endregion

        #region Portfolio Performance

        #region GetPortfolioPerformanceAvailableDate
        [HttpGet, Route("report/port-performance/avail")]
        public IHttpActionResult GetPortfolioPerformanceAvailableDate(string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_PERF_REPORT.GetAvailableDate", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<DateTime>(CONN, usp, null, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetPortfolioPerformanceReport
        [HttpGet, Route("report/port-perf")]
        public IHttpActionResult GetPortfolioPerformanceReport(DateTime start_date, DateTime end_date, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_PERF_REPORT.GetPortPerformance", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_START_DATE", start_date),
                    new OracleParameter("P_END_DATE", end_date),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<PortfolioPerformanceReport>(CONN, usp, PortfolioPerformanceReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetPortfolioPerformanceDetail
        [HttpGet, Route("report/port-perf-detail")]
        public IHttpActionResult GetPortfolioPerformanceDetail(DateTime start_date, DateTime end_date, string fund_type, string port_code)
        {
            try
            {
                string usp = string.Format("{0}_PERF_REPORT.GetPortPerformanceDetail", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_START_DATE", start_date),
                    new OracleParameter("P_END_DATE", end_date),
                    new OracleParameter("P_PORT_CODE", port_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<PortfolioPerformanceDaily>(CONN, usp, PortfolioPerformanceDaily.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #endregion

        #region Fund Fact Sheet

        #region GetMonthlyFundFactSheet
        [HttpGet, Route("report/monthly-factsheet")]
        public IHttpActionResult GetMonthlyFundFactSheet(DateTime report_date, string fund_type, string port_code, bool regen)
        {
            try
            {
                string usp = string.Format("{0}_PERF_REPORT.GetMonthlyFundFactSheet", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", report_date),
                    new OracleParameter("P_PORT_CODE", port_code),
                    new OracleParameter("P_REGEN", regen ? 1 : 0),
                    new OracleParameter("P_GENERATED_BY", this.UserName),
                    new OracleParameter("P_GENERATED_SOURCE", this.GetClientIP()),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<MonthlyFundFactSheetMatrix>(CONN, usp, MonthlyFundFactSheetMatrix.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetAnnuallyFundFactSheet
        [HttpGet, Route("report/annually-factsheet")]
        public IHttpActionResult GetAnnuallyFundFactSheet(DateTime report_date, string fund_type, string port_code, bool regen)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_PERF_REPORT.GetAnnuallyFundFactSheet", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", report_date),
                    new OracleParameter("P_PORT_CODE", port_code),
                    new OracleParameter("P_REGEN", regen ? 1 : 0),
                    new OracleParameter("P_GENERATED_BY", this.UserName),
                    new OracleParameter("P_GENERATED_SOURCE", this.GetClientIP()),
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

        #region GenAllFundFactSheet
        [HttpGet, Route("report/gen-factsheet")]
        public IHttpActionResult GenAllFundFactSheet(DateTime report_date, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_PERF_REPORT.GenAllFundFactSheet", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", report_date),
                    new OracleParameter("P_GENERATED_BY", this.UserName),
                    new OracleParameter("P_GENERATED_SOURCE", this.GetClientIP()),
                };
                var result = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetMonthlyFundFactSheetSummay
        [HttpGet, Route("report/monthly-factsheet/summary")]
        public IHttpActionResult GetMonthlyFundFactSheetSummay(DateTime report_date, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_PERF_REPORT.GetMonthlyFactSheetSummary", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", report_date),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<MonthlyFundFactSheetSummary>(CONN, usp, MonthlyFundFactSheetSummary.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetAnnuallyFundFactSheetSummary
        [HttpGet, Route("report/annually-factsheet/summary")]
        public IHttpActionResult GetAnnuallyFundFactSheetSummary(DateTime report_date, string fund_type)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_PERF_REPORT.GetAnnuallyFactSheetSummary", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", report_date),
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

        #endregion

        #region Portfolio Benchmark

        #region GetPortfolioBenchmark
        [HttpGet, Route("port-bm")]
        public IHttpActionResult GetPortfolioBenchmark()
        {
            try
            {
                string usp = "PERF.GetPortBenchmark";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<PortfolioBenchmark>(CONN, usp, PortfolioBenchmark.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SavePortBenchmark
        [HttpPost, Route("port-bm/save")]
        public IHttpActionResult SavePortBenchmark([FromBody]PortfolioBenchmark req)
        {
            try
            {
                string usp = "PERF.SavePortBenchmark";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_PORT_CODE", req.PortfolioCode),
                    new OracleParameter("P_FUND_TYPE", req.FundType),
                    new OracleParameter("P_POLICY_CODE", req.PolicyCode),
                    new OracleParameter("P_BM_ORDER", req.BenchmarkOrder),
                    new OracleParameter("P_BM_CODE", req.BenchmarkCode),
                    new OracleParameter("P_START_DATE", req.StartDate),
                    new OracleParameter("P_REMARK", req.Remark),
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

        #region DeletePortBenchmark
        [HttpPost, Route("port-bm/delete")]
        public IHttpActionResult DeletePortBenchmark([FromBody]PortfolioBenchmark req)
        {
            try
            {
                string usp = "PERF.DeletePortBenchmark";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_PORT_CODE", req.PortfolioCode),
                    new OracleParameter("P_BM_ORDER", req.BenchmarkOrder),
                    new OracleParameter("P_START_DATE", req.StartDate),
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

        #region SavePortfolioBenchmarkFile
        [HttpPost, Route("port-bm/file-save")]
        public async Task<IHttpActionResult> SavePortfolioBenchmarkFile()
        {
            bool success = false;
            try
            {
                NameValueCollection data = await base.UploadFile();
                if (data.Count > 0 && !string.IsNullOrEmpty(data["full_path"]))
                {
                    string filepath = data["full_path"];
                    if (File.Exists(filepath))
                    {
                        #region Convert CSV to Object
                        string clientip = this.GetClientIP();
                        List<PortfolioBenchmark> col = new List<PortfolioBenchmark>();
                        string[] lines = File.ReadAllLines(filepath).Skip(1).ToArray();
                        foreach (string line in lines)
                        {
                            PortfolioBenchmark o = PortfolioBenchmark.FromCSV(line, this.UserName, clientip);
                            if (o != null)
                                col.Add(o);
                        }
                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "PERF.SavePortBenchmark";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_PORT_CODE", OracleDbType.Varchar2, col.Select(x => x.PortfolioCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_FUND_TYPE", OracleDbType.Varchar2, col.Select(x => x.FundType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_POLICY_CODE", OracleDbType.Varchar2, col.Select(x => x.PolicyCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_BM_ORDER", OracleDbType.Int32, col.Select(x => x.BenchmarkOrder).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_BM_CODE", OracleDbType.Varchar2, col.Select(x => x.BenchmarkCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_START_DATE", OracleDbType.Date, col.Select(x => x.StartDate).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_REMARK", OracleDbType.Varchar2, col.Select(x => x.Remark).ToArray(), ParameterDirection.Input),
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

        #region RemovePortfolioBenchmarkFile
        [HttpPost, Route("port-bm/file-remove")]
        public IHttpActionResult RemovePortfolioBenchmarkFile([FromBody]string[] fileNames)
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

        #region Benchmark
        #region GetBenchamrkCode
        [HttpGet, Route("bm/all-code")]
        public IHttpActionResult GetBenchamrkCode()
        {
            try
            {
                string usp = "PERF.GetBenchmarkCode";
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

        #region GetBenchamrkWeight
        [HttpGet, Route("bm-weight")]
        public IHttpActionResult GetBenchamrkWeight()
        {
            try
            {
                string usp = "PERF.GetBenchmarkWeight";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<BenchmarkWeight>(CONN, usp, BenchmarkWeight.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveBenchmarkWeight
        [HttpPost, Route("bm-weight/save")]
        public IHttpActionResult SaveBenchmarkWeight([FromBody]BenchmarkWeight req)
        {
            try
            {
                string usp = "PERF.SaveBenchmarkWeight";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_BM_CODE", req.BenchmarkCode),
                    new OracleParameter("P_INDEX_CODE", req.IndexCode),
                    new OracleParameter("P_WEIGHT", req.Weight),
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

        #region DeleteBenchmarkWeight
        [HttpPost, Route("bm-weight/delete")]
        public IHttpActionResult DeleteBenchmarkWeight([FromBody]BenchmarkWeight req)
        {
            try
            {
                string usp = "PERF.DeleteBenchmarkWeight";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_BM_CODE", req.BenchmarkCode),
                    new OracleParameter("P_INDEX_CODE", req.IndexCode),
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

        #region SaveBenchmarkWeightFile
        [HttpPost, Route("bm-weight/file-save")]
        public async Task<IHttpActionResult> SaveBenchmarkWeightFile()
        {
            bool success = false;
            try
            {
                NameValueCollection data = await base.UploadFile();
                if (data.Count > 0 && !string.IsNullOrEmpty(data["full_path"]))
                {
                    string filepath = data["full_path"];
                    if (File.Exists(filepath))
                    {
                        #region Convert CSV to Object
                        string clientip = this.GetClientIP();
                        List<BenchmarkWeight> col = new List<BenchmarkWeight>();
                        string[] lines = File.ReadAllLines(filepath).Skip(1).ToArray();
                        foreach (string line in lines)
                        {
                            BenchmarkWeight o = BenchmarkWeight.FromCSV(line, this.UserName, clientip);
                            if (o != null)
                                col.Add(o);
                        }
                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "PERF.SaveBenchmarkWeight";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_BM_CODE", OracleDbType.Varchar2, col.Select(x => x.BenchmarkCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_INDEX_CODE", OracleDbType.Varchar2, col.Select(x => x.IndexCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_WEIGHT", OracleDbType.Double, col.Select(x => x.Weight).ToArray(), ParameterDirection.Input),
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

        #region RemoveBenchmarkWeightFile
        [HttpPost, Route("bm-weight/file-remove")]
        public IHttpActionResult RemoveBenchmarkWeightFile([FromBody]string[] fileNames)
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

        #region Index
        #region GetIndexList
        [HttpGet, Route("index/list")]
        public IHttpActionResult GetIndexList()
        {
            try
            {
                string usp = "PERF.GetIndexList";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<Index>(CONN, usp, Index.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveIndex
        [HttpPost, Route("index/save")]
        public IHttpActionResult SaveIndex([FromBody]Index req)
        {
            try
            {
                string usp = "PERF.SaveIndex";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_INDEX_CODE", req.IndexCode),
                    new OracleParameter("P_INDEX_NAME", req.IndexName),
                    new OracleParameter("P_SORT_ORDER", req.SortOrder),
                    new OracleParameter("P_FUND_TYPE", req.FundType),
                    new OracleParameter("P_INDEX_TYPE", req.IndexType),
                    new OracleParameter("P_INDEX_SUB_TYPE", req.IndexSubType),
                    new OracleParameter("P_ORIGIN", req.Origin),
                    new OracleParameter("P_CURRENCY", req.Currency),
                    new OracleParameter("P_DATA_SOURCE", req.DataSource),
                    new OracleParameter("P_REMARK", req.Remark),
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

        #region DeleteIndex
        [HttpPost, Route("index/delete")]
        public IHttpActionResult DeleteIndex([FromBody]Index req)
        {
            try
            {
                string usp = "PERF.DeleteIndex";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_INDEX_CODE", req.IndexCode),
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

        #region SaveIndexFile
        [HttpPost, Route("index/file-save")]
        public async Task<IHttpActionResult> SaveIndexFile()
        {
            bool success = false;
            try
            {
                NameValueCollection data = await base.UploadFile();
                if (data.Count > 0 && !string.IsNullOrEmpty(data["full_path"]))
                {
                    string filepath = data["full_path"];
                    if (File.Exists(filepath))
                    {
                        #region Convert CSV to Object
                        string clientip = this.GetClientIP();
                        List<Index> col = new List<Index>();
                        string[] lines = File.ReadAllLines(filepath, Encoding.Unicode).Skip(1).ToArray();
                        foreach (string line in lines)
                        {
                            Index o = Index.FromCSV(line, this.UserName, clientip);
                            if (o != null)
                                col.Add(o);
                        }
                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "PERF.SaveIndex";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_INDEX_CODE", OracleDbType.Varchar2, col.Select(x => x.IndexCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_INDEX_NAME", OracleDbType.Varchar2, col.Select(x => x.IndexName).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_SORT_ORDER", OracleDbType.Int32, col.Select(x => x.SortOrder).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_FUND_TYPE", OracleDbType.Varchar2, col.Select(x => x.FundType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_INDEX_TYPE", OracleDbType.Varchar2, col.Select(x => x.IndexType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_INDEX_SUB_TYPE", OracleDbType.Varchar2, col.Select(x => x.IndexSubType).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_ORIGIN", OracleDbType.Varchar2, col.Select(x => x.Origin).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_CURRENCY", OracleDbType.Varchar2, col.Select(x => x.Currency).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_DATA_SOURCE", OracleDbType.Varchar2, col.Select(x => x.DataSource).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_REMARK", OracleDbType.Varchar2, col.Select(x => x.Remark).ToArray(), ParameterDirection.Input),
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

        #region RemoveIndexFile
        [HttpPost, Route("index/file-remove")]
        public IHttpActionResult RemoveIndexFile([FromBody]string[] fileNames)
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

        #region Index Return
        #region GetIndexReturnAvailableDate
        [HttpGet, Route("index-ret/avail")]
        public IHttpActionResult GetIndexReturnAvailableDate()
        {
            try
            {
                string usp = "PERF.GetIndexReturnAvailableDate";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<DateTime>(CONN, usp, null, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetIndexReturnMatrix
        [HttpGet, Route("index-ret-matrix")]
        public IHttpActionResult GetIndexReturnMatrix(DateTime start_date, DateTime end_date, string data_type, string index_code)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = "PERF.GetIndexReturnMatrix";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_START_DATE", start_date),
                    new OracleParameter("P_END_DATE", end_date),
                    new OracleParameter("P_DATA_TYPE", data_type ?? "INDEX_RETURN"),
                    new OracleParameter("P_INDEX_CODE", index_code ?? ""),
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

        #region GetIndexReturn
        [HttpGet, Route("index-ret")]
        public IHttpActionResult GetIndexReturn(DateTime start_date, DateTime end_date, string index_code)
        {
            try
            {
                string usp = "PERF.GetIndexReturn";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_START_DATE", start_date),
                    new OracleParameter("P_END_DATE", end_date),
                    new OracleParameter("P_INDEX_CODE", index_code ?? ""),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<IndexReturn>(CONN, usp, IndexReturn.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetSimulatedIndexReturn
        [HttpGet, Route("index-ret-sim")]
        public IHttpActionResult GetSimulatedIndexReturn(DateTime start_date, DateTime end_date, string index_code)
        {
            try
            {
                string usp = "PERF.GetSimulatedIndexReturn";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_START_DATE", start_date),
                    new OracleParameter("P_END_DATE", end_date),
                    new OracleParameter("P_INDEX_CODE", index_code ?? ""),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<SimulatedIndexReturn>(CONN, usp, SimulatedIndexReturn.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region SaveIndexReturn
        [HttpPost, Route("index-ret/save")]
        public IHttpActionResult SaveIndexReturn([FromBody]IndexReturn req)
        {
            try
            {
                string usp = "PERF.SaveIndexReturn";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_ASOF", req.Asof),
                    new OracleParameter("P_INDEX_CODE", req.IndexCode),
                    new OracleParameter("P_CLOSED_PRICE", req.ClosedPrice),
                    new OracleParameter("P_INDEX_RETURN", req.Return),
                    new OracleParameter("P_UPDATED_BY", this.UserName),
                    new OracleParameter("P_UPDATED_SOURCE", this.GetClientIP()),
                    new OracleParameter("P_RE_CALC", 1),
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

        #region DeleteIndexReturn
        [HttpPost, Route("index-ret/delete")]
        public IHttpActionResult DeleteIndexReturn([FromBody]IndexReturn req)
        {
            try
            {
                string usp = "PERF.DeleteIndexReturn";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_ASOF", req.Asof),
                    new OracleParameter("P_INDEX_CODE", req.IndexCode),
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

        #region SaveIndexReturnFile
        [HttpPost, Route("index-ret/file-save")]
        public async Task<IHttpActionResult> SaveIndexReturnFile()
        {
            bool success = false;
            try
            {
                NameValueCollection data = await base.UploadFile();
                if (data.Count > 0 && !string.IsNullOrEmpty(data["full_path"]))
                {
                    string filepath = data["full_path"];
                    if (File.Exists(filepath))
                    {
                        #region Convert CSV to Object
                        string clientip = this.GetClientIP();
                        List<IndexReturn> col = new List<IndexReturn>();
                        string[] lines = File.ReadAllLines(filepath).Skip(1).ToArray();
                        foreach (string line in lines)
                        {
                            IndexReturn o = IndexReturn.FromCSV(line, this.UserName, clientip);
                            if (o != null)
                                col.Add(o);
                        }

                        #endregion

                        #region Save to DB
                        if (col.Count > 0)
                        {
                            try
                            {
                                string usp = "PERF.SaveIndexReturn";
                                OracleParameter[] p = new OracleParameter[] {
                                    new OracleParameter("P_ASOF", OracleDbType.Date, col.Select(x => x.Asof).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_INDEX_CODE", OracleDbType.Varchar2, col.Select(x => x.IndexCode).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_CLOSED_PRICE", OracleDbType.Double, col.Select(x => x.ClosedPrice.HasValue ? (object)x.ClosedPrice.Value : (object)DBNull.Value).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_INDEX_RETURN", OracleDbType.Double, col.Select(x => x.Return.HasValue ? (object)x.Return.Value : (object)DBNull.Value).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_UPDATED_BY", OracleDbType.Varchar2, col.Select(x => x.UpdatedBy).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_UPDATED_SOURCE", OracleDbType.Varchar2, col.Select(x => x.UpdatedSource).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_RE_CALC", OracleDbType.Int32, col.Select(x => 0).ToArray(), ParameterDirection.Input),
                                };
                                var list = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, col.Count, p);

                                var result = col.GroupBy(x => x.IndexCode)
                                    .Select(o => new { IndexCode = o.Key, Asof = o.Min(x => x.Asof) })
                                    .ToList();

                                string usp1 = "MF_PERF_REPORT.CalcPortBenchmarkReturn";
                                OracleParameter[] p1 = new OracleParameter[] {
                                    new OracleParameter("P_ASOF", OracleDbType.Date, result.Select(x => x.Asof).ToArray(), ParameterDirection.Input),
                                    new OracleParameter("P_INDEX_CODE", OracleDbType.Varchar2, result.Select(x => x.IndexCode).ToArray(), ParameterDirection.Input),
                                };
                                list = System.Data.DataUtil.ExecuteNonQuery(CONN, usp1, result.Count, p1);

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

        #region RemoveIndexReturnFile
        [HttpPost, Route("index-ret/file-remove")]
        public IHttpActionResult RemoveIndexReturnFile([FromBody]string[] fileNames)
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

        #endregion

    }

}

