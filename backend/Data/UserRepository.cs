using LoginApp.Models;

namespace LoginApp.Data
{
    public class UserRepository
    {
        private readonly List<User> _users = new List<User>();

        public UserRepository()
        {
            // Add a default user for testing
            _users.Add(new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123")
            });
        }

        public User? GetByUsername(string username)
        {
            return _users.FirstOrDefault(u => u.Username == username);
        }

        public void Add(User user)
        {
            user.Id = Guid.NewGuid();
            _users.Add(user);
        }

        public IEnumerable<User> GetAll()
        {
            return _users;
        }
    }
}