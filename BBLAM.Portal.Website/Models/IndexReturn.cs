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
    public class IndexReturn
    {
        #region Properties
        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("index_code")]
        public string IndexCode { get; set; }

        [JsonProperty("index_name")]
        public string IndexName { get; set; }

        [JsonProperty("index_type")]
        public string IndexType { get; set; }

        [JsonProperty("sort_order")]
        public int SortOrder { get; set; }

        [JsonProperty("closed_price")]
        public double? ClosedPrice { get; set; }

        [JsonProperty("index_return")]
        public double? Return { get; set; }

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
        public static IndexReturn FillObject(IDataReader reader)
        {
            IndexReturn obj = new IndexReturn();
            obj.Asof = reader.Field<DateTime>("asof");
            obj.IndexCode = reader.Field<string>("index_code");
            obj.IndexName = reader.Field<string>("index_name");
            obj.IndexType = reader.Field<string>("index_type");
            obj.SortOrder = reader.Field<int>("sort_order");
            obj.ClosedPrice = reader.Field<double?>("closed_price");
            obj.Return = reader.Field<double?>("index_return");

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
        public static IndexReturn FromCSV(string csvline, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Length >= 4)
            {
                try
                {
                    int i = 0;
                    IndexReturn o = new IndexReturn();
                    o.Asof = values[i++].ToDate("dd/MM/yyyy");
                    o.IndexCode = values[i++];
                    try { o.ClosedPrice = values[i++].ToDouble(); } catch { }
                    try { o.Return = values[i++].ToDouble(); } catch { }
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
    public class SimulatedIndexReturn
    {
        #region Properties
        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("index_code")]
        public string IndexCode { get; set; }

        [JsonProperty("index_name")]
        public string IndexName { get; set; }

        [JsonProperty("index_type")]
        public string IndexType { get; set; }

        [JsonProperty("closed_price")]
        public double? ClosedPrice { get; set; }

        [JsonProperty("index_return")]
        public double? Return { get; set; }

        [JsonProperty("sim_nav")]
        public double? SimulatedNAV { get; set; }

        #endregion

        #region FillObject
        public static SimulatedIndexReturn FillObject(IDataReader reader)
        {
            SimulatedIndexReturn obj = new SimulatedIndexReturn();
            obj.Asof = reader.Field<DateTime>("asof");
            obj.IndexCode = reader.Field<string>("index_code");
            obj.IndexName = reader.Field<string>("index_name");
            obj.IndexType = reader.Field<string>("index_type");
            obj.ClosedPrice = reader.Field<double?>("closed_price");
            obj.Return = reader.Field<double?>("index_return");
            obj.SimulatedNAV = reader.Field<double?>("sim_nav");

            return obj;
        }

        #endregion

    }

}