import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './styling/ItemStyle.css';

export default class PriceItem extends Component{
    constructor(props){
        super(props);

        this.state = {
            visible: true
        };
    }

    delPost = e => {
        this.setState({ visible: false });
        axios.delete('lists/tracklist/del',{
            params: {
                url: this.props.url,
                uEmail: Cookies.get("email")
            }
        }).catch(err => {
            console.log(err.response.status);
            this.setState({ visible: true });
        }).then(res => {
            if (res !== undefined) {
                console.log("Success");
            }
        })

    }

    render(){
        return (
        <div>
            { this.state.visible && 
            <div className="ItemParent">
                <svg style={{ marginLeft: "93%", marginTop: "0.5%", cursor: "pointer" }}
                    onClick={e => this.delPost(e)}
                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 
                    1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" /></svg>
                <h3 style={{color:"#003fa3"}}>{this.props.title}</h3>
                <h4>${this.props.price}</h4>
                <h4>{this.props.vendor}</h4>
                <h3>{ this.props.maxPrice > 0 ? `Max price: $${this.props.maxPrice}` : "No notification"}</h3>
                    </div>}</div>
        )
    }
}