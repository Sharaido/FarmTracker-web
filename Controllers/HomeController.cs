using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using FarmTracker_web.Models;
using Microsoft.AspNetCore.Http;

namespace FarmTracker_web.Controllers
{
    public class HomeController : Controller
    {
        public readonly IHttpContextAccessor _httpContextAccessor;
        public readonly SessionModel Sessions;
        public HomeController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            Sessions = new SessionModel(_httpContextAccessor.HttpContext.Session);
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
