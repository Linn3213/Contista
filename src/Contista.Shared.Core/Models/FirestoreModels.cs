using System.Text.Json;
using System.Text.Json.Serialization;

namespace Contista.Shared.Core.Models
{
    // 🔹 Root response för "list documents"
    public class FirestoreListResponse
    {
        [JsonPropertyName("documents")]
        public List<FirestoreDocument>? Documents { get; set; }
    }

    // 🔹 Root response för ett enskilt dokument
    public class FirestoreDocument
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; } // projects/{projectId}/databases/(default)/documents/{collection}/{docId}
        [JsonPropertyName("fields")]
        public Dictionary<string, FirestoreValue>? Fields { get; set; }

        [JsonPropertyName("createTime")]
        public string? CreateTime { get; set; }

        [JsonPropertyName("updateTime")]
        public string? UpdateTime { get; set; }
    }

    // 🔹 FirestoreValue representerar en "union type" (endast en property används åt gången)
    public class FirestoreValue
    {
        [JsonPropertyName("stringValue")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? StringValue { get; set; }

        [JsonPropertyName("integerValue")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? IntegerValue { get; set; }

        [JsonPropertyName("doubleValue")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public double? DoubleValue { get; set; }

        [JsonPropertyName("booleanValue")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public bool? BooleanValue { get; set; }

        [JsonPropertyName("timestampValue")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? TimestampValue { get; set; }

        [JsonPropertyName("mapValue")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public FirestoreMap? MapValue { get; set; }

        [JsonPropertyName("arrayValue")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public FirestoreArray? ArrayValue { get; set; }

        // Firestore NullValue är enum i protobuf-json: "NULL_VALUE"
        [JsonPropertyName("nullValue")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public object? NullValue { get; set; }

        public static FirestoreValue Null => new FirestoreValue { NullValue = "NULL_VALUE" };
    }

    // 🔹 Hjälpklass för att läsa MapValue
    public class FirestoreMap
    {
        [JsonPropertyName("fields")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Dictionary<string, FirestoreValue>? Fields { get; set; }
    }

    public class FirestoreArray
    {
        [JsonPropertyName("values")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<FirestoreValue>? Values { get; set; }
    }

    public class FirebaseErrorResponse
    {
        public FirebaseError? error { get; set; }
    }

    public class FirebaseError
    {
        public int? code { get; set; }
        public string? message { get; set; }
        public List<FirebaseErrorDetail>? errors { get; set; }
    }

    public class FirebaseErrorDetail
    {
        public string? message { get; set; }
        public string? domain { get; set; }
        public string? reason { get; set; }
    }

    public class BulkSaveResult
    {
        public int TotalTried { get; set; }
        public int Created { get; set; }
        public int Updated { get; set; }
        public List<string> Errors { get; } = new();
    }
}
