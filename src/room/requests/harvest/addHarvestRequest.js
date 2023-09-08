const createHarvestRequest = require("./createHarvestRequest");
const addHarvestRequestToRoomMemory = require("./addHarvestrequestToRoomMemory");

const addHarvestRequest = (harvestableObject, amount) => {
	if (!harvestableObject) {
		throw Error(`Invalid parameters harvestableObject  ${JSON.stringify(harvestableObject)}`);
	}

	let resourceType = RESOURCE_ENERGY;

	if (harvestableObject.mineralType) {
		resourceType = harvestableObject.mineralType;
	}

	const harvestRequest = createHarvestRequest(harvestableObject.id, resourceType, amount);

	addHarvestRequestToRoomMemory(harvestableObject.room, harvestRequest);
};

module.exports = addHarvestRequest;
