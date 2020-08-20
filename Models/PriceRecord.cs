using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AmazonTrackingApp.Models
{
    public class PriceRecord
    {
        public int Id { get; set; }
        public int DaysAgo { get; set; }
        public float Price { get; set; }
        public int AzTrackListId { get; set; }
        public AzTrackList AzTrackList { get; set; }
    }
}
