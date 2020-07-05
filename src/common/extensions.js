const creepRequisitioner = require('../modules/creepRequisitioner');

creepRequisitioner.prototype.getType = () => {
	if (this.memory.type) {
		return this.memory.type;
	}
};
