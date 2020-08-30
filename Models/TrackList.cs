using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PriceTrackerApp.Models
{
    public class TrackList
    {
        public int Id { get; set; }
        public string PageUrl { get; set; }
        public float MaxPrice { get; set; }
        public float CurrentPrice { get; set; }
        public string Vendor { get; set; }
        public string ItemName { get; set; }
        public string ListedEmail { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
