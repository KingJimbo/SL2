const getNextId = require("./getNextId");

getNextCreepName = () => {
	return "Creep_" + getNextId(OBJECT_TYPE.CREEP);
};

exports = getNextCreepName;
