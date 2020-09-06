import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import axios from 'axios';

export default class TrendPage extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            hasData: false,
            isEmpty: false
        };

        this.data = [];

        axios.get('stats/trend/uitem-stats', {
            params: {
                email: Cookies.get("email")
            }
        }).catch(err => {
            if (err.response.status === 404) this.setState({isEmpty:true})
        }).then(res => {
            if (res.data !== undefined) {
                console.log(res.data);
                /*for (let i = 0; i < res.data['7'].length; ++i){
                    let dayTemp = res.data['7'][i].DaysAgo;
                    this.data.push({ name: `${dayTemp} days ago`, uv: res.data['7'][i].Price });
                }*/
                this.setState({ hasData: true });
            }
        })

    }

    render(){
        return (
            <div>
                <div>Trends</div>
                <button onClick={() => { this.getStats() }}>Click</button>
                <div>
                    {this.state.hasData &&
                        <LineChart width={600} height={300} data={this.data}>
                            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="name" />
                            <YAxis />
                        </LineChart>
                    }
                    {this.state.isEmpty &&
                        <h3>You aren't tracking any items</h3>
                        <h5>Price trends up until the past 30 days will appear here</h5>
                    }
                </div>
            </div>
        )
    }
}