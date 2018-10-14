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
    public class LiquidityLimitReport
    {
        #region Properties
        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("asof")]
        public DateTime? Asof { get; set; }

        [JsonProperty("nav_delay")]
        public bool NavDelay { get; set; }

        [JsonProperty("fund_code")]
        public string FundCode { get; set; }

        [JsonProperty("fund_name")]
        public string FundName { get; set; }

        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("group_order")]
        public int GroupOrder { get; set; }

        [JsonProperty("total_nav")]
        public double TotalNav { get; set; }

        [JsonProperty("liquidity_amount")]
        public double LiquidityAmount { get; set; }

        [JsonProperty("liquidity_weight")]
        public double LiquidityWeight { get; set; }
        
        [JsonProperty("soft_limit")]
        public double? SoftLimit { get; set; }

        [JsonProperty("hard_limit")]
        public double? HardLimit { get; set; }

        [JsonProperty("remark")]
        public string Remark { get; set; }

        [JsonProperty("status_code")]
        public int StatusCode { get; set; }

        #endregion

        #region FillObject
        public static LiquidityLimitReport FillObject(IDataReader reader)
        {
            LiquidityLimitReport obj = new LiquidityLimitReport();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.NavDelay = reader.Field<bool>("nav_delay");
            if (obj.NavDelay)
                obj.Asof = reader.Field<DateTime?>("asof");

            obj.FundCode = reader.Field<string>("fund_code");
            obj.FundName = reader.Field<string>("fund_name", true);
            obj.FundType= reader.Field<string>("fund_type");
            obj.GroupOrder = reader.Field<int>("group_order");

            obj.TotalNav = reader.Field<double>("total_nav");
            obj.LiquidityAmount = reader.Field<double>("liquidity_value");
            obj.LiquidityWeight = reader.Field<double>("liquidity_weight");

            obj.SoftLimit = reader.Field<double?>("soft_limit");
            obj.HardLimit = reader.Field<double?>("hard_limit");
            obj.Remark = reader.Field<string>("remark");
            obj.StatusCode = reader.Field<int>("status_code");

            return obj;        }

        #endregion

    }

}