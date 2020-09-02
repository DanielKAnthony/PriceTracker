import React,{Component} from 'react';

export default class PriceItem extends Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return(
            <div className="ItemParent">
                <h3>{this.props.title}</h3>
                <h3>{this.props.price}</h3>
                <h3>{this.props.vendor}</h3>
                <h3>Notification price</h3>
            </div>
        )
    }
}