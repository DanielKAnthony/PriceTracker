import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Cookies from 'js-cookie';
import axios from 'axios';

export default class UserAuthForm extends Component{
    constructor(props){
        super(props);

        this.isLogin = window.location.pathname === "/login";

        this.state = {
            email: "",
            username: "",
            password: "",
            emailErr: "",
            userErr: "",
            passErr: ""
        };
    }

    validRegForm = () => {
        this.setState({
            emailErr: this.state.email.length === 0 ? "Required" : "",
            userErr: this.state.username.length === 0 ? "Required" : "",
            passErr: this.state.password.length === 0 ? "Required" : "",
        });

        if(this.state.email.length === 0 || this.state.username.length === 0 ||
            this.state.password.length === 0) return false;
        
        if(this.state.email.indexOf('@') < 1){
            this.setState({emailErr:"Invalid format"});
            return false;
        }

        if(this.state.username.indexOf('@') !== -1){
            this.setState({userErr:"Invalid character"});
            return false;
        }

        if (this.state.username.length > 32) {
            this.setState({ userErr: "Max 32 characters" });
            return false;
        }

        if(this.state.password.length < 8){
            this.setState({passErr:"Must be at least 8 characters"});
            return false;
        }

        return true;
    }

    validLogForm = () => {
        this.setState({
            emailErr: this.state.email === "" ? "Required": "",
            passErr: this.state.password === "" ? "Required": ""
        });

        if(this.state.email.length === 0 || this.state.password === 0)
            return false;

        var failed = false;
        axios.get('api/user/logauth', {
            params: {
                namefield: this.state.email,
                pass: this.state.password
            }
        }).catch(error => {
            console.log("ERROR HERE: " + error);
            this.setState({ emailErr: "Invalid name or password" });
            failed = true;
        }).then(res => {
            if (failed) return false;
            Cookies.set("username", res.data.username, { sameSite: 'strict' });
            Cookies.set("email", res.data.email, { sameSite: 'strict' });
            document.location.replace(window.location.origin + "/");
            return true;
        });
    }

    formIsValid = () => {
        if(this.isLogin) return this.validLogForm();
        return this.validRegForm();
    }

    handleSubmit = e => {
        e.preventDefault();

        if(!this.formIsValid()) return;

        if (!this.isLogin) {
            const userData = {
                "Email": this.state.email,
                "Username": this.state.username,
                "Password": this.state.password
            }
            axios.post('/api/user', userData).then(res => {
                this.setState({
                    emailErr: res.data.email === null ? "Email taken" : "",
                    userErr: res.data.username === null ? "Username taken" : ""
                });

                if (res.data.email === null || res.data.username === null)
                    return;

                Cookies.set("username", this.state.username, { sameSite: 'strict' });
                Cookies.set("email", this.state.email, { sameSite: 'strict' });
                document.location.replace(window.location.origin + "/");
            })
        }
    }

    render() {
        return(
            <div className="RegParent">
                <form type="submit" onSubmit={this.handleSubmit}>
            
            <TextField 
                name="email"
                placeholder={this.isLogin ? "Email or username":"Email"}
                variant="outlined" 
                onChange={e => this.setState({email:e.target.value})}
                error={this.state.emailErr !== ""}
                helperText={this.state.emailErr}
                />
            <br />
            
            {!this.isLogin &&
            <div>
                <TextField 
                name="username"
                placeholder="Username"
                variant="outlined" 
                onChange={e => this.setState({username:e.target.value})}
                error={this.state.userErr !== ""}
                helperText={this.state.userErr}
                />
                <br/>
            </div>
            }

            <TextField 
                name="password"
                placeholder="Password"
                variant="outlined"
                type="password"
                onChange={e => this.setState({password:e.target.value})}
                error={this.state.passErr !== ""}
                helperText={this.state.passErr} 
            />
            <br/>
            <button type="submit" onClick={e => this.handleSubmit(e)}>Submit</button>
            </form>
            </div>
        )
    }
}