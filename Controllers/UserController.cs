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

    	[HttpPut("email-change")]
    	public async Task<IActionResult> PutEmail(User user)
    	{
            if (EmailExists(user.Email)) return NotFound();

            User uObj = _context.Users.Single(e => e.Username == user.Username);

            user.Id = uObj.Id;
            _context.Users.Remove(uObj);
            _context.Users.Add(user);

    		await _context.SaveChangesAsync();
            
            return Ok();
    	}

        [HttpPut("name-change")]
        public async Task<IActionResult> PutUsername(User user)
        {
            if (UsernameExists(user.Username)) return NotFound();

            User uObj = _context.Users.Single(e => e.Email == user.Email);

            user.Id = uObj.Id;
            _context.Users.Remove(uObj);
            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("pass-change")]
        public async Task<IActionResult> PutPass(UserRequestBody user)
        {
            var idObj = _context.Users.SingleOrDefault(e => e.Email == user.Email);
            int uid = idObj.Id;

            var pObj = _context.UserAuths.SingleOrDefault(e => e.UserId == uid);
            if (pObj.Password != user.Username) return NotFound();
            _context.UserAuths.Remove(pObj);

            UserAuth tmp = new UserAuth
            {
                Password = user.Password,
                UserId = uid
            };
            _context.UserAuths.Add(tmp);
            await _context.SaveChangesAsync();

            return Ok();
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

    	[HttpDelete("del")]
    	public async Task<ActionResult<User>> DeleteUser([FromQuery] string email,
            [FromQuery] string pass)
    	{
            //get user from db
            User u = _context.Users.SingleOrDefault(e => e.Email == email);
            if (u == null) return NotFound();

            //authenticate password
            if(_context.UserAuths.SingleOrDefault(e => e.Password == pass
            && e.UserId == u.Id) == null) return NotFound();

            _context.Users.Remove(u);
            await _context.SaveChangesAsync();

    		return Ok();
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