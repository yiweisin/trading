namespace LoginApp.Models
{
    public enum TradeType
    {
        Buy,
        Sell
    }

    public class TradeLog
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string StockSymbol { get; set; } = string.Empty;
        public TradeType Type { get; set; }
        public decimal SharePrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime TradeDate { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class TradeLogDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string StockSymbol { get; set; } = string.Empty;
        public string StockName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal SharePrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime TradeDate { get; set; }
    }

    public class CreateTradeRequest
    {
        public string StockSymbol { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Buy" or "Sell"
        public decimal SharePrice { get; set; }
        public int Quantity { get; set; }
        public string? Notes { get; set; }
    }

    public class TradeLogSummary
    {
        public string StockSymbol { get; set; } = string.Empty;
        public string StockName { get; set; } = string.Empty;
        public int TotalShares { get; set; }
        public decimal AverageBuyPrice { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal ProfitLoss { get; set; }
        public decimal ProfitLossPercentage { get; set; }
    }
}