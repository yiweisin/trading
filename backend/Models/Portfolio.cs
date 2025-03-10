using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Portfolio
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid UserId { get; set; }
        public List<PortfolioItem> Items { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class PortfolioItem
    {
        public Guid Id { get; set; }
        public string StockSymbol { get; set; }
        public int Quantity { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
    }
}