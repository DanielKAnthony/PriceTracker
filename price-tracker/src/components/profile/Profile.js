import React, {Component} from 'react';
import { TextField } from "@material-ui/core";
import Cookies from 'js-cookie';
import './styling/ProfileStyle.css';
import PassChange from './PassChange';
import DeleteAccount from './DeleteAccount';
import axios from 'axios';

export default class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: Cookies.get("email"),
            username: Cookies.get("username"),
            emailErr: "",
            nameErr: "",
            emailEdit: false,
            nameEdit: false,
            passEdit: false,
            delAcc: false
        };
    }

    validEmail = () => {
        this.setState({emailErr: this.state.email.length === 0 ? "Required": ""});
        if (this.state.email.length === 0) return false;

        if (this.state.email.indexOf('@') < 1) {
            this.setState({ emailErr: "Invalid" });
            return false;
        }

        return true;
    }

    validUsername = () => {
        this.setState({nameErr: this.state.username.length === 0 ? "Required": ""});
        if(this.state.username.length === 0) return false;

        if (this.state.username.indexOf('@') !== -1) {
            this.setState({ nameErr: "Invalid character"});
            return false;
        }

        return true;
    }

    updateEmail = e => {
        e.preventDefault();

        if (!this.validEmail()) return;

        const data = {
            Email: this.state.email,
            Username: Cookies.get("username"),
        };

        axios.put('api/user/email-change', data).catch(err => {
            this.setState({
                emailErr: err.response.status === 404 ? "Username taken" :
                    `Failed with ${err.response.status}. Try again later.`
            })
        }).then(res => {
            if (res !== undefined) {
                Cookies.set("email", this.state.email);
                window.location.reload();
            }
        });
    }

    updateUsername = e => {
        e.preventDefault();

        if (!this.validUsername()) return;

        const data = {
            Email: Cookies.get("email"),
            Username: this.state.username
        }

        axios.put('api/user/name-change', data).catch(err => {
            this.setState({
                nameErr: err.response.status === 404 ? "Username taken" :
                    `Failed with ${err.response.status}. Try again later.`
            })
        }).then(res => {
            if (res !== undefined) {
                Cookies.set("username", this.state.username);
                window.location.reload();
            }
        })
    }

    toggleName = isEmail => {
        if (isEmail) {
            if (this.state.emailEdit) {
                this.setState({
                    emailErr: "",
                    email: Cookies.get("email")
                })
            }
            this.setState({ emailEdit: !this.state.emailEdit });
        }
        else {
            if (this.state.nameEdit) {
                this.setState({
                    nameErr: "",
                    username: Cookies.get("username")
                })
            }
            this.setState({ nameEdit: !this.state.nameEdit });
        }
    }

    render(){
        return(
            <div>
                <h1>Account Details</h1>
                <div className="CredParent">
                <div className="CredChild">
                <form onSubmit={e => this.updateEmail(e)}>
                <h3 style={{color: "#003fa3"}}>Email</h3>
                <TextField
                    className="CredText"
                    name="email"
                    variant="outlined"
                    value={this.state.email}
                    onChange={e => { this.setState({ email: e.target.value }) }}
                    disabled={!this.state.emailEdit}
                    error={this.state.emailErr !== ""}
                    helperText={this.state.emailErr}
                />
                <br/>
                <button onSubmit={e => this.updateEmail(e)} hidden={!this.state.emailEdit}>Update</button>
                <button type="button"
                onClick={() => this.toggleName(true)}>
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
                    error={this.state.nameErr !== ""}
                    helperText={this.state.nameErr}
                />
                <br/>
                <button onSubmit={e => this.updateUsername(e)} hidden={!this.state.nameEdit}>Update</button>
                <button type="button"
                onClick={() => this.toggleName(false)}>
                    {this.state.nameEdit ? "Cancel": "Edit"}</button>
                </form>
                </div>

                </div>

                <div className="AccAdmin">
                {this.state.passEdit && <PassChange/>}
                <button onClick={() => {this.setState({passEdit: !this.state.passEdit})}}>
                    Change Password</button><br/>
                {this.state.delAcc && <DeleteAccount/>}
                <button onClick={() => {this.setState({delAcc: !this.state.delAcc})}}>
                    Delete Account</button>
                </div>

            </div>
        );
    }
}