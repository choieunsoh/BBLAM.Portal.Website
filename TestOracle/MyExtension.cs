#region Using DIrectives
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.IO;
using System.ComponentModel;
using System.Globalization;
using System.Xml;
using System.Xml.Serialization;
using System.Runtime.Serialization.Json;
using System.Reflection;
using System.Data.SqlClient;
using System.Configuration;
using System.Net;
using System.Net.Http;
using Oracle.DataAccess.Client;

#endregion

namespace System
{
    public static class MyExtension
    {
        #region Private Members
        private static CultureInfo enus = new CultureInfo("en-US");

        #endregion

        #region String Extension
        #region ToInt32
        public static int ToInt32(this string value)
        {
            return ChangeType<int>(value);
        }

        #endregion

        #region ToDouble
        public static double ToDouble(this string value)
        {
            return ChangeType<double>(value);
        }

        #endregion

        #region ToBoolean
        public static bool ToBoolean(this string value)
        {
            return ChangeType<bool>(value);
        }

        #endregion

        #region ToDate
        public static DateTime ToDate(this string value)
        {
            return ToDate(value, "dd/MM/yyyy");
        }
        public static DateTime ToDate(this string value, string format)
        {
            return ChangeType<DateTime>(value, format);
        }

        #endregion

        #region ToDateTime
        public static DateTime ToDateTime(this string value)
        {
            return ToDateTime(value, "dd/MM/yyyy HH:mm:ss");
        }
        public static DateTime ToDateTime(this string value, string format)
        {
            return ChangeType<DateTime>(value, format);
        }

        #endregion

        #region ToTimeSpan
        public static TimeSpan ToTimeSpan(this string value)
        {
            return ToTimeSpan(value, "hh\\:mm");
        }
        public static TimeSpan ToTimeSpan(this string value, string format)
        {
            try
            {
                return TimeSpan.ParseExact(value, format, enus);
            }
            catch { return TimeSpan.ParseExact(value, "h\\:mm", enus); }
        }

        #endregion

        #region FromXML
        /// <summary>
        /// Deserialize an Xml to object using the XmlAttributes
        /// </summary>
        /// <param name="xmlString">The object string to Deserialize</param>
        /// <returns></returns>
        /// <remarks>
        /// An Object representation of the Xml.
        /// </remarks>
        public static T FromXML<T>(this string xml) where T : class
        {
            XmlSerializer xmlSerializer;
            try
            {
                xmlSerializer = new XmlSerializer(typeof(T));
                byte[] bytes = new byte[xml.Length];
                Encoding.GetEncoding("windows-874").GetBytes(xml, 0, xml.Length, bytes, 0);
                using (MemoryStream memStream = new MemoryStream(bytes))
                {
                    T objectFromXml = xmlSerializer.Deserialize(memStream) as T;
                    return objectFromXml;
                }
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                xmlSerializer = null;
            }
        }

        #endregion

        #region FromJSON
        /// <summary>
        /// Deserialize an Json to object using the DataMemberAttribute
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <remarks>
        /// An Object representation of the Json.
        /// </remarks>
        public static T FromJSON<T>(this string json) where T : class
        {
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
            using (MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(json)))
            {
                return ser.ReadObject(stream) as T;
            }
        }

        #endregion

        #endregion

        #region DateTime Extension
        #region GetQuarter
        public static int GetQuarter(this DateTime date)
        {
            return (int)Math.Floor((date.Month + 2) / 3.0);
        }

        #endregion

        #endregion

        #region Object Extension
        #region ToInt32
        public static int ToInt32(this object value)
        {
            return ChangeType<int>(value);
        }

        #endregion

        #region ToDouble
        public static double ToDouble(this object value)
        {
            return ChangeType<double>(value);
        }

        #endregion

        #region ToDecimal
        public static decimal ToDecimal(this object value)
        {
            return ChangeType<decimal>(value);
        }

        #endregion

        #region ToBoolean
        public static bool ToBoolean(this object value)
        {
            return ChangeType<bool>(value);
        }

        #endregion

        #region ToDate
        public static DateTime ToDate(this object value)
        {
            return ToDate(value, "dd/MM/yyyy");
        }
        public static DateTime ToDate(this object value, string format)
        {
            return ChangeType<DateTime>(value, format);
        }

        #endregion

        #region ToDateTime
        public static DateTime ToDateTime(this object value)
        {
            return ToDateTime(value, "dd/MM/yyyy HH:mm:ss");
        }
        public static DateTime ToDateTime(this object value, string format)
        {
            return ChangeType<DateTime>(value, format);
        }

