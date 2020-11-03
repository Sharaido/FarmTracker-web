using System;
using System.ComponentModel.DataAnnotations;

namespace FarmTracker_web.Models.Members
{
    public class SignUpRequest
    {
        [Required]
        [MaxLength(50)]
        [MinLength(3)]
        public string Username { get; set; }
        [Required]
        [MaxLength(255)]
        [MinLength(6)]
        public string Password { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }
        [Required]
        [MaxLength(50)]
        [MinLength(2)]
        public string Name { get; set; }
        [Required]
        [MaxLength(50)]
        [MinLength(2)]
        public string Surname { get; set; }
        [Required]
        public Guid GUC { get; set; }
    }
}
