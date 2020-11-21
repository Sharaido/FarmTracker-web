using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FarmTracker_web.Models;
using FarmTracker_web.Models.Farms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FarmTracker_web.Controllers
{
    [Authorize]
    public class FarmsController : Controller
    {
        public readonly IHttpContextAccessor _httpContextAccessor;
        public readonly SessionModel Sessions;
        public FarmsController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            Sessions = new SessionModel(_httpContextAccessor.HttpContext.Session);
        }

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
            Sessions.CurrentFarmName = farm.Name;
            Sessions.CurrentFarmUID = farm.Fuid.ToString();
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

        [HttpGet("[controller]/{FUID}/{PUID}")]
        public IActionResult Property(string FUID, string PUID)
        {
            if (FUID == null || PUID == null)
            {
                return NotFound();
            }

            var r = StaticFunctions.Request(
                "Farms/Properties/" + FUID + "/" + PUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );

            ViewData["CurrentFarmName"] = Sessions.CurrentFarmName;

            if (r != null)
            {
                var property = JsonConvert.DeserializeObject<FarmProperties>(r);
                Sessions.CurrentPropertyName = property.Name;
                return View(property);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("[controller]/GetFPEntities/{PUID}")]
        public IEnumerable<EntityOfFp> GetFPEntities(string PUID)
        {
            if (PUID == null)
            {
                return null;
            }

            var r = StaticFunctions.Request(
                "Farms/Properties/Entities/" + PUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var entities = JsonConvert.DeserializeObject<IEnumerable<EntityOfFp>>(r);
                return entities;
            }
            return null;
        }

        [HttpGet("[controller]/{FUID}/{PUID}/{EUID}")]
        public IActionResult Entity(string FUID, string PUID, string EUID)
        {
            if (FUID == null || PUID == null || EUID == null)
            {
                return NotFound();
            }

            var r = StaticFunctions.Request(
                "Farms/Properties/Entities/" + PUID + "/" + EUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );

            ViewData["CurrentFarmName"] = Sessions.CurrentFarmName;
            ViewData["CurrentFarmUID"] = Sessions.CurrentFarmUID;
            ViewData["CurrentPropertyName"] = Sessions.CurrentPropertyName;

            if (r != null)
            {
                var entity = JsonConvert.DeserializeObject<EntityOfFp>(r);
                return View(entity);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
