using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Numerics;
using System.Text;
using System.Text.RegularExpressions;

namespace Contista.Shared.Core.Models
{
    public static class FirestoreMapper
    {

        // 🔹 Group
        //public static Group ToGroup(FirestoreDocument doc, string id)
        //{
        //    var f = doc.Fields!;
        //    return new Group
        //    {
        //        GroupId = id,
        //        GroupName = f.GetString("GroupName"),
        //        Type = f.GetString("Type"),
        //        CreatedBy = f.GetString("CreatedBy"),
        //        CreatedDate = f.GetDate("CreatedDate"),
        //        Mentors = f.ContainsKey("Mentors") && f["Mentors"].MapValue?.Fields != null
        //            ? f["Mentors"].MapValue.ToStringDictionary()
        //            : new Dictionary<string, string>(),
        //        Learners = f.ContainsKey("Learners") && f["Learners"].ArrayValue?.Values != null
        //            ? f["Learners"].ArrayValue.ToStringList()
        //            : new List<string>()
        //    };
        //}

        //public static FirestoreDocument FromGroup(Group g)
        //{
        //    var fields = new Dictionary<string, FirestoreValue>
        //    {
        //        ["GroupName"] = g.GroupName.ToFirestoreValue(),
        //        ["Type"] = g.Type.ToFirestoreValue(),
        //        ["CreatedBy"] = g.CreatedBy.ToFirestoreValue(),
        //        ["CreatedDate"] = g.CreatedDate.ToFirestoreTimestamp(),
        //        ["Mentors"] = g.Mentors.ToFirestoreMapValue(),
        //        ["Learners"] = g.Learners.ToFirestoreArrayValue()
        //    };

        //    return new FirestoreDocument { Fields = fields };
        //}

    }
}
