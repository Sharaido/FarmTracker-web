using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using FarmTracker_services.Models.DB;
using FarmTracker_web.Models;
using FarmTracker_web.Models.DB;
using FarmTracker_web.Models.Members;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FarmTracker_web.Controllers
{
    public class MembersController : Controller
    {
        public readonly IHttpContextAccessor _httpContextAccessor;
        public readonly MCookies Cookies;
        public MembersController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            Cookies = new MCookies(_httpContextAccessor);
        }

        public IActionResult SignIn()
        {
            return View();
        }
        [HttpPost]
        public SignInResponse SignIn(SignInRequest signInRequest)
        {
            var body = JsonConvert.SerializeObject(signInRequest);
            var response = StaticFunctions.Request("Members/SignIn", body, HttpMethod.Get);
            SignInResponse signInResponse = JsonConvert.DeserializeObject<SignInResponse>(response);

            if (signInResponse.Result)
            {
                var user = StaticFunctions.Request(
                    "Members/GetUserFromSignInKey/" + signInRequest.SignInKey,
                    "",
                    HttpMethod.Get,
                    signInResponse.Token
                    );

                Users theUser = JsonConvert.DeserializeObject<Users>(user);
                SignIn(theUser, signInResponse);
                if (signInRequest.RememberMe)
                    AddUserToCookies(theUser, signInRequest, signInResponse);

                signInResponse.Token = "";
            }

            return signInResponse;
        }

        private void AddUserToCookies(Users user, SignInRequest signInRequest, SignInResponse signInResponse)
        {
            CookieUser cu = new CookieUser
            {
                u = user.Username
            };

            if (signInRequest.KeepMeSignIn)
            {
                var r = StaticFunctions.Request(
                        "Members/CreateSession/" + user.Uuid,
                        "",
                        HttpMethod.Post,
                        signInResponse.Token
                    );

                Sessions sessions = JsonConvert.DeserializeObject<Sessions>(r);
                cu.s = sessions.Suid;
                cu.ui = sessions.Uuid;
            }

            Cookies.User = cu;
        }

        private void SignIn(Users user, SignInResponse signInResponse)
        {
            var claims = new List<Claim>
            {
                new Claim("Username", user.Username),
                new Claim("Token", signInResponse.Token),
                new Claim("Expiration", signInResponse.Expiration.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Surname, user.Surname),
                new Claim(ClaimTypes.Role, user.Ruid.ToString()),
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                RedirectUri = signInResponse.RedirectAddress
            };

            HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);
        }

        [HttpPost]
        public void SignOut()
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            InactiveteSession();
            ClearCookieUserSession();
        }
        private void InactiveteSession()
        {
            Guid? SUID = Cookies.User.s;
            if (SUID != null)
            {
                var r = StaticFunctions.Request(
                    "Members/InactiveteSession/" + SUID.ToString(),
                    "",
                    HttpMethod.Post,
                    User.FindFirst(claim => claim.Type == "Token")?.Value
                );
            }
        }
        private void ClearCookieUserSession()
        {
            CookieUser u = Cookies.User;
            u.ui = null;
            u.s = null;
            Cookies.User = u;
        }
        public string GetAuthenticatedUser()
        {
            if (User.Identity.IsAuthenticated)
            {
                return GetAuthenticatedUserResponse();
            }
            else
            {
                if (Cookies.User.s != null && Cookies.User.ui != null)
                {
                    if (AuthenticateFromCookies())
                    {
                        return GetAuthenticatedUserResponse();
                    }
                }
            }
            return null;
        }
        private string GetAuthenticatedUserResponse()
        {
            return JsonConvert.SerializeObject(new
            {
                Username = User.FindFirst(claim => claim.Type == "Username")?.Value,
                UserRName = User.FindFirst(claim => claim.Type == ClaimTypes.Name)?.Value + " " + User.FindFirst(claim => claim.Type == ClaimTypes.Surname)?.Value,
            });
        }
        private bool AuthenticateFromCookies()
        {
            Guid? SUID = Cookies.User.s;
            Guid? UUID = Cookies.User.ui;

            var r = StaticFunctions.Request(
                        "Members/AuthenticateFromCookies",
                        JsonConvert.SerializeObject(new Sessions { Uuid = (Guid)UUID, Suid = (Guid)SUID, IsValid = false }),
                        HttpMethod.Get
                        );
            var signInResponse = JsonConvert.DeserializeObject<SignInResponse>(r);
            if (signInResponse.Result)
            {
                var r2 = StaticFunctions.Request(
                    "Members/GetUsers/" + UUID,
                    "",
                    HttpMethod.Get,
                    signInResponse.Token
                );
                var theUser = JsonConvert.DeserializeObject<Users>(r2);

                SignIn(theUser, signInResponse);
                return true;
            }
            else
            {
                ClearCookieUserSession();
                return false;
            }
        }
        public IActionResult SignUp()
        {
            return View();
        }
        [HttpPost]
        public SignUpResponse SignUp(SignUpRequest signUpRequest)
        {
            var r = StaticFunctions.Request(
                "Members/GetNewUCodeForSignUp",
                "",
                HttpMethod.Get
                );
            GeneratedUcodes uCode = JsonConvert.DeserializeObject<GeneratedUcodes>(r);
            if (uCode == null)
            {
                return new SignUpResponse { TooManyAttempts = true };
            }
            signUpRequest.GUC = uCode.Guc;

            var r2 = StaticFunctions.Request(
                "Members/SignUp",
                JsonConvert.SerializeObject(signUpRequest),
                HttpMethod.Post
                );

            return JsonConvert.DeserializeObject<SignUpResponse>(r2);
        }
        public bool IsUsedUsername(string Username)
        {
            var r = StaticFunctions.Request(
                "Members/IsUsedUsername/" + Username,
                "",
                HttpMethod.Get
                );

            return JsonConvert.DeserializeObject<bool>(r);
        }
        public bool IsUsedEmail(string Email)
        {
            var r = StaticFunctions.Request(
                "Members/IsUsedEmail/" + Email,
                "",
                HttpMethod.Get
                );

            return JsonConvert.DeserializeObject<bool>(r);
        }
    }
}
