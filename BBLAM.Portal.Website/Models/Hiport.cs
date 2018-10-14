#region Using Directives
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

#endregion

namespace BBLAM.Portal.Models
{
    #region MF_COLUMN Enum
    public static class MF_COLUMN
    {
        public const int ROW_TYPE = 0;
        public const int FUND_CODE = 1;
        public const int SECURITY = 2;
        public const int SHORT_NAME = 3;
        public const int SEC_TYPE = 4;

        public const int UNIT_HOLDING = 5;
        public const int COUPON = 6;
        public const int LAST_TRADE_DATE = 7;
        public const int MATURITY_DATE = 8;
        public const int TOTAL_COST = 9;

        public const int AMORTISED_COST = 10;
        public const int ACCRUED_INTEREST = 11;
        public const int INT_ENT_EX = 12;
        public const int CLEAN_VALUE = 13;
        public const int TOTAL_VALUE = 14;

        public const int WEIGHT = 15;
        public const int TTM = 16;
        public const int REDEMP_Y = 17;
        public const int MARKET_Y = 18;
        public const int ISSUER = 19;

        public const int SEC0 = 20;
        public const int SEC1 = 21;
        public const int SEC2 = 22;
        public const int SEC3 = 23;
        public const int IND = 24;

        public const int CAT = 25;
        public const int SHARES_ISSUED = 26;
        public const int MAC_DURATION = 27;
        public const int MOD_DURATION = 28;
        public const int STK_EX = 29;

        public const int EXCHANGE_NATIVE_TO_BASE = 30;
        public const int TOTAL_COST_NATIVE = 31;
        public const int CURRENCY = 32;
        public const int ISSUE_DATE = 33;
        public const int FI = 34;
    }

    #endregion

    #region HiportMutualFund
    [XmlRoot("mffund")]
    public class HiportMutualFund
    {
        #region Properties

        [XmlElement("no")]
        public int RowNo { get; set; }

        [XmlElement("row")]
        public string RowType { get; set; }

        [XmlElement("fund")]
        public string FundCode { get; set; }

        [XmlElement("security")]
        public string Security { get; set; }

        [XmlElement("name")]
        public string ShortName { get; set; }

        [XmlElement("type")]
        public string SecType { get; set; }


        [XmlElement("unit", IsNullable = true)]
        public double? UnitHolding { get; set; }

        [XmlElement("coupon", IsNullable = true)]
        public double? Coupon { get; set; }

        [XmlElement("last_trade", IsNullable = true)]
        public DateTime? LastTradeDate { get; set; }

        [XmlElement("maturity", IsNullable = true)]
        public DateTime? MaturityDate { get; set; }

        [XmlElement("total_cost", IsNullable = true)]
        public double? TotalCost { get; set; }


        [XmlElement("amortised_cost", IsNullable = true)]
        public double? AmortisedCost { get; set; }

        [XmlElement("ai", IsNullable = true)]
        public double? AccruedInterest { get; set; }

        [XmlElement("int_ent_ex")]
        public string IntEntEx { get; set; }

        [XmlElement("clean_value", IsNullable = true)]
        public double? CleanValue { get; set; }

        [XmlElement("total_value", IsNullable = true)]
        public double? TotalValue { get; set; }


        [XmlElement("weight", IsNullable = true)]
        public double? Weight { get; set; }

        [XmlElement("ttm", IsNullable = true)]
        public double? TTM { get; set; }

        [XmlElement("redemp", IsNullable = true)]
        public double? RedempY { get; set; }

        [XmlElement("market", IsNullable = true)]
        public double? MarketY { get; set; }

        [XmlElement("issuer")]
        public string Issuer { get; set; }


        [XmlElement("sec0")]
        public string Sec0 { get; set; }

        [XmlElement("sec1")]
        public string Sec1 { get; set; }

        [XmlElement("sec2")]
        public string Sec2 { get; set; }

        [XmlElement("sec3")]
        public string Sec3 { get; set; }

        [XmlElement("ind")]
        public string Ind { get; set; }


        [XmlElement("cat")]
        public string Cat { get; set; }

        [XmlElement("shares", IsNullable = true)]
        public double? SharesIssued { get; set; }

        [XmlElement("mac", IsNullable = true)]
        public double? MacDuration { get; set; }

        [XmlElement("mod", IsNullable = true)]
        public double? ModDuration { get; set; }

        [XmlElement("stk_ex")]
        public string StkEx { get; set; }


        [XmlElement("fx", IsNullable = true)]
        public double? ExchangeNativeToBase { get; set; }

        [XmlElement("cost_native", IsNullable = true)]
        public double? TotalCostNative { get; set; }

        [XmlElement("cur")]
        public string Currency { get; set; }

