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
	/* CREEP OVERRIDES END */
})();
