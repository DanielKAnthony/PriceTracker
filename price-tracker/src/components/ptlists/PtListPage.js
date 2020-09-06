import React, {Component} from 'react';
import axios from 'axios';
import { sites } from '../../Constants';
import { TextField, LinearProgress, FormControlLabel, Checkbox, CircularProgress } from '@material-ui/core';
import Cookies from 'js-cookie';
import PriceItem from './PriceItem';
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
            itemReady:false,
            isLoading: false,
            maxPrice: 0.00,
            priceEdit: false,
            priceErr: "",
            postSend: false,
            hasItems: false
        };

        this.keyIndex = 0;
        this.iList = [];
    }

    componentDidMount() {
        axios.get(`/lists/tracklist/${Cookies.get("email")}`)
            .then(res => {
                if (res.data.length > 0) {
                    console.log(res.data);
                    for (let i = 0; i < res.data.length; ++i)
                        this.iList.push(res.data[i]);
                    this.setState({ hasItems: this.iList.length > 0 });
                }
            });
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
        }).catch(err => {
            this.setState({linkErr: `Connection failed with ${err.response.status}`});})
            .then(res => {
                this.setState({isLoading: false});
                if (this.state.linkErr !== "") return;
                if (res === undefined) {
                    this.setState({ linkErr: "Page not found" });
                    return;
                } else if (res.data[1] === undefined) {
                    this.setState({ linkErr: "Page not found" });
                    return;
                }
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

    postList = () => {
        if (this.state.linkErr !== this.state.priceErr) return;
        this.setState({ postSend: true });

        const listData = {
            "PageUrl": this.state.itemUrl.startsWith("https://www.") ? this.state.itemUrl:
            "https://www."+this.state.itemUrl,
            "MaxPrice": parseFloat(this.state.maxPrice),
            "CurrentPrice": parseFloat(this.state.itemInfo.price.slice(1)),
            "Vendor": this.state.itemInfo.vendor,
            "itemName": this.state.itemInfo.name,
            "ListedEmail": Cookies.get("email"),
            "UserId": 0
        }

        axios.post('/lists/tracklist', listData).catch(err => {
            this.setState({
                linkErr: err.response.status === 404 ? "Item is already listed" :
                    `Failed with ${err.response.status}. Try another link`
            });
        })
            .then(res => {
                this.setState({ postSend: false });
                try {
                    if (res.data !== undefined)
                        window.location.reload();
                } catch { return; }  
        });
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
                    {this.state.isLoading && <div><LinearProgress /></div>}
                </form>

                    {this.state.itemReady &&
                        <div style={{ margin: "auto", width: "75vw" }}>
                            {this.state.postSend && <div className="CLoad"><CircularProgress /></div>}
                            <table id="newITable">
                                <tbody>
                                    <tr><th>Name</th><td>{this.state.itemInfo.name}</td></tr>
                                    <tr><th>Price</th><td>{this.state.itemInfo.price}</td></tr>
                                <tr><th>Vendor</th><td>
                                    <a href={this.state.itemUrl}>{this.state.itemInfo.vendor}</a></td></tr>
                                </tbody>
                            </table>
                        <FormControlLabel
                            value="end"
                            control={<Checkbox color="primary" />}
                            label="Notify me when the price falls to a certain value"
                            labelPlacement="end"
                            onClick={() => {
                                if (this.state.priceEdit) this.setState({ priceErr: "", maxPrice: 0.00 });
                                this.setState({ priceEdit: !this.state.priceEdit });
                            }}
                        />
                        {this.state.priceEdit && <div>
                            <TextField
                                name="itemLink"
                                disabled={this.state.isLoading}
                                id="uField"
                                style={{ width: "75vw", margin: "auto",marginBottom:"1vh" }}
                                placeholder="Target price"
                                variant="outlined"
                                onChange={e => {
                                    if ((isNaN(parseFloat(e.target.value))) ||
                                        (e.target.value.indexOf('.') !== -1 &&
                                        e.target.value.split(".")[1].length > 2)
                                    ) { this.setState({ priceErr: "Invalid" });}
                                     else {
                                        this.setState({priceErr: "",maxPrice: e.target.value});
                                    }
                                }}
                                error={this.state.priceErr !== ""}
                                helperText={this.state.priceErr}
                            />
                        </div>}
                        <br/>
                        <button className="TableBtn" onClick={() => { this.postList() }}>Confirm</button>
                        <button className="TableBtn" onClick={() => {
                            this.setState({
                                itemUrl: "",
                                linkErr: "",
                                priceErr: "",
                                priceEdit: false,
                                maxPrice: 0.00,
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
                {this.state.hasItems &&
                    <div className="uItems">
                    <br />
                    {this.iList.map(item =>
                        <PriceItem key={this.keyIndex++}
                            title={item.itemName} price={item.currentPrice}
                            vendor={item.vendor} maxPrice={item.maxPrice}
                            url={item.pageUrl}
                        />
                    )}
                    </div>
                }
            </div>
        )
    }
}