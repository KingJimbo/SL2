module.exports = {
	colorPositionByStructure: (position, structureType) => {
		var fill = "#ffffff";

		switch (structureType) {
			case STRUCTURE_SPAWN:
				fill = "#ff0000";
				break;
			case STRUCTURE_EXTENSION:
				fill = "#ffff00";
				break;
			case STRUCTURE_STORAGE:
				fill = "#999966";
				break;
			case STRUCTURE_TOWER:
				fill = "#00ff00";
				break;
			case STRUCTURE_TERMINAL:
				fill = "#000000";
				break;
			case STRUCTURE_POWER_SPAWN:
				fill = "#ff6666";
				break;
			case STRUCTURE_FACTORY:
				fill = "#4d4dff";
				break;
			case STRUCTURE_NUKER:
				fill = "#0000ff";
				break;
			case STRUCTURE_LAB:
				fill = "#cc0099";
				break;
		}

		const style = { radius: 1, fill };

		//console.log(`coloring position: ${JSON.stringify(pos)}, style: ${style}`);

		Game.map.visual.circle(position, style);
	},
};
