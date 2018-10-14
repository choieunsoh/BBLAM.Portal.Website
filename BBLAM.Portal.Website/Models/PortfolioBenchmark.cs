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
    public class PortfolioBenchmark
    {
        #region Properties
        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("policy_code")]
        public string PolicyCode { get; set; }

        [JsonProperty("bm_order")]
        public int BenchmarkOrder { get; set; }

        [JsonProperty("bm_code")]
        public string BenchmarkCode { get; set; }

        [JsonProperty("start_date")]
        public DateTime StartDate { get; set; }

        [JsonProperty("remark")]
        public string Remark { get; set; }

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
        public static PortfolioBenchmark FillObject(IDataReader reader)
        {
            PortfolioBenchmark obj = new PortfolioBenchmark();
            obj.PortfolioCode = reader.Field<string>("port_code");
            obj.FundType= reader.Field<string>("fund_type");
            obj.PolicyCode = reader.Field<string>("policy_code");
            obj.BenchmarkOrder = reader.Field<int>("bm_order");
            obj.BenchmarkCode = reader.Field<string>("bm_code");
            obj.StartDate = reader.Field<DateTime>("start_date");
            obj.Remark = reader.Field<string>("remark");

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
        public static PortfolioBenchmark FromCSV(string csvline, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Length >= 7)
            {
                try
                {
                    int i = 0;
                    PortfolioBenchmark o = new PortfolioBenchmark();
                    o.PortfolioCode = values[i++];
                    o.FundType = values[i++];
                    o.PolicyCode = values[i++];
                    o.BenchmarkOrder = values[i++].ToInt32();
                    o.BenchmarkCode = values[i++];
                    o.StartDate = values[i++].ToDate("dd/MM/yyyy");
                    o.Remark = values[i++];
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