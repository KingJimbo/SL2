(function () {
	/* CREEP OVERRIDES START */
	if (!Creep.prototype.exitRoom) {
		Creep.prototype.exitRoom = function () {
			const currentPosition = this.pos;

			if (currentPosition.x === 0) {
				this.move(LEFT);
				return true;
			} else if (currentPosition.y === 0) {
				this.move(TOP);
				return true;
			} else if (currentPosition.x === COORDINATES_MAX_SIZE) {
				this.move(RIGHT);
				return true;
			} else if (currentPosition.y === COORDINATES_MAX_SIZE) {
				this.move(BOTTOM);
				return true;
			}

			return false;
		};
	}

	if (!Creep.prototype.willDieSoon) {
		Creep.prototype.willDieSoon = function () {
			return this.ticksToLive < CREEP_WILL_DIE_SOON_TICK_VALUE;
		};
	}

	if (!Room.prototype.lookForAtSurroundingArea) {
		Room.prototype.lookForAtSurroundingArea = function (type, x, y, asArray, distance) {
			if (!distance) {
				distance = 1;
			}

			const top = y - distance,
				left = x - distance,
				right = x + distance,
				bottom = y + distance;

			if (process.env.NODE_ENV === "development") {
				global.logger.log(`type: ${type}, top: ${top}, left: ${left}, right: ${right}, bottom: ${bottom}`);
			}

			return this.lookForAtArea(type, top, left, bottom, right, asArray);
		};
	}

	if (!Room.prototype.lookAtSurroundingArea) {
		Room.prototype.lookAtSurroundingArea = function (x, y, asArray, distance) {
			if (!distance) {
				distance = 1;
			}

			const top = y - distance,
				left = x - distance,
				right = x + distance,
				bottom = y + distance;

			if (process.env.NODE_ENV === "development") {
				global.logger.log(` top: ${top}, left: ${left}, right: ${right}, bottom: ${bottom}`);
			}

			return this.lookAtArea(top, left, bottom, right, asArray);
		};
	}

	// if (!StructureTower.prototype._attack) {
	// 	StructureTower.prototype._attack = StructureTower.prototype.attack;

	// 	StructureTower.prototype.attack = function (objectToAttack) {
	// 		if (objectToAttack) {
	// 			return this._attack(objectToAttack);
	// 		}
	// 	};
	// }

	/* CREEP OVERRIDES END */
})();
