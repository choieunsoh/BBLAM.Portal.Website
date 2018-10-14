using Oracle.DataAccess.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestOracle
{
    class Program
    {
        static void Main(string[] args)
        {
        }
        static void Run()
        {
            try
            {
                Console.WriteLine("Start: {0:dd-MMM-yyyy HH:mm:ss}", DateTime.Now);
                string usp = "SELECT PORT";
                var result = System.Data.DataUtil.ExecuteNonQuery("BBLAM", usp);
                Console.WriteLine("Completed");
                Console.WriteLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR");
                Console.WriteLine(ex.Message);
                Console.WriteLine();
            }

        }

    }
}
