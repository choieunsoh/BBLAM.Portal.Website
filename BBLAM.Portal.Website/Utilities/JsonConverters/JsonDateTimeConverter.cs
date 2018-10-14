#region Using Directives
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

#endregion

namespace System.Web.Json
{
    public class JsonDateTimeConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(DateTime) || objectType == typeof(DateTime?);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.Value != null && reader.Value.ToString().ToLower() != "null")
            {
                DateTime date = (DateTime)reader.Value;
                if (date.Kind == DateTimeKind.Utc)
                    date = date.ToLocalTime();
                return date;
            }
            else
                return null;

            // If we reach here, we're pretty much going to throw an error so let's let Json.NET throw it's pretty-fied error message.
            //return new JsonSerializer().Deserialize(reader, objectType);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            new JsonSerializer().Serialize(writer, value);
        }

    }
}
