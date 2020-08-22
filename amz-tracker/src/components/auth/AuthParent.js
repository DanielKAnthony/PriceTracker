import React, { Component } from 'react';
import UserAuthForm from './UserAuthForm';

export default class AuthParent extends Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
            <UserAuthForm/>
            </div>
        )
    }
}