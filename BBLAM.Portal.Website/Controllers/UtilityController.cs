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
    [RoutePrefix("api/util")]
    public class UtilityController : ApiControllerBase
    {
        #region Private Members
        private string CONN = "BBLAM";

        #endregion

        #region Utility Functions

        #region GetNextWorkingDate
        [HttpGet, Route("next-workday")]
        public IHttpActionResult GetNextWorkingDate(DateTime asof, int days)
        {
            try
            {
                string usp = "SELECT UTIL.GetNextWorkingDate(:P_DATE,:P_DAYS) FROM DUAL";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_DATE", asof),
                    new OracleParameter("P_DAYS", days),
                };
                var list = System.Data.DataUtil.ExecuteScalar<DateTime>(CONN, usp, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region GetPreviousWorkingDate
        [HttpGet, Route("prev-workday")]
        public IHttpActionResult GetPreviousWorkingDate(DateTime asof, int days)
        {
            try
            {
                string usp = "SELECT UTIL.GetPrevWorkingDate(:P_DATE,:P_DAYS) FROM DUAL";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_DATE", asof),
                    new OracleParameter("P_DAYS", days),
                };
                var list = System.Data.DataUtil.ExecuteScalar<DateTime>(CONN, usp, p);
                return Ok(list);
            }
            catch (Exception ex)
            {
                throw ThrowException(ex);
            }
        }

        #endregion

        #region IsHoliday
        [HttpGet, Route("is-holiday")]
        public IHttpActionResult IsHoliday(DateTime asof)
        {
            try
            {
                string usp = "SELECT UTIL.IsHoliday(:P_DATE) FROM DUAL";
                OracleParameter[] p = new OracleParameter[] {
                    new OracleParameter("P_DATE", asof),
                };
                var list = System.Data.DataUtil.ExecuteScalar<int>(CONN, usp, p);
                return Ok(list > 0);
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

