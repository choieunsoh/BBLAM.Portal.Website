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
    #region MF
    public class MonthlyFundFactSheet
    {
        #region Properties
        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("period_order")]
        public int PeriodOrder { get; set; }

        [JsonProperty("period_code")]
        public string PeriodCode { get; set; }

        [JsonProperty("period_date")]
        public DateTime PeriodDate { get; set; }

        [JsonProperty("period_days")]
        public int PeriodDays { get; set; }

        [JsonProperty("actual_days")]
        public int ActualOays { get; set; }

        [JsonProperty("port_return")]
        public double PortfolioReturn { get; set; }

        [JsonProperty("bm_return")]
        public double BenchmarkReturn { get; set; }

        [JsonProperty("port_sd")]
        public double PortfolioSD { get; set; }

        [JsonProperty("bm_sd")]
        public double BenchmarkSD { get; set; }

        [JsonProperty("ir")]
        public double InformationRatio { get; set; }

        [JsonProperty("te")]
        public double TrackingError { get; set; }

        #endregion

        #region FillObject
        public static MonthlyFundFactSheet FillObject(IDataReader reader)
        {
            MonthlyFundFactSheet obj = new MonthlyFundFactSheet();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.PortfolioCode = reader.Field<string>("port_code");

            obj.PeriodOrder = reader.Field<int>("period_order");
            obj.PeriodCode = reader.Field<string>("period_code");
            obj.PeriodDate = reader.Field<DateTime>("period_date");
            obj.PeriodDays = reader.Field<int>("period_days");
            obj.ActualOays = reader.Field<int>("actual_days");

            obj.PortfolioReturn = reader.Field<double>("port_return");
            obj.BenchmarkReturn = reader.Field<double>("bm_return");

            obj.PortfolioSD = reader.Field<double>("port_sd");
            obj.BenchmarkSD = reader.Field<double>("bm_sd");

            obj.InformationRatio = reader.Field<double>("ir");
            obj.TrackingError = reader.Field<double>("te");

            return obj;
        }

        #endregion

    }

    public class MonthlyFundFactSheetMatrix
    {
        #region Properties
        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("title_order")]
        public int TitleOrder { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("p_1m")]
        public double? Period1M { get; set; }

        [JsonProperty("p_3m")]
        public double? Period3M { get; set; }

        [JsonProperty("p_6m")]
        public double? Period6M { get; set; }

        [JsonProperty("p_1y")]
        public double? Period1Y { get; set; }

        [JsonProperty("p_3y")]
        public double? Period3Y { get; set; }

        [JsonProperty("p_5y")]
        public double? Period5Y { get; set; }

        [JsonProperty("p_10y")]
        public double? Period10Y { get; set; }

        [JsonProperty("p_inc")]
        public double? PeriodINC { get; set; }

        [JsonProperty("p_ytd")]
        public double? PeriodYTD { get; set; }

        #endregion

        #region FillObject
        public static MonthlyFundFactSheetMatrix FillObject(IDataReader reader)
        {
            MonthlyFundFactSheetMatrix obj = new MonthlyFundFactSheetMatrix();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.PortfolioCode = reader.Field<string>("port_code");
            obj.Title = reader.Field<string>("title");
            obj.TitleOrder = reader.Field<int>("title_order");
            obj.Type = reader.Field<string>("factsheet_type");

            obj.Period1M = reader.Field<double?>("p_1m");
            obj.Period3M = reader.Field<double?>("p_3m");
            obj.Period6M = reader.Field<double?>("p_6m");
            obj.Period1Y = reader.Field<double?>("p_1y");
            obj.Period3Y = reader.Field<double?>("p_3y");
            obj.Period5Y = reader.Field<double?>("p_5y");
            obj.Period10Y = reader.Field<double?>("p_10y");
            obj.PeriodINC = reader.Field<double?>("p_inc");
            obj.PeriodYTD = reader.Field<double?>("p_ytd");

            return obj;
        }

        #endregion

    }

    public class MonthlyFundFactSheetSummary
    {
        #region Properties
        [JsonProperty("row_no")]
        public int RowNo { get; set; }

        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("data_type")]
        public string DataType { get; set; }

        [JsonProperty("total_nav")]
        public double? TotalNAV { get; set; }

        [JsonProperty("nav")]
        public double? NAV { get; set; }

        [JsonProperty("p_1m")]
        public double? Period1M { get; set; }

        [JsonProperty("p_3m")]
        public double? Period3M { get; set; }

        [JsonProperty("p_6m")]
        public double? Period6M { get; set; }

        [JsonProperty("p_1y")]
        public double? Period1Y { get; set; }

        [JsonProperty("p_3y")]
        public double? Period3Y { get; set; }

        [JsonProperty("p_5y")]
        public double? Period5Y { get; set; }

        [JsonProperty("p_10y")]
        public double? Period10Y { get; set; }

        [JsonProperty("p_si")]
        public double? PeriodSI { get; set; }

        [JsonProperty("p_ytd")]
        public double? PeriodYTD { get; set; }

        [JsonProperty("p_si_bm")]
        public double? PeriodSIBM { get; set; }

        #endregion

        #region FillObject
        public static MonthlyFundFactSheetSummary FillObject(IDataReader reader)
        {
            MonthlyFundFactSheetSummary obj = new MonthlyFundFactSheetSummary();
            obj.RowNo = reader.Field<int>("row_no");
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.PortfolioCode = reader.Field<string>("port_code");
            obj.DataType = reader.Field<string>("data_type");

            obj.TotalNAV = reader.Field<double?>("total_nav");
            obj.NAV = reader.Field<double?>("nav");

            obj.Period1M = reader.Field<double?>("p_1m");
            obj.Period3M = reader.Field<double?>("p_3m");
            obj.Period6M = reader.Field<double?>("p_6m");
            obj.Period1Y = reader.Field<double?>("p_1y");
            obj.Period3Y = reader.Field<double?>("p_3y");
            obj.Period5Y = reader.Field<double?>("p_5y");
            obj.Period10Y = reader.Field<double?>("p_10y");
            obj.PeriodSI = reader.Field<double?>("p_si");
            obj.PeriodYTD = reader.Field<double?>("p_ytd");
            obj.PeriodSIBM = reader.Field<double?>("p_si_bm");

            return obj;
        }

        #endregion

    }

    #endregion

    #region PVD
    public class PVDMonthlyFundFactSheetSummary
    {
        #region Properties

        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("row_no")]
        public int? RowNo { get; set; }

        [JsonProperty("policy_group")]
        public int? PolicyGroup { get; set; }

        [JsonProperty("policy_group_name")]
        public string PolicyGroupName { get; set; }

        [JsonProperty("policy_code")]
        public string PolicyCode { get; set; }

        [JsonProperty("policy_order")]
        public string PolicyOrder { get; set; }

        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("total_nav")]
        public double? TotalNAV { get; set; }

        [JsonProperty("nav")]
        public double? NAV { get; set; }

        #region Port Return
        [JsonProperty("port_ret_1m")]
        public double? PortReturn1M { get; set; }

        [JsonProperty("port_ret_3m")]
        public double? PortReturn3M { get; set; }

        [JsonProperty("port_ret_6m")]
        public double? PortReturn6M { get; set; }

        [JsonProperty("port_ret_1y")]
        public double? PortReturn1Y { get; set; }

        [JsonProperty("port_ret_3y")]
        public double? PortReturn3Y { get; set; }

        [JsonProperty("port_ret_5y")]
        public double? PortReturn5Y { get; set; }

        [JsonProperty("port_ret_10y")]
        public double? PortReturn10Y { get; set; }

        [JsonProperty("port_ret_si")]
        public double? PortReturnSI { get; set; }

        [JsonProperty("port_ret_ytd")]
        public double? PortReturnYTD { get; set; }

        #endregion

        #region BM Return
        [JsonProperty("bm_ret_1m")]
        public double? BMReturn1M { get; set; }

        [JsonProperty("bm_ret_3m")]
        public double? BMReturn3M { get; set; }

        [JsonProperty("bm_ret_6m")]
        public double? BMReturn6M { get; set; }

        [JsonProperty("bm_ret_1y")]
        public double? BMReturn1Y { get; set; }

        [JsonProperty("bm_ret_3y")]
        public double? BMReturn3Y { get; set; }

        [JsonProperty("bm_ret_5y")]
        public double? BMReturn5Y { get; set; }

        [JsonProperty("bm_ret_10y")]
        public double? BMReturn10Y { get; set; }

        [JsonProperty("bm_ret_si")]
        public double? BMReturnSI { get; set; }

        [JsonProperty("bm_ret_ytd")]
        public double? BMReturnYTD { get; set; }

        #endregion

        #region Alpha
        [JsonProperty("alpha_1m")]
        public double? Alpha1M { get; set; }

        [JsonProperty("alpha_3m")]
        public double? Alpha3M { get; set; }

        [JsonProperty("alpha_6m")]
        public double? Alpha6M { get; set; }

        [JsonProperty("alpha_1y")]
        public double? Alpha1Y { get; set; }

        [JsonProperty("alpha_3y")]
        public double? Alpha3Y { get; set; }

        [JsonProperty("alpha_5y")]
        public double? Alpha5Y { get; set; }

        [JsonProperty("alpha_10y")]
        public double? Alpha10Y { get; set; }

        [JsonProperty("alpha_si")]
        public double? AlphaSI { get; set; }

        [JsonProperty("alpha_ytd")]
        public double? AlphaYTD { get; set; }

        #endregion

        #endregion

        #region FillObject
        public static PVDMonthlyFundFactSheetSummary FillObject(IDataReader reader)
        {
            PVDMonthlyFundFactSheetSummary obj = new PVDMonthlyFundFactSheetSummary();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.RowNo = reader.Field<int?>("row_no");
            obj.PolicyGroup = reader.Field<int?>("policy_group");
            obj.PolicyGroupName = reader.Field<string>("policy_group_name");
            obj.PolicyCode = reader.Field<string>("policy_code");
            obj.PolicyOrder = reader.Field<string>("policy_order");

            obj.PortfolioCode = reader.Field<string>("port_code");
            obj.TotalNAV = reader.Field<double?>("total_nav");
            obj.NAV = reader.Field<double?>("nav_per_unit");

            #region Port Return
            obj.PortReturn1M = reader.Field<double?>("port_ret_1m");
            obj.PortReturn3M = reader.Field<double?>("port_ret_3m");
            obj.PortReturn6M = reader.Field<double?>("port_ret_6m");
            obj.PortReturn1Y = reader.Field<double?>("port_ret_1y");
            obj.PortReturn3Y = reader.Field<double?>("port_ret_3y");
            obj.PortReturn5Y = reader.Field<double?>("port_ret_5y");
            obj.PortReturn10Y = reader.Field<double?>("port_ret_10y");
            obj.PortReturnSI = reader.Field<double?>("port_ret_si");
            obj.PortReturnYTD = reader.Field<double?>("port_ret_ytd");

            #endregion

            #region BM Return
            obj.BMReturn1M = reader.Field<double?>("bm_ret_1m");
            obj.BMReturn3M = reader.Field<double?>("bm_ret_3m");
            obj.BMReturn6M = reader.Field<double?>("bm_ret_6m");
            obj.BMReturn1Y = reader.Field<double?>("bm_ret_1y");
            obj.BMReturn3Y = reader.Field<double?>("bm_ret_3y");
            obj.BMReturn5Y = reader.Field<double?>("bm_ret_5y");
            obj.BMReturn10Y = reader.Field<double?>("bm_ret_10y");
            obj.BMReturnSI = reader.Field<double?>("bm_ret_si");
            obj.BMReturnYTD = reader.Field<double?>("bm_ret_ytd");

            #endregion

            #region Alpha
            obj.Alpha1M = reader.Field<double?>("alpha_1m");
            obj.Alpha3M = reader.Field<double?>("alpha_3m");
            obj.Alpha6M = reader.Field<double?>("alpha_6m");
            obj.Alpha1Y = reader.Field<double?>("alpha_1y");
            obj.Alpha3Y = reader.Field<double?>("alpha_3y");
            obj.Alpha5Y = reader.Field<double?>("alpha_5y");
            obj.Alpha10Y = reader.Field<double?>("alpha_10y");
            obj.AlphaSI = reader.Field<double?>("alpha_si");
            obj.AlphaYTD = reader.Field<double?>("alpha_ytd");

            #endregion

            return obj;
        }

        #endregion

    }

    #endregion

}