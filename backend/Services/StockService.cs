using LoginApp.Data;
using LoginApp.Models;

namespace LoginApp.Services
{
    public class StockService
    {
        private readonly StockRepository _stockRepository;

        public StockService(StockRepository stockRepository)
        {
            _stockRepository = stockRepository;
        }

        public IEnumerable<StockDto> GetAllStocks()
        {
            return _stockRepository.GetAll().Select(s => new StockDto
            {
                Symbol = s.Symbol,
                Name = s.Name,
                CurrentPrice = s.CurrentPrice
            });
        }

        public StockDto? GetStockBySymbol(string symbol)
        {
            var stock = _stockRepository.GetBySymbol(symbol);
            if (stock == null) return null;

            return new StockDto
            {
                Symbol = stock.Symbol,
                Name = stock.Name,
                CurrentPrice = stock.CurrentPrice
            };
        }

        public Stock? GetStockDetails(string symbol)
        {
            return _stockRepository.GetBySymbol(symbol);
        }
    }
}