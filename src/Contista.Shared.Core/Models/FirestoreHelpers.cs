using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Linq;

namespace Contista.Shared.Core.Models
{
    public static class FirestoreHelpers
    {
        // ---------- To FirestoreValue (för skrivning) ----------
        public static FirestoreValue ToFirestoreValue(this string s) =>
            new FirestoreValue { StringValue = s ?? "" };

        public static FirestoreValue ToFirestoreValue(this int i) =>
            new FirestoreValue { IntegerValue = i.ToString() };

        public static FirestoreValue ToFirestoreValue(this double d) =>
            new FirestoreValue { DoubleValue = d };

        public static FirestoreValue ToFirestoreValue(this bool b) =>
            new FirestoreValue { BooleanValue = b };

        // Timestamp (ISO 8601)
        public static FirestoreValue ToFirestoreTimestamp(this DateTime dt)
        {
            var utc = dt.Kind == DateTimeKind.Utc ? dt : dt.ToUniversalTime();
            return new FirestoreValue
            {
                TimestampValue = utc.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'")
            };
        }

        // Array av strängar -> FirestoreValue (arrayValue)
        public static FirestoreValue ToFirestoreArrayValue(this IEnumerable<string> items) =>
            new FirestoreValue
            {
                ArrayValue = new FirestoreArray
                {
                    Values = items?.Select(x => new FirestoreValue { StringValue = x }).ToList() ?? new List<FirestoreValue>()
                }
            };

        // Dictionary<string,string> -> MapValue
        public static FirestoreValue ToFirestoreMapValue(this IDictionary<string, string> map) =>
            new FirestoreValue
            {
                MapValue = new FirestoreMap
                {
                    Fields = map?.ToDictionary(k => k.Key, k => new FirestoreValue { StringValue = k.Value }) ?? new Dictionary<string, FirestoreValue>()
                }
            };

        // ---------- Läsningshjälpare (från FirestoreDocument.Fields) ----------
        // Hämta string
        public static string GetString(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return "";
            if (fields.TryGetValue(key, out var v))
                return v?.StringValue ?? "";
            return "";
        }

        // Hämta int (stöd för integerValue eller string)
        public static int GetInt(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return 0;
            if (fields.TryGetValue(key, out var v))
            {
                if (!string.IsNullOrEmpty(v.IntegerValue) && int.TryParse(v.IntegerValue, out var i)) return i;
                if (!string.IsNullOrEmpty(v.StringValue) && int.TryParse(v.StringValue, out i)) return i;
                if (v.DoubleValue.HasValue) return (int)v.DoubleValue.Value;
            }
            return 0;
        }

        // Hämta double
        public static double GetDouble(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return 0.0;
            if (fields.TryGetValue(key, out var v))
            {
                if (v.DoubleValue.HasValue) return v.DoubleValue.Value;
                if (!string.IsNullOrEmpty(v.IntegerValue) && double.TryParse(v.IntegerValue, out var d)) return d;
                if (!string.IsNullOrEmpty(v.StringValue) && double.TryParse(v.StringValue, out d)) return d;
            }
            return 0.0;
        }

        // Hämta bool
        public static bool GetBool(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return false;
            if (fields.TryGetValue(key, out var v))
            {
                if (v.BooleanValue.HasValue) return v.BooleanValue.Value;
                if (!string.IsNullOrEmpty(v.StringValue) && bool.TryParse(v.StringValue, out var b)) return b;
            }
            return false;
        }

        // Hämta DateTime från timestampValue
        public static DateTime GetDate(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return DateTime.MinValue;

            if (fields.TryGetValue(key, out var v) && !string.IsNullOrEmpty(v.TimestampValue))
            {
                // Firestore timestampValue är ISO8601 med Z -> UTC
                if (DateTimeOffset.TryParse(v.TimestampValue, CultureInfo.InvariantCulture,
                        DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var dto))
                {
                    return dto.UtcDateTime; // ✅ Kind = Utc
                }
            }

            return DateTime.MinValue;
        }

        // ---------- Hjälpare för nested map (mapValue -> fields) ----------
        public static string GetMapString(this Dictionary<string, FirestoreValue> fields, string mapField, string key)
        {
            if (fields == null) return "";
            if (fields.TryGetValue(mapField, out var mapVal) && mapVal?.MapValue?.Fields != null)
                return mapVal.MapValue.Fields.GetString(key);
            return "";
        }

