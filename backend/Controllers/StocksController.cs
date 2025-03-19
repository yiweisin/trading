using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using backend.Data;
using backend.DTOs;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StocksController : ControllerBase
    {
        private readonly AppDbContext _context;
        
        public StocksController(AppDbContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public ActionResult<IEnumerable<StockDto>> GetStocks()
        {
            var stocks = _context.Stocks
                .Select(s => new StockDto
                {
                    Id = s.Id,
                    Symbol = s.Symbol,
                    Name = s.Name,
                    Price = s.Price,
                    Description = s.Description
                })
                .ToList();
                
            return stocks;
        }
        
        [HttpGet("{id}")]
        public ActionResult<StockDto> GetStock(int id)
        {
            var stock = _context.Stocks
                .Where(s => s.Id == id)
                .Select(s => new StockDto
                {
                    Id = s.Id,
                    Symbol = s.Symbol,
                    Name = s.Name,
                    Price = s.Price,
                    Description = s.Description
                })
                .FirstOrDefault();
                
            if (stock == null)
            {
                return NotFound();
            }
            
            return stock;
        }
    }
}