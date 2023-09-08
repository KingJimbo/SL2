const removeObjectMemory = (obj) => {
	const objectMemory = getObjectMemory(obj.objectType);

	if (objectMemory[obj.id]) {
		delete objectMemory[obj.id];
	}
};

module.exports = removeObjectMemory;
