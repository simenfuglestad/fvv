import React, { Component } from 'react';

/**
 * Dropdown list component.
 * properties:
 * title: header of the list
 * list: items to put in the dropdown list
 * selected: currently selected items
 * addFilter: function for handling adding of a filter
 * removeFilter: function for handling removing a filter
 */
class DropDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listOpen: false,
            headerTitle: this.props.title,
            list: this.props.list,
            selected: this.props.selected,
        }
    }

    toggleList(){
        this.setState(prevState => ({
          listOpen: !prevState.listOpen
        }));
    }

    addFilter(filter){
        this.setState(prevState => {
            this.props.addFilter(filter);
            return {selected: prevState.selected.concat(filter)}
        });
    }

    removeFilter(filter){
        this.setState(prevState => {
            this.props.removeFilter(filter);
            return {selected: prevState.selected.filter((i) => i !== filter)}
        });
    }

    render(){
        const{list} = this.props
        const{listOpen, headerTitle} = this.state

        //console.log(this.props.selected)
        //console.log('---')
        //console.log(this.state.selected)
        

        return(
            <div className="dd-wrapper">
                <div className="dd-header" onClick={() => this.toggleList()}>

                    {this.state.selected.length ?
                    this.state.selected.map((item) =>(
                        <div className='test' key={item.nummer}>{item.navn}<button className='removeFilter' onClick={() => this.removeFilter(item)}>X</button></div>
                    ))
                    :
                    <div className="dd-header-title">{headerTitle}</div>
                    }
                </div>
                {listOpen && <ul className="dd-list">
                    {list.map((item) => (
                        <li className="dd-list-item" key={item.nummer} onClick={() => this.addFilter(item)} >{item.navn}</li>
                    ))}
                </ul>}
            </div>
        );
    }
}

export default DropDown;
