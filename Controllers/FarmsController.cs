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
        [HttpPost]
        public Farms AddFarm(Farms farm)
        {
            var r = StaticFunctions.Request(
                "Farms",
                JsonConvert.SerializeObject(farm),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var rFarm = JsonConvert.DeserializeObject<Farms>(r);
                return rFarm;
            }
            return null;
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
        [HttpPost]
        public FarmProperties AddFarmProperty(FarmProperties farmProperty)
        {
            var r = StaticFunctions.Request(
                "Farms/Properties/",
                JsonConvert.SerializeObject(farmProperty),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var rFarmProperty = JsonConvert.DeserializeObject<FarmProperties>(r);
                return rFarmProperty;
            }
            return null;
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

        [HttpPost]
        public EntityOfFp AddFPEntity(EntityOfFp entity)
        {
            var r = StaticFunctions.Request(
                "Farms/Properties/Entities/",
                JsonConvert.SerializeObject(entity),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var rEntity = JsonConvert.DeserializeObject<EntityOfFp>(r);
                /* This part must be improved */
                if (entity.CP_1 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 1, Value = entity.CP_1 });
                if (entity.CP_2 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 2, Value = entity.CP_2 });
                if (entity.CP_3 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 3, Value = entity.CP_3 });
                if (entity.CP_4 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 4, Value = entity.CP_4 });
                if (entity.CP_5 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 5, Value = entity.CP_5 });
                if (entity.CP_6 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 6, Value = entity.CP_6 });
                if (entity.CP_7 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 7, Value = entity.CP_7 });
                if (entity.CP_8 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 8, Value = entity.CP_8 });
                if (entity.CP_9 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 9, Value = entity.CP_9 });
                if (entity.CP_10 != null)
                    AddCOPValue(new EntityCopvalues { Euid = rEntity.Euid, Puid = 10, Value = entity.CP_10 });
                /* This part must be improved  END*/

                return rEntity;
            }
            return null;
        }
        private void AddCOPValue(EntityCopvalues value)
        {
            StaticFunctions.Request(
                "Farms/Properties/Entities/COPValues/",
                JsonConvert.SerializeObject(value),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
        }

        [HttpGet("[controller]/SubCategories/{CUID}")]
        public IEnumerable<Categories> GetSubCategories(int CUID)
        {
            var r = StaticFunctions.Request(
                "Farms/SubCategories/" + CUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var categories = JsonConvert.DeserializeObject<IEnumerable<Categories>>(r);
                return categories;
            }
            return null;
        }
        [HttpGet("[controller]/CategoryProperties/{CUID}")]
        public IEnumerable<CategoryOfProperties> GetCategoryProperties(int CUID)
        {
            var r = StaticFunctions.Request(
                "Farms/CategoryProperties/" + CUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var cProperties = JsonConvert.DeserializeObject<IEnumerable<CategoryOfProperties>>(r);
                return cProperties;
            }
            return null;
        }
        [HttpGet("[controller]/COPValues/{PUID}")]
        public IEnumerable<Copvalues> GetCOPValues(int PUID)
        {
            var r = StaticFunctions.Request(
                "Farms/COPValues/" + PUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var values = JsonConvert.DeserializeObject<IEnumerable<Copvalues>>(r);
                return values;
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
        [HttpGet("[controller]/IncomeAndExpeneses/{FUID}")]
        public IEnumerable<IncomeAndExpeneses> GetIncomeAndExpeneses(string FUID)
        {
            var r = StaticFunctions.Request(
                "Farms/IncomeAndExpenses/" + FUID,
                "",
                HttpMethod.Get,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var incomeAndExpeneses = JsonConvert.DeserializeObject<IEnumerable<IncomeAndExpeneses>>(r);
                return incomeAndExpeneses;
            }
            return null;
        }
        [HttpPost]
        public IncomeAndExpeneses AddIncome(IncomeAndExpeneses income)
        {
            var r = StaticFunctions.Request(
                "Farms/Incomes/",
                JsonConvert.SerializeObject(income),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var rIncome = JsonConvert.DeserializeObject<IncomeAndExpeneses>(r);
                return rIncome;
            }
            return null;
        }
        [HttpPost]
        public IncomeAndExpeneses AddExpense(IncomeAndExpeneses expense)
        {
            var r = StaticFunctions.Request(
                "Farms/Expenses/",
                JsonConvert.SerializeObject(expense),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var rExpense = JsonConvert.DeserializeObject<IncomeAndExpeneses>(r);
                return rExpense;
            }
            return null;
        }
    }
}
