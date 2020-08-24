import React, { Component } from 'react';
import UserAuthForm from './UserAuthForm';
import FeatureText from './FeatureText';
import './styling/ParentStyle.css';

export default class AuthParent extends Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="AuthContainer">
            <div >
            <UserAuthForm/>
            </div>
            <div className="AuthSub" id="authRight">
                <FeatureText/>
            </div>
            </div>
        )
    }
}