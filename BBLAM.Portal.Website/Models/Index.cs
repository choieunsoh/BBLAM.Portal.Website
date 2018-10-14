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
    public class Index
    {
        #region Properties
        [JsonProperty("index_code")]
        public string IndexCode { get; set; }

        [JsonProperty("index_name")]
        public string IndexName { get; set; }

        [JsonProperty("index_name_html")]
        public string IndexNameHtml
        {
            get
            {
                return this.IndexName.Replace("<=", "&le;").Replace("<", "&lt;").Replace(">=", "&ge;").Replace(">", "&gt;");
            }
        }

        [JsonProperty("sort_order")]
        public int SortOrder { get; set; }

        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("index_type")]
        public string IndexType { get; set; }

        [JsonProperty("index_sub_type")]
        public string IndexSubType { get; set; }

        [JsonProperty("origin")]
        public string Origin { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("data_source")]
        public string DataSource { get; set; }

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
        public static Index FillObject(IDataReader reader)
        {
            Index obj = new Index();
            obj.IndexCode = reader.Field<string>("index_code");
            obj.IndexName = reader.Field<string>("index_name");
            obj.SortOrder = reader.Field<int>("sort_order");
            obj.FundType = reader.Field<string>("fund_type");
            obj.IndexType = reader.Field<string>("index_type");
            obj.IndexSubType = reader.Field<string>("index_sub_type");
            obj.Origin = reader.Field<string>("origin");
            obj.Currency = reader.Field<string>("currency");
            obj.DataSource = reader.Field<string>("data_source");
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
        public static Index FromCSV(string csvline, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Length >= 10)
            {
                try
                {
                    int i = 0;
                    Index o = new Index();
                    o.IndexCode = values[i++];
                    o.IndexName = values[i++];
                    o.SortOrder = values[i++].ToInt32();
                    o.FundType = values[i++];
                    o.IndexType = values[i++];
                    o.IndexSubType = values[i++];
                    o.Origin = values[i++];
                    o.Currency = values[i++];
                    o.DataSource = values[i++];
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