import React, { Component } from 'react';
import Table from './Table';

class CaseList extends Component {
    constructor(props) {
        super(props);

        this.columns = 
              [{
                Header: "Saksliste",
                // First group columns
                columns: [
                  {
                    Header: "Type",
                    accessor: "saksType"
                  },
                  {
                    Header: "Status",
                    accessor: "status"
                  }
                ]
              }]
    }


    render(){
        console.log(this.props.caseList)
        return(
            <div className='caseList'>
                <div className='caseList-grid'>
                    <Table columns={this.columns} data={this.props.caseList}/>
                </div>
            </div>
        )
    }
}

export default CaseList;