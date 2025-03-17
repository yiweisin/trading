using LoginApp.Models;

namespace LoginApp.Data
{
    public class StockRepository
    {
        private readonly List<Stock> _stocks = new List<Stock>();

        public StockRepository()
        {
            // Initialize with some sample stocks
            _stocks.Add(new Stock
            {
                Symbol = "AAPL",
                Name = "Apple Inc.",
                CurrentPrice = 182.52m,
                Industry = "Technology",
                Description = "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."
            });

            _stocks.Add(new Stock
            {
                Symbol = "MSFT",
                Name = "Microsoft Corporation",
                CurrentPrice = 417.88m,
                Industry = "Technology",
                Description = "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide."
            });

            _stocks.Add(new Stock
            {
                Symbol = "GOOGL",
                Name = "Alphabet Inc.",
                CurrentPrice = 165.23m,
                Industry = "Technology",
                Description = "Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America."
            });

            _stocks.Add(new Stock
            {
                Symbol = "AMZN",
                Name = "Amazon.com, Inc.",
                CurrentPrice = 182.30m,
                Industry = "Retail",
                Description = "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally."
            });

            _stocks.Add(new Stock
            {
                Symbol = "TSLA",
                Name = "Tesla, Inc.",
                CurrentPrice = 176.75m,
                Industry = "Automotive",
                Description = "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems."
            });
        }

        public IEnumerable<Stock> GetAll()
        {
            return _stocks;
        }

        public Stock? GetBySymbol(string symbol)
        {
            return _stocks.FirstOrDefault(s => s.Symbol == symbol);
        }

        public void UpdatePrice(string symbol, decimal newPrice)
        {
            var stock = _stocks.FirstOrDefault(s => s.Symbol == symbol);
            if (stock != null)
            {
                stock.CurrentPrice = newPrice;
            }
        }
    }
}