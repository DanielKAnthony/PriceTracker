import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

export default class RegForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            username: "",
            password: ""
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state.email);
        console.log(this.state.username);
        console.log(this.state.password);
    }

    render() {
        return(
            <div className="RegParent">
            <form type="submit" onSubmit={this.handleSubmit}>
            <TextField 
                name="email"
                placeholder="Email"
                onChange={e => this.setState({email:e.target.value})}
                
            />
            <br/>
            <TextField 
                name="username"
                placeholder="Username"
                onChange={e => this.setState({username:e.target.value})}
                
            />
            <br/>
            <TextField 
                name="password"
                placeholder="Password"
                type="password"
                onChange={e => this.setState({password:e.target.value})}
                
            />
            <br/>
            <button type="submit" onClick={e => this.handleSubmit(e)}>Submit</button>
            </form>
            </div>
        )
    }
}