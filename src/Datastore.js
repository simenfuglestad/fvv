/**
 * Globally accessible data
 * Not in use yet
 */ 
class Datastore {
    constructor(){
      this._data = {};
    }
  
    add(key, value){
      this._data[key] = value;
    }
  
    get(key){
      return this._data[key];
    }
  }
  
  const instance = new Datastore();
  Object.freeze(instance);
  
  export default instance;