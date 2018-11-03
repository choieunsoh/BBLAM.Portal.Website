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
    public class PVDUploadReturn
    {
        #region Properties
        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("asof_thai")]
        public string AsofThai { get; set; }

        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("total_nav")]
        public double? TotalNav { get; set; }

        [JsonProperty("nav_per_unit")]
        public double? NavPerUnit { get; set; }

        [JsonProperty("mtd_return")]
        public double? MTDReturn { get; set; }

        [JsonProperty("ytd_return")]
        public double? YTDReturn { get; set; }

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
        public static PVDUploadReturn FillObject(IDataReader reader)
        {
            PVDUploadReturn obj = new PVDUploadReturn();
            obj.PortfolioCode = reader.Field<string>("port_code");
            obj.Asof = reader.Field<DateTime>("asof");
            obj.AsofThai = obj.Asof.ToString("dd/MM/yyyy", CultureInfo.GetCultureInfo("th-TH"));
            obj.TotalNav = reader.Field<double?>("total_nav");
            obj.NavPerUnit = reader.Field<double?>("nav_per_unit");
            obj.MTDReturn = reader.Field<double?>("mtd_return");
            obj.YTDReturn = reader.Field<double?>("ytd_return");

            obj.CreatedDate = reader.Field<DateTime>("created_date");
            obj.CreatedBy = reader.Field<string>("created_by");
            obj.CreatedSource = reader.Field<string>("created_source");
            obj.UpdatedDate = reader.Field<DateTime>("updated_date");
            obj.UpdatedBy = reader.Field<string>("updated_by");
            obj.UpdatedSource = reader.Field<string>("updated_source");

            return obj;
        }

        #endregion

        #region FromString
        public static PVDUploadReturn FromString(string line, string updatedBy, string updatedSource)
        {
            string[] values = line.Split(',').Select(x => x.Trim().Trim('"')).ToArray();
            if (values.Length >= 4)
            {
                try
                {
                    int i = 0;
                    PVDUploadReturn o = new PVDUploadReturn();
                    o.PortfolioCode = values[i++];
                    o.AsofThai = values[i++];
                    o.Asof = DateTime.ParseExact(o.AsofThai, "dd/MM/yyyy", CultureInfo.GetCultureInfo("th-TH"));
                    o.TotalNav = values[i++].ToDouble();
                    o.NavPerUnit = values[i++].ToDouble();
                    o.CreatedBy = updatedBy;
                    o.CreatedSource = updatedSource;
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