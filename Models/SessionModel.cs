using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FarmTracker_web.Models
{
    public class SessionModel
    {
        private readonly ISession _session;

        public string CurrentFarmName
        {
            get => Get<string>("CurrentFarmName");
            set => Set("CurrentFarmName", value);
        }
        public string CurrentFarmUID
        {
            get => Get<string>("CurrentFarmUID");
            set => Set("CurrentFarmUID", value);
        }
        public string CurrentPropertyName
        {
            get => Get<string>("CurrentPropertyName");
            set => Set("CurrentPropertyName", value);
        }







        public SessionModel(ISession session)
        {
            _session = session;
        }
        public void Set<T>(string key, T value)
        {
            string json = JsonConvert.SerializeObject(value);
            _session.SetString(key, JsonConvert.SerializeObject(value));
        }
        //public void Set<T>(SessionKey key, T value) { Set(key.ToString(), value); }
        public T Get<T>(string key)
        {
            var value = _session.GetString(key);
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }
        //public T Get<T>(SessionKey key) { return Get<T>(key.ToString()); }

        public void Clear()
        {
            _session.Clear();
        }
        public void Remove(string key)
        {
            _session.Remove(key);
        }
    }
}
