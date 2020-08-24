import React, {Component} from 'react';

export default class FeatureText extends Component{
    constructor(props){
        super(props);

        this.isLogin = window.location.pathname === "/login";
    }

    render() {
        return(
            <div style={{paddingBottom:"3vh"}}>
                <h2 style={{paddingTop:"7vh"}}>Features</h2>
                <ul style={{textAlign:"left",listStyleType:"none"}}>
                    <li style={{marginBottom:"3vh"}}>Track unlimited Amazon prices at any time</li>
                    <li style={{marginBottom:"3vh"}}>See price trends for items you track</li>
                    <li style={{marginBottom:"3vh"}}>Know when an item is out of stock</li>
                    <li>Receive an email when the price is right</li>
                </ul>
            </div>
        )
    }
}