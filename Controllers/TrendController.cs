using System.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriceTrackerApp.Models;
using Newtonsoft.Json;

namespace PriceTrackerApp.Controllers
{
    [Route("stats/[controller]")]
    [ApiController]
    public class TrendController:ControllerBase
    {
        private readonly TrackerContext _context;

        public TrendController(TrackerContext context)
        {
            _context = context;
        }

        [HttpGet("uitem-stats")]
        public async Task<ActionResult<string>> GetUserItemTrends(
            [FromQuery] string email)
        {
            var uItems = await _context.TrackLists.Where(e => e.ListedEmail == email).ToListAsync();

            if (uItems.Count == 0) return NotFound();

            List<int> trendIds = new List<int>();
            foreach(TrackList t in uItems)
            {
                if (!trendIds.Contains(t.Id)) trendIds.Add(t.Id);
            }

            Dictionary<int, List<PriceRecord>> uRecs =
                new Dictionary<int, List<PriceRecord>>();

            for(int i = 0; i < trendIds.Count; ++i)
            {
                if (!uRecs.ContainsKey(trendIds[i]))
                {
                    uRecs[trendIds[i]] = _context.ListTrends
                        .Where(e => e.TrackListId == trendIds[i]).ToList();
                }
            }

            return JsonConvert.SerializeObject(uRecs, Formatting.Indented);
        }
    }
}
