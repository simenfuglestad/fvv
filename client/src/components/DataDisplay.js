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
                {Marker.egenskaper.map(egenskap => {
                    if(egenskap.verdi && egenskap.egenskapstype !== 'Geometri'){
                        return <p key={egenskap.id}>{egenskap.navn}: {egenskap.verdi}</p>
                    }

                    return null;  
                })}
                {Marker.relasjoner.foreldre &&
                    <label className='DataDisplay-label'>
                        Foreldre:
                        {Marker.relasjoner.foreldre.map(relasjon => {
                            return <p key={relasjon.id}>{relasjon.type.navn}</p>
                        })}
                    </label>
                }
                {Marker.relasjoner.barn &&
                    <label className='DataDisplay-label'>
                        Barn:
                        {Marker.relasjoner.barn.map(relasjon => {
                            return <p key={relasjon.id}>{relasjon.type.navn}</p>
                        })}
                    </label>
                }
               

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