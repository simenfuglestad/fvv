import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';

class CaseRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saksType: '',
            status: '',
            beskrivelse: '',
            objektListe: '',
            selectedFiles: [],
            lat: '',
            lng: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getObjectsFromFilter = this.getObjectsFromFilter.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);

        this.abortBtn = React.createRef();
    }

    componentDidMount(){
        this.setState({...this.props.data})
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.data !== prevProps.data){
            this.setState({...this.props.data})
        }
    }

    render(){

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
                            Plassering:
                            <input className='caseRegistration-form-input' type='number' name='lat' value={this.state.lat} onChange={this.handleChange}></input>
                            <input className='caseRegistration-form-input' type='number' name='lng' value={this.state.lng} onChange={this.handleChange}></input>
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

                        <div className='caseRegistration-form-files'>
                            filer her
                        </div>
                        <label className='caseRegistration-form-label'>
                            Legg ved filer:
                            <FileBase64 multiple={ true } onDone={ this.handleFileSelect.bind(this) } />
                        </label>

                        <input type='submit' id='caseSubmit' value='Lagre'/>
                        <input type='button' id='caseAbort' value='Avbryt' onClick={this.props.toggleCaseReg} ref={this.abortBtn}/>
                    </form>
                </div>
        )
    }

    handleFileSelect(files){
        let newFiles = []

        files.forEach(file => {
            newFiles.push({name: file.name, filestring: file.base64})
        })
        console.log(files)
        this.setState({
            selectedFiles: newFiles
        })
    }

    getObjectsFromFilter(event){
        
        let list = '';

        Object.entries(this.props.map).forEach(([key,value]) => {
            value.forEach(element => { list += element.id + ':' + element.metadata.type.id + ','})
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
        this.props.registerCase({...this.state});
        event.preventDefault();
        this.props.toggleCaseReg();
    }
}

export default CaseRegistration;

