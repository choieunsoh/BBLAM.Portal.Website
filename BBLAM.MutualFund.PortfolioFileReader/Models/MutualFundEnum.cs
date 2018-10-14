#region Uising Directives
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

#endregion

namespace BBLAM.MutualFund.PortfolioFileReader.Models
{
    public static class MF_LINE
    {
        public const int VALUATION_LINE = 1;
        public const int COLUMN_LINE = 2;
        public const int DATA_LINE = 3;
    }
    // C,Pfolio,Security,Short Name,Sec Type,Face/unit holding, 
    // Coupon,Last Trade Date,Maturity Date,Total Cost, 
    // Amortised Cost,Accrued Interest,Int.Ent.(EX),Clean Value,Total Value,
    // %Asset,TTM,Redemp-Y,Market-Y,Issuer,
    // Sec0,Sec1,Sec2,Sec3,Ind,
    // Cat,Shares Issued,MacDuration,ModDuration,StkEx, 
    // Exch Ntv to Base,Total Cost(Native,)  Cur,Issue Date, FI
    public static class MF_COLUMN
    {
        public const int ROW_TYPE = 0;
        public const int FUND_CODE = 1;
        public const int SECURITY = 2;
        public const int SHORT_NAME = 3;
        public const int SEC_TYPE = 4;

        public const int UNIT_HOLDING = 5;
        public const int COUPON = 6;
        public const int LAST_TRADE_DATE = 7;
        public const int MATURITY_DATE = 8;
        public const int TOTAL_COST = 9;

        public const int AMORTISED_COST = 10;
        public const int ACCRUED_INTEREST = 11;
        public const int INT_ENT_EX = 12;
        public const int CLEAN_VALUE = 13;
        public const int TOTAL_VALUE = 14;

        public const int WEIGHT = 15;
        public const int TTM = 16;
        public const int REDEMP_Y = 17;
        public const int MARKET_Y = 18;
        public const int ISSUER = 19;

        public const int SEC0 = 20;
        public const int SEC1 = 21;
        public const int SEC2 = 22;
        public const int SEC3 = 23;
        public const int IND = 24;

        public const int CAT = 25;
        public const int SHARES_ISSUED = 26;
        public const int MAC_DURATION = 27;
        public const int MOD_DURATION = 28;
        public const int STK_EX = 29;

        public const int EXCHANGE_NATIVE_TO_BASE = 30;
        public const int TOTAL_COST_NATIVE = 31;
        public const int CURRENCY = 32;
        public const int ISSUE_DATE = 33;
        public const int FI = 34;
    }
    public static class MF_ROWTYPE
    {
        public const string REMARK = "R";
        public const string COLUMN = "C";
        public const string DATA = "D";
        public const string TOTAL = "T";
    }
}
