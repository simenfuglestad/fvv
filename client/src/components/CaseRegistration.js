import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';
import WorkOrderForm from './WorkOrderForm';

class CaseRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addingWorkorder: false,
            saksType: '',
            status: '',
            beskrivelse: '',
            objektListe: '',
            gjentagende: '',
            dato: '',
            selectedFiles: [],
            lat: '',
            lng: '',
            arbeidsordre: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.getObjectsFromFilter = this.getObjectsFromFilter.bind(this);
        this.toggleWorkorder = this.toggleWorkorder.bind(this);
        this.workorderSubmit = this.workorderSubmit.bind(this);

        this.abortBtn = React.createRef();
    }

    componentDidMount(){
        this.setState({...this.props.data})
    }

    shouldComponentUpdate(nextProps, nextState){
        console.log(nextProps)
        console.log(nextState)
        if(nextState.objektListe !== this.state.objektListe){
            this.props.addMarkerCollection(nextState.objektListe, 'caseObjects', true)
            return false;
        }
        if(nextProps.clickedMarker !== this.props.clickedMarker){
            console.log(nextProps.clickedMarker)
            this.setState({objektListe: this.addOrRemoveObject(nextProps.clickedMarker.object)})
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.data !== prevProps.data){
            this.setState({...this.props.data})
        }
    }

    render(){

        return(
                this.state.addingWorkorder ?
                <WorkOrderForm toggleWorkorder={this.toggleWorkorder} addWorkorder={this.workorderSubmit}/>
                :
                <div className='caseRegistration'>
                    <form className='caseRegistration-form' onSubmit={this.handleSubmit}>
                        <label className='caseRegistration-form-label'>
                            Sakstype:
                            <select className='caseRegistration-form-input' name='saksType' value={this.state.saksType} onChange={this.handleChange}>
                                <option>-</option>
                                <option>Hendelse</option>  
                                <option>Vedlikehold</option>
                                <option>planlagt arbeide</option>     
                            </select>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Gjentagende:
                            <select className='caseRegistration-form-input' name='gjentagende' value={this.state.gjentagende} onChange={this.handleChange}>
                                <option>-</option>
                                <option>Ukentlig</option>  
                                <option>Månedlig</option>
                                <option>Årlig</option>    
                            </select>
                        </label>

                        <label className='caseRegistration-form-label'>
                            Dato:
                            <input type='date' name='dato' value={this.state.dato} onChange={this.handleChange}/>
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

                        <div className='caseRegistration-form-files'>
                            Arbeidsordre:
                            {this.state.arbeidsordre.map((item, index) => {
                                console.log(item)
                                return(<p key ={index}>{item.arbeidsordretype}</p>)
                            })}
                        </div>
                        <label className='caseRegistration-form-label'>
                            <button onClick={this.toggleWorkorder}>Legg til arbeidsordre</button>
                        </label>

                        <input type='submit' id='caseSubmit' value='Lagre'/>
                        <input type='button' id='caseAbort' value='Avbryt' onClick={this.props.toggleCaseReg} ref={this.abortBtn}/>
                    </form>
                </div>
        )
    }

    addOrRemoveObject(object){
        let objectList = this.state.objektListe;
        let newObject = object.id + ':' + object.metadata.type.id;

        objectList = objectList.split(',');
        console.log(newObject)
        if(objectList.includes(newObject)){
            objectList = objectList.filter(item => (item !== newObject))
        } else {
            objectList.push(newObject)
        }

        objectList = objectList.join(',')

        console.log(objectList)
        return objectList;
    }

    toggleWorkorder(){
        this.setState(prevState => ({addingWorkorder: !prevState.addingWorkorder}))
    }

    workorderSubmit(workorder){
        console.log(workorder)
        if(workorder !== undefined){
            this.setState(prevstate => ({addingWorkorder: false, arbeidsordre: prevstate.arbeidsordre.concat(workorder)}))
            return;
        }
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
        let state = {...this.state}
        delete state.addingWorkorder
        this.props.registerCase(state);
        event.preventDefault();
        this.props.toggleCaseReg();
    }
}

export default CaseRegistration;

