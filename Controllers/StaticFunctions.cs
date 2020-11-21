using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace FarmTracker_web.Controllers
{
    public static class StaticFunctions
    {
        public static string host = "http://localhost:8181/api/";
        public static string Request(string method, string jsonBody, HttpMethod httpMethod, string token)
        {
            using (HttpClient client = new HttpClient())
            {
                using (HttpRequestMessage request = new HttpRequestMessage
                {
                    Method = httpMethod,
                    RequestUri = new Uri(host + method),
                    Content = new StringContent(jsonBody, Encoding.UTF8, "application/json")
                })
                {
                    if (token != null)
                    {
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    }
                    using (HttpResponseMessage response = client.SendAsync(request).Result)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            using (HttpContent content = response.Content)
                            {

                                var jsonResponse = content.ReadAsStringAsync().Result;
                                return jsonResponse;
                            }
                        }
                        else
                        {
                            if (response.StatusCode == HttpStatusCode.Unauthorized)
                            {
                                using (HttpContent content = response.Content)
                                {

                                    var jsonResponse = content.ReadAsStringAsync().Result;
                                    return jsonResponse;
                                }
                            }
                            return null;
                        }
                    }
                }
            }
        }
        public static string Request(string method, string jsonBody, HttpMethod httpMethod)
        {
            return Request(method, jsonBody, httpMethod,  null);
        }
    }
}
