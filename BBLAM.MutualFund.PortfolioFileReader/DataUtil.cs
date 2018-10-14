#region Using Directives
using System;
using System.Linq;
using System.Configuration;
using System.Collections.Generic;
using Oracle.DataAccess.Client;

#endregion

namespace System.Data
{
    public class DataUtil
    {
        #region Properties
        public static string ConnectionString
        {
            get { return ConfigurationManager.ConnectionStrings[ConfigurationManager.AppSettings["CONNECTION_NAME"]].ConnectionString; }
        }
        public static int CommandTimeout
        {
            get
            {
                try { return Convert.ToInt32(ConfigurationManager.AppSettings["COMMAND_TIMEOUT"]); }
                catch { return 600; }
            }
        }

        #endregion

        #region Protected Methods
        #region ExecuteObject
        public static T ExecuteObject<T>(string usp, Func<OracleDataReader, T> fillMethod, params OracleParameter[] parameters)
        {
            return ExecuteObject(null, usp, fillMethod, parameters);
        }
        public static T ExecuteObject<T>(string connName, string usp, Func<OracleDataReader, T> fillMethod, params OracleParameter[] parameters)
        {
            string connString = DataUtil.GetConnectionString(connName);
            using (var conn = new OracleConnection(connString))
            {
                return conn.ExecuteObject<T>(usp, fillMethod, parameters);
            }
        }

        #endregion

        #region ExecuteList
        public static List<T> ExecuteList<T>(string usp, Func<OracleDataReader, T> fillMethod, params OracleParameter[] parameters)
        {
            return ExecuteList(null, usp, fillMethod, parameters);
        }
        public static List<T> ExecuteList<T>(string connName, string usp, Func<OracleDataReader, T> fillMethod, params OracleParameter[] parameters)
        {
            string connString = DataUtil.GetConnectionString(connName);
            using (var conn = new OracleConnection(connString))
            {
                return conn.ExecuteList<T>(usp, fillMethod, parameters);
            }
        }

        #endregion

        #region ExecuteNonQuery
        public static int ExecuteNonQuery(string usp, params OracleParameter[] parameters)
        {
            return ExecuteNonQuery(null, usp, parameters);
        }
        public static int ExecuteNonQuery(string connName, string usp, params OracleParameter[] parameters)
        {
            return ExecuteNonQuery(null, usp, -1, parameters);
        }
        public static int ExecuteNonQuery(string connName, string usp, int bulkCount, params OracleParameter[] parameters)
        {
            string connString = DataUtil.GetConnectionString(connName);
            using (var conn = new OracleConnection(connString))
            {
                return conn.ExecuteNonQuery(usp, bulkCount, parameters);
            }
        }

        #endregion

        #region ExecuteScalar
        public static T ExecuteScalar<T>(string usp, params OracleParameter[] parameters)
        {
            return ExecuteScalar<T>(null, usp, parameters);
        }
        public static T ExecuteScalar<T>(string connName, string usp, params OracleParameter[] parameters)
        {
            string connString = DataUtil.GetConnectionString(connName);
            using (var conn = new OracleConnection(connString))
            {
                return conn.ExecuteScalar<T>(usp, parameters);
            }
        }

        #endregion

        #endregion

        #region Private Methods
        #region GetConnectionString
        private static string GetConnectionString(string connName)
        {
            if (string.IsNullOrEmpty(connName))
                return DataUtil.ConnectionString;
            else
            {
                string connString = ConfigurationManager.ConnectionStrings[connName].ConnectionString;
                if (string.IsNullOrEmpty(connString))
                    return DataUtil.ConnectionString;
                else
                    return connString;
            }
        }

        #endregion

        #endregion

    }
}
