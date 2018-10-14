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
    public class PortfolioPerformanceReport
    {
        #region Properties
        [JsonProperty("start_date")]
        public DateTime StartDate { get; set; }

        [JsonProperty("end_date")]
        public DateTime EndDate { get; set; }

        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("group_order")]
        public int GroupOrder { get; set; }

        [JsonProperty("port_return")]
        public double? PortfolioReturn { get; set; }

        [JsonProperty("bm0_return")]
        public double? Benchmark0Return { get; set; }

        [JsonProperty("bm1_return")]
        public double? Benchmark1Return { get; set; }

        [JsonProperty("bm2_return")]
        public double? Benchmark2Return { get; set; }

        [JsonProperty("bm3_return")]
        public double? Benchmark3Return { get; set; }

        [JsonProperty("bm0_alpha")]
        public double? Benchmark0Alpha { get; set; }

        [JsonProperty("bm1_alpha")]
        public double? Benchmark1Alpha { get; set; }

        [JsonProperty("bm2_alpha")]
        public double? Benchmark2Alpha { get; set; }

        [JsonProperty("bm3_alpha")]
        public double? Benchmark3Alpha { get; set; }

        [JsonProperty("remark")]
        public string Remark { get; set; }

        #endregion

        #region FillObject
        public static PortfolioPerformanceReport FillObject(IDataReader reader)
        {
            PortfolioPerformanceReport obj = new PortfolioPerformanceReport();
            obj.StartDate = reader.Field<DateTime>("start_date");
            obj.EndDate = reader.Field<DateTime>("end_date");
            obj.PortfolioCode = reader.Field<string>("port_code");
            obj.FundType= reader.Field<string>("fund_type");
            obj.GroupOrder = reader.Field<int>("group_order");

            obj.PortfolioReturn = reader.Field<double?>("port_return");

            obj.Benchmark0Return = reader.Field<double?>("bm0_return");
            obj.Benchmark1Return = reader.Field<double?>("bm1_return");
            obj.Benchmark2Return = reader.Field<double?>("bm2_return");
            obj.Benchmark3Return = reader.Field<double?>("bm3_return");

            obj.Benchmark0Alpha = reader.Field<double?>("bm0_alpha");
            obj.Benchmark1Alpha = reader.Field<double?>("bm1_alpha");
            obj.Benchmark2Alpha = reader.Field<double?>("bm2_alpha");
            obj.Benchmark3Alpha = reader.Field<double?>("bm3_alpha");

            obj.Remark = reader.Field<string>("remark");

            return obj;
        }

        #endregion

    }

    public class PortfolioPerformanceDaily
    {
        #region Properties
        [JsonProperty("asof")]
        public DateTime Asof { get; set; }

        [JsonProperty("port_code")]
        public string PortfolioCode { get; set; }

        [JsonProperty("nav_per_unit")]
        public double? NavPerUnit { get; set; }

        [JsonProperty("port_return")]
        public double? PortfolioReturn { get; set; }

        [JsonProperty("bm0_return")]
        public double? Benchmark0Return { get; set; }

        [JsonProperty("bm1_return")]
        public double? Benchmark1Return { get; set; }

        [JsonProperty("bm2_return")]
        public double? Benchmark2Return { get; set; }

        [JsonProperty("bm3_return")]
        public double? Benchmark3Return { get; set; }

        [JsonProperty("bm0_alpha")]
        public double? Benchmark0Alpha { get; set; }

        [JsonProperty("bm1_alpha")]
        public double? Benchmark1Alpha { get; set; }

        [JsonProperty("bm2_alpha")]
        public double? Benchmark2Alpha { get; set; }

        [JsonProperty("bm3_alpha")]
        public double? Benchmark3Alpha { get; set; }

        [JsonProperty("port_nav")]
        public double? PortfolioNav { get; set; }

        [JsonProperty("bm0_nav")]
        public double? Benchmark0Nav { get; set; }

        [JsonProperty("bm1_nav")]
        public double? Benchmark1Nav { get; set; }

        [JsonProperty("bm2_nav")]
        public double? Benchmark2Nav { get; set; }

        [JsonProperty("bm3_nav")]
        public double? Benchmark3Nav { get; set; }

        [JsonProperty("remark")]
        public string Remark { get; set; }

        #endregion

        #region FillObject
        public static PortfolioPerformanceDaily FillObject(IDataReader reader)
        {
            PortfolioPerformanceDaily obj = new PortfolioPerformanceDaily();
            obj.Asof = reader.Field<DateTime>("asof");
            obj.PortfolioCode = reader.Field<string>("port_code");

            obj.NavPerUnit = reader.Field<double?>("nav_per_unit");
            obj.PortfolioReturn = reader.Field<double?>("port_return");

            obj.Benchmark0Return = reader.Field<double?>("bm0_return");
            obj.Benchmark1Return = reader.Field<double?>("bm1_return");
            obj.Benchmark2Return = reader.Field<double?>("bm2_return");
            obj.Benchmark3Return = reader.Field<double?>("bm3_return");

            obj.Benchmark0Alpha = reader.Field<double?>("bm0_alpha");
            obj.Benchmark1Alpha = reader.Field<double?>("bm1_alpha");
            obj.Benchmark2Alpha = reader.Field<double?>("bm2_alpha");
            obj.Benchmark3Alpha = reader.Field<double?>("bm3_alpha");

            obj.PortfolioNav = reader.Field<double?>("port_nav");
            obj.Benchmark0Nav = reader.Field<double?>("bm0_nav");
            obj.Benchmark1Nav = reader.Field<double?>("bm1_nav");
            obj.Benchmark2Nav = reader.Field<double?>("bm2_nav");
            obj.Benchmark3Nav = reader.Field<double?>("bm3_nav");

            obj.Remark = reader.Field<string>("remark");

            return obj;
        }

        #endregion

    }

}