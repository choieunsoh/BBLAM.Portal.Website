#region Using Directives
using System.Collections.Generic;
using System.Data;
using System.Dynamic;

#endregion

namespace BBLAM.Portal.Models
{
    public class DynamicEntity : DynamicObject
    {
        #region Private Members
        private IDictionary<string, object> _values;

        #endregion

        #region Properties
        public IDictionary<string, object> Values { get { return _values; } }

        #endregion

        #region Constructors
        public DynamicEntity(IDictionary<string, object> values)
        {
            _values = values;
        }

        #endregion

        #region Override Methds
        public override bool TryGetMember(GetMemberBinder binder, out object result)
        {
            if (_values.ContainsKey(binder.Name))
            {
                result = _values[binder.Name];
                return true;
            }
            result = null;
            return false;
        }

        #endregion

        #region Public Methods
        #region FillList
        public static List<DynamicEntity> FillList(IDataReader reader)
        {
            List<DynamicEntity> col = new List<DynamicEntity>();
            try { col.Add(DynamicEntity.FillObject(reader)); }
            catch { }
            while (reader.Read())
            {
                col.Add(DynamicEntity.FillObject(reader));
            }
            return col;
        }

        #endregion

        #region FillObject
        public static DynamicEntity FillObject(IDataReader reader)
        {
            var values = new Dictionary<string, object>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                values.Add(reader.GetName(i), reader[i]);                
            }

            DynamicEntity obj = new DynamicEntity(values);
            return obj;
        }

        #endregion

        #endregion

    }
}