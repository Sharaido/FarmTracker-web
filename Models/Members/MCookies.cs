using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FarmTracker_web.Models.Members
{
    public class MCookies
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IResponseCookies _response;
        private readonly IRequestCookieCollection _request;

        public CookieUser User
        {
            get => Get<CookieUser>("User");
            set => Set("User", value);
        }





        public MCookies(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _response = _httpContextAccessor.HttpContext.Response.Cookies;
            _request = _httpContextAccessor.HttpContext.Request.Cookies;
        }
        public void Set<T>(string key, T value, CookieOptions ops)
        {
            string str = JsonConvert.SerializeObject(value);
            _response.Append(key, str, ops);
        }
        public void Set<T>(string key, T value)
        {
            CookieOptions ops = new CookieOptions();
            ops.Expires = DateTime.UtcNow.AddYears(1);

            Set<T>(key, value, ops);
        }
        public T Get<T>(string key)
        {
            string value = _request[key];
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }
        public void Delete(string key)
        {
            _response.Delete(key);
        }
    }
}