        public static bool GetMapBool(this Dictionary<string, FirestoreValue> fields, string mapField, string key)
        {
            if (fields == null) return false;
            if (fields.TryGetValue(mapField, out var mapVal) && mapVal?.MapValue?.Fields != null)
                return mapVal.MapValue.Fields.GetBool(key);
            return false;
        }

        public static int GetMapInt(this Dictionary<string, FirestoreValue> fields, string mapField, string key)
        {
            if (fields == null) return 0;
            if (fields.TryGetValue(mapField, out var mapVal) && mapVal?.MapValue?.Fields != null)
                return mapVal.MapValue.Fields.GetInt(key);
            return 0;
        }

        // ---------- Utility: konvertera Firestore array/ map till .NET-typer ----------
        public static List<string> ToStringList(this FirestoreArray array)
        {
            if (array?.Values == null) return new List<string>();
            return array.Values.Select(v => v.StringValue ?? "").ToList();
        }

        public static Dictionary<string, string> ToStringDictionary(this FirestoreMap map)
        {
            if (map?.Fields == null) return new Dictionary<string, string>();
            return map.Fields.ToDictionary(k => k.Key, k => k.Value.StringValue ?? "");
        }

        public static List<string> GetStringList(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return new List<string>();
            if (!fields.TryGetValue(key, out var v) || v?.ArrayValue?.Values == null)
                return new List<string>();

            return v.ArrayValue.Values
                .Select(x => x.StringValue ?? "")
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToList();
        }

        public static string? GetOptionalString(this Dictionary<string, FirestoreValue> fields, string key)
        {
            var s = fields.GetString(key);
            return string.IsNullOrWhiteSpace(s) ? null : s;
        }

        public static TEnum GetEnum<TEnum>(this Dictionary<string, FirestoreValue> fields, string key, TEnum fallback)
            where TEnum : struct, Enum
        {
            if (fields == null) return fallback;
            if (!fields.TryGetValue(key, out var v) || v is null) return fallback;

            // stringValue: "CreatePost" eller "1"
            if (!string.IsNullOrWhiteSpace(v.StringValue))
            {
                if (Enum.TryParse<TEnum>(v.StringValue, ignoreCase: true, out var parsed))
                    return parsed;

                if (int.TryParse(v.StringValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out var asInt) &&
                    Enum.IsDefined(typeof(TEnum), asInt))
                {
                    return (TEnum)Enum.ToObject(typeof(TEnum), asInt);
                }
            }

            // integerValue: "1"
            if (!string.IsNullOrWhiteSpace(v.IntegerValue) &&
                int.TryParse(v.IntegerValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out var i) &&
                Enum.IsDefined(typeof(TEnum), i))
            {
                return (TEnum)Enum.ToObject(typeof(TEnum), i);
            }

            return fallback;
        }

        public static FirestoreValue ToFirestoreMapValueFields(this IDictionary<string, FirestoreValue> fields) =>
        new FirestoreValue
        {
            MapValue = new FirestoreMap
            {
                Fields = fields?.ToDictionary(k => k.Key, v => v.Value) ?? new Dictionary<string, FirestoreValue>()
            }
        };

        public static FirestoreValue ToFirestoreArrayValue(this IEnumerable<FirestoreValue> values) =>
            new FirestoreValue
            {
                ArrayValue = new FirestoreArray
                {
                    Values = values?.ToList() ?? new List<FirestoreValue>()
                }
            };

        public static Dictionary<string, FirestoreValue>? GetMap(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return null;
            if (!fields.TryGetValue(key, out var v)) return null;
            if (v is null || v.NullValue is not null) return null;
            return v?.MapValue?.Fields;
        }

        public static List<FirestoreValue>? GetArray(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return null;
            if (!fields.TryGetValue(key, out var v)) return null;
            return v?.ArrayValue?.Values;
        }

        public static bool HasNonNull(this Dictionary<string, FirestoreValue> fields, string key)
        {
            if (fields == null) return false;
            if (!fields.TryGetValue(key, out var v) || v is null) return false;
            return v.NullValue is null; 
        }
    }
}
