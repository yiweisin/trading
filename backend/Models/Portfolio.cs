using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Portfolio
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public List<PortfolioItem> Items { get; set; } = new List<PortfolioItem>();
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class PortfolioItem
    {
        public Guid Id { get; set; }
        public Guid PortfolioId { get; set; }
        public required string StockSymbol { get; set; }
        public Stock? Stock { get; set; }
        public int Quantity { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
    }
}