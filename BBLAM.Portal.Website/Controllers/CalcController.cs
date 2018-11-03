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
    [RoutePrefix("api/calc")]
    public class CalcController : ApiControllerBase
    {
        #region Private Members
        private string CONN = "BBLAM";

        #endregion

        #region Properties

        #endregion

        #region Performance

        #region GetAvailableDate
        [HttpGet, Route("avail")]
        public IHttpActionResult GetAvailableDate(string data_type)
        {
            try
            {
                string usp = "PERF_CALC.GetAvailableDate";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_DATA_TYPE", data_type.ToUpper()),
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

        #region GetComparePortReturn
        [HttpGet, Route("perf/mf-port/comp")]
        public IHttpActionResult GetComparePortReturn()
        {
            try
            {
                string usp = "PERF_CALC.CompareMFPortReturn";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_RESULT", OracleDbType.RefCursor, ParameterDirection.Output)
                };
                var list = System.Data.DataUtil.ExecuteList<ComparePortReturn>(CONN, usp, ComparePortReturn.FillObject, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region CalcPortReturn
        [HttpPost, Route("perf/mf-port/calc-ret")]
        public IHttpActionResult CalcPortReturn(string port_code, DateTime start_date, DateTime end_date)
        {
            try
            {
                string usp = "MF_PERF_REPORT.CalcPortSimulatedNavByPort";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_START_DATE", start_date),
                    new OracleParameter("P_END_DATE", end_date),
                    new OracleParameter("P_PORT_CODE", port_code),
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

        #endregion

        #region Private Methods

        #endregion

    }

}

