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
    public class NAV
    {
        #region Properties
        public double Total { get; set; }
        public double Equity { get; set; }
        public double FixedIncome { get; set; }
        public double UnitTrust { get; set; }
        public double Other { get; set; }
        public double EquityPercent { get { return this.Equity / this.Total; } }
        public double FixedIncomePercent { get { return this.FixedIncome / this.Total; } }
        public double UnitTrustPercent { get { return this.UnitTrust / this.Total; } }
        public double OtherPercent { get { return this.Other / this.Total; } }

        #endregion

        #region Public Methods
        #region Add
        public void Add(string asset, double value)
        {
            this.Total += value;
            switch (asset)
            {
                case "Equity":
                    this.Equity += value;
                    break;
                case "Fixed Income":
                    this.Equity += value;
                    break;
                case "Unit Trust":
                    this.Equity += value;
                    break;
                default:
                    this.Other += value;
                    break;
            }
        }

        #endregion

        #endregion

    }
}
