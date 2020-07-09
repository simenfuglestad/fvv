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
                    Header: "ID",
                    accessor: "id"
                  },
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

              this.onCaseClick = this.onCaseClick.bind(this);
    }


    render(){
        return(
            <div className='caseList'>
              <button className='closeCaseListBtn' onClick={() => {this.props.toggleCaseList()}}>X</button>
              <Table columns={this.columns} data={this.props.caseList} onCaseClick={this.onCaseClick}/>
            </div>
        )
    }

    onCaseClick(event){
      let caseId = event.currentTarget.children[0].innerHTML;
      console.log(caseId)
      this.props.toggleCaseList(caseId)
    }
}

export default CaseList;