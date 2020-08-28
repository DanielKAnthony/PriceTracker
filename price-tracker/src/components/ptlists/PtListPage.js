import React, {Component} from 'react';
import axios from 'axios';
import {sites} from '../../Constants';
import TextField from '@material-ui/core/TextField';
import './styling/PageStyle.css';

export default class PtListPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            itemUrl: "",
            domain: "",
            itemName: "",
            price: undefined,
            linkErr: "",
            itemInfo: {
                name: "",
                price: "",
                vendor: ""
            },
            itemReady: false,
            isLoading: false
        };

        //get lists here
    }

    validUrl = url => {
        if(this.state.itemUrl.length === 0){
            this.setState({linkErr: "Required"});
            return false;
        }

        var temp = undefined;
        url = (url.indexOf('https://www.') === -1) ? 'https://www.' + url : url;
        try{
            temp = new URL(url);
        
            for(let i = 0;i<sites.length;++i){
                if (temp.hostname.includes(sites[i])) {
                    this.setState({
                        itemInfo: {
                            ...this.state.itemInfo,
                            vendor: sites[i].charAt(0).toUpperCase() + sites[i].slice(1)
                        }
                    });
                    return true;
                }
            }
            this.setState({linkErr:"Site not supported"});
            return false;
        }catch{
            this.setState({linkErr:"Invalid Format"});
            return false;
        }
    }

    addNewItem = e => {
        e.preventDefault();
        if (this.state.isLoading) return;
        this.setState({ linkErr: "" });
        this.setState({ isLoading: true });

        if (!this.validUrl(this.state.itemUrl)) {
            this.setState({ isLoading: false });
            return;
        }

        axios.get('lists/tracklist/scrape-site', {
            params:
                {url: encodeURIComponent(this.state.itemUrl)}
        })
            .then(res => {
                this.setState({
                    isLoading: false,
                    itemInfo: {
                        ...this.state.itemInfo,
                        name: res.data[0],
                        price: "$" + res.data[1]
                    },
                    itemReady:true
                });
            })
    }

    render() {
        return(
            <div>
            <h1>Items Being Tracked</h1>
            <div>
                <form type="submit" style={{
                    height: "fit-content",
                    width: "fit-content", margin: "auto"
                    }} onSubmit={e => this.addNewItem(e)}>

                    <h2 style={{ margin: "auto", color: "#003fa3" }}>Add new item</h2>
                    {this.state.isLoading && <div>Put loading gif here</div>}
                    <TextField
                    name="itemLink"
                    disabled={this.state.isLoading}
                    id="uField"
                    style={{ width: "75vw", margin: "auto" }}
                    placeholder="Item URL"
                    variant="outlined"
                        onChange={e =>
                            this.setState({
                                itemUrl: e.target.value,
                                linkErr: e.target.value.length === 0 ? "" : this.state.linkErr 
                            })
                        }
                    error={this.state.linkErr !== ""}
                    helperText={this.state.linkErr}
                    />
                    <br />
                        <button className="TrBtn" disabled={this.state.isLoading} type="submit"
                        onClick={e => this.addNewItem(e)}>Submit</button>
                </form>

                    {this.state.itemReady &&
                        <div style={{margin:"auto",width:"75vw"}}>
                            <table id="newITable">
                                <tbody>
                                    <tr><th>Name</th><td>{this.state.itemInfo.name}</td></tr>
                                    <tr><th>Price</th><td>{this.state.itemInfo.price}</td></tr>
                                <tr><th>Vendor</th><td>
                                    <a href={this.state.itemUrl}>{this.state.itemInfo.vendor}</a></td></tr>
                                </tbody>
                            </table>
                        <button className="TableBtn">Confirm</button>
                        <button className="TableBtn" onClick={() => {
                            this.setState({
                                itemUrl: "",
                                itemInfo: {
                                    ...this.state.itemInfo,
                                    name: "",
                                    price: "",
                                    vendor: ""
                                },
                                itemReady: false
                            })
                            document.getElementById("uField").value = "";
                        }} id="cancelBtn">
                                Cancel
                        </button>

                        </div>
                    }
            </div>
            </div>
        )
    }
}