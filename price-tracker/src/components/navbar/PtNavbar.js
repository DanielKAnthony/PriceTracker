import React, {useState}  from 'react';
import { makeStyles } from '@material-ui/core';
import {AppBar} from '@material-ui/core';
import {Toolbar} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import {MenuItem} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import Cookies from 'js-cookie';
import App from '../../App';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const PtNavbar = () => {
  const isLoggedIn = new App().isLoggedIn();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {window.location.href="/profile"}}>Profile</MenuItem>
          <MenuItem onClick={() => {
            Cookies.remove("email");
            Cookies.remove("username");
            document.location.replace(window.location.origin + "/");
          }}>Sign Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => window.location.href="/price-lists"}>
        My Items
      </MenuItem>
      <MenuItem onClick={() => window.location.href="/analytics"}>
        <p>Trends</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Account</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography onClick={() => window.location.href="/"}
          className="NavTitle" variant="h5" noWrap style={{cursor:"pointer"}}>
            Price Tracker
          </Typography>
          <div className={classes.grow} />
          
          <div className={classes.sectionDesktop}>
            {isLoggedIn ? 
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                <h4 onClick={() => window.location.href="/pt-lists"}
                    style={{marginRight:"2vw",cursor:"pointer"}}
                >My Items</h4>
                </div>
                <div>
                <h4 onClick={() => window.location.href="/analytics"}
                    style={{marginRight:"2vw",cursor:"pointer"}}
                >Trends</h4>
                </div>
                <div>
                <IconButton
                  style={{marginTop:"25%"}}
                  edge="end"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                    </IconButton>
                </div>
            </div> :
            <div>
            <h4 style={{cursor:"pointer"}} onClick={() => window.location.href="/login"}>Log in</h4>
            </div>
           }
          </div>
          <div className={classes.sectionMobile}>
            {isLoggedIn ? 
            <div>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
            </div>:
            <div>
            <h4 style={{cursor:"pointer"}} onClick={() => window.location.href="/login"}>Log in</h4>
            </div>}
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default PtNavbar;