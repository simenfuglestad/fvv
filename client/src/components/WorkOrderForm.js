import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';

class WorkOrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dato: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    render(){

        return(
                <div className='caseRegistration'>
                    <form className='caseRegistration-form' onSubmit={this.handleSubmit}>
                        <label className='caseRegistration-form-label'>
                            Arbeidsordre type:
                            <select className='caseRegistration-form-input' name='arbeidsordretype' value={this.state.arbeidsordretype} onChange={this.handleChange}>
                                <option>-</option>
                                <option>Utskifting</option>  
                                <option>Reparasjon</option>
                                <option>Rensking av kum</option>     
                            </select>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Status:
                            <select className='caseRegistration-form-input' type="text" name='status' value={this.state.status} onChange={this.handleChange} >
                                <option>-</option>
                                <option>Ikke utført</option>  
                                <option>Ny</option>  
                                <option>Planlagt</option>
                                <option>På vent</option>  
                                <option>Under arbeid</option>  
                                <option>Utført</option>    
                            </select>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Dato:
                            <input type='date' name='dato' value={this.state.dato} onChange={this.handleChange}/>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Utføres av:
                            <input type='text' name='utføresav' value={this.state.utføresav} onChange={this.handleChange}/>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Beskrivelse:
                            <textarea className='caseRegistration-form-input' name='beskrivelse' value={this.state.beskrivelse} onChange={this.handleChange}/>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Objektliste:
                            <textarea className='caseRegistration-form-input' name='objektListe' value={this.state.objektListe} onChange={this.handleChange}/>
                            <button className='caseRegistration-form-options' onClick={this.getObjectsFromFilter}>Fra kartfilter</button>
                        </label>

                        <input type='submit' id='caseSubmit' value='Legg til'/>
                        <input type='button' id='caseAbort' value='Avbryt' onClick={this.props.toggleWorkorder} ref={this.abortBtn}/>
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
        event.preventDefault();
        this.props.addWorkorder(this.state)
    }
}

export default WorkOrderForm;

