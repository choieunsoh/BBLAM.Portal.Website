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
    public class EquityLimitReport
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
        public double? TotalNav { get; set; }

        [JsonProperty("equity_amount")]
        public double? EquityAmount { get; set; }

        [JsonProperty("fixed_income_amount")]
        public double? FixedIncomeAmount { get; set; }

        [JsonProperty("unit_trust_amount")]
        public double? UnitTrustAmount { get; set; }

        [JsonProperty("other_amount")]
        public double? OtherAmount { get; set; }

        [JsonProperty("equity_weight")]
        public double? EquityWeight { get; set; }

        [JsonProperty("fixed_income_weight")]
        public double? FixedIncomeWeight { get; set; }

        [JsonProperty("unit_trust_weight")]
        public double? UnitTrustWeight { get; set; }

        [JsonProperty("other_weight")]
        public double? OtherWeight { get; set; }

        [JsonProperty("limit_min")]
        public double? LimitMin { get; set; }

        [JsonProperty("limit_max")]
        public double? LimitMax { get; set; }

        [JsonProperty("remark")]
        public string Remark { get; set; }

        #endregion

        #region FillObject
        public static EquityLimitReport FillObject(IDataReader reader)
        {
            EquityLimitReport obj = new EquityLimitReport();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.NavDelay = reader.Field<bool>("nav_delay");
            if (obj.NavDelay)
                obj.Asof = reader.Field<DateTime?>("asof");

            obj.FundCode = reader.Field<string>("fund_code");
            obj.FundName = reader.Field<string>("fund_name", true);
            obj.FundType= reader.Field<string>("fund_type");
            obj.GroupOrder = reader.Field<int>("group_order");

            obj.TotalNav = reader.Field<double?>("total_nav");
            obj.EquityAmount = reader.Field<double?>("equity_amount");
            obj.FixedIncomeAmount = reader.Field<double?>("fixed_income_amount");
            obj.UnitTrustAmount = reader.Field<double?>("unit_trust_amount");
            obj.OtherAmount = reader.Field<double?>("other_amount");

            obj.EquityWeight = reader.Field<double?>("equity_weight");
            obj.FixedIncomeWeight = reader.Field<double?>("fixed_income_weight");
            obj.UnitTrustWeight = reader.Field<double?>("unit_trust_weight");
            obj.OtherWeight = reader.Field<double?>("other_weight");

            obj.LimitMin = reader.Field<double?>("limit_min");
            obj.LimitMax = reader.Field<double?>("limit_max");
            obj.Remark = reader.Field<string>("remark");

            return obj;        }

        #endregion

    }

    public class EquityLimitPeriodReport
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

        [JsonProperty("equity_amount")]
        public double EquityAmount { get; set; }

        [JsonProperty("equity_weight")]
        public double EquityWeight { get; set; }

        [JsonProperty("limit_min")]
        public double? LimitMin { get; set; }

        [JsonProperty("limit_max")]
        public double? LimitMax { get; set; }

        [JsonProperty("effective_date")]
        public DateTime? EffectiveDate { get; set; }

        [JsonProperty("breach_limit")]
        public bool BreachLimit { get; set; }

        #endregion

        #region FillObject
        public static EquityLimitPeriodReport FillObject(IDataReader reader)
        {
            EquityLimitPeriodReport obj = new EquityLimitPeriodReport();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.NavDelay = reader.Field<bool>("nav_delay");
            if (obj.NavDelay)
                obj.Asof = reader.Field<DateTime?>("asof");

            obj.FundCode = reader.Field<string>("fund_code");
            obj.FundName = reader.Field<string>("fund_name", true);
            obj.FundType = reader.Field<string>("fund_type");
            obj.GroupOrder = reader.Field<int>("group_order");

            obj.TotalNav = reader.Field<double>("total_nav");
            obj.EquityAmount = reader.Field<double>("equity_amount");
            obj.EquityWeight = reader.Field<double>("equity_weight");

            obj.LimitMin = reader.Field<double?>("limit_min");
            obj.LimitMax = reader.Field<double?>("limit_max");
            obj.EffectiveDate = reader.Field<DateTime?>("effective_date");
            obj.BreachLimit = reader.Field<bool>("breach_limit");

            return obj;
        }

        #endregion

    }

    public class EquityLimitPeriodSummaryReport
    {
        #region Properties
        [JsonProperty("fund_code")]
        public string FundCode { get; set; }

        [JsonProperty("fund_name")]
        public string FundName { get; set; }

        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("group_order")]
        public int GroupOrder { get; set; }

        [JsonProperty("from_date")]
        public DateTime FromDate { get; set; }

        [JsonProperty("to_date")]
        public DateTime ToDate { get; set; }

        [JsonProperty("min_equity_weight")]
        public double MinEquityWeight { get; set; }

        [JsonProperty("max_equity_weight")]
        public double MaxEquityWeight { get; set; }

        [JsonProperty("limit_min")]
        public double? LimitMin { get; set; }

        [JsonProperty("limit_max")]
        public double? LimitMax { get; set; }

        [JsonProperty("breach_limit")]
        public int BreachLimit { get; set; }

        #endregion

        #region FillObject
        public static EquityLimitPeriodSummaryReport FillObject(IDataReader reader)
        {
            EquityLimitPeriodSummaryReport obj = new EquityLimitPeriodSummaryReport();
            obj.FundCode = reader.Field<string>("fund_code");
            obj.FundName = reader.Field<string>("fund_name", true);
            obj.FundType = reader.Field<string>("fund_type");
            obj.GroupOrder = reader.Field<int>("group_order");

            obj.FromDate = reader.Field<DateTime>("from_date");
            obj.ToDate = reader.Field<DateTime>("to_date");

            obj.MinEquityWeight = reader.Field<double>("min_equity_weight");
            obj.MaxEquityWeight = reader.Field<double>("max_equity_weight");

            obj.LimitMin = reader.Field<double?>("limit_min");
            obj.LimitMax = reader.Field<double?>("limit_max");
            obj.BreachLimit = reader.Field<int>("breach_limit");

            return obj;
        }

        #endregion

    }

    public class EquityOriginReport
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
        public double? TotalNav { get; set; }

        [JsonProperty("equity_thai_amount")]
        public double? EquityThaiAmount { get; set; }

        [JsonProperty("equity_foreign_amount")]
        public double? EquityForeignAmount { get; set; }

        [JsonProperty("gov_thai_amount")]
        public double? GovThaiAmount { get; set; }

        [JsonProperty("gov_foreign_amount")]
        public double? GovForeignAmount { get; set; }

        [JsonProperty("corp_thai_amount")]
        public double? CorpThaiAmount { get; set; }

        [JsonProperty("corp_foreign_amount")]
        public double? CorpForeignAmount { get; set; }

        [JsonProperty("unit_trust_thai_amount")]
        public double? UnitTrustThaiAmount { get; set; }

        [JsonProperty("unit_trust_foreign_amount")]
        public double? UnitTrustForeignAmount { get; set; }

        [JsonProperty("unit_trust_fi_thai_amount")]
        public double? UnitTrustFIThaiAmount { get; set; }

        [JsonProperty("unit_trust_fi_foreign_amount")]
        public double? UnitTrustFIForeignAmount { get; set; }

        [JsonProperty("equity_thai_weight")]
        public double? EquityThaiWeight { get; set; }

        [JsonProperty("equity_foreign_weight")]
        public double? EquityForeignWeight { get; set; }

        [JsonProperty("gov_thai_weight")]
        public double? GovThaiWeight { get; set; }

        [JsonProperty("gov_foreign_weight")]
        public double? GovForeignWeight { get; set; }

        [JsonProperty("corp_thai_weight")]
        public double? CorpThaiWeight { get; set; }

        [JsonProperty("corp_foreign_weight")]
        public double? CorpForeignWeight { get; set; }

        [JsonProperty("unit_trust_thai_weight")]
        public double? UnitTrustThaiWeight { get; set; }

        [JsonProperty("unit_trust_foreign_weight")]
        public double? UnitTrustForeignWeight { get; set; }

        [JsonProperty("unit_trust_fi_thai_weight")]
        public double? UnitTrustFIThaiWeight { get; set; }

        [JsonProperty("unit_trust_fi_foreign_weight")]
        public double? UnitTrustFIForeignWeight { get; set; }

        #endregion

        #region FillObject
        public static EquityOriginReport FillObject(IDataReader reader)
        {
            EquityOriginReport obj = new EquityOriginReport();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.NavDelay = reader.Field<bool>("nav_delay");
            if (obj.NavDelay)
                obj.Asof = reader.Field<DateTime?>("asof");

            obj.FundCode = reader.Field<string>("fund_code");
            obj.FundName = reader.Field<string>("fund_name", true);
            obj.FundType = reader.Field<string>("fund_type");
            obj.GroupOrder = reader.Field<int>("group_order");

            obj.TotalNav = reader.Field<double?>("total_nav");
            obj.EquityThaiAmount = reader.Field<double?>("equity_thai_amount");
            obj.EquityForeignAmount = reader.Field<double?>("equity_foreign_amount");
            obj.GovThaiAmount = reader.Field<double?>("gov_thai_amount");
            obj.GovForeignAmount = reader.Field<double?>("gov_foreign_amount");
            obj.CorpThaiAmount = reader.Field<double?>("corp_thai_amount");
            obj.CorpForeignAmount = reader.Field<double?>("corp_foreign_amount");
            obj.UnitTrustThaiAmount = reader.Field<double?>("unit_trust_thai_amount");
            obj.UnitTrustForeignAmount = reader.Field<double?>("unit_trust_foreign_amount");
            obj.UnitTrustFIThaiAmount = reader.Field<double?>("unit_trust_fi_thai_amount");
            obj.UnitTrustFIForeignAmount = reader.Field<double?>("unit_trust_fi_foreign_amount");

            obj.EquityThaiWeight = reader.Field<double?>("equity_thai_weight");
            obj.EquityForeignWeight = reader.Field<double?>("equity_foreign_weight");
            obj.GovThaiWeight = reader.Field<double?>("gov_thai_weight");
            obj.GovForeignWeight = reader.Field<double?>("gov_foreign_weight");
            obj.CorpThaiWeight = reader.Field<double?>("corp_thai_weight");
            obj.CorpForeignWeight = reader.Field<double?>("corp_foreign_weight");
            obj.UnitTrustThaiWeight = reader.Field<double?>("unit_trust_thai_weight");
            obj.UnitTrustForeignWeight = reader.Field<double?>("unit_trust_foreign_weight");
            obj.UnitTrustFIThaiWeight = reader.Field<double?>("unit_trust_fi_thai_weight");
            obj.UnitTrustFIForeignWeight = reader.Field<double?>("unit_trust_fi_foreign_weight");

            return obj;
        }

        #endregion

    }

    public class EquityDeltaRemarkReport
    {
        #region Properties
        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("security")]
        public string Security { get; set; }

        [JsonProperty("master_stock")]
        public string MasterStock { get; set; }

        [JsonProperty("remark")]
        public string Remark { get; set; }

        #endregion

        #region FillObject
        public static EquityDeltaRemarkReport FillObject(IDataReader reader)
        {
            EquityDeltaRemarkReport obj = new EquityDeltaRemarkReport();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.Security = reader.Field<string>("security");
            obj.MasterStock = reader.Field<string>("master_stock");
            obj.Remark = reader.Field<string>("remark");

            return obj;
        }

        #endregion

    }

}