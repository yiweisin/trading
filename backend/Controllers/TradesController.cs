using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TradesController : ControllerBase
    {
        private readonly AppDbContext _context;
        
        public TradesController(AppDbContext context)
        {
            _context = context;
        }
        
        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
        
        [HttpGet]
        public ActionResult<IEnumerable<TradeHistoryDto>> GetTrades()
        {
            var userId = GetUserId();
            var trades = _context.TradeHistories
                .Include(t => t.Stock)
                .Where(t => t.UserId == userId)
                .Select(t => new TradeHistoryDto
                {
                    Id = t.Id,
                    StockId = t.StockId,
                    StockSymbol = t.Stock.Symbol,
                    StockName = t.Stock.Name,
                    EntryPrice = t.EntryPrice,
                    PNL = t.PNL,
                    Date = t.Date,
                    IsHolding = t.IsHolding
                })
                .OrderByDescending(t => t.Date)
                .ToList();
                
            return trades;
        }
        
        [HttpGet("{id}")]
        public ActionResult<TradeHistoryDto> GetTrade(int id)
        {
            var userId = GetUserId();
            var trade = _context.TradeHistories
                .Include(t => t.Stock)
                .Where(t => t.Id == id && t.UserId == userId)
                .Select(t => new TradeHistoryDto
                {
                    Id = t.Id,
                    StockId = t.StockId,
                    StockSymbol = t.Stock.Symbol,
                    StockName = t.Stock.Name,
                    EntryPrice = t.EntryPrice,
                    PNL = t.PNL,
                    Date = t.Date,
                    IsHolding = t.IsHolding
                })
                .FirstOrDefault();
                
            if (trade == null)
            {
                return NotFound();
            }
            
            return trade;
        }
        
        [HttpPost]
        public ActionResult<TradeHistoryDto> CreateTrade(CreateTradeDto tradeDto)
        {
            var userId = GetUserId();
            
            // Verify the stock exists
            var stock = _context.Stocks.Find(tradeDto.StockId);
            if (stock == null)
            {
                return BadRequest("Invalid stock ID");
            }
            
            var trade = new TradeHistory
            {
                StockId = tradeDto.StockId,
                UserId = userId,
                EntryPrice = tradeDto.EntryPrice,
                PNL = 0, // Initial PNL is 0
                Date = DateTime.UtcNow,
                IsHolding = tradeDto.IsHolding
            };
            
            _context.TradeHistories.Add(trade);
            _context.SaveChanges();
            
            // Load the stock for the response
            _context.Entry(trade).Reference(t => t.Stock).Load();
            
            var response = new TradeHistoryDto
            {
                Id = trade.Id,
                StockId = trade.StockId,
                StockSymbol = trade.Stock.Symbol,
                StockName = trade.Stock.Name,
                EntryPrice = trade.EntryPrice,
                PNL = trade.PNL,
                Date = trade.Date,
                IsHolding = trade.IsHolding
            };
            
            return CreatedAtAction(nameof(GetTrade), new { id = trade.Id }, response);
        }
        
        [HttpPut("{id}")]
        public IActionResult UpdateTrade(int id, UpdateTradeDto tradeDto)
        {
            var userId = GetUserId();
            var trade = _context.TradeHistories.FirstOrDefault(t => t.Id == id && t.UserId == userId);
            
            if (trade == null)
            {
                return NotFound();
            }
            
            trade.PNL = tradeDto.PNL;
            trade.IsHolding = tradeDto.IsHolding;
            
            _context.Entry(trade).State = EntityState.Modified;
            _context.SaveChanges();
            
            return NoContent();
        }
        
        [HttpDelete("{id}")]
        public IActionResult DeleteTrade(int id)
        {
            var userId = GetUserId();
            var trade = _context.TradeHistories.FirstOrDefault(t => t.Id == id && t.UserId == userId);
            
            if (trade == null)
            {
                return NotFound();
            }
            
            _context.TradeHistories.Remove(trade);
            _context.SaveChanges();
            
            return NoContent();
        }
    }
}