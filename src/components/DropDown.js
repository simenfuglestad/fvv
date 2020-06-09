import React, { Component } from 'react';

/**
 * Dropdown list component.
 * properties:
 * headerTitle: header of the list
 * list: items to put in the dropdown list
 */
class DropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listOpen: false,
            headerTitle: this.props.title,
            municipalities: []
        }
    }

    toggleList(){
        this.setState(prevState => ({
          listOpen: !prevState.listOpen
        }));
    }

    addMunicipalityFilter(item){
        this.setState(prevState => {
            this.props.handleFilters(prevState.municipalities.concat(item));
            return{municipalities: prevState.municipalities.concat(item)};  
        });
        
    }

    removeMunicipalityFilter(item){
        this.setState(prevState => {
            this.props.handleFilters(prevState.municipalities.filter((i) => i !== item));
            return{municipalities: prevState.municipalities.filter((i) => i !== item)};
        });
    }


    render(){
        const{list} = this.props
        const{listOpen, headerTitle} = this.state
        

        return(
            <div className="dd-wrapper">
                <div className="dd-header" onClick={() => this.toggleList()}>

                    {this.state.municipalities.length ?
                    this.state.municipalities.map((item) =>(
                        <div className='test' key={item.nummer}>{item.navn}<button className='removeFilter' onClick={() => this.removeMunicipalityFilter(item)}>X</button></div>
                    ))
                    :
                    <div className="dd-header-title">{headerTitle}</div>
                    }
                </div>
                {listOpen && <ul className="dd-list">
                    {list.map((item) => (
                        <li className="dd-list-item" key={item.nummer} onClick={() => this.addMunicipalityFilter(item)} >{item.navn}</li>
                    ))}
                </ul>}
            </div>
        );
    }
}

export default DropDown;
