using Microsoft.EntityFrameworkCore;
using backend.Models;
using System;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<TradeHistory> TradeHistories { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships
            modelBuilder.Entity<TradeHistory>()
                .HasOne(t => t.Stock)
                .WithMany()
                .HasForeignKey(t => t.StockId);
                
            modelBuilder.Entity<TradeHistory>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId);
            
            // Seed some initial data
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    Username = "demo", 
                    // Password: "password"
                    PasswordHash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" 
                }
            );
            
            // Seed some stocks
            modelBuilder.Entity<Stock>().HasData(
                new Stock { Id = 1, Symbol = "AAPL", Name = "Apple Inc.", Price = 187.41m, Description = "Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories." },
                new Stock { Id = 2, Symbol = "MSFT", Name = "Microsoft Corporation", Price = 403.78m, Description = "Technology company that develops, licenses, and supports software, services, devices, and solutions." },
                new Stock { Id = 3, Symbol = "AMZN", Name = "Amazon.com, Inc.", Price = 178.75m, Description = "Online retailer and web service provider." },
                new Stock { Id = 4, Symbol = "GOOGL", Name = "Alphabet Inc.", Price = 153.51m, Description = "Technology company that specializes in Internet-related services and products." },
                new Stock { Id = 5, Symbol = "META", Name = "Meta Platforms, Inc.", Price = 485.58m, Description = "Technology company that focuses on social media and technology." }
            );
            
            // Seed some trade history for demo user
            modelBuilder.Entity<TradeHistory>().HasData(
                new TradeHistory { 
                    Id = 1, 
                    StockId = 1, 
                    UserId = 1, 
                    EntryPrice = 150.25m, 
                    PNL = 37.16m, 
                    Date = DateTime.Now.AddDays(-30), 
                    IsHolding = true 
                },
                new TradeHistory { 
                    Id = 2, 
                    StockId = 2, 
                    UserId = 1, 
                    EntryPrice = 380.50m, 
                    PNL = 23.28m, 
                    Date = DateTime.Now.AddDays(-15), 
                    IsHolding = true 
                },
                new TradeHistory { 
                    Id = 3, 
                    StockId = 3, 
                    UserId = 1, 
                    EntryPrice = 185.30m, 
                    PNL = -6.55m, 
                    Date = DateTime.Now.AddDays(-10), 
                    IsHolding = false 
                }
            );
        }
    }
}