        #endregion

        #region ToTimeSpan
        public static TimeSpan ToTimeSpan(this object value)
        {
            return ToTimeSpan(value, "hh\\:mm");
        }
        public static TimeSpan ToTimeSpan(this object value, string format)
        {
            return TimeSpan.ParseExact(value.ToString(), format, enus);
        }

        #endregion

        #region ToJSON
        public static string ToJSON(this object obj)
        {
            DataContractJsonSerializer json = new DataContractJsonSerializer(obj.GetType());
            using (MemoryStream ms = new MemoryStream())
            {
                using (StreamReader sr = new StreamReader(ms))
                {
                    json.WriteObject(ms, obj);
                    ms.Position = 0;
                    return sr.ReadToEnd();
                }
            }
        }

        #endregion

        #region ToXML
        /// <summary>
        /// Serializes an object to Xml using the XmlAttributes
        /// </summary>
        /// <param name="objl">The object to Serialize</param>
        /// <returns></returns>
        /// <remarks>
        /// An Xml representation of the object.
        /// </remarks>
        public static string ToXML(this object obj)
        {
            return ToXML(obj, false, true);
        }
        /// <summary>
        /// Serializes an object to Xml using the XmlAttributes
        /// </summary>
        /// <param name="objl">The object to Serialize</param>
        /// <param name="includeNameSpace">Whether removes namespace and any other inline information tag</param>		
        /// <param name="removeEmptyNodes">Remove unicode /0. (0x00)</param>
        /// <returns></returns>
        /// <remarks>
        /// An Xml representation of the object.
        /// </remarks>
        public static string ToXML(this object obj, bool includeNameSpace, bool removeEmptyNodes)
        {
            XmlSerializer xmlSerializer;
            string buffer;
            try
            {
                xmlSerializer = new XmlSerializer(obj.GetType());
                using (MemoryStream memStream = new MemoryStream())
                {
                    using (XmlTextWriter xmlWriter = new XmlTextWriter(memStream, Encoding.GetEncoding("windows-874")))
                    {
                        xmlWriter.Formatting = Formatting.Indented;
                        xmlWriter.Indentation = 4;
                        if (!includeNameSpace)
                        {
                            XmlSerializerNamespaces xs = new XmlSerializerNamespaces();
                            xs.Add("", "");//To remove namespace and any other inline information tag
                            xmlSerializer.Serialize(xmlWriter, obj, xs);
                        }
                        else
                        {
                            xmlSerializer.Serialize(xmlWriter, obj);
                        }
                        buffer = Encoding.ASCII.GetString(memStream.GetBuffer());
                    }
                }
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                xmlSerializer = null;
            }

            //if (removeEmptyNodes)
            //    buffer = RemoveEmptyNodes(buffer);

            // Remove \0
            buffer = RemoveUnicodeNull(buffer);
            return buffer;
        }

        private static string RemoveUnicodeNull(string input)
        {
            return input.Trim('\0');
        }

        #endregion

        #region GetProperties
        public static Dictionary<string, Type> GetProperties(this object obj)
        {
            Dictionary<string, Type> col = new Dictionary<string, Type>();

            // Get all public static properties of MyClass type
            //PropertyInfo[] propertyInfos = obj.GetType().GetProperties(BindingFlags.Public | BindingFlags.Static);
            PropertyInfo[] propertyInfos = obj.GetType().GetProperties();
            
            // Sort properties by name
            Array.Sort(propertyInfos,
                    delegate(PropertyInfo propertyInfo1, PropertyInfo propertyInfo2)
                    { return propertyInfo1.Name.CompareTo(propertyInfo2.Name); });

            // Write property result
            foreach (PropertyInfo prop in propertyInfos)
            {
                col.Add(prop.Name, prop.PropertyType);
            }

            return col;
        }


        #endregion

        #endregion

        #region Decimal Extension
        #region GetDecimals
        public static int GetDecimals(this decimal d, int i = 0)
        {
            decimal multiplied = (decimal)((double)d * Math.Pow(10, i));
            if (Math.Round(multiplied) == multiplied)
                return i;
            return GetDecimals(d, i + 1);
        }

        #endregion

        #region HasDecimals
        public static bool HasDecimals(this decimal d, int i = 0)
        {
            return GetDecimals(d, i).Equals(i);
        }

        #endregion

        #endregion

        #region Double Extension
        #region GetDecimals
        public static int GetDecimals(this double d, int i = 0)
        {
            decimal multiplied = (decimal)((double)d * Math.Pow(10, i));
            if (Math.Round(multiplied) == multiplied)
                return i;
            return GetDecimals(d, i + 1);
        }

