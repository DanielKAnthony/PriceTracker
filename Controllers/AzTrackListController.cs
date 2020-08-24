using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazonTrackingApp.Models;

namespace AmazonTrackerApp.Controllers
{
    [Route("lists/[controller]")]
    [ApiController]
    public class AzTrackListController:ControllerBase
    {
        private readonly TrackerContext _context;

        public AzTrackListController(TrackerContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AzTrackList>>> GetUsers()
        {
            return await _context.TrackLists.ToListAsync();
        }

        [HttpGet("{UserId}")]
        public async Task<ActionResult<IEnumerable<AzTrackList>>> GetUser(int uid)
        {
            var userLists = await _context.TrackLists.Where(e => e.UserId == uid).ToListAsync();

            if (userLists == null)
            {
                return NotFound();
            }

            return userLists;
        }

        [HttpPost]
        public async Task<ActionResult<User>> PostList([FromBody] AzTrackList azList)
        {
            //check for duplicate page here
            var uLists = await _context.TrackLists.Where(e => e.UserId == azList.UserId).ToListAsync();

            if (uLists == null) return null;

            foreach(var u in uLists)
            {
                if(u.PageUrl == azList.PageUrl)
                {
                    return null;
                }
            }
            //get user here and init ATL object -- change params to FromQuery
            _context.TrackLists.Add(azList);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetList", new { id = azList.Id }, azList);
        }

        [HttpPut("{Id}")]
        public async Task<IActionResult> PutList(int id, AzTrackList azTrack)
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

        [HttpDelete]
        public async Task<ActionResult<AzTrackList>> DeleteList(int uid,string pageUrl)
        {
            var uLists = await _context.TrackLists.Where(e => e.UserId == uid).ToListAsync();

            if (uLists == null)
            {
                return NotFound();
            }

            foreach (var u in uLists)
            {
                if(u.PageUrl == pageUrl)
                {
                    _context.TrackLists.Remove(u);
                    await _context.SaveChangesAsync();
                    return u;
                }
            }

            return NotFound();
        }

        private bool ListExists(int id)
        {
            return _context.TrackLists.Any(e => e.Id == id);
        }
    }
}