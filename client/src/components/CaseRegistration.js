import React, { Component } from 'react';

class CaseRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            date: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render(){
        
        return(
                <div className='caseRegistration'>
                    <form className='caseRegistration-form' onSubmit={this.handleSubmit}>
                        <label className='caseRegistration-form-label'>
                            Sakstype
                            <input
                                name='type'
                                type='text' 
                                className='caseRegistration-form-input'
                                value={this.state.type} 
                                onChange={this.handleChange}
                            />
                        </label>
                        <label className='caseRegistration-form-label'>
                            Dato
                            <input
                                name='date' 
                                type='text' 
                                className='caseRegistration-form-input'
                                value={this.state.date} 
                                onChange={this.handleChange}
                            />
                        </label>
                        <label className='caseRegistration-form-label'>
                            Sted
                            <input 
                                name='latitude'
                                type='text' 
                                className='caseRegistration-form-input' 
                                value={this.state.latitude}
                                onChange={this.handleChange}
                            />
                            <input
                                name='longitude'
                                type='text'
                                className='caseRegistration-form-input' 
                                value={this.state.longitude}
                                onChange={this.handleChange}
                            />
                        </label>
                        <input type='submit' className='caseRegistration-form-input'></input>
                    </form>
                </div>
        )
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event){
        let newIssue = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [this.state.latitude, this.state.longitude]
            },
            properties: {
                name: this.state.type,
                date: this.state.date
            }
        }

        this.props.handleRegistration(newIssue);
        event.preventDefault();
    }
}

export default CaseRegistration;

