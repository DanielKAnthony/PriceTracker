import React, {Component} from 'react';
import { TextField } from '@material-ui/core';
import Cookies from 'js-cookie';
import axios from 'axios';
import './styling/ProfileStyle.css';

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
        this.setState({
            oldPassErr: this.state.oldPass.length === 0 ? "Required" : "",
            newPassErr: this.state.newPass.length === 0 ? "Required" : "",
            conNewPassErr: this.state.conNewPass.length === 0 ? "Required" : "",
        })

        if(this.state.oldPass.length === 0 || this.state.newPass.length === 0 ||
            this.state.conNewPass.length === 0) return false;
        
        if(this.state.newPass !== this.state.conNewPass){
            this.setState({conNewPassErr: "Passwords do not match"});
            return false;
        }

        return true;
    }

    handlePassChange = e => {
        e.preventDefault();
        if (!this.validChange()) return;

        const data = {
            Email: Cookies.get("email"),
            Username: this.state.oldPass,
            Password: this.state.newPass
        }

        axios.put('api/user/pass-change', data)
        .catch(err => {
            this.setState({
                oldPassErr: err.response.status === 404 ? "Incorrect password" :
                    `Failed with ${err.response.status}. Try again later.`
            })
        }).then(res => {
            if (res !== undefined) {
                window.location.reload();
            }
        })
    }

    render(){
        return(
            <div>
            <form style={{width:"fit-content"}} onSubmit={e=>this.handlePassChange(e)}>
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
                <button className="uBtn" style={{width:"100%",marginBottom:"1vh"}}
                onSubmit={e=>this.handlePassChange(e)}>Submit</button>
            </form>
            </div>
        )
    }
}