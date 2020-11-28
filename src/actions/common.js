module.exports = {
  getNextId = (type) => {
    let id = Memory.ids[type];

    if(!id){
      id = 0;
    }
    id++;
    Memory.ids[type] = id;
    return id;
  },

  saveObject = (object) => {
    let objectCollection = Memory[object.objectType];
    let id = null;
    if(!objectCollection){
      objectCollection = {};
    }

    if(!object.id){
      id = getNextId(OBJECT_TYPE.OPERATION);
      object.id = id;
    } else{
      id = object.id;
    }

    objectCollection[id] = object;

    Memory[objectType] = objectCollection;

    return object;
  }
}