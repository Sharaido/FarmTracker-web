using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FarmTracker_web.Models.DB;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FarmTracker_web.Controllers
{
    [Authorize]
    public class FarmsController : Controller
    {

        [HttpGet("[controller]/{FUID}")]
        public IActionResult Index(string FUID)
        {
            if (FUID == null)
            {
                return NotFound();
            }

            var r = StaticFunctions.Request(
                "Farms/" + FUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            var farm = JsonConvert.DeserializeObject<Farms>(r);

            if (farm == null)
            {
                return NotFound();
            }

            return View(farm);
        }
        [HttpGet]
        public IEnumerable<Farms> GetUserAllFarms()
        {
            var r = StaticFunctions.Request(
                "Farms",
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            var farms = JsonConvert.DeserializeObject<List<Farms>>(r);

            return farms;
        }
        [HttpGet("[controller]/GetFarmPropertiesFromFUID/{FUID}")]
        public IEnumerable<FarmProperties> GetFarmPropertiesFromFUID(string FUID)
        {
            if (FUID == null)
            {
                return null;
            }

            var r = StaticFunctions.Request(
                "Farms/Properties/" + FUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var properties = JsonConvert.DeserializeObject<IEnumerable<FarmProperties>>(r);
                return properties;
            }
            return null;
        } 
    }
}
