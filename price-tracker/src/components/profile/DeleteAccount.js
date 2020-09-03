import React, {Component} from 'react';
import {TextField} from '@material-ui/core';

export default class DeleteAccount extends Component{
    constructor(props){
        super(props);

        this.state = {
            passConfirm: "",
            passErr: ""
        };
    }

    validateReq = () => {

    }

    handleDelete = e => {

    }

    render(){
        return(
            <div>
                <form>
                    <TextField
                        name="passConfirm"
                        variant="outlined"
                        onChange={e=>{this.setState({passConfirm:e.target.value})}}
                        error={this.state.passErr !== ""}
                        helperText={this.state.passErr}
                    />
                    <br/>
                </form>
            </div>
        )
    }
}