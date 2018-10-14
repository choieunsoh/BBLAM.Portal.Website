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
    public class Stock
    {
        #region Properties

        [JsonProperty("stock_code")]
        public string StockCode { get; set; }

        [JsonProperty("sector_code")]
        public string SectorCode { get; set; }

        [JsonProperty("stock_name_en")]
        public string StockNameEn { get; set; }

        [JsonProperty("stock_name_th")]
        public string StockNameTh { get; set; }

        [JsonProperty("ipo_date")]
        public DateTime? IPODate { get; set; }

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
        public static Stock FillObject(IDataReader reader)
        {
            Stock obj = new Stock();
            obj.StockCode= reader.Field<string>("stock_code");
            obj.SectorCode = reader.Field<string>("sector_code");
            obj.StockNameEn = reader.Field<string>("stock_name_en");
            obj.StockNameTh = reader.Field<string>("stock_name_th");
            obj.IPODate = reader.Field<DateTime?>("ipo_date");

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
        public static Stock FromCSV(string csvline, string updatedBy, string updatedSource)
        {
            string[] values = csvline.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Take(5).Where(x => !string.IsNullOrEmpty(x)).ToArray().Length >= 4)
            {
                try
                {
                    int i = 0;
                    Stock o = new Stock();
                    o.StockCode = values[i++];
                    o.SectorCode = values[i++];
                    o.StockNameEn = values[i++];
                    o.StockNameTh = values[i++];
                    if (!String.IsNullOrEmpty(values[i]))
                        o.IPODate = values[i].ToDate("dd/MM/yyyy");
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