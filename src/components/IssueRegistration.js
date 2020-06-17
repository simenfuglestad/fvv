import React, { Component } from 'react';

class IssueRegistration extends Component {
    constructor(props) {
        super(props);

    }

    render(){
        return(
            <div className='issueRegistration'>
                <form className='issueRegistration-form'>
                    <label className='issueRegistration-form-label'>Hendelsestype</label>
                    <input type='text' className='issueRegistration-form-input'></input>
                    <label className='issueRegistration-form-label'>input1</label>
                    <input type='text' className='issueRegistration-form-input'></input>
                    <label className='issueRegistration-form-label'>input2</label>
                    <input type='text' className='issueRegistration-form-input'></input>
                    <input type='submit' className='issueRegistration-form-input'></input>
                </form>
            </div>
        )
    }
}

export default IssueRegistration;

