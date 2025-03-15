using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StocksController : ControllerBase
    {
        private readonly StockService _stockService;

        public StocksController(StockService stockService)
        {
            _stockService = stockService;
        }

        // GET: api/Stocks
        [HttpGet]
        public ActionResult<IEnumerable<Stock>> GetStocks()
        {
            return Ok(_stockService.GetAll());
        }

        // GET: api/Stocks/AAPL
        [HttpGet("{symbol}")]
        public ActionResult<Stock> GetStock(string symbol)
        {
            var stock = _stockService.GetBySymbol(symbol);

            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock);
        }

        // GET: api/Stocks/top/5
        [HttpGet("top/{count}")]
        public ActionResult<IEnumerable<Stock>> GetTopStocks(int count)
        {
            return Ok(_stockService.GetTopPerformingStocks(count));
        }

        // POST: api/Stocks
        [HttpPost]
        public ActionResult<Stock> CreateStock(Stock stock)
        {
            if (_stockService.GetBySymbol(stock.Symbol) != null)
            {
                return BadRequest("Stock with this symbol already exists");
            }

            var createdStock = _stockService.Create(stock);
            
            if (createdStock == null)
            {
                return BadRequest("Could not create stock");
            }

            return CreatedAtAction(nameof(GetStock), new { symbol = createdStock.Symbol }, createdStock);
        }

        // PUT: api/Stocks/AAPL
        [HttpPut("{symbol}")]
        public IActionResult UpdateStock(string symbol, Stock stock)
        {
            if (symbol != stock.Symbol)
            {
                return BadRequest();
            }

            var existingStock = _stockService.GetBySymbol(symbol);
            if (existingStock == null)
            {
                return NotFound();
            }

            if (_stockService.Update(stock))
            {
                return NoContent();
            }

            return BadRequest();
        }

        // DELETE: api/Stocks/AAPL
        [HttpDelete("{symbol}")]
        public IActionResult DeleteStock(string symbol)
        {
            var stock = _stockService.GetBySymbol(symbol);
            if (stock == null)
            {
                return NotFound();
            }

            if (_stockService.Delete(symbol))
            {
                return NoContent();
            }

            return BadRequest();
        }
    }
}