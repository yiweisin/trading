using backend.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class StockService
    {
        private readonly ConcurrentDictionary<string, Stock> _stocks = new ConcurrentDictionary<string, Stock>();

        public StockService()
        {
            // Add sample stocks
            var stocks = new List<Stock>
            {
                new Stock
                {
                    Symbol = "AAPL",
                    CompanyName = "Apple Inc.",
                    CurrentPrice = 173.50m,
                    DayChange = 2.30m,
                    PercentChange = 1.34m,
                    Volume = 55000000,
                    LastUpdated = DateTime.UtcNow
                },
                new Stock
                {
                    Symbol = "MSFT",
                    CompanyName = "Microsoft Corporation",
                    CurrentPrice = 328.15m,
                    DayChange = 4.50m,
                    PercentChange = 1.39m,
                    Volume = 25000000,
                    LastUpdated = DateTime.UtcNow
                },
                new Stock
                {
                    Symbol = "GOOG",
                    CompanyName = "Alphabet Inc.",
                    CurrentPrice = 135.73m,
                    DayChange = 1.20m,
                    PercentChange = 0.89m,
                    Volume = 18000000,
                    LastUpdated = DateTime.UtcNow
                },
                new Stock
                {
                    Symbol = "AMZN",
                    CompanyName = "Amazon.com Inc.",
                    CurrentPrice = 156.42m,
                    DayChange = -0.78m,
                    PercentChange = -0.50m,
                    Volume = 32000000,
                    LastUpdated = DateTime.UtcNow
                },
                new Stock
                {
                    Symbol = "TSLA",
                    CompanyName = "Tesla, Inc.",
                    CurrentPrice = 185.20m,
                    DayChange = 5.60m,
                    PercentChange = 3.12m,
                    Volume = 95000000,
                    LastUpdated = DateTime.UtcNow
                }
            };

            foreach (var stock in stocks)
            {
                _stocks.TryAdd(stock.Symbol, stock);
            }
        }

        public IEnumerable<Stock> GetAll()
        {
            return _stocks.Values;
        }

        public Stock? GetBySymbol(string symbol)
        {
            if (_stocks.TryGetValue(symbol, out var stock))
            {
                return stock;
            }
            return null;
        }

        public IEnumerable<Stock> GetBySymbols(IEnumerable<string> symbols)
        {
            return _stocks.Values.Where(s => symbols.Contains(s.Symbol));
        }

        public Stock? Create(Stock stock)
        {
            stock.LastUpdated = DateTime.UtcNow;
            
            if (_stocks.TryAdd(stock.Symbol, stock))
            {
                return stock;
            }
            
            return null;
        }

        public bool Update(Stock stock)
        {
            stock.LastUpdated = DateTime.UtcNow;
            return _stocks.TryUpdate(stock.Symbol, stock, GetBySymbol(stock.Symbol));
        }

        public bool Delete(string symbol)
        {
            return _stocks.TryRemove(symbol, out _);
        }

        public IEnumerable<Stock> GetTopPerformingStocks(int count)
        {
            return _stocks.Values
                .OrderByDescending(s => s.PercentChange)
                .Take(count);
        }
    }
}