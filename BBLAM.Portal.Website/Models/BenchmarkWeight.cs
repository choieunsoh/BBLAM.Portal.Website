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
    public class BenchmarkWeight
    {
        #region Properties
        [JsonProperty("bm_code")]
        public string BenchmarkCode { get; set; }

        [JsonProperty("index_code")]
        public string IndexCode { get; set; }

        [JsonProperty("index_name")]
        public string IndexName { get; set; }

        [JsonProperty("weight")]
        public double Weight { get; set; }

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
        public static BenchmarkWeight FillObject(IDataReader reader)
        {
            BenchmarkWeight obj = new BenchmarkWeight();
            obj.BenchmarkCode = reader.Field<string>("bm_code");
            obj.IndexCode = reader.Field<string>("index_code");
            obj.IndexName = reader.Field<string>("index_name", true);
            obj.Weight = reader.Field<double>("weight");

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
        public static BenchmarkWeight FromCSV(string csvline, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Length >= 3)
            {
                try
                {
                    int i = 0;
                    BenchmarkWeight o = new BenchmarkWeight();
                    o.BenchmarkCode = values[i++];
                    o.IndexCode = values[i++];
                    o.Weight = values[i++].ToDouble() * 100.0;
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