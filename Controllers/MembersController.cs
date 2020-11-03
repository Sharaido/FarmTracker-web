using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FarmTracker_web.Models;
using Microsoft.AspNetCore.Mvc;

namespace FarmTracker_web.Controllers
{
    public class MembersController : Controller
    {
        public IActionResult SignIn()
        {
            return View();
        }
        [HttpPost]
        public string SignIn(SignInRequest request)
        {
            return "";
        }
        public IActionResult SignUp()
        {
            return View();
        }
    }
}
