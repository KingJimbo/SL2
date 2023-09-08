const surveyRoomDroppedResources = (room) => {
	if (process.env.NODE_ENV === "development") {
		console.log(`surveyRoomDroppedResources ${room.name} TODO`);
	}

	// const droppedResources = room.find(FIND_DROPPED_RESOURCES);
	// if (droppedResources) {
	// 	droppedResources.forEach((droppedResource) => {
	// 		resourceModule.addPickupRequest(droppedResource);
	// 	});
	// }
};

module.exports = surveyRoomDroppedResources;
