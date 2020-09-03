import React, {Component} from 'react';
import {TextField} from '@material-ui/core';

export default class PassChange extends Component{
    constructor(props){
        super(props);

        this.state = {
            oldPass: "",
            newPass: "",
            conNewPass: "",
            oldPassErr: "",
            newPassErr: "",
            conNewPassErr: ""
        };
    }

    validChange = () => {

    }

    handlePassChange = e => {
        e.preventDefault();
    }

    render(){
        return(
            <div>
            <form onSubmit={e=>this.handlePassChange(e)}>
                <TextField
                name="oldPass"
                variant="outlined"
                placeholder="Password"
                onChange={e=>{this.setState({oldPass:e.target.value})}}
                error={this.state.oldPassErr !== ""}
                helperText={this.state.oldPassErr}
                />
                <br/>
                <TextField
                name="newPass"
                variant="outlined"
                placeholder="New password"
                onChange={e=>{this.setState({newPass:e.target.value})}}
                error={this.state.newPassErr !== ""}
                helperText={this.state.newPassErr}
                />
                <br/>
                <TextField
                name="conNewPass"
                variant="outlined"
                placeholder="Confirm password"
                onChange={e=>{this.setState({conNewPass:e.target.value})}}
                error={this.state.conNewPassErr !== ""}
                helperText={this.state.conNewPassErr}
                />
                <br/>
                <button onSubmit={e=>this.handlePassChange(e)}>Submit</button>
            </form>
            </div>
        )
    }
}