import React, {Component} from 'react';
import Cookies from 'js-cookie';
import { TextField } from '@material-ui/core';
import axios from 'axios';
import './styling/ProfileStyle.css';

export default class DeleteAccount extends Component{
    constructor(props){
        super(props);

        this.state = {
            passConfirm: "",
            passErr: ""
        };
    }

    validateReq = () => {
        this.setState({passErr: this.state.passConfirm.length === 0 ? "Required": ""});
        if (this.state.passConfirm.length === 0) return false;

        return true;
    }

    handleDelete = e => {
        e.preventDefault();
        if(!this.validateReq()) return;

        axios.delete('api/user/del', {
            params: {
                email: Cookies.get("email"),
                pass: this.state.passConfirm
            }
        }).catch(err => {
            this.setState({
                passErr: err.response.status === 404 ? "Incorrect password" :
                    `Failed with ${err.response.status}. Try again later.`
            })
        }).then(res => {
            if (res !== undefined) {
                Cookies.remove("email");
                Cookies.remove("username");
                window.location.replace(window.location.origin+"/");
            }
        })
    }

    render(){
        return(
            <div>
                <form style={{width:"fit-content"}} onSubmit={e => this.handleDelete(e)}>
                    <TextField
                        name="passConfirm"
                        variant="outlined"
                        placeholder="Password"
                        type="password"
                        onChange={e=>{this.setState({passConfirm:e.target.value})}}
                        error={this.state.passErr !== ""}
                        helperText={this.state.passErr}
                    />
                    <br />
                    <button className="uBtn" style={{width:"100%",marginBottom:"1vh"}}
                    onSubmit={e => this.handleDelete(e)}>Delete</button>
                </form>
            </div>
        )
    }
}