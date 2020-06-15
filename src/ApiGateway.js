import axios from 'axios';
import Datastore from './Datastore';

/**
 * Responsible for sending out api calls and storing responses
 * TODO
 * Not in use yet
 */
export default class ApiGateway {
    constructor(endpoint){
        this.endpoint = endpoint;
    }

    async apiCall(request){
        let res = await axios.get(this.endpoint + request, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}})
        let data = res.data;
        this.setState(prevState => ({
          [request]: prevState[request].concat(data.objekter)
        }));  
        console.log(data)
        while (data.metadata.returnert === 1000) {
          res = await axios.get(data.metadata.neste.href, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}})
          data = res.data;
          this.setState(prevState => ({
            [request]: prevState[request].concat(data.objekter)
          }));  
          console.log(data)
        }
      }
}