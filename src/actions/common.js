module.exports = {
	isANumber: (number) => {
		return typeof number == "number";
	},

	getPosName: (x, y) => {
		return `${x}-${y}`;
	},

	getNextId: (type) => {
		let id = Memory.ids[type];

		if (!id) {
			id = 0;
		}
		id++;
		Memory.ids[type] = id;
		return `${type}-${id}`;
	},

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

		Memory[objectType] = objectCollection;

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

	deleteObject: (objectType, id) => {
		if (objectType && id && Memory[objectType] && Memory[objectType][id]) {
			delete Memory[objectType][id];
			return true;
		}

		console.log(`could not find object belonging to objectType:${objectType}, id:${id} `);
		return false;
	},
};
