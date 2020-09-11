import React, { Component } from 'react';
import GithubIcon from './githubicon.png';
import './HomeStyling.css';

export default class HomeParent extends Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render() {
        return(
            <div>
            <div className="MainContainer">
                <div style={{color:"white",paddingTop:"2vh"}}>
                    <h1 className="HomeText" style={{textShadow:"2px 2px 2px #5a5c66"}}>
                        Track Prices from Various Retailers</h1>
                    <h4 className="HomeText">Bestbuy | Kijiji | Indigo</h4>
                    <br/><br/>
                    <p className="HomeText">Make an account and watch out for sales today</p>
                </div>
            </div>
                <div style={{textAlign:"center",marginTop:"3%"}}>
                    <p style={{fontSize:"1.3rem"}}>This web app is open-source<img onClick={() => {
                        window.open("https://github.com/DanielKAnthony/PriceTracker","_blank");
                    }}
                    style={{cursor:"pointer",height:"auto",marginLeft:"1vw",
                    verticalAlign:"middle"}}
                    id="gPic"
                    src={GithubIcon} alt=""/></p>
                </div>
            </div>
        )
    }
}