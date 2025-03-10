using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastLogin { get; set; }
        public List<Portfolio> Portfolios { get; set; }
        public List<Alert> Alerts { get; set; }
    }
}