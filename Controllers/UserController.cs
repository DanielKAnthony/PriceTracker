using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriceTrackerApp.Models;

namespace PriceTrackerApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
    public class UserController : ControllerBase
    {
    	private readonly TrackerContext _context;

    	public UserController(TrackerContext context)
    	{
    		_context = context;
    	}

    	[HttpGet]
    	public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    	{
    		return await _context.Users.ToListAsync();
    	}

        [HttpGet("logauth")]
        public async Task<ActionResult<User>> AuthUser([FromQuery] string namefield,[FromQuery] string pass)
        {

            var tmpUser =  _context.Users.SingleOrDefault(user => 
            (namefield.Contains('@') ? user.Email:user.Username) == namefield);

            if(tmpUser == null)
            {
                return NotFound();
            }

			var userId = tmpUser.Id;
            var userPass = await _context.UserAuths.Where(x => x.UserId == userId).ToListAsync();

            if (pass == userPass[0].Password) return tmpUser;
            return NotFound();
        }

    	[HttpGet("{Id}")]
    	public async Task<ActionResult<User>> GetUser(int id)
    	{
    		var user = await _context.Users.FindAsync(id);

            if(user == null)
            {
                return NotFound();
            }

    		return user;
    	}

    	[HttpPut("{Id}")]
    	public async Task<IActionResult> PutUser(int id, User user)
    	{
    		user.Id = id;

            _context.Entry(user).State = EntityState.Modified;

    		try{
    			await _context.SaveChangesAsync();
    		}
    		catch(DbUpdateConcurrencyException)
    		{
    			if(!UserExists(id))
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

    	[HttpPost]
    	public async Task<ActionResult<User>> PostUser([FromBody] UserRequestBody user)
    	{
            User errUser = new User
            {
                Email = "temp",
                Username = "temp",
            };

            bool duplicate = false;

            if (EmailExists(user.Email))
            {
                errUser.Email = null;
                duplicate = true;
            }
            if (UsernameExists(user.Username))
            {
                errUser.Username = null;
                duplicate = true;
            }

            if (duplicate) return errUser;

            User postUser = new User{
                Username = user.Username,
                Email = user.Email,
            };

            _context.Users.Add(postUser);
            
			await _context.SaveChangesAsync();

            await InitUserAuth(user.Password, user.Email);

    		return CreatedAtAction("GetUser", new { id = postUser.Id}, user);
    	}

        private async Task<ActionResult<UserAuth>> InitUserAuth(string pass,string email)
        {
            var newUser = await _context.Users.Where(e => e.Email == email).ToListAsync();

            UserAuth tmp = new UserAuth
            {
                Password = pass,
                UserId = newUser[0].Id
            };

            _context.UserAuths.Add(tmp);

            await _context.SaveChangesAsync();

            return NoContent();
        }

    	[HttpDelete("{Id}")]
    	public async Task<ActionResult<User>> DeleteUser(int id)
    	{
    		var user = await _context.Users.FindAsync(id);

    		if(user == null)
    		{
    			return NotFound();
    		}

    		_context.Users.Remove(user);
    		await _context.SaveChangesAsync();

    		return user;
    	}

    	private bool UserExists(int id)
    	{
    		return _context.Users.Any(e => e.Id == id);
    	}

        private bool EmailExists(string Email)
        {
            return _context.Users.Any(e => e.Email == Email);
        }

        private bool UsernameExists(string Username)
        {
            return _context.Users.Any(e => e.Username == Username);
        }
    }
}