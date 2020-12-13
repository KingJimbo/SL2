//const { STRUCTURE_CONTROLLER, RESOURCE_ENERGY } = require("../testing/constants");

/* resource.js */
module.exports = (function (App) {
	let resource = {};

	if (!Memory.resourceOrders) {
		Memory.resourceOrders = {};
	}

	if (!Memory.resourceOrderItems) {
		Memory.resourceOrderItems = {};
	}

	// for (const i in Memory.resourceOrders) {
	// 	let resourceOrder;
	// }

	resource.createResourceOrder = (room, destinationId, type, amount, isContructionSite) => {
		if (!room || !type || !amount) {
			console.log("createResourceOrder: Invalid parameters");
			return false;
		}

		//console.log(`createResourceOrder: ${JSON.stringify({ room, destinationId, type, amount })})`);

		const destination = Game.getObjectById(destinationId);

		if (!destination) {
			console.log(`createResourceOrder: Couldn't find destination for id: ${destinationId}`);
		}

		if (!room.memory.resourceOrders) {
			room.memory.resourceOrders = {};
		}

		if (!room.memory.resourceOrders[type]) {
			room.memory.resourceOrders[type] = {};
		}

		if (!room.memory.resourceOrders[type][destination.structureType]) {
			room.memory.resourceOrders[type][destination.structureType] = [];
		}

		let resourceOrder = {
			id: resource.getNextResourceOrderId(),
			destinationId,
			type,
			amount,
			amountPending: 0,
			amountFulfilled: 0,
			isContructionSite,
			orderItemIds: {},
			createdTime: Game.time,
		};

		if (!Memory[destination.structureType]) {
			Memory[destination.structureType] = {};
		}

		if (!Memory[destination.structureType][destination.id]) {
			Memory[destination.structureType][destination.id] = {};
		}

		if (!Memory[destination.structureType][destination.id].resourceOrderIds) {
			Memory[destination.structureType][destination.id].resourceOrderIds = {};
		}

		if (destination.structureType !== STRUCTURE_CONTROLLER && Memory[destination.structureType][destination.id].resourceOrderIds[type]) {
			let orderId = Memory[destination.structureType][destination.id].resourceOrderIds[type];
			let existingOrder = Memory.resourceOrders[orderId];

			// if it exists there has been an issue with making another order at the structure side
			if (existingOrder) {
				console.log(`found existing resource order id: ${existingOrder.id}`);
				return existingOrder;
			} //else continue as normal as it will be overridden anyways
		}

		Memory.resourceOrders[resourceOrder.id] = resourceOrder;

		if (destination.structureType !== STRUCTURE_CONTROLLER) {
			room.memory.resourceOrders[type][destination.structureType].push(resourceOrder.id);
		}

		Memory[destination.structureType][destination.id].resourceOrderIds[type] = resourceOrder.id;

		return resourceOrder;
	};

	resource.findNextResourceOrderToFulfill = (room, creep, type, amount) => {
		if (!room || !creep || !type || !amount) {
			console.log("findNextResourceOrderToFulfill: Invalid parameters");
		}

		resource.checkRoomForResourceOrder(room, type);

		var strucIndex = 0,
			order = null,
			getOrderAsNormal = true;
		//console.log(`looking for strucIndex: ${strucIndex}, RESOURCE_ORDER_STRUCTURE_PRIORITY length: ${RESOURCE_ORDER_STRUCTURE_PRIORITY.length}`);

		//for(var strucIndex = 0; strucIndex < RESOURCE_ORDER_STRUCTURE_PRIORITY.length )

		if (room.controller.ticksToDowngrade < MIN_CONTROLLER_TICKS_TO_DOWNGRADE) {
			let controllerResourceOrderIds = resource.getStructureResourceOrderId(room.controller.structureType, RESOURCE_ENERGY);

			if (!controllerResourceOrderIds) {
				getOrderAsNormal = false;
			}
		}

		if (getOrderAsNormal) {
			while (!order && strucIndex < RESOURCE_ORDER_STRUCTURE_PRIORITY.length) {
				const structure = RESOURCE_ORDER_STRUCTURE_PRIORITY[strucIndex];

				// console.log(
				// 	`looking for ${structure}, strucIndex: ${strucIndex}, RESOURCE_ORDER_STRUCTURE_PRIORITY length: ${RESOURCE_ORDER_STRUCTURE_PRIORITY.length}`
				// );

				if (!room.memory.resourceOrders[type][structure]) {
					room.memory.resourceOrders[type][structure] = [];
				}

				//console.log(`room.memory.resourceOrders[type][structure] ${JSON.stringify(room.memory.resourceOrders[type][structure])}`);

				if (room.memory.resourceOrders[type][structure].length) {
					// console.log(
					// 	`room resourceOrder of type: ${type}, of struc: ${structure}, length: ${room.memory.resourceOrders[type][structure].length}`
					// );
					var queueIndex = 0;
					while (!order && queueIndex < room.memory.resourceOrders[type][structure].length) {
						var orderId = room.memory.resourceOrders[type][structure][queueIndex];

						//console.log(`looking for order with id ${orderId}, queueIndex: ${queueIndex}`);

						var currentOrder = Memory.resourceOrders[orderId];

						//console.log(`currentOrder ${JSON.stringify(currentOrder)}`);

						if (!currentOrder || currentOrder.amountPending + currentOrder.amountFulfilled >= currentOrder.amount) {
							//console.log(`shifting order`);
							room.memory.resourceOrders[type][structure].shift();
						} else if (currentOrder.amountPending + currentOrder.amountFulfilled < currentOrder.amount) {
							//console.log(`selecting order`);
							order = currentOrder;
						}

						queueIndex++;
					}
					//queue = room.memory.resourceOrders[type][structure];
				}
				//test
				strucIndex++;
			}
		}

		if (!order) {
			if (type === RESOURCE_ENERGY) {
				// for now go to controller this will probably need to chnage to include other destinations
				order = resource.createResourceOrder(room, room.controller.id, type, amount);
			} else {
				//TODO stick it in storage;
			}
		}

		//console.log(`findNextResourceOrderToFulfill: order: ${JSON.stringify(order)}`);

		let item = resource.createResourceOrderItem(creep, type, amount, order);

		return item;
	};

	resource.checkRoomForResourceOrder = (room, type) => {
		if (!room || !type) {
			console.log("checkRoomForResourceOrder: Invalid parameters");
		}

		if (!room.memory.resourceOrders) {
			room.memory.resourceOrders = {};
		}

		if (!room.memory.resourceOrders[type]) {
			room.memory.resourceOrders[type] = {};
		}
	};

	resource.createResourceOrderItem = (creep, type, amount, order) => {
		if (!creep || !type || !amount || !order) {
			console.log("createResourceOrderItem: Invalid parameters");
			return false;
		}

		const amountLeft = order.amount - (order.amountPending + order.amountFulfilled);

		if (amountLeft <= 0) {
			console.log("createResourceOrderItem: amountLeft is less than originally requested!");
			resource.deleteOrder(order);
			return false;
		}

		// check if it's the full creep carry amount to be fulfilled
		const amountToUpdate = amount > amountLeft ? amountLeft : amount;

		let resourceOrderItem = {
			id: resource.getNextResourceOrderItemId(),
			amount: amountToUpdate,
			type,
			orderId: order.id,
			creepName: creep.name,
			fulfilled: false,
			createdTime: Game.time,
			amountTransferred: 0,
		};

		//console.log(`createResourceOrderItem: order: ${JSON.stringify(order)}`);

		order.amountPending += amountToUpdate;
		order.orderItemIds[resourceOrderItem.id] = resourceOrderItem.id;

		Memory.resourceOrders[order.id] = order;
		Memory.resourceOrderItems[resourceOrderItem.id] = resourceOrderItem;
		creep.memory.resourceOrderItemId = resourceOrderItem.id;

		return resourceOrderItem;
	};

	resource.getResourceOrder = (orderId) => {
		return Memory.resourceOrders[orderId];
	};

	resource.getResourceOrderItem = (orderItemId) => {
		return Memory.resourceOrderItems[orderItemId];
	};

	resource.orderIsValid = (order) => {
		//console.log("order is valid start");
		if (!order) {
			throw new Error(`Invalid parameter!`);
		}

		//console.log(`order ${JSON.stringify(order)}`);

		if (order.amountFulfilled >= order.amount) {
			//console.log(`order.amountFulfilled >= order.amount`);
			return false;
		}

		if (order.amountPending > 0) {
			//console.log(`order.amountPending > 0`);
			if (!order.orderItemIds) {
				//console.log(`!order.orderItemIds`);
				return false;
			}

			for (const orderItemId in order.orderItemIds) {
				const resourceOrderItem = resource.getResourceOrderItem(orderItemId);
				//console.log(`resourceOrderItem ${JSON.stringify(resourceOrderItem)}`);

				if (!resourceOrderItem) {
					return false;
				}

				const creep = Game.creeps[resourceOrderItem.creepName];
				//console.log(`creep ${JSON.stringify(creep)}`);

				if (!creep) {
					return false;
				}

				if (creep.memory.resourceOrderItemId !== orderItemId) {
					//console.log("return false");
					return false;
				}
			}
		}
		//console.log("return true");
		return true;
	};

	resource.fulfillResourceOrderItem = (creep) => {
		let orderItem = Memory.resourceOrderItems[creep.memory.resourceOrderItemId];

		if (!orderItem) {
			delete creep.memory.resourceOrderItemId;
			return false;
			// reassign creep to new order?
			// how to determine room etc?
			//this.findNextResourceOrderToFulfill(creep)
		}

		let order = Memory.resourceOrders[orderItem.orderId];

		if (!order) {
			console.log("fulfillResourceOrderItem: could not find order to fulfill!");
			delete Memory.resourceOrderItems[creep.memory.resourceOrderItemId];
			delete creep.memory.resourceOrderItemId;

			return false;
		}

		let structure = Game.getObjectById(order.destinationId);

		if (!structure) {
			if (order.isContructionSite) {
			}

			console.log("fulfillResourceOrderItem: Could not find structure for  resource order!");

			resource.deleteOrder(order);

			return false;
		}

		let transferResult = null;
		const carryAmountBeforeAction = creep.store.getUsedCapacity(order.type);

		if (carryAmountBeforeAction === 0) {
			orderItem.amount = order.amountFulfilled;
			orderItem.fulfilled = true;
			Memory.resourceOrderItems[creep.memory.resourceOrderItemId] = orderItem;
			return false;
		}

		if (order.isContructionSite) {
			transferResult = creep.build(structure);
		} else if (structure.structureType === STRUCTURE_CONTROLLER) {
			transferResult = creep.upgradeController(structure);
		} else {
			transferResult = creep.transfer(structure, order.type, orderItem.amount);
		}

		//console.log(`transferResult ${transferResult}`);

		switch (transferResult) {
			case OK:
				const carryAmountAfterAction = creep.store.getUsedCapacity(order.type);
				const amountTransferred = carryAmountBeforeAction - carryAmountAfterAction;

				order.amountFulfilled += amountTransferred;
				order.amountPending -= amountTransferred;
				orderItem.amountTransferred += amountTransferred;

				//console.log(`order ${JSON.stringify(order)}`);
				//console.log(`orderItem ${JSON.stringify(orderItem)}`);

				if (order.amountFulfilled >= order.amount) {
					//console.log(`order.amountFulfilled >= order.amount delete order`);
					resource.deleteOrder(order);
					break;
				}

				if (orderItem.amountTransferred > orderItem.amount) {
					//console.log(`orderItem.amountTransferred > orderItem.amount order item fulfilled`);
					orderItem.fulfilled = true;
				}

				Memory.resourceOrderItems[creep.memory.resourceOrderItemId] = orderItem;
				Memory.resourceOrders[orderItem.orderId] = order;
				break;
			case ERR_NOT_ENOUGH_RESOURCES:
				resource.checkCreepAmount(creep, orderItem, order);
				break;
			case ERR_FULL:
				resource.deleteOrder(order);
				break;
			case ERR_NOT_IN_RANGE:
				return transferResult;
			case ERR_INVALID_ARGS:
				resource.checkCreepAmount(creep, orderItem, order);
				break;
		}

		return transferResult;
	};

	resource.checkCreepAmount = (creep, orderItem, order) => {
		// find out what resources you do have
		var creepAmount = creep.store.getUsedCapacity(order.type);

		// amend the order item
		if (creepAmount && creepAmount > 0) {
			order.amountPending -= creepAmount + orderItem.amount;
			orderItem.amount = creepAmount;
			orderItem.fulfilled = true;
			order.amountFulfilled += orderItem.amount;

			delete creep.memory.resourceOrderItemId;
			Memory.resourceOrderItems[creep.memory.resourceOrderItemId] = orderItem;
			Memory.resourceOrders[orderItem.orderId] = order;
		} else {
			// or delete orderItem if no resources
			resource.deleteOrderItem(orderItem);
		}
	};

	resource.getNextResourceOrderId = () => {
		if (!Memory.counts.resourceOrders) {
			Memory.counts.resourceOrders = 0;
		}
		return `ro${Memory.counts.resourceOrders++}`;
	};

	resource.getNextResourceOrderItemId = () => {
		if (!Memory.counts.resourceOrderItems) {
			Memory.counts.resourceOrderItems = 0;
		}
		return `roi${Memory.counts.resourceOrderItems++}`;
	};

	resource.deleteOrderItem = (orderItem) => {
		if (!orderItem) {
			console.log("deleteOrderItem: Invalid Parameters!");
			return false;
		}

		let resourceOrder = Memory.resourceOrders[orderItem.orderId];

		if (resourceOrder) {
			if (!resourceOrder.fulfilled) {
				resourceOrder.pendingAmount -= orderItem.amount;
				delete resourceOrder.orderItemIds[orderItem.id];
				Memory.resourceOrders[orderItem.orderId] = resourceOrder;
			}
		}

		let creep = Game.creeps[orderItem.creepName];

		if (creep) {
			delete creep.memory.resourceOrderItemId;
		}

		if (Memory.resourceOrderItems[orderItem.id]) {
			delete Memory.resourceOrderItems[orderItem.id];
		}

		return true;
	};

	resource.deleteOrder = (order) => {
		if (!order) {
			console.log("deleteOrder: Invalid parameter!");
		}

		if (order.orderItemIds && order.orderItemIds.length) {
			order.orderItemIds.foreach((itemId) => {
				let orderItem = Memory.resourceOrderItems[itemId];

				if (orderItem) {
					let creep = Game.creeps[orderItem.creepName];

					if (creep) {
						delete creep.memory.resourceOrderItemId;
					}
				}
				delete Memory.resourceOrderItems[itemId];
			});
		}

		// need to do a check on actual strucutres indiviudually to check if resourceOrder still exists grr!
		let struc = Game.getObjectById(order.destinationId);

		if (struc) {
			if (Memory[struc.structureType][struc.id]) {
				delete Memory[struc.structureType][struc.id].resourceOrderId;
			}
		}

		if (Memory.resourceOrders[order.id]) {
			delete Memory.resourceOrders[order.id];
		}

		return true;
	};

	resource.getStructureResourceOrderId = (struc, type) => {
		if (!struc || !type) {
			throw new Error("getStructureResourceOrderId: Invalid parameters!");
		}

		if (!Memory[struc.structureType]) {
			Memory[struc.structureType] = {};
		}

		if (!Memory[struc.structureType][struc.id]) {
			Memory[struc.structureType][struc.id] = {};
		}

		let strucMemory = Memory[struc.structureType][struc.id];

		if (!strucMemory.resourceOrderIds) {
			strucMemory.resourceOrderIds = {};
		}

		return strucMemory.resourceOrderIds[type];
	};

	resource.getResourceOrderItemDestination = (resourceOrderItemId) => {
		if (!resourceOrderItemId) {
			console.log("getResourceOrderItemDestination: Invalid parameters");
			return false;
		}

		let resourceOrderItem = Memory.resourceOrderItems[resourceOrderItemId];

		if (!resourceOrderItem) {
			console.log(`getResourceOrderItemDestination: No resource order item found belonging to id: ${resourceOrderItemId}`);
			return false;
		}

		let resourceOrder = Memory.resourceOrders[resourceOrderItem.orderId];

		if (!resourceOrder) {
			console.log(`getResourceOrderItemDestination: No resource order found belonging to id: ${resourceOrderItem.orderId}`);

			resource.deleteOrderItem(resourceOrderItem);
			return false;
		}

		let destination = Game.getObjectById(resourceOrder.destinationId);

		if (!destination) {
			// no destination found remove order
			console.log(`getResourceOrderItemDestination: No destination found for resource order belonging to id: ${resourceOrder.destinationId}`);
			resource.deleteOrder(resourceOrder);
			return false;
		}

		return destination;
	};

	// find and remove any roi belonging to dead creeps
	for (const roi in Memory.resourceOrderItems) {
		let orderItem = Memory.resourceOrderItems[roi];
		if (!Game.creeps[orderItem.creepName]) {
			resource.deleteOrderItem(orderItem);
		}
	}

	App.modules.resource = resource;
})(App);
