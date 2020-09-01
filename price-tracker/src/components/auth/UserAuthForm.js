import React, { Component } from 'react';
import { TextField, CircularProgress } from '@material-ui/core';
import Cookies from 'js-cookie';
import axios from 'axios';
import './styling/UserAuthStyle.css';

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
            passErr: "",
            isLoading: false
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
        this.setState({ isLoading: true });
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
            this.setState({ isLoading: false });
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
        if (this.state.isLoading) return;

        if(!this.formIsValid()) return;

        if (!this.isLogin) {
            this.setState({ isLoading: true });
            const userData = {
                "Email": this.state.email,
                "Username": this.state.username,
                "Password": this.state.password
            }
            axios.post('/api/user', userData).catch(e => {
                this.setState({
                    isLoading: false,
                    emailErr: `Something went wrong: ${e.response.status}`
                })
            })
            .then(res => {
                this.setState({
                    isLoading: false,
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
                <form type="submit" className="AuthForm" onSubmit={this.handleSubmit}>
                {this.state.isLoading && <CircularProgress id="CLoader" />}
                <h2 style={{ marginBottom: "3vh" }}>{this.isLogin ? "Sign In" : "Register"}</h2>
                <TextField 
                style={{marginBottom:"2%"}}
                    name="email"
                    placeholder={this.isLogin ? "Email or username":"Email"}
                    variant="outlined" 
                    onChange={e => this.setState({ email: e.target.value })}
                    disabled={this.state.isLoading}
                    error={this.state.emailErr !== ""}
                    helperText={this.state.emailErr}
                    />
                <br />
            
            {!this.isLogin &&
                <div>
                <TextField 
                style={{marginBottom:"2%"}}
                name="username"
                placeholder="Username"
                variant="outlined" 
                onChange={e => this.setState({ username: e.target.value })}
                disabled={this.state.isLoading}
                error={this.state.userErr !== ""}
                helperText={this.state.userErr}
                />
                <br/>
            </div>
            }

            <TextField
                style={{marginBottom:"2%"}}
                name="password"
                placeholder="Password"
                variant="outlined"
                type="password"
                onChange={e => this.setState({ password: e.target.value })}
                disabled={this.state.isLoading}
                error={this.state.passErr !== ""}
                helperText={this.state.passErr} 
            />
            <br/>
            <button type="submit" id="authBtn" onClick={e => this.handleSubmit(e)}>Submit</button>
            {this.isLogin && <p onClick={() => window.location.href="/register"}
            style={{color:"blue",cursor:"pointer",fontWeight:"bold",
            width:"fit-content",margin:"auto",marginTop:"5vh"}}>Register here</p>}
            </form>
            </div>
        )
    }
}