        [XmlElement("issue", IsNullable = true)]
        public DateTime? IssueDate { get; set; }

        [XmlElement("fi")]
        public string FI { get; set; }

        public DateTime FileDate { get; set; }
        public DateTime Asof { get; set; }

        #endregion

        #region Public Methods
        #region FillObject
        public static HiportMutualFund FillObject(string data)
        {
            return FillObject(data.Split(','));
        }
        public static HiportMutualFund FillObject(string[] data)
        {
            HiportMutualFund obj = new HiportMutualFund();
            obj.RowType = data[MF_COLUMN.ROW_TYPE];
            obj.FundCode = data[MF_COLUMN.FUND_CODE];
            obj.Security = data[MF_COLUMN.SECURITY];
            obj.ShortName = data[MF_COLUMN.SHORT_NAME];
            obj.SecType = data[MF_COLUMN.SEC_TYPE];

            obj.UnitHolding = ToDouble(data[MF_COLUMN.UNIT_HOLDING]);
            obj.Coupon = ToDouble(data[MF_COLUMN.COUPON]);
            obj.LastTradeDate = ToDate(data[MF_COLUMN.LAST_TRADE_DATE]);
            obj.MaturityDate = ToDate(data[MF_COLUMN.MATURITY_DATE]);
            obj.TotalCost = ToDouble(data[MF_COLUMN.TOTAL_COST]);

            obj.AmortisedCost = ToDouble(data[MF_COLUMN.AMORTISED_COST]);
            obj.AccruedInterest = ToDouble(data[MF_COLUMN.ACCRUED_INTEREST]);
            obj.IntEntEx = data[MF_COLUMN.INT_ENT_EX];
            obj.CleanValue = ToDouble(data[MF_COLUMN.CLEAN_VALUE]);
            obj.TotalValue = ToDouble(data[MF_COLUMN.TOTAL_VALUE]);

            obj.Weight = ToDouble(data[MF_COLUMN.WEIGHT]);
            obj.TTM = ToDouble(data[MF_COLUMN.TTM]);
            obj.RedempY = ToDouble(data[MF_COLUMN.REDEMP_Y]);
            obj.MarketY = ToDouble(data[MF_COLUMN.MARKET_Y]);
            obj.Issuer = data[MF_COLUMN.ISSUER];

            obj.Sec0 = data[MF_COLUMN.SEC0];
            obj.Sec1 = data[MF_COLUMN.SEC1];
            obj.Sec2 = data[MF_COLUMN.SEC2];
            obj.Sec3 = data[MF_COLUMN.SEC3];
            obj.Ind = data[MF_COLUMN.IND];

            obj.Cat = data[MF_COLUMN.CAT];
            obj.SharesIssued = ToDouble(data[MF_COLUMN.SHARES_ISSUED]);
            obj.MacDuration = ToDouble(data[MF_COLUMN.MAC_DURATION]);
            obj.ModDuration = ToDouble(data[MF_COLUMN.MOD_DURATION]);
            obj.StkEx = data[MF_COLUMN.STK_EX];

            obj.ExchangeNativeToBase = ToDouble(data[MF_COLUMN.EXCHANGE_NATIVE_TO_BASE]);
            obj.TotalCostNative = ToDouble(data[MF_COLUMN.TOTAL_COST_NATIVE]);
            obj.Currency = data[MF_COLUMN.CURRENCY];
            obj.IssueDate = ToDate(data[MF_COLUMN.ISSUE_DATE]);
            obj.FI = data[MF_COLUMN.FI];

            return obj;
        }

        #endregion

        #endregion

        #region Private Methods
        #region ToDate
        private static DateTime? ToDate(string date)
        {
            return date != "" ? date.ToDate("dd/MM/yyyy") : (DateTime?)null;
        }

        #endregion

        #region ToDouble
        private static double? ToDouble(string date)
        {
            return date != "" ? date.ToDouble() : (double?)null;
        }

        #endregion

        #region ToInt32
        private static int? ToInt32(string date)
        {
            return date != "" ? date.ToInt32() : (int?)null;
        }

        #endregion

        #endregion

    }

    #endregion

    #region HiportLog
    public class HiportLog
    {
        #region Properties
        [JsonProperty("report_date")]
        public DateTime ReportDate { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("row_count")]
        public int RowCount { get; set; }

        #endregion

        #region FillObject
        public static HiportLog FillObject(IDataReader reader)
        {
            HiportLog obj = new HiportLog();
            obj.ReportDate = reader.Field<DateTime>("report_date");
            obj.Name = reader.Field<string>("name");
            obj.Asof = reader.Field<DateTime>("asof");
            obj.RowCount = reader.Field<int>("row_count");

            return obj;
        }

        #endregion

    }

    #endregion
}