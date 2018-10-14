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
    public class EquityDelta
    {
        #region Properties
        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("stock_name")]
        public string StockName { get; set; }

        [JsonProperty("master_stock")]
        public string MasterStock { get; set; }

        [JsonProperty("delta")]
        public double Delta { get; set; }

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
        public static EquityDelta FillObject(IDataReader reader)
        {
            EquityDelta obj = new EquityDelta();
            obj.Asof = reader.Field<DateTime>("asof");
            obj.StockName = reader.Field<string>("stock_name");
            obj.MasterStock = reader.Field<string>("master_stock");
            obj.Delta = reader.Field<double>("delta");

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
        public static EquityDelta FromCSV(string csvline, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Take(4).Where(x => !string.IsNullOrEmpty(x)).ToArray().Length == 4)
            {
                try
                {
                    int i = 0;
                    EquityDelta o = new EquityDelta();
                    o.Asof = values[i++].ToDate("dd/MM/yyyy");
                    o.StockName = values[i++];
                    o.MasterStock = values[i++];
                    o.Delta = values[i++].ToDouble();
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