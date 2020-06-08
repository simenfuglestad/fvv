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
            headerTitle: this.props.title
        }
    }

    toggleList(){
        this.setState(prevState => ({
          listOpen: !prevState.listOpen
        }))
    }

    render(){
        const{list} = this.props
        const{listOpen, headerTitle} = this.state

        return(
            <div className="dd-wrapper">
                <div className="dd-header" onClick={() => this.toggleList()}>
                    <div className="dd-header-title">{headerTitle}</div>
                </div>
                {listOpen && <ul className="dd-list">
                    {list.map((item) => (
                        <li className="dd-list-item" key={item.nummer} onClick={() => this.props.onClick(item)} >{item.navn}</li>
                    ))}
                </ul>}
            </div>
        );
    }
}

export default DropDown;
