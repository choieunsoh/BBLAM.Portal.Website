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
    public class CounterpartyTier
    {
        #region Properties

        [JsonProperty("period_code")]
        public string PeriodCode { get; set; }

        [JsonProperty("counter_party")]
        public string CounterParty { get; set; }

        [JsonProperty("counterparty_type")]
        public string CounterpartyType { get; set; }

        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("transaction_type")]
        public string TransactionType { get; set; }

        [JsonProperty("tier_level")]
        public int TierLevel { get; set; }

        [JsonProperty("created_date")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("created_by")]
        public string CreatedBy { get; set; }

        [JsonProperty("created_source")]
        public string CreatedSource { get; set; }

        [JsonProperty("updated_date")]
        public DateTime UpdatedDate { get; set; }

        [JsonProperty("updated_by")]
        public string UpdatedBy { get; set; }

        [JsonProperty("updated_source")]
        public string UpdatedSource { get; set; }

        #endregion

        #region FillObject
        public static CounterpartyTier FillObject(IDataReader reader)
        {
            CounterpartyTier obj = new CounterpartyTier();
            obj.PeriodCode = reader.Field<string>("period_code");
            obj.CounterParty = reader.Field<string>("counter_party");
            obj.CounterpartyType = reader.Field<string>("counterparty_type");
            obj.FundType = reader.Field<string>("fund_type");
            obj.TransactionType = reader.Field<string>("transaction_type");
            obj.TierLevel = reader.Field<int>("tier_level");

            obj.CreatedDate = reader.Field<DateTime>("created_date");
            obj.CreatedBy = reader.Field<string>("created_by");
            obj.CreatedSource = reader.Field<string>("created_source");
            obj.UpdatedDate = reader.Field<DateTime>("updated_date");
            obj.UpdatedBy = reader.Field<string>("updated_by");
            obj.UpdatedSource = reader.Field<string>("updated_source");

            return obj;
        }

        #endregion

        #region FromCSV
        public static CounterpartyTier FromCSV(string csvline, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Take(6).Where(x => !string.IsNullOrEmpty(x)).ToArray().Length == 6)
            {
                try
                {
                    int i = 0;
                    CounterpartyTier o = new CounterpartyTier();
                    o.CounterParty = values[i++];
                    o.PeriodCode = values[i++].Substring(0, 6);
                    o.TierLevel = values[i++].ToInt32();
                    o.TransactionType = values[i++][0].ToString();
                    o.CounterpartyType = values[i++][0].ToString();
                    o.FundType = values[i++][0].ToString();
                    o.UpdatedBy = updatedBy;
                    o.UpdatedSource = updatedSource;
                    return o;
                }
                catch { }
            }
            return null;
        }

        #endregion

    }

    public class CounterpartyLine
    {
        #region Properties
        [JsonProperty("period_code")]
        public string PeriodCode { get; set; }

        [JsonProperty("transaction_type")]
        public string TransactionType { get; set; }

        [JsonProperty("counterparty_type")]
        public string CounterpartyType { get; set; }

        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("tier_level")]
        public int TierLevel { get; set; }

        [JsonProperty("line_amount")]
        public double LineAmount { get; set; }

        [JsonProperty("created_date")]
        public DateTime CreatedDate { get; set; }

        [JsonProperty("created_by")]
        public string CreatedBy { get; set; }

        [JsonProperty("created_source")]
        public string CreatedSource { get; set; }

        [JsonProperty("updated_date")]
        public DateTime UpdatedDate { get; set; }

        [JsonProperty("updated_by")]
        public string UpdatedBy { get; set; }

        [JsonProperty("updated_source")]
        public string UpdatedSource { get; set; }

        #endregion

        #region FillObject
        public static CounterpartyLine FillObject(IDataReader reader)
        {
            CounterpartyLine obj = new CounterpartyLine();
            obj.PeriodCode = reader.Field<string>("period_code");
            obj.TransactionType = reader.Field<string>("transaction_type");
            obj.CounterpartyType = reader.Field<string>("counterparty_type");
            obj.FundType = reader.Field<string>("fund_type");
            obj.TierLevel = reader.Field<int>("tier_level");
            obj.LineAmount = reader.Field<double>("line_amount");

            obj.CreatedDate = reader.Field<DateTime>("created_date");
            obj.CreatedBy = reader.Field<string>("created_by");
            obj.CreatedSource = reader.Field<string>("created_source");
            obj.UpdatedDate = reader.Field<DateTime>("updated_date");
            obj.UpdatedBy = reader.Field<string>("updated_by");
            obj.UpdatedSource = reader.Field<string>("updated_source");

            return obj;
        }

        #endregion

        #region FromCSV
        public static CounterpartyLine FromCSV(string csvline, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Take(6).Where(x => !string.IsNullOrEmpty(x)).ToArray().Length == 6)
            {
                try
                {
                    int i = 0;
                    CounterpartyLine o = new CounterpartyLine();
                    o.PeriodCode = values[i++].Substring(0, 6);
                    o.TierLevel = values[i++].ToInt32();
                    o.LineAmount = values[i++].ToDouble();
                    o.TransactionType = values[i++][0].ToString();
                    o.CounterpartyType = values[i++][0].ToString();
                    o.FundType = values[i++][0].ToString();
                    o.UpdatedBy = updatedBy;
                    o.UpdatedSource = updatedSource;
                    return o;
                }
                catch { }
            }
            return null;
        }

        #endregion

    }

}