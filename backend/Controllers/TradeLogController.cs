using LoginApp.Models;
using LoginApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LoginApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TradeLogController : ControllerBase
    {
        private readonly TradeLogService _tradeLogService;

        public TradeLogController(TradeLogService tradeLogService)
        {
            _tradeLogService = tradeLogService;
        }

        [HttpGet]
        public IActionResult GetUserTrades()
        {
            var username = User.FindFirst("unique_name")?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var trades = _tradeLogService.GetUserTrades(username);
            return Ok(trades);
        }

        [HttpGet("portfolio")]
        public IActionResult GetPortfolioSummary()
        {
            var username = User.FindFirst("unique_name")?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var summary = _tradeLogService.GetPortfolioSummary(username);
            return Ok(summary);
        }

        [HttpGet("{id}")]
        public IActionResult GetTrade(Guid id)
        {
            var username = User.FindFirst("unique_name")?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var trade = _tradeLogService.GetTrade(id, username);
            if (trade == null)
            {
                return NotFound();
            }

            return Ok(trade);
        }

        [HttpPost]
        public IActionResult CreateTrade([FromBody] CreateTradeRequest request)
        {
            var username = User.FindFirst("unique_name")?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            if (request.Quantity <= 0)
            {
                return BadRequest(new { message = "Quantity must be positive" });
            }

            if (request.SharePrice <= 0)
            {
                return BadRequest(new { message = "Share price must be positive" });
            }

            var trade = _tradeLogService.CreateTrade(request, username);
            if (trade == null)
            {
                return BadRequest(new { message = "Invalid trade data" });
            }

            return CreatedAtAction(nameof(GetTrade), new { id = trade.Id }, trade);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTrade(Guid id)
        {
            var username = User.FindFirst("unique_name")?.Value;
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized();
            }

            var result = _tradeLogService.DeleteTrade(id, username);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}