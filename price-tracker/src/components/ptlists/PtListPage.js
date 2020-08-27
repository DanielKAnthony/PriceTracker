import React, {Component} from 'react';
import axios from 'axios';
import {sites} from '../../Constants';
import TextField from '@material-ui/core/TextField';

export default class PtListPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            itemUrl: "",
            domain: "",
            itemName: "",
            price: undefined,
            siteIndex: -1,
            linkErr: ""
        };

        //get lists here
    }

    validUrl = url => {
        if(this.state.itemUrl.length === 0){
            this.setState({linkErr: "Required"});
            return false;
        }

        var temp = undefined;
        try{
            temp = new URL(url);
        
            for(let i = 0;i<sites.length;++i){
                if(temp.hostname.includes(sites[i])){
                    this.setState({siteIndex:i});
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

        if(!this.validUrl(this.state.itemUrl)) return;

        

    }

    render() {
        return(
            <div>
            <h1>Items Being Tracked</h1>
            <div>
                <h2>Add new item</h2>
                <form type="submit" onSubmit={e => this.addNewItem(e)}>
                    <TextField
                        name="itemLink"
                        placeholder="Item URL"
                        variant="outlined"
                        onChange={e => this.setState({itemUrl:e.target.value})}
                        error={this.state.linkErr !== ""}
                        helperText={this.setState.linkErr}
                    />
                    <button type="submit" onClick={e => this.addNewItem(e)}>Submit</button>
                </form>

            </div>
            </div>
        )
    }
}