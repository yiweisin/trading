using LoginApp.Models;

namespace LoginApp.Data
{
    public class TradeLogRepository
    {
        private readonly List<TradeLog> _tradeLogs = new List<TradeLog>();

        public TradeLogRepository()
        {
            // Initialize with some sample trades if needed
            // This is just for demo purposes - in a real app these would be stored in a database
        }

        public IEnumerable<TradeLog> GetAll()
        {
            return _tradeLogs;
        }

        public IEnumerable<TradeLog> GetByUsername(string username)
        {
            return _tradeLogs.Where(t => t.Username == username);
        }

        public TradeLog? GetById(Guid id)
        {
            return _tradeLogs.FirstOrDefault(t => t.Id == id);
        }

        public void Add(TradeLog trade)
        {
            trade.Id = Guid.NewGuid();
            trade.TradeDate = DateTime.UtcNow;
            trade.TotalAmount = trade.SharePrice * trade.Quantity;
            _tradeLogs.Add(trade);
        }

        public bool Remove(Guid id)
        {
            var trade = _tradeLogs.FirstOrDefault(t => t.Id == id);
            if (trade == null)
            {
                return false;
            }

            _tradeLogs.Remove(trade);
            return true;
        }
    }
}