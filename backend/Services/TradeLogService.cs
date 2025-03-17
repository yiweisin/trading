using LoginApp.Data;
using LoginApp.Models;

namespace LoginApp.Services
{
    public class TradeLogService
    {
        private readonly TradeLogRepository _tradeLogRepository;
        private readonly StockRepository _stockRepository;

        public TradeLogService(TradeLogRepository tradeLogRepository, StockRepository stockRepository)
        {
            _tradeLogRepository = tradeLogRepository;
            _stockRepository = stockRepository;
        }

        public IEnumerable<TradeLogDto> GetUserTrades(string username)
        {
            var trades = _tradeLogRepository.GetByUsername(username);
            
            return trades.Select(t => new TradeLogDto
            {
                Id = t.Id,
                Username = t.Username,
                StockSymbol = t.StockSymbol,
                StockName = _stockRepository.GetBySymbol(t.StockSymbol)?.Name ?? string.Empty,
                Type = t.Type.ToString(),
                SharePrice = t.SharePrice,
                Quantity = t.Quantity,
                TotalAmount = t.TotalAmount,
                TradeDate = t.TradeDate
            }).OrderByDescending(t => t.TradeDate);
        }

        public TradeLogDto? GetTrade(Guid id, string username)
        {
            var trade = _tradeLogRepository.GetById(id);
            
            if (trade == null || trade.Username != username)
            {
                return null;
            }

            return new TradeLogDto
            {
                Id = trade.Id,
                Username = trade.Username,
                StockSymbol = trade.StockSymbol,
                StockName = _stockRepository.GetBySymbol(trade.StockSymbol)?.Name ?? string.Empty,
                Type = trade.Type.ToString(),
                SharePrice = trade.SharePrice,
                Quantity = trade.Quantity,
                TotalAmount = trade.TotalAmount,
                TradeDate = trade.TradeDate
            };
        }

        public IEnumerable<TradeLogSummary> GetPortfolioSummary(string username)
        {
            var trades = _tradeLogRepository.GetByUsername(username);
            
            return trades
                .GroupBy(t => t.StockSymbol)
                .Select(group => 
                {
                    var stockSymbol = group.Key;
                    var stock = _stockRepository.GetBySymbol(stockSymbol);
                    
                    var buyTrades = group.Where(t => t.Type == TradeType.Buy).ToList();
                    var sellTrades = group.Where(t => t.Type == TradeType.Sell).ToList();

                    // Calculate total shares (buys minus sells)
                    var boughtShares = buyTrades.Sum(t => t.Quantity);
                    var soldShares = sellTrades.Sum(t => t.Quantity);
                    var totalShares = boughtShares - soldShares;

                    // Calculate average buy price
                    decimal totalCost = buyTrades.Sum(t => t.SharePrice * t.Quantity);
                    var avgBuyPrice = boughtShares > 0 ? totalCost / boughtShares : 0;
                    
                    // Calculate current value and profit/loss
                    var currentPrice = stock?.CurrentPrice ?? 0;
                    var currentValue = totalShares * currentPrice;
                    var profitLoss = currentValue - (totalShares * avgBuyPrice);
                    var profitLossPercentage = avgBuyPrice > 0 ? (profitLoss / (totalShares * avgBuyPrice)) * 100 : 0;

                    return new TradeLogSummary
                    {
                        StockSymbol = stockSymbol,
                        StockName = stock?.Name ?? string.Empty,
                        TotalShares = totalShares,
                        AverageBuyPrice = Math.Round(avgBuyPrice, 2),
                        CurrentValue = Math.Round(currentValue, 2),
                        ProfitLoss = Math.Round(profitLoss, 2),
                        ProfitLossPercentage = Math.Round(profitLossPercentage, 2)
                    };
                })
                .Where(s => s.TotalShares > 0) // Only include positions with shares
                .ToList();
        }

        public TradeLogDto? CreateTrade(CreateTradeRequest request, string username)
        {
            // Validate the stock exists
            var stock = _stockRepository.GetBySymbol(request.StockSymbol);
            if (stock == null)
            {
                return null;
            }

            // Validate trade type
            if (!Enum.TryParse<TradeType>(request.Type, true, out var tradeType))
            {
                return null;
            }

            // Create the trade
            var trade = new TradeLog
            {
                Username = username,
                StockSymbol = request.StockSymbol,
                Type = tradeType,
                SharePrice = request.SharePrice,
                Quantity = request.Quantity,
                Notes = request.Notes ?? string.Empty
            };

            _tradeLogRepository.Add(trade);

            // Return DTO
            return new TradeLogDto
            {
                Id = trade.Id,
                Username = trade.Username,
                StockSymbol = trade.StockSymbol,
                StockName = stock.Name,
                Type = trade.Type.ToString(),
                SharePrice = trade.SharePrice,
                Quantity = trade.Quantity,
                TotalAmount = trade.TotalAmount,
                TradeDate = trade.TradeDate
            };
        }

        public bool DeleteTrade(Guid id, string username)
        {
            var trade = _tradeLogRepository.GetById(id);
            
            if (trade == null || trade.Username != username)
            {
                return false;
            }

            return _tradeLogRepository.Remove(id);
        }
    }
}