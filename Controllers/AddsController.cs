using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FarmTracker_web.Models.Adds;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        [HttpGet]
        [Authorize]
        public IActionResult PostAdd()
        {
            return View();
        }
        [HttpPost("[controller]")]
        [Authorize]
        public IActionResult InsertAdd(Adds add)
        {
            var r = StaticFunctions.Request(
                "Adds/",
                JsonConvert.SerializeObject(add),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            if (r != null)
            {
                var _add = JsonConvert.DeserializeObject<Adds>(r);
                /* This part must be improved */
                if (add.CP_1 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 1, Value = add.CP_1 });
                if (add.CP_2 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 2, Value = add.CP_2 });
                if (add.CP_3 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 3, Value = add.CP_3 });
                if (add.CP_4 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 4, Value = add.CP_4 });
                if (add.CP_5 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 5, Value = add.CP_5 });
                if (add.CP_6 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 6, Value = add.CP_6 });
                if (add.CP_7 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 7, Value = add.CP_7 });
                if (add.CP_8 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 8, Value = add.CP_8 });
                if (add.CP_9 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 9, Value = add.CP_9 });
                if (add.CP_10 != null)
                    InsertAddCOPValue(new AddCopvalues { Auid = _add.Auid, Puid = 10, Value = add.CP_10 });



                if (add.Picture_1 != null)
                {
                    var picFileName = UploadFile(add.Picture_1);
                    InsertPicture(new Pictures { Auid = _add.Auid, Address = picFileName }); 
                }
                if (add.Picture_2 != null)
                {
                    var picFileName = UploadFile(add.Picture_2);
                    InsertPicture(new Pictures { Auid = _add.Auid, Address = picFileName });
                }
                if (add.Picture_3 != null)
                {
                    var picFileName = UploadFile(add.Picture_3);
                    InsertPicture(new Pictures { Auid = _add.Auid, Address = picFileName });
                }



                /* This part must be improved  END*/

                return RedirectToAction("Index", "Home");
            }
            return RedirectToAction("Error", "Home");
        }
        private void InsertAddCOPValue(AddCopvalues value)
        {
            StaticFunctions.Request(
                "Adds/COPValues/",
                JsonConvert.SerializeObject(value),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
        }
        private void InsertPicture(Pictures picture)
        {
            StaticFunctions.Request(
                "Adds/Pictures/",
                JsonConvert.SerializeObject(picture),
                HttpMethod.Post,
                User.FindFirst(claim => claim.Type == "Token")?.Value
                );
        }
        private string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);
            return Path.GetFileNameWithoutExtension(fileName)
                      + "_"
                      + Guid.NewGuid().ToString().Substring(0, 4)
                      + Path.GetExtension(fileName);
        }
        private string UploadFile(IFormFile file)
        {
            var uniqueFileName = GetUniqueFileName(file.FileName);
            //var uploads = Path.Combine("uploads");
            var filePath = Path.Combine(@"wwwroot\Content\farmTracker\img", uniqueFileName);
            file.CopyTo(new FileStream(filePath, FileMode.Create));

            return uniqueFileName;
        }
    }
}
