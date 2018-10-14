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
    public class CounterpartyLimitReport
    {
        #region Properties

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("asof_type")]
        public string AsofType { get; set; }

        [JsonProperty("trans_group")]
        public string TransGroup { get; set; }

        [JsonProperty("period")]
        public string Period { get; set; }

        [JsonProperty("tier_level")]
        public int? TierLevel { get; set; }

        [JsonProperty("line_amount")]
        public double? LineAmount { get; set; }

        [JsonProperty("counterparty_type")]
        public string CounterpartyType { get; set; }

        [JsonProperty("sort_order")]
        public int SortOrder { get; set; }

        [JsonProperty("counter_party")]
        public string CounterParty { get; set; }

        [JsonProperty("buy_amount")]
        public double? BuyAmount { get; set; }
        
        [JsonProperty("sell_amount")]
        public double? SellAmount { get; set; }

        [JsonProperty("total_amount")]
        public double? TotalAmount { get; set; }

        [JsonProperty("net_amount")]
        public double? NetAmount { get; set; }

        [JsonProperty("trans_count")]
        public int TransCount { get; set; }

        [JsonProperty("total_breach_limit")]
        public bool TotalBreachLimit { get; set; }

        [JsonProperty("net_breach_limit")]
        public bool NetBreachLimit { get; set; }

        [JsonProperty("report_title")]
        public string ReportTitle
        {
            get
            {
                if (string.IsNullOrEmpty(this.Period))
                {
                    return string.Format("{0}Q/{1} Tier N/A : 0 (MB)", this.Asof.GetQuarter(), this.Asof.Year);
                }
                else
                {
                    return string.Format("{0}Q/{1} Tier {2} : {3:N0} (MB)", this.Asof.GetQuarter(), this.Asof.Year, this.TierLevel, this.LineAmount);
                }
            }
        }

        #endregion

        #region FillObject
        public static CounterpartyLimitReport FillObject(IDataReader reader)
        {
            CounterpartyLimitReport obj = new CounterpartyLimitReport();
            obj.Asof = reader.Field<DateTime>("asof");
            obj.AsofType = reader.Field<string>("asof_type");

            obj.TransGroup = reader.Field<string>("trans_group");
            obj.Period = reader.Field<string>("period_code");
            obj.TierLevel= reader.Field<int?>("tier_level");
            obj.LineAmount = reader.Field<double?>("line_amount");

            obj.CounterpartyType = reader.Field<string>("counterparty_type");
            obj.SortOrder = reader.Field<int>("sort_order");
            obj.CounterParty = reader.Field<string>("counter_party");

            obj.BuyAmount = reader.Field<double?>("buy_amount");
            obj.SellAmount = reader.Field<double?>("sell_amount");
            obj.TotalAmount = reader.Field<double?>("total_amount");
            obj.NetAmount = reader.Field<double?>("net_amount");
            obj.TransCount = reader.Field<int>("trans_count");

            obj.TotalBreachLimit = reader.Field<bool>("total_breach_limit");
            obj.NetBreachLimit = reader.Field<bool>("net_breach_limit");

            return obj;
        }

        #endregion

    }

    public class CounterpartyLimitDetail
    {
        #region Properties

        [JsonProperty("trade_date")]
        public DateTime TradeDate { get; set; }

        [JsonProperty("settlement_date")]
        public DateTime SettlementDate { get; set; }

        [JsonProperty("fund_code")]
        public string FundCode { get; set; }

        [JsonProperty("trade_type")]
        public string TradeType { get; set; }

        [JsonProperty("counter_party")]
        public string CounterParty { get; set; }

        [JsonProperty("trans_group")]
        public string TransGroup { get; set; }

        [JsonProperty("trans_type")]
        public string TransType { get; set; }

        [JsonProperty("symbol")]
        public string Symbol { get; set; }

        [JsonProperty("short_name")]
        public string ShortName { get; set; }

        [JsonProperty("unit")]
        public double Unit { get; set; }

        [JsonProperty("total_amount")]
        public double TotalAmount { get; set; }

        #endregion

        #region FillObject
        public static CounterpartyLimitDetail FillObject(IDataReader reader)
        {
            CounterpartyLimitDetail obj = new CounterpartyLimitDetail();
            obj.TradeDate = reader.Field<DateTime>("trade_date");
            obj.SettlementDate = reader.Field<DateTime>("settlement_date");

            obj.FundCode = reader.Field<string>("fund_code");
            obj.TradeType = reader.Field<string>("trade_type");
            obj.CounterParty = reader.Field<string>("counter_party");
            obj.TransGroup = reader.Field<string>("trans_group");
            obj.TransType = reader.Field<string>("trans_type");
            obj.Symbol = reader.Field<string>("symbol");
            obj.ShortName = reader.Field<string>("short_name");

            obj.Unit = reader.Field<double>("unit");
            obj.TotalAmount = reader.Field<double>("total_amount");

            return obj;
        }

        #endregion

    }

}