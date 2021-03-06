﻿using System.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriceTrackerApp.Models;
using PriceTrackerApp.ScraperUtils;

namespace PriceTrackerApp.Controllers
{
    [Route("lists/[controller]")]
    [ApiController]
    public class TrackListController:ControllerBase
    {
        private readonly TrackerContext _context;

        public TrackListController(TrackerContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrackList>>> GetLists()
        {
            return await _context.TrackLists.ToListAsync();
        }

        [HttpGet("{uEmail}")]
        public async Task<ActionResult<IEnumerable<TrackList>>> GetUserLists(string uEmail)
        {
            return await _context.TrackLists
                .Where(u => u.ListedEmail == uEmail).ToListAsync();
            //return uLists.ToList();
        }

        [HttpGet("scrape-site")]
        public async Task<string[]> GetSiteInfo(string url)
        {
            url = HttpUtility.UrlDecode(url);
            string[] res = await PriceScraper.FetchData(url);

            return res;
        }

        [HttpPost]
        public async Task<ActionResult<TrackList>> PostList([FromBody] TrackList azList)
        {
            //match foreign key
            User uObj = _context.Users.SingleOrDefault(user => user.Email == azList.ListedEmail);
            azList.UserId = uObj.Id;

            //check for duplicate
            var uLists = await _context.TrackLists
                .Where(e => (e.UserId == azList.UserId) &&
                (e.PageUrl == azList.PageUrl)).ToListAsync();

            if (uLists.Count > 0) return NotFound();

            _context.TrackLists.Add(azList);

            await _context.SaveChangesAsync();

            await AppendPriceRecord(azList.ItemName, azList.CurrentPrice, azList.UserId);

            return CreatedAtAction("GetUserLists", new { uEmail = azList.ListedEmail }, azList);
        }

        private async Task<ActionResult> AppendPriceRecord(string itemName, float price, int uid)
        {
            var tmpId = _context.TrackLists.SingleOrDefault(t =>
            t.ItemName == itemName && t.UserId == uid);

            PriceRecord pr = new PriceRecord
            {
                DaysAgo = 0,
                Price = price,
                ItemName = itemName,
                TrackListId = tmpId.Id
            };

            _context.ListTrends.Add(pr);
           await _context.SaveChangesAsync();
           return NoContent();
        }

        [HttpPut("{Id}")]
        public async Task<IActionResult> PutList(int id, TrackList azTrack)
        {
            azTrack.Id = id;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ListExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("del")]
        public async Task<ActionResult<TrackList>> DeleteList([FromQuery] string url,
            [FromQuery] string uEmail)
        {
            var tempItem = _context.TrackLists.SingleOrDefault(i => i.ListedEmail == uEmail &&
             i.PageUrl == url);

            if(tempItem == null) return NotFound();

            _context.TrackLists.Remove(tempItem);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool ListExists(int id)
        {
            return _context.TrackLists.Any(e => e.Id == id);
        }
    }
}