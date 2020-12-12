const { getNextId } = require("./common");

module.exports = {
	saveObject: (object) => {
		let objectCollection = Memory[object.objectType];
		let id = null;
		if (!objectCollection) {
			objectCollection = {};
		}

		if (!object.id) {
			id = getNextId(OBJECT_TYPE.OPERATION);
			object.id = id;
		} else {
			id = object.id;
		}

		objectCollection[id] = object;

		Memory[object.objectType] = objectCollection;

		return object;
	},

	getObject: (objectType, id) => {
		if (objectType && id) {
			var objectTypeCollection = Memory[objectType];

			if (!objectTypeCollection) {
				objectTypeCollection = {};
			}

			let object = objectTypeCollection[id];

			if (object) {
				return object;
			}
		}

		console.log(`could not find object belonging to objectType:${objectType}, id:${id} `);
		return null;
	},

	getObjects: (objectType) => {
		if (objectType) {
			if (!Memory[objectType]) {
				Memory[objectType] = {};
			}

			return Memory[objectType];
		}

		console.log(`could not find objects belonging to objectType: ${objectType} `);
		return null;
	},

	deleteObject: (objectType, id) => {
		if (objectType && id && Memory[objectType] && Memory[objectType][id]) {
			delete Memory[objectType][id];
			return true;
		}

		console.log(`could not find object belonging to objectType:${objectType}, id:${id} `);
		return false;
	},

	getNextResourceOrderId: () => {
		if (!Memory.counts) {
			Memory.counts = {};
		}

		if (!Memory.counts.resourceOrders) {
			Memory.counts.resourceOrders = 0;
		}
		return `ro${Memory.counts.resourceOrders++}`;
	},

	getNextResourceOrderItemId: () => {
		if (!Memory.counts) {
			Memory.counts = {};
		}

		if (!Memory.counts.resourceOrderItems) {
			Memory.counts.resourceOrderItems = 0;
		}
		return `roi${Memory.counts.resourceOrderItems++}`;
	},
};
