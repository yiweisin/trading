using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfoliosController : ControllerBase
    {
        private readonly PortfolioService _portfolioService;
        private readonly UserService _userService;

        public PortfoliosController(PortfolioService portfolioService, UserService userService)
        {
            _portfolioService = portfolioService;
            _userService = userService;
        }

        // GET: api/Portfolios
        [HttpGet]
        public ActionResult<IEnumerable<Portfolio>> GetPortfolios()
        {
            return Ok(_portfolioService.GetAll());
        }

        // GET: api/Portfolios/5
        [HttpGet("{id}")]
        public ActionResult<Portfolio> GetPortfolio(Guid id)
        {
            var portfolio = _portfolioService.GetById(id);

            if (portfolio == null)
            {
                return NotFound();
            }

            return Ok(portfolio);
        }

        // GET: api/Portfolios/User/5
        [HttpGet("User/{userId}")]
        public ActionResult<IEnumerable<Portfolio>> GetUserPortfolios(Guid userId)
        {
            var user = _userService.GetById(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(_portfolioService.GetByUserId(userId));
        }

        // POST: api/Portfolios
        [HttpPost]
        public ActionResult<Portfolio> CreatePortfolio(Portfolio portfolio)
        {
            var user = _userService.GetById(portfolio.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var createdPortfolio = _portfolioService.Create(portfolio);
            
            if (createdPortfolio == null)
            {
                return BadRequest("Could not create portfolio");
            }

            return CreatedAtAction(nameof(GetPortfolio), new { id = createdPortfolio.Id }, createdPortfolio);
        }

        // PUT: api/Portfolios/5
        [HttpPut("{id}")]
        public IActionResult UpdatePortfolio(Guid id, Portfolio portfolio)
        {
            if (id != portfolio.Id)
            {
                return BadRequest();
            }

            var existingPortfolio = _portfolioService.GetById(id);
            if (existingPortfolio == null)
            {
                return NotFound();
            }

            // Don't allow changing the user ID
            portfolio.UserId = existingPortfolio.UserId;
            portfolio.User = existingPortfolio.User;

            // Preserve existing items
            portfolio.Items = existingPortfolio.Items;

            if (_portfolioService.Update(portfolio))
            {
                return NoContent();
            }

            return BadRequest();
        }

        // DELETE: api/Portfolios/5
        [HttpDelete("{id}")]
        public IActionResult DeletePortfolio(Guid id)
        {
            var portfolio = _portfolioService.GetById(id);
            if (portfolio == null)
            {
                return NotFound();
            }

            if (_portfolioService.Delete(id))
            {
                return NoContent();
            }

            return BadRequest();
        }

        // POST: api/Portfolios/5/Stocks
        [HttpPost("{portfolioId}/Stocks")]
        public ActionResult<PortfolioItem> AddStockToPortfolio(Guid portfolioId, PortfolioItem item)
        {
            var portfolio = _portfolioService.GetById(portfolioId);
            if (portfolio == null)
            {
                return NotFound("Portfolio not found");
            }

            var addedItem = _portfolioService.AddStockToPortfolio(portfolioId, item);
            if (addedItem == null)
            {
                return BadRequest("Failed to add stock to portfolio");
            }

            return CreatedAtAction(nameof(GetPortfolio), new { id = portfolioId }, addedItem);
        }

        // DELETE: api/Portfolios/5/Stocks/6
        [HttpDelete("{portfolioId}/Stocks/{itemId}")]
        public IActionResult RemoveStockFromPortfolio(Guid portfolioId, Guid itemId)
        {
            var portfolio = _portfolioService.GetById(portfolioId);
            if (portfolio == null)
            {
                return NotFound("Portfolio not found");
            }

            if (_portfolioService.RemoveStockFromPortfolio(portfolioId, itemId))
            {
                return NoContent();
            }

            return BadRequest("Failed to remove stock from portfolio");
        }

        // GET: api/Portfolios/5/Stocks
        [HttpGet("{portfolioId}/Stocks")]
        public ActionResult<IEnumerable<PortfolioItem>> GetPortfolioStocks(Guid portfolioId)
        {
            var portfolio = _portfolioService.GetById(portfolioId);
            if (portfolio == null)
            {
                return NotFound("Portfolio not found");
            }

            return Ok(_portfolioService.GetPortfolioItems(portfolioId));
        }
    }
}