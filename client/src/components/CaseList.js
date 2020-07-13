import React, { Component, useRef } from 'react';
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
                  accessor: "id",
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

      this.selected = null;
      this.onCaseClick = this.onCaseClick.bind(this);
    }

    componentDidUpdate(){
      if(this.props.selected === null){
        this.selected = null;
        return;
      }
      if(this.props.selected !== this.selected){
        this.selected = this.props.selected.id;
      }
    }


    render(){
        return(
            <div className='caseList'>
              <button className='closeCaseListBtn' onClick={() => {this.props.toggleCaseList()}}>X</button>
              <Table 
                columns={this.columns} 
                data={this.props.caseList} 
                onCaseClick={this.onCaseClick}
                selected={this.selected}
              />
            </div>
        )
    }



    onCaseClick(id){
      if(this.selected === id){
        this.props.toggleCaseList(id);
      }

      this.selected = id;
      this.props.selectCase(id)
    }
}

export default CaseList;