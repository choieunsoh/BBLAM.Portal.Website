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
    public class FundAssetClass
    {
        #region Properties
        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("fund_code")]
        public string FundCode { get; set; }

        [JsonProperty("fund_name")]
        public string FundName { get; set; }

        [JsonProperty("asset_class")]
        public string AssetClass { get; set; }

        [JsonProperty("asset_order")]
        public int AssetOrder { get; set; }

        [JsonProperty("total_value")]
        public double TotalValue { get; set; }

        [JsonProperty("weight")]
        public double Weight { get; set; }

        [JsonProperty("total_nav")]
        public double TotalNAV { get; set; }

        #endregion

        #region FillObject
        public static FundAssetClass FillObject(IDataReader reader)
        {
            FundAssetClass obj = new FundAssetClass();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.Asof = reader.Field<DateTime>("asof");
            obj.FundCode = reader.Field<string>("fund_code");
            obj.FundName = reader.Field<string>("fund_name");
            obj.AssetClass = reader.Field<string>("asset_class");
            obj.AssetOrder = reader.Field<int>("asset_order");
            obj.TotalValue = reader.Field<double>("total_value");
            obj.Weight = reader.Field<double>("weight");
            obj.TotalNAV = reader.Field<double>("total_nav");

            return obj;
        }

        #endregion

    }

}