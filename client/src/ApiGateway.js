import axios from 'axios';
import Datastore from './Datastore';

/**
 * Responsible for sending out api calls and storing responses
 */
export default class ApiGateway {
    constructor(endpoint){
        this.endpoint = endpoint;
    }

    async apiCall(request){
      let res = await axios.get(this.endpoint + request, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}});
  
      let data = res.data.objekter;
      console.log(res)
  
      while (res.data.metadata.returnert === 1000) {
        res = await axios.get(res.data.metadata.neste.href, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}});
        data = data.concat(res.data.objekter);
      }
      return data;
    }

    async apiCallSingle(request){
      let res = await axios.get(this.endpoint + request, {headers: {'Accept': 'application/vnd.vegvesen.nvdb-v3-rev1+json'}});
  
      let data = res.data;
      console.log(res)
      return data;
    }
}