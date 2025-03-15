using backend.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class PortfolioService
    {
        private readonly ConcurrentDictionary<Guid, Portfolio> _portfolios = new ConcurrentDictionary<Guid, Portfolio>();
        private readonly ConcurrentDictionary<Guid, PortfolioItem> _portfolioItems = new ConcurrentDictionary<Guid, PortfolioItem>();
        private readonly StockService _stockService;
        private readonly UserService _userService;

        public PortfolioService(StockService stockService, UserService userService)
        {
            _stockService = stockService;
            _userService = userService;

            // Create sample portfolios
            var user1 = _userService.GetById(Guid.Parse("00000000-0000-0000-0000-000000000001"));
            var user2 = _userService.GetById(Guid.Parse("00000000-0000-0000-0000-000000000002"));

            if (user1 != null && user2 != null)
            {
                var portfolio1 = new Portfolio
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000011"),
                    Name = "Tech Stocks",
                    UserId = user1.Id,
                    User = user1,
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    LastUpdated = DateTime.UtcNow
                };

                var portfolio2 = new Portfolio
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000012"),
                    Name = "Long Term Investments",
                    UserId = user1.Id,
                    User = user1,
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    LastUpdated = DateTime.UtcNow
                };

                var portfolio3 = new Portfolio
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000013"),
                    Name = "Growth Portfolio",
                    UserId = user2.Id,
                    User = user2,
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    LastUpdated = DateTime.UtcNow
                };

                _portfolios.TryAdd(portfolio1.Id, portfolio1);
                _portfolios.TryAdd(portfolio2.Id, portfolio2);
                _portfolios.TryAdd(portfolio3.Id, portfolio3);

                // Add some portfolio items
                var item1 = new PortfolioItem
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000021"),
                    PortfolioId = portfolio1.Id,
                    StockSymbol = "AAPL",
                    Stock = _stockService.GetBySymbol("AAPL"),
                    Quantity = 10,
                    PurchasePrice = 165.25m,
                    PurchaseDate = DateTime.UtcNow.AddDays(-15)
                };

                var item2 = new PortfolioItem
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000022"),
                    PortfolioId = portfolio1.Id,
                    StockSymbol = "MSFT",
                    Stock = _stockService.GetBySymbol("MSFT"),
                    Quantity = 5,
                    PurchasePrice = 315.50m,
                    PurchaseDate = DateTime.UtcNow.AddDays(-12)
                };

                var item3 = new PortfolioItem
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000023"),
                    PortfolioId = portfolio2.Id,
                    StockSymbol = "AMZN",
                    Stock = _stockService.GetBySymbol("AMZN"),
                    Quantity = 8,
                    PurchasePrice = 150.10m,
                    PurchaseDate = DateTime.UtcNow.AddDays(-8)
                };

                var item4 = new PortfolioItem
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000024"),
                    PortfolioId = portfolio3.Id,
                    StockSymbol = "TSLA",
                    Stock = _stockService.GetBySymbol("TSLA"),
                    Quantity = 15,
                    PurchasePrice = 172.80m,
                    PurchaseDate = DateTime.UtcNow.AddDays(-3)
                };

                _portfolioItems.TryAdd(item1.Id, item1);
                _portfolioItems.TryAdd(item2.Id, item2);
                _portfolioItems.TryAdd(item3.Id, item3);
                _portfolioItems.TryAdd(item4.Id, item4);

                // Add items to respective portfolios
                portfolio1.Items.Add(item1);
                portfolio1.Items.Add(item2);
                portfolio2.Items.Add(item3);
                portfolio3.Items.Add(item4);

                // Add portfolios to users
                user1.Portfolios.Add(portfolio1);
                user1.Portfolios.Add(portfolio2);
                user2.Portfolios.Add(portfolio3);
            }
        }

        public IEnumerable<Portfolio> GetAll()
        {
            return _portfolios.Values;
        }

        public Portfolio? GetById(Guid id)
        {
            if (_portfolios.TryGetValue(id, out var portfolio))
            {
                return portfolio;
            }
            return null;
        }

        public IEnumerable<Portfolio> GetByUserId(Guid userId)
        {
            return _portfolios.Values.Where(p => p.UserId == userId);
        }

        public Portfolio? Create(Portfolio portfolio)
        {
            portfolio.Id = portfolio.Id == Guid.Empty ? Guid.NewGuid() : portfolio.Id;
            portfolio.CreatedAt = DateTime.UtcNow;
            portfolio.LastUpdated = DateTime.UtcNow;
            
            if (portfolio.Items == null)
            {
                portfolio.Items = new List<PortfolioItem>();
            }

            // Get and set the user
            var user = _userService.GetById(portfolio.UserId);
            if (user != null)
            {
                portfolio.User = user;
                
                if (_portfolios.TryAdd(portfolio.Id, portfolio))
                {
                    // Add portfolio to user's portfolios
                    user.Portfolios.Add(portfolio);
                    _userService.Update(user);
                    
                    return portfolio;
                }
            }
            
            return null;
        }

        public bool Update(Portfolio portfolio)
        {
            portfolio.LastUpdated = DateTime.UtcNow;
            return _portfolios.TryUpdate(portfolio.Id, portfolio, GetById(portfolio.Id));
        }

        public bool Delete(Guid id)
        {
            if (_portfolios.TryRemove(id, out var portfolio))
            {
                // Remove portfolio from user's portfolios
                var user = _userService.GetById(portfolio.UserId);
                if (user != null)
                {
                    user.Portfolios.Remove(portfolio);
                    _userService.Update(user);
                }
                
                // Remove all portfolio items
                foreach (var item in portfolio.Items.ToList())
                {
                    _portfolioItems.TryRemove(item.Id, out _);
                }
                
                return true;
            }
            
            return false;
        }

        public PortfolioItem? AddStockToPortfolio(Guid portfolioId, PortfolioItem item)
        {
            var portfolio = GetById(portfolioId);
            var stock = _stockService.GetBySymbol(item.StockSymbol);
            
            if (portfolio != null && stock != null)
            {
                item.Id = item.Id == Guid.Empty ? Guid.NewGuid() : item.Id;
                item.PortfolioId = portfolioId;
                item.Stock = stock;
                item.PurchaseDate = DateTime.UtcNow;
                
                if (_portfolioItems.TryAdd(item.Id, item))
                {
                    // Add item to portfolio
                    portfolio.Items.Add(item);
                    portfolio.LastUpdated = DateTime.UtcNow;
                    Update(portfolio);
                    
                    return item;
                }
            }
            
            return null;
        }

        public bool RemoveStockFromPortfolio(Guid portfolioId, Guid itemId)
        {
            var portfolio = GetById(portfolioId);
            
            if (portfolio != null && _portfolioItems.TryGetValue(itemId, out var item) && item.PortfolioId == portfolioId)
            {
                if (_portfolioItems.TryRemove(itemId, out _))
                {
                    // Remove item from portfolio
                    var itemToRemove = portfolio.Items.FirstOrDefault(i => i.Id == itemId);
                    if (itemToRemove != null)
                    {
                        portfolio.Items.Remove(itemToRemove);
                        portfolio.LastUpdated = DateTime.UtcNow;
                        Update(portfolio);
                    }
                    
                    return true;
                }
            }
            
            return false;
        }

        public PortfolioItem? GetPortfolioItem(Guid itemId)
        {
            if (_portfolioItems.TryGetValue(itemId, out var item))
            {
                return item;
            }
            return null;
        }

        public IEnumerable<PortfolioItem> GetPortfolioItems(Guid portfolioId)
        {
            return _portfolioItems.Values.Where(i => i.PortfolioId == portfolioId);
        }
    }
}