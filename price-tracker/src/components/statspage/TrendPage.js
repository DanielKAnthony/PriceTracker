import React, { Component } from 'react';
import Cookies from 'js-cookie';
//import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import PriceModel from './PriceModel';
import axios from 'axios';

export default class TrendPage extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            hasData: false,
            isEmpty: false,
            isLoading: true
        };

        this.keyIndex = 0;
        this.data = [];
        this.titles = [];
    }

    componentDidMount() {
        axios.get('stats/trend/uitem-stats', {
            params: {
                email: Cookies.get("email")
            }
        }).catch(err => {
            this.setState({
                isEmpty: err.response.status === 404,
                isLoading: false
            })
        }).then(res => {
            if (res !== undefined) {
                console.log(res.data);
                for (let i in res.data) {
                    //console.log(res.data[i]);
                    this.titles.push(res.data[i][0].ItemName)
                    let arr = [];
                    for (let j = 0; j < res.data[i].length; ++j) {
                        let dayTemp = res.data[i][j].DaysAgo;
                        arr.push({ name: `${dayTemp}`, uv: res.data[i][j].Price });
                    }
                    this.data.push(arr);
                }
                console.log("DATA");
                console.log(this.data);
                this.setState({ hasData: true, isLoading: false });
            }
        })
    }

    render(){
        return (
            <div>
                <h1>Trends</h1>
                <div>
                    {this.state.hasData &&
                        <div>
                        {this.data.map(item =>
                            <PriceModel key={this.keyIndex} data={item} title={this.titles[this.keyIndex++]} />
                        )}
                        </div>
                    }
                    {this.state.isEmpty &&
                        <div>
                        <h3>You aren't tracking any items</h3>
                        <h6 style={{color:"grey"}}>Price trends up until the past 30 days will appear here</h6>
                        </div>
                    }
                </div>
            </div>
        )
    }
}