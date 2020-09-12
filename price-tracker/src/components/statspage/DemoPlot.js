import React, { Component } from 'react';
import PriceModel from './PriceModel';
import axios from 'axios';

export default class DemoPlot extends Component{
    constructor(props){
        super(props);

        this.state = {
            isVisible: true,
            isLoading: true,
            hasErrors: false
        };

        this.data = [];
        this.title = "Price trend of your item";
        this.itemLink = "";
        this.plot = undefined;
    }

    componentDidMount() {
        axios.get('stats/trend/demo').then(res => {
            if (res !== undefined) {
                for (let i = 0; i < res.data[34].length; ++i) {
                    let dayTemp = res.data[34][i].DaysAgo;
                    this.data.push({ name: `${dayTemp}`, uv: res.data[34][i].Price });
                }
                
                this.plot = <PriceModel data={this.data} title={this.title} />
                this.setState({ isLoading: false });
            } else this.setState({hasErrors:true});
        })
    }

    render(){
        return (
            <div>
                {(this.state.isLoading || this.state.hasErrors) ?
                    <div></div> :<div><div>
                    {this.state.isVisible &&
                        <div style={{
                            borderTop: "1px solid #003fa3", borderBottom: "1px solid #003fa3",
                            boxShadow: "1px 2px 8px #003fa3", marginTop: "1vh"
                        }}>
                            <h3 style={{ color: "#003fa3" }}>This is a demo.</h3>
                            <p>Once you start tracking an item, its listed prices
                            up to the last 30 days will be plotted in a graph like the one below.</p>
                            {this.plot}
                        </div>
                    }</div><div>
                    <p style={{ color:"#003fa3", cursor:"pointer"}} onClick={() => {this.setState({ isVisible: !this.state.isVisible })}}>
                    {this.state.isVisible ? "Hide" : "Show Demo"}</p></div></div>
                }
            </div>
        );
    }
}
