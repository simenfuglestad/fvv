

class ColorPicker {
    constructor(){
        this.colorScheme = {
            '#1f78b4': null,
            '#33a02c': null,
            '#e31a1c': null,
            '#ff7f00': null,
            '#6a3d9a': null,
            '#b15928': null,
            '#ffff99': null,
            '#cab2d6': null,
            '#fdbf6f': null,
            '#fb9a99': null,
            '#b2df8a': null,
            '#a6cee3': null};
    }

    get(typeId){
        typeId = String(typeId);
        if(Object.values(this.colorScheme).includes(typeId)){
            return this.getKeyByValue(this.colorScheme, typeId)
        } else {
            for (const [key, value] of Object.entries(this.colorScheme)) {
                if(value === null){
                    this.colorScheme[key] = typeId;
                    return key;
                }
            }
        }
    }

    removeUnusedIds(typeIdsInUse){
        for (const typeId of Object.values(this.colorScheme)) {
            if(!typeIdsInUse.has(typeId) && typeId !== null){
                let key = this.getKeyByValue(this.colorScheme, typeId)
                this.colorScheme[key] = null;
            }
        }
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }
  }

  const instance = new ColorPicker();
  Object.freeze(instance);

  export default instance;
