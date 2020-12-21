using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FarmTracker_web.Models.Adds;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FarmTracker_web.Controllers
{
    public class AddsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("[controller]")]
        public IEnumerable<Adds> GetAdds()
        {
            var r = StaticFunctions.Request(
                "Adds/",
                "",
                HttpMethod.Get
                );
            if (r != null)
            {
                var _r = JsonConvert.DeserializeObject<IEnumerable<Adds>>(r);
                return _r;
            }
            return null;
        }
    }
}
