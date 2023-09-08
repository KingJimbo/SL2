const filterLookAtAreaResultsArray = (lookResults, filter) => {
	let newResults = [];

	lookResults.forEach((result) => {
		if (result.type == LOOK_STRUCTURES && result.structure.structureType == filter.structure) {
			newResults.push(result);
		}
	});

	return newResults;
};

module.exports = filterLookAtAreaResultsArray;
