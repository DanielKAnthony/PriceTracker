using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace AmazonTrackingApp.Models
{
    public class TrackerContext : DbContext
    {
        public TrackerContext(DbContextOptions<TrackerContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<AzTrackList> TrackLists { get; set; }
        public DbSet<PriceRecord> ListTrends { get; set; }
    }
}
