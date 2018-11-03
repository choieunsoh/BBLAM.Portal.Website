#region Using Directives
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

#endregion

namespace BBLAM.Portal.Models
{
    public class ComparePortReturn
    {
        #region Properties
        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("ora_asof")]
        public DateTime OracleAsof { get; set; }

        [JsonProperty("asof")]
        public DateTime? Asof { get; set; }

        [JsonProperty("ora_total_nav")]
        public double OracleTotalNav { get; set; }

        [JsonProperty("total_nav")]
        public double? TotalNav { get; set; }

        [JsonProperty("ora_nav")]
        public double OracleNav { get; set; }

        [JsonProperty("nav")]
        public double? Nav { get; set; }

        [JsonProperty("match")]
        public bool Match { get; set; }

        [JsonProperty("updated_date")]
        public DateTime? UpdatedDate { get; set; }

        #endregion

        #region FillObject
        public static ComparePortReturn FillObject(IDataReader reader)
        {
            ComparePortReturn obj = new ComparePortReturn();
            obj.PortfolioCode = reader.Field<string>("port_code");

            obj.OracleAsof = reader.Field<DateTime>("ora_asof");
            obj.Asof = reader.Field<DateTime?>("asof");

            obj.OracleTotalNav = reader.Field<double>("ora_total_nav");
            obj.TotalNav = reader.Field<double?>("total_nav");

            obj.OracleNav = reader.Field<double>("ora_nav");
            obj.Nav = reader.Field<double?>("nav");

            obj.Match = reader.Field<bool>("match");
            obj.UpdatedDate = reader.Field<DateTime?>("updated_date");

            return obj;
        }

        #endregion

    }

}