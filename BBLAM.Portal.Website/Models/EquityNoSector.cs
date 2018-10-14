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
    public class EquitySector
    {
        #region Properties
        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("fund_code")]
        public string FundCode { get; set; }

        [JsonProperty("total_nav")]
        public double TotalNav { get; set; }

        [JsonProperty("security")]
        public string Security { get; set; }

        [JsonProperty("weight")]
        public double Weight { get; set; }

        [JsonProperty("total_value")]
        public double TotalValue { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("sector_code")]
        public string SectorCode { get; set; }

        #endregion

        #region FillObject
        public static EquitySector FillObject(IDataReader reader)
        {
            EquitySector obj = new EquitySector();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.Asof = reader.Field<DateTime>("asof");
            obj.FundCode = reader.Field<string>("fund_code");
            obj.TotalNav = reader.Field<double>("total_nav");
            obj.Security = reader.Field<string>("security");
            obj.Weight = reader.Field<double>("weight");
            obj.TotalValue= reader.Field<double>("total_value");
            obj.Currency = reader.Field<string>("currency");
            obj.SectorCode = reader.Field<string>("sector_code");

            return obj;        }

        #endregion

    }

}