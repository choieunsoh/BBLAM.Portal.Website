#region Using Directives
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web;

#endregion

namespace BBLAM.Portal.Models
{
    public class PVDMonthlyReturn
    {
        #region Properties

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("policy_group")]
        public int PolicyGroup { get; set; }

        [JsonProperty("policy_group_name")]
        public string PolicyGroupName { get; set; }

        [JsonProperty("policy_code")]
        public string PolicyCode { get; set; }

        [JsonProperty("policy_order")]
        public string PolicyOrder { get; set; }

        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("bm_code")]
        public string BenchmarkCode { get; set; }

        [JsonProperty("total_nav")]
        public double? TotalNAV { get; set; }

        [JsonProperty("nav")]
        public double? NAV { get; set; }

        [JsonProperty("port_mtd")]
        public double? PortMTD { get; set; }

        [JsonProperty("port_ytd")]
        public double? PortYTD { get; set; }

        [JsonProperty("bm_mtd")]
        public double? BenchmarkMTD { get; set; }

        [JsonProperty("bm_ytd")]
        public double? BenchmarkYTD { get; set; }

        #endregion

        #region FillObject
        public static PVDMonthlyReturn FillObject(IDataReader reader)
        {
            PVDMonthlyReturn obj = new PVDMonthlyReturn();
            obj.Asof = reader.Field<DateTime>("asof");
            obj.PolicyGroup = reader.Field<int>("policy_group");
            obj.PolicyGroupName = reader.Field<string>("policy_group_name");
            obj.PolicyCode = reader.Field<string>("policy_code");
            obj.PolicyOrder = reader.Field<string>("policy_order");

            obj.PortfolioCode = reader.Field<string>("port_code");
            obj.BenchmarkCode = reader.Field<string>("bm_code");
            obj.TotalNAV = reader.Field<double?>("total_nav");
            obj.NAV = reader.Field<double?>("nav_per_unit");

            obj.PortMTD = reader.Field<double?>("port_mtd");
            obj.PortYTD = reader.Field<double?>("port_ytd");
            obj.BenchmarkMTD = reader.Field<double?>("bm_mtd");
            obj.BenchmarkYTD = reader.Field<double?>("bm_ytd");

            return obj;
        }

        #endregion

    }

}