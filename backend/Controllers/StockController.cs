using LoginApp.Models;
using LoginApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LoginApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StockController : ControllerBase
    {
        private readonly StockService _stockService;

        public StockController(StockService stockService)
        {
            _stockService = stockService;
        }

        [HttpGet]
        public IActionResult GetAllStocks()
        {
            var stocks = _stockService.GetAllStocks();
            return Ok(stocks);
        }

        [HttpGet("{symbol}")]
        public IActionResult GetStock(string symbol)
        {
            var stock = _stockService.GetStockDetails(symbol);
            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock);
        }
    }
}
