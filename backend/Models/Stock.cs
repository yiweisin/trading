using System;

namespace backend.Models
{
    public class Stock
    {
        public string Symbol { get; set; }
        public string CompanyName { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal DayChange { get; set; }
        public decimal PercentChange { get; set; }
        public long Volume { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}