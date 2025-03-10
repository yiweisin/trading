using System;

namespace backend.Models
{
    public class Alert
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string StockSymbol { get; set; }
        public AlertType Type { get; set; }
        public decimal Threshold { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? TriggeredAt { get; set; }
    }

    public enum AlertType
    {
        PriceAbove,
        PriceBelow,
        PercentageChange
    }
}