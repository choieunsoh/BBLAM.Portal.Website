#region Using Directives
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BBLAM.MutualFund.PortfolioFileReader.Models;
using System.Diagnostics;
using Oracle.DataAccess.Client;
#endregion

namespace BBLAM.MutualFund.PortfolioFileReader
{
    class Program
    {
        #region Private Members
        static CultureInfo temp = null;
        static CultureInfo enus = new CultureInfo("en-US");
        static string CONN = "BBLAM";

        #endregion

        static void Main(string[] args)
        {
            temp = System.Threading.Thread.CurrentThread.CurrentCulture;
            System.Threading.Thread.CurrentThread.CurrentCulture = enus;

            Console.WriteLine("Starting ...\n");

            DateTime? asof = null;
            bool runMF0 = true;
            bool runMF1 = true;
            bool runMF2 = true;
            bool runPVD = true;
            bool saveMF = true;
            bool savePVD = true;

            if (args.Length == 1)
            {
                runMF0 = runMF1 = runMF2 = runPVD = true;
                try
                {
                    asof = DateTime.ParseExact(args[0], "yyyy-MM-dd", enus);
                }
                catch { }
            }
            if (args.Length == 2)
            {
                try
                {
                    asof = DateTime.ParseExact(args[0], "yyyy-MM-dd", enus);
                }
                catch { }

                runMF0 = runMF1 = runMF2 = runPVD = false;
                switch (args[1].ToUpper())
                {
                    case "MF0":
                        runMF0 = true;
                        break;
                    case "MF1":
                        runMF1 = true;
                        break;
                    case "MF2":
                        runMF2 = true;
                        break;
                    case "PVD":
                        runPVD = true;
                        break;
                    case "RPTMF":
                        saveMF = true;
                        break;
                    case "RPTPVD":
                        savePVD = true;
                        break;
                }
            }

            // MF
            if (runMF0)
                asof = RunMF(MyExtension.Config("HIPORT_DELAY0_FILE"), asof);
            if (runMF1)
                asof = RunMF(MyExtension.Config("HIPORT_DELAY1_FILE"), asof);
            if (runMF2)
                asof = RunMF(MyExtension.Config("HIPORT_DELAY2_FILE"), asof);

            // PVD+PF
            if (runPVD)
                asof = RunPVD(MyExtension.Config("PVD_FILE"), null);

            Delay();
            if (runPVD)
                SavePVD2DB(asof.Value);

            Delay();
            if (runMF0 || runMF1 || runMF2)
                SaveMF2DB(asof.Value);

            System.Threading.Thread.CurrentThread.CurrentCulture = temp;
            Console.WriteLine("Completed.");
#if DEBUG
            Console.ReadLine();
#endif
        }

#region Static Methods
#region Mutual Fund Reading
        static DateTime? RunMF(string filename, DateTime? asof)
        {
            string root = MyExtension.Config("HIPORT_ROOT");
            string filepath = Path.Combine(root, filename);
            if (File.Exists(filepath))
            {
                string[] lines = File.ReadAllLines(filepath);
                Console.WriteLine(filename);
                Console.WriteLine("Reading completed: {0:N0} lines", lines.Length);
                if (lines.Length > 0)
                {
                    DateTime? valuationDate = GetValuationDate(lines);
                    if (valuationDate.HasValue)
                    {
                        Console.WriteLine("VALUATION DATE: {0:yyyy-MM-dd}\n", valuationDate);
                        if (!asof.HasValue)
                             asof = valuationDate;

                        lines = lines.Where(x => x.StartsWith("D"))
                            .Select(x => String.Join(",", x.Trim().Split(',').Select(y => y.Trim())))
                            .ToArray();

                        int no = 1;
                        List<string> csv = new List<string>();
                        foreach (string line in lines)
                        {
                            csv.Add(string.Format("{0:dd/MM/yyyy},{1:dd/MM/yyyy},{2},{3}", asof, valuationDate, no++, line));
                        }
                        string[] outputfiles = SaveOutputFiles(root, filename, asof.Value, valuationDate.Value, csv);

                        RunSqlLoader(Path.GetFileNameWithoutExtension(filename));
                    }
                }
            }

            return asof;
        }

#endregion

#region PVD + Private Fund Reading
        static DateTime? RunPVD(string filename, DateTime? asof)
        {
            string root = MyExtension.Config("PVD_ROOT");
            string filepath = Path.Combine(root, filename);
            if (File.Exists(filepath))
            {
                string[] lines = File.ReadAllLines(filepath);
                Console.WriteLine(filename);
                Console.WriteLine("Reading completed: {0:N0} lines", lines.Length);
                if (lines.Length > 0)
                {
                    DateTime? valuationDate = lines[0].Split(',').Select(x => x.Trim()).Last().ToDate("dd/MM/yy");
                    Console.WriteLine("VALUATION DATE: {0:yyyy-MM-dd}\n", valuationDate);
                    if (!asof.HasValue)
                        asof = valuationDate;

                    lines = lines.Where(x => x.StartsWith("D"))
                       .Select(x => String.Join(",", x.Trim().Split(',').Select(y => y.Trim().TrimStart('0'))))
                       .ToArray();

                    int no = 1;
                    List<string> csv = new List<string>();
                    foreach (string line in lines)
                    {
                        csv.Add(string.Format("{0:dd/MM/yyyy},{1:dd/MM/yyyy},{2},{3}", asof, valuationDate, no++, line));
                    }
                    string[] outputfiles = SaveOutputFiles(root, filename, asof.Value, valuationDate.Value, csv);

                    RunSqlLoader(Path.GetFileNameWithoutExtension(filename));
                }
            }
            return asof;
        }

#endregion

#endregion

#region Private Methods
#region SaveOutputFiles
        static string[] SaveOutputFiles(string root, string filename, DateTime asof, DateTime valuationDate, List<string> csv)
        {
            if (csv.Count > 0)
            {
                string filepath = Path.Combine(root, filename);
                string ext = Path.GetExtension(filepath);
                string asof_folder = string.Format(@"{0:yyyy}\{0:MM}\{0:yyyyMMdd}", asof);
                string asof_filepath = Path.Combine(root, asof_folder);
                if (!Directory.Exists(asof_filepath))
                    Directory.CreateDirectory(asof_filepath);
                asof_filepath = Path.Combine(asof_filepath, filename);
                string mo = string.Format("_{0:yyyyMMdd}{1}", valuationDate, ext);
                string outputpath = asof_filepath.Replace(ext, mo);
                string outputpath_forimport = filepath.Replace(ext, "_IMPORT" + ext);

                File.WriteAllLines(outputpath, csv);
                File.WriteAllLines(outputpath_forimport, csv);

                return new string[] { outputpath, outputpath_forimport };
            }
            return new string[0];
        }

#endregion

#region GetValuationDate
        static DateTime? GetValuationDate(string[] lines)
        {
            string[] token = lines[MF_LINE.VALUATION_LINE].Split(',').Select(x => x.Trim()).ToArray();
            if (token.Length >= 2)
            {
                string[] token2 = token[1].Split(':').Select(x => x.Trim()).ToArray();
                return DateTime.ParseExact(token2[1], "dd/MM/yyyy", enus);
            }
            return null;
        }

#endregion

#region GetAssetClass
        static string GetAssetClass(string secType)
        {
            switch (secType)
            {
                case "EQUITIES":
                case "FOREIGN EQUITY":
                case "PREFERRED STOCK":
                case "WARRANTS":
                case "STOCK&WARRANT&R":
                    return "Equity";
                case "TREASURY BILL":
                case "REPURCHASE AGREEMEN":
                case "BOND":
                case "CASH&BANK ACCOU":
                case "CD (BANK ISSUE)":
                case "DEBT (BANK ISSU":
                case "DEBT (COMPANY I":
                case "DEBT(FIN-FONC I":
                case "PN&BE(FIN-FONC":
                case "STATE ENT(NON-M":
                case "BILL OF EXCHANGE":
                case "BOT BONDS":
                case "CD & NCD":
                case "DEBENTURES":
                case "FIXED DEPOSIT":
                case "GOVERMENT BONDS":
                case "PROMISSORY NOTE":
                    return "Fixed Income";
                case "UNIT TRUST & WA":
                case "UNIT TRUST-FI":
                case "UNIT TRUSTS":
                    return "Unit Trust";
                default:
                    return "";
            }
        }

#endregion

#region SaveMF2DB
        static void SaveMF2DB(DateTime asof)
        {
            bool generate = MyExtension.Config<bool>("GEN_MF_REPORT", false);
            if (generate)
            {
                try
                {
                    Console.WriteLine("Generate MF report: {0:dd-MMM-yyyy}", asof);
                    string usp = "MF.GenerateReport";
                    OracleParameter[] p = new OracleParameter[] {
                        new OracleParameter("P_REPORT_DATE", asof),
                    };
                    var result = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);
                    Console.WriteLine("Completed");
                    Console.WriteLine();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("ERROR");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine(ex.StackTrace);
                    Console.WriteLine();
                }
            }
        }

#endregion

#region SavePVD2DB
        static void SavePVD2DB(DateTime asof)
        {
            bool generate = MyExtension.Config<bool>("GEN_PVD_REPORT", false);
            if (generate)
            {
                try
                {
                    Console.WriteLine("Generate PVD report: {0:dd-MMM-yyyy}", asof);
                    string usp = "PVD.GenerateReport";
                    OracleParameter[] p = new OracleParameter[] {
                        new OracleParameter("P_REPORT_DATE", asof),
                    };
                    var result = System.Data.DataUtil.ExecuteNonQuery(CONN, usp, p);
                    Console.WriteLine("Completed");
                    Console.WriteLine();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("ERROR");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine(ex.StackTrace);
                    Console.WriteLine();
                }
            }
        }

#endregion

#region RunSqlLoader
        static void RunSqlLoader(string name)
        {
            bool enabled = MyExtension.Config<bool>("SQLLOADER", false);
            if (enabled)
            {
                string account = MyExtension.Config("CTL_ACCOUNT");
                string root = MyExtension.Config("CTL_ROOT");
                Console.WriteLine("SQL Loader is starting..");
                string sqlldr = MyExtension.Config("SQLLOADER_EXE", "sqlldr");
                string args = string.Format(@"userid={0} control=""{1}\{2}.CTL"" log=""{1}\{2}_LOG.txt""", account, root, name);
                string command = string.Format(@"/C {0} {1}", sqlldr, args);
                // Use ProcessStartInfo class
                ProcessStartInfo startInfo = new ProcessStartInfo("cmd.exe", command);
                startInfo.CreateNoWindow = false;
                startInfo.UseShellExecute = false;
                //startInfo.FileName = sqlldr;
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;
                //startInfo.Arguments = args;
                startInfo.RedirectStandardOutput = true;
                startInfo.RedirectStandardError = true;

                try
                {
                    // Start the process with the info we specified.
                    // Call WaitForExit and then the using statement will close.
                    using (Process exeProcess = Process.Start(startInfo))
                    {
                        exeProcess.WaitForExit();
                        string log2 = string.Format(@"{1}\{2}_LOG2.txt", root, name);
                        if (exeProcess.ExitCode == 0)
                        {
                            string msg = exeProcess.StandardOutput.ReadToEnd();
                            File.WriteAllText(log2, msg);
                            Console.WriteLine("Completed");
                            Console.WriteLine();
                        }
                        else
                        {
                            string msg = exeProcess.StandardError.ReadToEnd();
                            File.WriteAllText(log2, msg);
                            //throw new Exception(error);
                        }
                    }

                    Delay();
                }
                catch (Exception ex)
                {
                    string log3 = string.Format(@"{1}\{2}_LOG2.txt", root, name);
                    File.WriteAllText(log3, ex.StackTrace);
                    Console.WriteLine("ERROR");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine();
                }
            }
        }

        #endregion

        #region Delay
        static void Delay()
        {
            int delay = MyExtension.Config<int>("SQLLOADER_DELAY", 10000);
        }
        static void Delay(int ms)
        {
            System.Threading.Thread.Sleep(ms);
        }

        #endregion

        #endregion

    }
}
