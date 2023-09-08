const createHarvestRequest = (id, resourceType, amount) => {
	return {
		amount,
		resourceType,
		id,
	};
};

module.exports = createHarvestRequest;
