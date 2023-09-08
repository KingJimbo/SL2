const getCreepBodyTotalCost = (creepBodyType, ratio = 1) => {
	const creepBody = CREEP_BODIES[creepBodyType];

	if (!creepBody) {
		throw new Error(`Can't find creep body of type ${creepBodyType}`);
	}

	if (ratio > creepBody.maxRatio) {
		throw new Error(`Can't calculate creep body past it's maximum ratio`);
	}

	let creepBodyCostTotal = 0;

	for (const bodyType in creepBody) {
		if (bodyType !== "maxRatio") {
			creepBodyCostTotal += creepBody[bodyType] * BODYPART_COST[bodyType] * ratio;
		}
	}

	return creepBodyCostTotal;
};

module.exports = getCreepBodyTotalCost;
