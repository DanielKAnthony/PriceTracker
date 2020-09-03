import React, {Component} from 'react';
import { TextField } from "@material-ui/core";
import Cookies from 'js-cookie';
import './styling/ProfileStyle.css';

export default class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: Cookies.get("email"),
            username: Cookies.get("username"),
            emailEdit: false,
            nameEdit: false,
            passEdit: false,
            delAcc: false
        };
    }

    updateEmail = e => {
        e.preventDefault();
    }

    updateUsername = e => {
        e.preventDefault();
    }

    render(){
        return(
            <div>
                <h1>Account Details</h1>
                <div className="CredParent">
                <div className="CredChild">
                <form onSubmit={e => {this.updateEmail(e)}}>
                <h3 style={{color: "#003fa3"}}>Email</h3>
                <TextField
                    className="CredText"
                    name="email"
                    variant="outlined"
                    value={this.state.email}
                    onChange={e => {this.setState({email: e.target.value})}}
                    disabled={!this.state.emailEdit}
                />
                <br/>
                <button onSubmit={e => {this.updateEmail(e)}} hidden={!this.state.emailEdit}>Update</button>
                <button onSubmit={e=>{e.preventDefault()}} 
                onClick={() => {this.setState({emailEdit: !this.state.emailEdit})}}>
                    {this.state.emailEdit ? "Cancel": "Edit"}</button>
                </form>
                </div>

                <div className="CredChild">
                <form onSubmit={e => {this.updateUsername(e)}}>
                <h3 style={{color: "#003fa3"}}>Username</h3>
                <TextField
                    className="CredText"
                    id="uField"
                    name="username"
                    variant="outlined"
                    value={this.state.username}
                    onChange={e => {this.setState({username: e.target.value})}}
                    disabled={!this.state.nameEdit}
                />
                <br/>
                <button onSubmit={e => {this.updateUsername(e)}} hidden={!this.state.nameEdit}>Update</button>
                <button onSubmit={e=>{e.preventDefault()}}
                onClick={() => {this.setState({nameEdit: !this.state.nameEdit})}}>
                    {this.state.nameEdit ? "Cancel": "Edit"}</button>
                </form>
                </div>

                </div>

                <div className="AccAdmin">
                <button>Change Password</button><br/>
                <button>Delete Account</button>
                </div>

            </div>
        );
    }
}