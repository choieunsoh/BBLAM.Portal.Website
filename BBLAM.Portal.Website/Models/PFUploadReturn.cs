#region Using Directives
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web;

#endregion

namespace BBLAM.Portal.Models
{
    public class PFUploadReturn
    {
        #region Properties
        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("total_nav")]
        public double TotalNav { get; set; }

        [JsonProperty("daily_return")]
        public double DailyReturn { get; set; }

        [JsonProperty("ytd_return")]
        public double YTDReturn { get; set; }

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
        public static PFUploadReturn FillObject(IDataReader reader)
        {
            PFUploadReturn obj = new PFUploadReturn();
            obj.PortfolioCode = reader.Field<string>("port_code");
            obj.Asof = reader.Field<DateTime>("asof");
            obj.TotalNav = reader.Field<double>("total_nav");
            obj.DailyReturn = reader.Field<double>("daily_return");
            obj.YTDReturn = reader.Field<double>("ytd_return");

            obj.CreatedDate = reader.Field<DateTime>("created_date");
            obj.CreatedBy = reader.Field<string>("created_by");
            obj.CreatedSource = reader.Field<string>("created_source");
            obj.UpdatedDate = reader.Field<DateTime>("updated_date");
            obj.UpdatedBy = reader.Field<string>("updated_by");
            obj.UpdatedSource = reader.Field<string>("updated_source");

            return obj;
        }

        #endregion

    }

}