const surveyRoomSources = require("./surveyRoomSources");
const surveyRoomMinerals = require("./surveyRoomMinerals");
const surveyRoomDroppedResources = require("./surveyRoomDroppedResources");

const surveyRoomResources = (room) => {
	if (process.env.NODE_ENV === "development") {
		console.log(`surveyRoomResources ${room.name}`);
	}

	surveyRoomSources(room);
	surveyRoomMinerals(room);
	surveyRoomDroppedResources(room);
};

module.exports = surveyRoomResources;
