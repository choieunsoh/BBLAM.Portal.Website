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

}