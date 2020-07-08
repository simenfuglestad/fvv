import React, { Component } from 'react';

class CaseList extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div className='caseList'>
                <h2>Saksliste</h2>
                <div className='caseList-grid'>
                    {this.props.caseList.map(element => (<p>{element.saksType} {element.status} {element.beskrivelse}</p>))}
                </div>
            </div>
        )
    }
}

export default CaseList;