import React, { Component } from 'react';

class DataDisplay extends Component {

    render(){
        const Marker = this.props.showMarkerInfo
        return(
            this.props.showMarkerInfo ?
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
}

export default DataDisplay;