        #endregion

        #region HasDecimals
        public static bool HasDecimals(this double d, int i = 0)
        {
            return GetDecimals(d, i).Equals(i);
        }

        #endregion

        #endregion
        
        #region IEnumerable<T> Extension
        #region IsEmpty
        public static bool IsEmpty<T>(this IEnumerable<T> source)
        {
            if (source == null)
                return true; // or throw an exception
            else if (typeof(T).Equals(typeof(string)))
                return IsEmptyString(source.Cast<string>());
            else
                return !source.Any();
        }

        #endregion

        #region IsEmptyString
        private static bool IsEmptyString(this IEnumerable<string> source)
        {
            if (source == null)
                return true; // or throw an exception
            return !source.Any(x => !string.IsNullOrEmpty(x));
        }

        #endregion

        #region MaxBy
        public static T MaxBy<T, R>(this IEnumerable<T> en, Func<T, R> evaluate) where R : IComparable<R>
        {
            return en.Select(t => new Tuple<T, R>(t, evaluate(t)))
                .Aggregate((max, next) => next.Item2.CompareTo(max.Item2) > 0 ? next : max).Item1;
        }

        #endregion

        #region MinBy
        public static T MinBy<T, R>(this IEnumerable<T> en, Func<T, R> evaluate) where R : IComparable<R>
        {
            return en.Select(t => new Tuple<T, R>(t, evaluate(t)))
                .Aggregate((max, next) => next.Item2.CompareTo(max.Item2) < 0 ? next : max).Item1;
        }

        #endregion

        #endregion

        #region DataRow Extension
        #region ToStringArray
        public static string ToStringArray(this DataRow datarow)
        {
            return ToStringArray(datarow, ",");
        }
        public static string ToStringArray(this DataRow datarow, string separator)
        {
            return string.Join(separator, datarow.ItemArray.Cast<string>().ToArray());
        }

        #endregion

        #endregion

        #region Enum Extension
        #region GetDescription
        ///<summary>
        /// Allows the discovery of an enumeration text value based on the <c>EnumTextValueAttribute</c>
        ///</summary>
        /// <param name="e">The enum to get the reader friendly text value for.</param>
        /// <returns><see cref="System.String"/> </returns>
        public static string GetDescription(this Enum e)
        {
            string ret = "";
            Type t = e.GetType();
            MemberInfo[] members = t.GetMember(e.ToString());
            if (members != null && members.Length == 1)
            {
                object[] attrs = members[0].GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (attrs.Length == 1)
                {
                    ret = ((DescriptionAttribute)attrs[0]).Description;
                }
            }
            return ret;
        }

        #endregion 

        #endregion

        #region OracleConnection Extension
        #region Properties
        private static string ConnectionString
        {
            get { return ConfigurationManager.ConnectionStrings["IM"].ConnectionString; }
        }
        private static int CommandTimeout
        {
            get
            {
                try { return Convert.ToInt32(ConfigurationManager.AppSettings["COMMAND_TIMEOUT"]); }
                catch { return 600; }
            }
        }

        #endregion

        #region ExecuteObject
        public static T ExecuteObject<T>(this OracleConnection conn, string usp, Func<OracleDataReader, T> fillMethod, params OracleParameter[] parameters)
        {
            conn.Open();
            using (var cmd = new OracleCommand(usp, conn))
            {
                if (usp.ToLower().StartsWith("select"))
                    cmd.CommandType = CommandType.Text;
                else
                    cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeout;
                if (parameters != null && parameters.Length > 0)
                    cmd.Parameters.AddRange(parameters);

                using (var reader = cmd.ExecuteReader())
                {
                    return reader.Read() ? fillMethod(reader) : default(T);
                }
            }
        }

        #endregion

