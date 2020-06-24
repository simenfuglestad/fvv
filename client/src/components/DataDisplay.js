import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

class DataDisplay extends Component {

    render(){
        const Marker = this.props.showMarkerInfo
        return(
            Marker ?
            <div className='dataDisplay'>
                <p>{Marker.metadata.type.navn}</p>
                <p>ID: {Marker.id}</p>
                <p> </p>
                {Marker.egenskaper.map((egenskap) => {
                    if(egenskap.verdi){
                        return <p key={egenskap.id}>{egenskap.navn}: {egenskap.verdi}</p>
                    } else {
                        return;
                    }  
                })}

                <div>
                    <button>Rediger</button>
                    <button>Opprett Sak</button>
                </div>
            </div>
            :
            <div></div>
        )
    }

    handleClickOutside(event){
        this.props.handleClickOutside();
    }

}

export default onClickOutside(DataDisplay);