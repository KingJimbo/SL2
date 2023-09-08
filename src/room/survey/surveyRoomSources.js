const surveyRoomSource = require("./surveyRoomSource");

const surveyRoomSources = (room) => {
	if (process.env.NODE_ENV === "development") {
		console.log(`surveyRoomSources ${room.name}`);
	}

	const sources = room.find(FIND_SOURCES);

	if (sources) {
		sources.forEach((source) => {
			surveyRoomSource(source);
		});
	}
};

module.exports = surveyRoomSources;
