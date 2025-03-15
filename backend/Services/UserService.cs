using backend.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class UserService
    {
        private readonly ConcurrentDictionary<Guid, User> _users = new ConcurrentDictionary<Guid, User>();

        public UserService()
        {
            // Add some sample users
            var user1 = new User
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Username = "johndoe",
                Email = "john@example.com",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                LastLogin = DateTime.UtcNow
            };

            var user2 = new User
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Username = "janedoe",
                Email = "jane@example.com",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                LastLogin = DateTime.UtcNow
            };

            _users.TryAdd(user1.Id, user1);
            _users.TryAdd(user2.Id, user2);
        }

        public IEnumerable<User> GetAll()
        {
            return _users.Values;
        }

        public User? GetById(Guid id)
        {
            if (_users.TryGetValue(id, out var user))
            {
                return user;
            }
            return null;
        }

        public User? GetByUsername(string username)
        {
            return _users.Values.FirstOrDefault(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        }

        public User? GetByEmail(string email)
        {
            return _users.Values.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }

        public User? Create(User user)
        {
            user.Id = user.Id == Guid.Empty ? Guid.NewGuid() : user.Id;
            user.CreatedAt = DateTime.UtcNow;
            user.LastLogin = DateTime.UtcNow;
            
            if (user.Portfolios == null)
            {
                user.Portfolios = new List<Portfolio>();
            }
            
            if (user.Watchlist == null)
            {
                user.Watchlist = new List<Stock>();
            }

            if (_users.TryAdd(user.Id, user))
            {
                return user;
            }

            return null;
        }

        public bool Update(User user)
        {
            return _users.TryUpdate(user.Id, user, GetById(user.Id));
        }

        public bool Delete(Guid id)
        {
            return _users.TryRemove(id, out _);
        }

        public bool UsernameExists(string username)
        {
            return _users.Values.Any(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        }

        public bool EmailExists(string email)
        {
            return _users.Values.Any(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }
    }
}