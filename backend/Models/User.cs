using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastLogin { get; set; }
        public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
        public List<Stock> Watchlist { get; set; } = new List<Stock>();
    }
}