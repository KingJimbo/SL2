const { OPERATION_TYPE, OBJECT_TYPE } = require('../common/constants');
const { saveObject } = require('../actions/common');


module.exports = {

  createBuildOperation = function (structureType, x, y, room) {
    saveObject({objectType:OBJECT_TYPE.OPERATION, operationType: OPERATION_TYPE.BUILD, structureType, x, y, room});
  },
}