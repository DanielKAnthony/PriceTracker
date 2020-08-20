using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AmazonTrackingApp.Models
{
    public class AzTrackList
    {
        public int Id { get; set; }
        public string PageUrl { get; set; }
        public float MaxPrice { get; set; }
        public List<PriceRecord> PriceTrend { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
