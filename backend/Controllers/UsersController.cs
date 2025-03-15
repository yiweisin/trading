using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // GET: api/Users
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers()
        {
            return Ok(_userService.GetAll());
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public ActionResult<User> GetUser(Guid id)
        {
            var user = _userService.GetById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // POST: api/Users
        [HttpPost]
        public ActionResult<User> CreateUser(User user)
        {
            if (_userService.UsernameExists(user.Username))
            {
                return BadRequest("Username already exists");
            }

            if (_userService.EmailExists(user.Email))
            {
                return BadRequest("Email already exists");
            }

            var createdUser = _userService.Create(user);
            
            if (createdUser == null)
            {
                return BadRequest("Could not create user");
            }

            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public IActionResult UpdateUser(Guid id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            var existingUser = _userService.GetById(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Check if the username or email is being changed and if it already exists
            if (existingUser.Username != user.Username && _userService.UsernameExists(user.Username))
            {
                return BadRequest("Username already exists");
            }

            if (existingUser.Email != user.Email && _userService.EmailExists(user.Email))
            {
                return BadRequest("Email already exists");
            }

            if (_userService.Update(user))
            {
                return NoContent();
            }

            return BadRequest();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(Guid id)
        {
            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }

            if (_userService.Delete(id))
            {
                return NoContent();
            }

            return BadRequest();
        }
    }
}