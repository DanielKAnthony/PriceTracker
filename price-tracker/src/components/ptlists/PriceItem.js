import React, { Component } from 'react';
import './styling/ItemStyle.css';

export default class PriceItem extends Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return(
            <div className="ItemParent">
                <h3>{this.props.title}</h3>
                <h4>${this.props.price}</h4>
                <h4>{this.props.vendor}</h4>
                <h3>{ this.props.maxPrice > 0 ? `Max price: $${this.props.maxPrice}` : "No notification"}</h3>
            </div>
        )
    }
}