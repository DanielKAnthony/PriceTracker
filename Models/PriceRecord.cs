using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PriceTrackerApp.Models
{
    public class PriceRecord
    {
        public int Id { get; set; }
        public int DaysAgo { get; set; }
        public float Price { get; set; }
        public int TrackListId { get; set; }
        public TrackList TrackList { get; set; }
    }
}
