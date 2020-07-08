import React, { Component } from 'react';

class CaseRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getObjectsFromFilter = this.getObjectsFromFilter.bind(this);

        this.abortBtn = React.createRef();
    }

    render(){
        console.log(this.props.map)
        
        return(
                <div className='caseRegistration'>
                    <form className='caseRegistration-form' onSubmit={this.handleSubmit}>
                        <label className='caseRegistration-form-label'>
                            Sakstype:
                            <select className='caseRegistration-form-input' name='saksType' value={this.state.saksType} onChange={this.handleChange}>
                                <option>-</option>
                                <option>Skade</option>  
                                <option>Vedlikehold</option>  
                                <option>Annet</option>  
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
                            Beskrivelse:
                            <textarea className='caseRegistration-form-input' name='beskrivelse' value={this.state.beskrivelse} onChange={this.handleChange}/>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Objektliste:
                            <textarea className='caseRegistration-form-input' name='objektListe' value={this.state.objektListe} onChange={this.handleChange}/>
                            <button className='caseRegistration-form-options' onClick={this.getObjectsFromFilter}>Fra kartfilter</button>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Legg ved filer:
                            <input type="file"  />
                        </label>

                        <input type='submit' id='caseSubmit' value='Lagre'/>
                        <input type='button' id='caseAbort' value='Avbryt' onClick={() => {this.props.handleClose(this.abortBtn)}} ref={this.abortBtn}/>
                    </form>
                </div>
        )
    }

    getObjectsFromFilter(event){
        
        let list = '';

        Object.entries(this.props.map).forEach(([key,value]) => {
            value.forEach(element => { list += element.id + ', '})
        });

        this.setState({objektListe: list})
        event.preventDefault();
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
        console.log(this.state)
        this.props.registerCase({...this.state})
        event.preventDefault();
    }
}

export default CaseRegistration;

