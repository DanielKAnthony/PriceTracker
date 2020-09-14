using System.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriceTrackerApp.Models;
using PriceTrackerApp.ScraperUtils;
using PriceTrackerApp.MailUtils;

namespace PriceTrackerApp.Controllers
{
    [Route("dbc/[controller]")]
    [ApiController]
    public class DataController:ControllerBase
    {
        private readonly TrackerContext _context;

        public DataController(TrackerContext context)
        {
            _context = context;
        }

        [HttpPost("trendupdater/{authKey}")]
        public async Task<ActionResult> DbUpdate(string authKey)
        {
            if (authKey != MailConfig.SendPass) return NoContent();
            var Listings = _context.TrackLists.Where(e => e.UserId != 7).ToList();

            foreach (var item in Listings)
            {
                float price = 0f;
                try
                {
                    string[] info = await PriceScraper.FetchData(item.PageUrl);
                    price = float.Parse(info[1]);
                }
                catch
                {
                    RemoveItem("hi");
                    Console.WriteLine("Fail: " + item.Id);
                    continue;
                }

                var nodes = _context.ListTrends.Where(e => e.TrackListId == item.Id).ToList();

                bool isMax = false;
                nodes.ForEach(e => e.DaysAgo += 1);
                if (nodes.Count == 30) isMax = true;
                PriceRecord NewNode = new PriceRecord
                {
                    DaysAgo = 0,
                    Price = price,
                    ItemName = item.ItemName,
                    TrackListId = item.Id
                };
                _context.ListTrends.Add(NewNode);
                _context.SaveChanges();

                if (isMax) CapList(item.Id);
            }

            return Ok();
        }

        private void CapList(int itemId)
        {
            PriceRecord temp = _context.ListTrends.Where(e => e.TrackListId == itemId
            && e.DaysAgo == 30).ToList()[0];

            _context.Remove(temp);
            _context.SaveChanges();
        }

        public void RemoveItem(string temp)
        {
            temp = null;
            Console.WriteLine("ERROR HERE");

        }
    }
}
