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
    [RoutePrefix("api/report")]
    public class ReportController : ApiControllerBase
    {
        #region Private Members
        private string CONN = "BBLAM";

        #endregion

        #region Equity Report

        #region GetEquityAvailableDate
        [HttpGet, Route("equity/avail")]
        public IHttpActionResult GetEquityAvailableDate(string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetAvailableDate", fund_type.ToUpper());
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

        #region GetAllActiveFunds
        [HttpGet, Route("equity/active-fund")]
        public IHttpActionResult GetAllActiveFunds(string fund_type)
        {
            try
            {
                string usp = string.Format("{0}.GetActiveFund", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<Fund>(CONN, usp, Fund.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityLimitReport
        [HttpGet, Route("equity/equity-limit")]
        public IHttpActionResult GetEquityLimitReport(DateTime asof, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetLimitReport", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityLimitReport>(CONN, usp, EquityLimitReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityLimitPeriodReport
        [HttpGet, Route("equity/period-limit")]
        public IHttpActionResult GetEquityLimitPeriodReport(DateTime from_date, DateTime to_date, string fund_type, string fund_code)
        {
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetLimitPeriodReport", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FROM_DATE", from_date),
                    new OracleParameter("P_TO_DATE", to_date),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityLimitPeriodReport>(CONN, usp, EquityLimitPeriodReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityLimitPeriodSummaryReport
        [HttpGet, Route("equity/period-sum")]
        public IHttpActionResult GetEquityLimitPeriodSummaryReport(DateTime from_date, DateTime to_date, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetLimitPeriodSummaryReport", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FROM_DATE", from_date),
                    new OracleParameter("P_TO_DATE", to_date),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityLimitPeriodSummaryReport>(CONN, usp, EquityLimitPeriodSummaryReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityOriginReport
        [HttpGet, Route("equity/equity-origin")]
        public IHttpActionResult GetEquityOriginReport(DateTime asof, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetOriginReport", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityOriginReport>(CONN, usp, EquityOriginReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityDetailByFundCode
        [HttpGet, Route("equity/equity-detail")]
        public IHttpActionResult GetEquityDetailByFundCode(DateTime asof, string fund_type, string fund_code)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetEQDetail", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<DynamicEntity>(CONN, usp, DynamicEntity.FillObject, p);
                foreach (var o in list)
                    result.Add(o.Values);
                return Ok(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.StartsWith("ORA-00936: missing expression"))
                    return Ok(result);
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityBySector
        [HttpGet, Route("equity/equity-sector")]
        public IHttpActionResult GetEquityBySector(DateTime asof, string fund_type, string fund_code, string sector_code)
        {
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetEQBySector", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_SECTOR_CODE", (object)sector_code ?? DBNull.Value),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquitySector>(CONN, usp, EquitySector.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityByCurrency
        [HttpGet, Route("equity/equity-currency")]
        public IHttpActionResult GetEquityByCurrency(DateTime asof, string fund_type, string fund_code, string currency)
        {
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetEQByCurrency", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_CURRENCY", currency),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquitySector>(CONN, usp, EquitySector.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetFixedIncomeDetailByFundCode
        [HttpGet, Route("equity/fixed-income-detail")]
        public IHttpActionResult GetFixedIncomeDetailByFundCode(DateTime asof, string fund_type, string fund_code)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetFIDetail", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<DynamicEntity>(CONN, usp, DynamicEntity.FillObject, p);
                foreach (var o in list)
                    result.Add(o.Values);
                return Ok(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.StartsWith("ORA-00936: missing expression"))
                    return Ok(result);
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetFixedIncomeBySector
        [HttpGet, Route("equity/fixed-income-sector")]
        public IHttpActionResult GetFixedIncomeBySector(DateTime asof, string fund_type, string fund_code, string sector_code)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetFIBySector", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_SECTOR_CODE", (object)sector_code ?? DBNull.Value),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquitySector>(CONN, usp, EquitySector.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetFixedIncomeByCurrency
        [HttpGet, Route("equity/fixed-income-currency")]
        public IHttpActionResult GetFixedIncomeByCurrency(DateTime asof, string fund_type, string fund_code, string currency)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetFIByCurrency", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_CURRENCY", currency),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquitySector>(CONN, usp, EquitySector.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetUnitTrustDetailByFundCode
        [HttpGet, Route("equity/unit-trust-detail")]
        public IHttpActionResult GetUnitTrustDetailByFundCode(DateTime asof, string fund_type, string fund_code)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetFIFDetail", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<DynamicEntity>(CONN, usp, DynamicEntity.FillObject, p);
                foreach (var o in list)
                    result.Add(o.Values);
                return Ok(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.StartsWith("ORA-00936: missing expression"))
                    return Ok(result);
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetUnitTrustBySector
        [HttpGet, Route("equity/unit-trust-sector")]
        public IHttpActionResult GetUnitTrustBySector(DateTime asof, string fund_type, string fund_code, string sector_code)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetFIFBySector", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_SECTOR_CODE", (object)sector_code ?? DBNull.Value),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquitySector>(CONN, usp, EquitySector.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetUnitTrustByCurrency
        [HttpGet, Route("equity/unit-trust-currency")]
        public IHttpActionResult GetUnitTrustByCurrency(DateTime asof, string fund_type, string fund_code, string currency)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetFIFByCurrency", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_CURRENCY", currency),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquitySector>(CONN, usp, EquitySector.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetAssetClassByFundCode
        [HttpGet, Route("equity/asset-class")]
        public IHttpActionResult GetAssetClassByFundCode(DateTime asof, string fund_type, string fund_code)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GroupingByAssetClass", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<FundAssetClass>(CONN, usp, FundAssetClass.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetSubAssetClassByFundCode
        [HttpGet, Route("equity/subasset-class")]
        public IHttpActionResult GetSubAssetClassByFundCode(DateTime asof, string fund_type, string fund_code)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GroupingBySubAssetClass", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<FundAssetClass>(CONN, usp, FundAssetClass.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetEquityDeltaRemark
        [HttpGet, Route("equity/delta-remark")]
        public IHttpActionResult GetEquityDeltaRemark(DateTime asof, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_EQUITY_REPORT.GetEquityDeltaRemark", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityDeltaRemarkReport>(CONN, usp, EquityDeltaRemarkReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #endregion

        #region Liquidity Report

        #region GetLiquidityAvailableDate
        [HttpGet, Route("liquidity/avail")]
        public IHttpActionResult GetLiquidityAvailableDate(string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_LIQUIDITY_REPORT.GetAvailableDate", fund_type.ToUpper());
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

        #region GetLiquidityLimitReport
        [HttpGet, Route("liquidity/liquidity-limit")]
        public IHttpActionResult GetLiquidityLimitReport(DateTime asof, string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_LIQUIDITY_REPORT.GetLimitReport", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<LiquidityLimitReport>(CONN, usp, LiquidityLimitReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetLiquidityDetail
        [HttpGet, Route("liquidity/liquidity-sector")]
        public IHttpActionResult GetLiquidityDetail(DateTime asof, string fund_type)
        {
            var result = new List<IDictionary<string, object>>();
            try
            {
                string usp = string.Format("{0}_LIQUIDITY_REPORT.GetLimitReportBySector", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<DynamicEntity>(CONN, usp, DynamicEntity.FillObject, p);
                foreach (var o in list)
                    result.Add(o.Values);
                return Ok(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.StartsWith("ORA-00936: missing expression"))
                    return Ok(result);
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetLiquidityLimitPeriodReport
        [HttpGet, Route("liquidity/period-limit")]
        public IHttpActionResult GetLiquidityLimitPeriodReport(DateTime from_date, DateTime to_date, string fund_type, string fund_code)
        {
            try
            {
                string usp = string.Format("{0}_LIQUIDITY_REPORT.GetLimitPeriodReport", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_FROM_DATE", from_date),
                    new OracleParameter("P_TO_DATE", to_date),
                    new OracleParameter("P_FUND_CODE", fund_code),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<LiquidityLimitReport>(CONN, usp, LiquidityLimitReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #endregion

        #region Counterparty Report

        #region GetCounterpartyAvailableDate
        [HttpGet, Route("counterparty/avail")]
        public IHttpActionResult GetCounterpartyAvailableDate(string fund_type)
        {
            try
            {
                string usp = string.Format("{0}_COUNTERPARTY_REPORT.GetAvailableDate", fund_type.ToUpper());
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

        #region GetCounterpartyLinetReport
        [HttpGet, Route("counterparty/counterparty-line")]
        public IHttpActionResult GetCounterpartyLinetReport(DateTime asof, string fund_type, bool exclude_fixterm)
        {
            try
            {
                string usp = string.Format("{0}_COUNTERPARTY_REPORT.GetLineReport", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_EXCLUDE_FIXTERM", exclude_fixterm ? 1 : 0),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<CounterpartyLimitReport>(CONN, usp, CounterpartyLimitReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetCounterpartyLinetReportByCounterParty
        [HttpGet, Route("counterparty/counterparty-line-detail")]
        public IHttpActionResult GetCounterpartyLinetReportByCounterParty(string fund_type, DateTime? trade, DateTime? settlement, bool exclude_fixterm, string counterparty)
        {
            try
            {
                string usp = string.Format("{0}_COUNTERPARTY_REPORT.GetLineReportByCounterParty", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_TRADE_DATE", trade),
                    new OracleParameter("P_SETTLEMENT_DATE", settlement),
                    new OracleParameter("P_EXCLUDE_FIXTERM", exclude_fixterm ? 1 : 0),
                    new OracleParameter("P_COUNTER_PARTY", counterparty),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<CounterpartyLimitDetail>(CONN, usp, CounterpartyLimitDetail.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #endregion

        #region Mail Alert
        #region GetEquityLimitMailAlert
        [HttpGet, Route("equity/mail-alert")]
        public IHttpActionResult GetEquityLimitMailAlert(DateTime asof, string fund_type)
        {
            try
            {
                string usp = string.Format("MAIL_ALERT.{0}_GetEquityLimit", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<EquityLimitPeriodReport>(CONN, usp, EquityLimitPeriodReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetLiquidityLimitMailAlert
        [HttpGet, Route("liquidity/mail-alert")]
        public IHttpActionResult GetLiquidityLimitMailAlert(DateTime asof, string fund_type)
        {
            try
            {
                // Not support PVD liquidity limit
                if (fund_type.ToUpper() == "PVD")
                    asof = asof.AddYears(10);

                string usp = "MAIL_ALERT.MF_GetLiquidityLimit";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<LiquidityLimitReport>(CONN, usp, LiquidityLimitReport.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetCounterpartyLineMailAlert
        [HttpGet, Route("counterparty/mail-alert")]
        public IHttpActionResult GetCounterpartyLineMailAlert(DateTime asof, string fund_type)
        {
            try
            {
                string usp = string.Format("MAIL_ALERT.{0}_GetCounterpartyLine", fund_type.ToUpper());
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_REPORT_DATE", asof),
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<CounterpartyLimitReport>(CONN, usp, CounterpartyLimitReport.FillObject, p);
                return Ok(list);
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

