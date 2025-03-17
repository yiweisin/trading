namespace LoginApp.Models
{
    public class Stock
    {
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal CurrentPrice { get; set; }
        public string Industry { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class StockDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal CurrentPrice { get; set; }
    }
}