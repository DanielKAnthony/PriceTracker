import React, { Component } from 'react';
import { AreaChart, Label, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';

export default class PriceModel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vpWidth: 0.9 * window.innerWidth
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.resizeVw);
    }

    resizeVw = () => {
        this.setState({ vpWidth: 0.9 * window.innerWidth})
    }

    render() {
        return (
            <div style={{ width: "fit-content" }}>
                <h4 style={{ marginLeft: "5%", marginBottom: "-1%" }}>{ this.props.title}</h4>
                <AreaChart width={this.state.vpWidth} height = { 250} data = { this.props.data }
                margin={{ top: 20, right: 5, left: 8, bottom: 25 }}>
                    <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                    </defs>
                    <XAxis dataKey="name">   
                        <Label value="Days Ago" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis label={{ value: 'Price', angle: -90, position: 'insideLeft' }}/>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                    <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart >
                </div>
        )
    }
}
