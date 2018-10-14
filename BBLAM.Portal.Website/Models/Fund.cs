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
    public class Fund
    {
        #region Properties
        [JsonProperty("fund_code")]
        public string FundCode { get; set; }

        [JsonProperty("fund_name")]
        public string FundName { get; set; }

        [JsonProperty("fund_type")]
        public string FundType { get; set; }

        [JsonProperty("group_order")]
        public int GroupOrder { get; set; }

        #endregion

        #region FillObject
        public static Fund FillObject(IDataReader reader)
        {
            Fund obj = new Fund();
            obj.FundCode = reader.Field<string>("fund_code");
            obj.FundName = reader.Field<string>("fund_name");
            obj.FundType= reader.Field<string>("fund_type");
            obj.GroupOrder = reader.Field<int>("group_order");

            return obj;        }

        #endregion

    }

}