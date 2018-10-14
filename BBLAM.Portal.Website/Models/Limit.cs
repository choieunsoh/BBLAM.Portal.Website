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
    public class EquityLimit
    {
        #region Properties
        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("fund_code")]
        public string FundCode { get; set; }

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("min_limit")]
        public double? MinLimit { get; set; }

        [JsonProperty("max_limit")]
        public double? MaxLimit { get; set; }

        [JsonProperty("var_limit")]
        public double? VaRLimit { get; set; }

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
        public static EquityLimit FillObject(IDataReader reader)
        {
            EquityLimit obj = new EquityLimit();
            obj.FundCode = reader.Field<string>("fund_code");
            obj.Asof = reader.Field<DateTime>("asof");
            obj.MinLimit= reader.Field<double?>("eq_limit_min");
            obj.MaxLimit = reader.Field<double?>("eq_limit_max");
            obj.VaRLimit = reader.Field<double?>("eq_var_limit");

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
        public static EquityLimit FromCSV(string csvline, string fundType, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Length >= 5)
            {
                try
                {
                    EquityLimit o = new EquityLimit();
                    o.FundCode = values[0];
                    o.FundType = fundType;
                    o.Asof = values[1].ToDate("dd/MM/yyyy");
                    o.MinLimit = values[2].ToDouble();
                    o.MaxLimit = values[3].ToDouble();
                    double var;
                    if (double.TryParse(values[4], out var))
                    {
                        o.VaRLimit = values[4].ToDouble();
                    }
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

    public class LiquidityLimit
    {
        #region Properties
        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("fund_code")]
        public string FundCode { get; set; }

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("soft_limit")]
        public double? SoftLimit { get; set; }

        [JsonProperty("hard_limit")]
        public double? HardLimit { get; set; }

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
        public static LiquidityLimit FillObject(IDataReader reader)
        {
            LiquidityLimit obj = new LiquidityLimit();
            obj.FundCode = reader.Field<string>("fund_code");
            obj.Asof = reader.Field<DateTime>("asof");
            obj.SoftLimit = reader.Field<double?>("soft_limit");
            obj.HardLimit = reader.Field<double?>("hard_limit");

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
        public static LiquidityLimit FromCSV(string csvline, string fundType, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Take(4).Where(x => !string.IsNullOrEmpty(x)).ToArray().Length == 4)
            {
                try
                {
                    LiquidityLimit o = new LiquidityLimit();
                    o.FundCode = values[0];
                    o.FundType = fundType;
                    o.Asof = values[1].ToDate("dd/MM/yyyy");
                    o.SoftLimit = values[2].ToDouble();
                    o.HardLimit = values[3].ToDouble();
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