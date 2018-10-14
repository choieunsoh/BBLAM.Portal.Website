#region Uising Directives
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

#endregion

namespace BBLAM.MutualFund.PortfolioFileReader.Models
{
    [XmlRoot("mf_data")]
    public class MutualFundCollection
    {
        #region Properties
        [XmlElement("data")]
        public List<MutualFundData> Items { get; set; }

        [XmlAttribute("rows")]
        public int Count { get { return this.Items.Count; } set { } }

        #endregion

        #region Constructor
        public MutualFundCollection()
        {
            this.Items = new List<MutualFundData>();
        }

        #endregion

        #region Public Meothds
        #region Add
        public void Add(MutualFundData item)
        {
            item.RowNo = this.Count + 1;
            this.Items.Add(item);
        }

        #endregion

        #endregion

    }

    [XmlRoot("mffund")]
    public class MutualFundData
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

        #endregion

        #region Public Methods
        #region FillObject
        public static MutualFundData FillObject(string[] data)
        {
            MutualFundData obj = new MutualFundData();
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
}
