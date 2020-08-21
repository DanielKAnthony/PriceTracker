import React, { Component } from 'react';
import LoginForm from './LoginForm';
import RegForm from './RegForm';

export default class AuthParent extends Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
            {window.location.pathname === "/login" ? 
                <LoginForm/>:<RegForm/>
            
            }
            </div>
        )
    }
}