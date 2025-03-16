using LoginApp.Data;
using LoginApp.Models;

namespace LoginApp.Services
{
    public class UserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public IEnumerable<UserDto> GetAllUsers()
        {
            return _userRepository.GetAll().Select(u => new UserDto { Username = u.Username });
        }

        public UserDto? GetUserByUsername(string username)
        {
            var user = _userRepository.GetByUsername(username);
            return user == null ? null : new UserDto { Username = user.Username };
        }

        public bool RegisterUser(RegisterRequest request)
        {
            if (_userRepository.GetByUsername(request.Username) != null)
            {
                return false;
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            
            var user = new User
            {
                Username = request.Username,
                PasswordHash = passwordHash
            };

            _userRepository.Add(user);
            return true;
        }
    }
}