        #region ExecuteList
        public static List<T> ExecuteList<T>(this OracleConnection conn, string usp, Func<OracleDataReader, T> fillMethod, params OracleParameter[] parameters)
        {
            List<T> col = new List<T>();
            conn.Open();
            using (var cmd = new OracleCommand(usp, conn))
            {
                if (usp.ToLower().StartsWith("select"))
                    cmd.CommandType = CommandType.Text;
                else
                    cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeout;
                if (parameters != null && parameters.Length > 0)
                    cmd.Parameters.AddRange(parameters);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        if (fillMethod != null)
                        {
                            T obj = fillMethod(reader);
                            if (obj != null)
                                col.Add(obj);
                        }
                        else
                        {
                            for (int i = 0; i < reader.FieldCount; i++)
                                col.Add(reader.Field<T>(i));
                        }
                    }
                }
            }
            return col;
        }

        #endregion

        #region ExecuteNonQuery
        public static int ExecuteNonQuery(this OracleConnection conn, string usp, params OracleParameter[] parameters)
        {
            return ExecuteNonQuery(conn, usp, -1, parameters);
        }
        public static int ExecuteNonQuery(this OracleConnection conn, string usp, int bulkCount, params OracleParameter[] parameters)
        {
            conn.Open();
            using (var cmd = new OracleCommand(usp, conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeout;
                if (bulkCount > 0)
                {
                    cmd.BindByName = true;
                    cmd.ArrayBindCount = bulkCount;
                }
                if (parameters != null && parameters.Length > 0)
                    cmd.Parameters.AddRange(parameters);

                return cmd.ExecuteNonQuery();
            }
        }

        #endregion

        #region ExecuteScalar
        public static T ExecuteScalar<T>(this OracleConnection conn, string usp, params OracleParameter[] parameters)
        {
            conn.Open();
            using (var cmd = new OracleCommand(usp, conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = CommandTimeout;
                if (parameters != null && parameters.Length > 0)
                    cmd.Parameters.AddRange(parameters);

                return ChangeType<T>(cmd.ExecuteScalar());
            }
        }

        #endregion

        #endregion

        #region IDataReader Extension
        #region Field
        public static T Field<T>(this IDataReader reader, string name)
        {
            return Field<T>(reader, name, false);
        }
        public static T Field<T>(this IDataReader reader, string name, bool validateColumnExist)
        {
            object value = null;
            if (validateColumnExist)
                value = ColumnExists(reader, name) ? reader[name] : null;
            else
                value = reader[name];
            return ChangeType<T>(value);
            //return (T)Convert.ChangeType(reader[name], typeof(T));
        }
        public static T Field<T>(this IDataReader reader, int index)
        {
            return ChangeType<T>(reader[index]);
            //return (T)Convert.ChangeType(reader[index], typeof(T));
        }

        #endregion

        #region TryGetValue
        public static bool TryGetValue<T>(this SqlDataReader reader, string name, out T output)
        {
            try
            {
                output = reader.Field<T>(name);
                return true;
            }
            catch (Exception ex)
            {
                if (ex is InvalidCastException || ex is FormatException || ex is OverflowException)
                {
                    output = default(T);
                    return false;
                }
                else
                    throw;
            }
        }

        #endregion

        #region IsDBNull
        public static bool IsDBNull(this IDataReader reader, string name)
        {
            int idx = reader.GetOrdinal(name);
            return reader.IsDBNull(idx);
        }

        #endregion

        #region ColumnExists
        public static bool ColumnExists(this IDataReader reader, string name)
        {
            return (reader.GetSchemaTable().Select("ColumnName = '" + name + "'").Count() == 1);
        }

        #endregion

        #endregion

        #region DirectoryInfo Extension
        #region GetFilesByExtensions
        public static IEnumerable<FileInfo> GetFilesByExtensions(this DirectoryInfo dir, params string[] extensions)
        {
            if (extensions == null)
                throw new ArgumentNullException("extensions");
            IEnumerable<FileInfo> files = dir.EnumerateFiles();
            return files.Where(f => extensions.Contains(f.Extension));
        }

        #endregion

        #endregion

        #region HttpRequestMessage
        private const string HttpContext = "MS_HttpContext";
        private const string RemoteEndpointMessage = "System.ServiceModel.Channels.RemoteEndpointMessageProperty";
        private const string OwinContext = "MS_OwinContext";

        public static string GetClientIpString(this HttpRequestMessage request)
        {
            //Web-hosting
            if (request.Properties.ContainsKey(HttpContext))
            {
                dynamic ctx = request.Properties[HttpContext];
                if (ctx != null)
                {
                    return ctx.Request.UserHostAddress;
                }
            }
            //Self-hosting
            if (request.Properties.ContainsKey(RemoteEndpointMessage))
            {
                dynamic remoteEndpoint = request.Properties[RemoteEndpointMessage];
                if (remoteEndpoint != null)
                {
                    return remoteEndpoint.Address;
                }
            }
            //Owin-hosting
            if (request.Properties.ContainsKey(OwinContext))
            {
                dynamic ctx = request.Properties[OwinContext];
                if (ctx != null)
                {
                    return ctx.Request.RemoteIpAddress;
                }
            }
            if (System.Web.HttpContext.Current != null)
            {
                return System.Web.HttpContext.Current.Request.UserHostAddress;
            }
            // Always return all zeroes for any failure
            return "0.0.0.0";
        }

        public static IPAddress GetClientIpAddress(this HttpRequestMessage request)
        {
            var ipString = request.GetClientIpString();
            IPAddress ipAddress = new IPAddress(0);
            if (IPAddress.TryParse(ipString, out ipAddress))
            {
                return ipAddress;
            }

            return ipAddress;
        }

        #endregion

        #region Public Methods
        #region ChangeType
        /// <summary>
        /// Returns an Object with the specified Type and whose value is equivalent to the specified object.
        /// </summary>
        /// <param name="value">An Object that implements the IConvertible interface.</param>
        /// <param name="conversionType">The Type to which value is to be converted.</param>
        /// <returns>An object whose Type is conversionType (or conversionType's underlying type if conversionType
        /// is Nullable&lt;&gt;) and whose value is equivalent to value. -or- a null reference, if value is a null
        /// reference and conversionType is not a value type.</returns>
        /// <remarks>
        /// This method exists as a workaround to System.Convert.ChangeType(Object, Type) which does not handle
        /// nullables as of version 2.0 (2.0.50727.42) of the .NET Framework. The idea is that this method will
        /// be deleted once Convert.ChangeType is updated in a future version of the .NET Framework to handle
        /// nullable types, so we want this to behave as closely to Convert.ChangeType as possible.
        /// This method was written by Peter Johnson at:
        /// http://aspalliance.com/author.aspx?uId=1026.
        /// </remarks>
        public static T ChangeType<T>(object value)
        {
            return ChangeType<T>(value, "en-US", "dd/MM/yyyy");
        }
        public static T ChangeType<T>(object value, string dateTimeFormat)
        {
            return ChangeType<T>(value, "en-US", dateTimeFormat);
        }
        public static T ChangeType<T>(object value, string culture, string dateTimeFormat)
        {
            return (T)ChangeType(value, typeof(T), culture, dateTimeFormat);
        }
        public static object ChangeType(object value, Type conversionType)
        {
            return ChangeType(value, conversionType, "en-US", "dd/MM/yyyy");
        }
        public static object ChangeType(object value, Type conversionType, string culture, string dateTimeFormat)
        {
            // Note: This if block was taken from Convert.ChangeType as is, and is needed here since we're
            // checking properties on conversionType below.
            if (conversionType == null)
            {
                throw new ArgumentNullException("conversionType");
            } // end if

            // If it's not a nullable type, just pass through the parameters to Convert.ChangeType

            if (conversionType.IsGenericType &&
              conversionType.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                // It's a nullable type, so instead of calling Convert.ChangeType directly which would throw a
                // InvalidCastException (per http://weblogs.asp.net/pjohnson/archive/2006/02/07/437631.aspx),
                // determine what the underlying type is
                // If it's null, it won't convert to the underlying type, but that's fine since nulls don't really
                // have a type--so just return null
                // Note: We only do this check if we're converting to a nullable type, since doing it outside
                // would diverge from Convert.ChangeType's behavior, which throws an InvalidCastException if
                // value is null and conversionType is a value type.
                if (value == null || value == DBNull.Value)
                {
                    return null;
                } // end if

                // It's a nullable type, and not null, so that means it can be converted to its underlying type,
                // so overwrite the passed-in conversion type with this underlying type
                NullableConverter nullableConverter = new NullableConverter(conversionType);
                conversionType = nullableConverter.UnderlyingType;
            } // end if

            // Now that we've guaranteed conversionType is something Convert.ChangeType can handle (i.e. not a
            // nullable type), pass the call on to Convert.ChangeType
            if (conversionType.Equals(typeof(Guid)))
            {
                try
                {
                    if (String.IsNullOrEmpty(value.ToString()))
                        return Guid.NewGuid();
                    else
                        return new Guid(value.ToString());
                }
                catch { return Guid.Empty; }
            }
            else if (!string.IsNullOrEmpty(dateTimeFormat) && conversionType.Equals(typeof(DateTime)))
            {
                if (value is DateTime)
                    return (DateTime)value;
                try { return DateTime.ParseExact(value.ToString(), dateTimeFormat, System.Globalization.CultureInfo.GetCultureInfo(culture).DateTimeFormat); }
                catch { return Convert.ChangeType(value, conversionType); }
            }
            else
                return Convert.ChangeType(value, conversionType);
        }

        #endregion

        #endregion

    }
}
