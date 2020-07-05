/* resource.js */
module.exports = function () {
	if (!Memory.resourceOrders) {
		Memory.resourceOrders = {
			count: 0,
		};
	}

	if (!Memory.resourceOrderItems) {
		Memory.resourceOrderItems = {
			count: 0,
		};
	}

	for (const i in Memory.resourceOrders) {
		let resourceOrder;
	}

	this.createResourceOrder = (room, destinationId, type, amount) => {
		if (!room || !type || !amount) {
			console.log('createResourceOrder: Invalid parameters');
		}

		const destination = Game.getObjectById(destinationId);

		if (!destination) {
			console.log(`createResourceOrder: Couldn't find destination for id: ${destinationId}`);
		}

		if (room.memory.resourceOrders) {
			room.memory.resourceOrders = {};
		}

		if (!room.memory.resourceOrders[type]) {
			room.memory.resourceOrders[type] = {};
		}

		if (!room.memory.resourceOrders[type][destination.structureType]) {
			room.memory.resourceOrders[type][destination.structureType] = [];
		}

		let resourceOrder = {
			id: this.getNextResourceOrderId(),
			destinationId,
			type,
			amount,
			amountPending,
			amountFulfilled,
			orderItemIds: {},
			createdTime: Game.time,
		};

		room.memory.resourceOrders[type][destination.structureType].push(resourceOrder.id);

		if (!Memory[destination.structureType]) {
			Memory[destination.structureType] = {};
		}

		if (!Memory[destination.structureType][destination.id]) {
			Memory[destination.structureType][destination.id] = {};
		}

		if (!Memory[destination.structureType][destination.id].resourceOrderIds) {
			Memory[destination.structureType][destination.id].resourceOrderIds = {};
		}

		if (Memory[destination.structureType][destination.id].resourceOrderIds[type]) {
			let orderId = Memory[destination.structureType][destination.id].resourceOrderIds[type];
			let existingOrder = Memory.resourceOrders[orderId];

			// if it exists there has been an issue with making another order at the structure side
			if (existingOrder) {
				return false;
			} //else continue as normal as it will be overridden anyways
		}

		Memory[destination.structureType][destination.id].resourceOrderIds[type] = resourceOrder.id;

		Memory.resourceOrders[resourceOrder.id] = resourceOrder;

		return resourceOrder;
	};

	this.findNextResourceOrderToFulfill = (room, creep, type, amount) => {
		if (!room || !creep || !type || !amount) {
			console.log('findNextResourceOrderToFulfill: Invalid parameters');
		}

		this.checkRoomForResourceOrder(room, type);

		var strucIndex = 0,
			order = null;

		while (!order || strucIndex < RESOURCE_ORDER_STRUCTURE_PRIORITY.length) {
			const structure = RESOURCE_ORDER_STRUCTURE_PRIORITY[strucIndex];
			if (!room.memory.resourceOrders[type][structure]) {
				room.memory.resourceOrders[type][structure] = [];
			}

			if (room.memory.resourceOrders[type][structure].length) {
				var queueindex = 0;
				while (!order || index < room.memory.resourceOrders[type][structure].length) {
					var orderId = room.memory.resourceOrders[type][structure][queueindex];

					var currentOrder = Memory.resourceOrders[orderId];

					if (currentOrder.amountPending + currentOrder.amountFulfilled < currentOrder.amount) {
						order = currentOrder;
					}

					queueIndex++;
				}
				queue = room.memory.resourceOrders[type][structure];
			}

			strucIndex++;
		}

		if (!order && type === RESOURCE_ENERGY) {
			if (type === RESOURCE_ENERGY) {
				// for now go to controller this will probably need to chnage to include other destinations
				order = this.createResourceOrder(room, room.controller.id, type, amount);
			} else {
				//TODO stick it in storage;
			}
		}

		let item = this.createResourceOrderItem(creep, type, amount, order);

		return item;
	};

	this.createResourceOrderItem = (creep, type, amount, order) => {
		if (!creep || !type || !amount || !order) {
			console.log('createResourceOrderItem: Invalid parameters');
		}

		const amountLeft = order.amount - (order.amountPending + order.amountFulfilled);

		if (amountLeft <= 0) {
			console.log('createResourceOrderItem: amountLeft is less than originally requested!');
			this.deleteOrder(order);
			return false;
		}

		// check if it's the full creep carry amount to be fulfilled
		const amountToUpdate = amount > amountLeft ? amountLeft : amount;

		let resourceOrderItem = {
			id: this.getNextResourceOrderItemId(),
			amount: amountToUpdate,
			type,
			orderId: order.id,
			creepName: creep.name,
			fulfilled: false,
			createdTime: Game.time,
		};

		order.amountPending += amountToUpdate;
		order.orderItemIds.push(resourceOrderItem.id);

		Memory.resourceOrders[order.id] = order;
		Memory.resourceOrderItems[resourceOrderItem.id] = resourceOrderItem;
		creep.memory.resourceOrderItemId = resourceOrderItem.id;

		return resourceOrderItem;
	};

	this.fulfillResourceOrderItem = (creep) => {
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
			console.log('fulfillResourceOrderItem: could not find order to fulfill!');
			delete Memory.resourceOrderItems[creep.memory.resourceOrderItemId];
			delete creep.memory.resourceOrderItemId;

			return false;
		}

		let structure = Game.getObjectById(order.destinationId);

		if (!structure) {
			console.log('fulfillResourceOrderItem: Could not find structure for  resource order!');

			this.deleteOrder(order);

			return false;
		}

		let transferResult = creep.transfer(structure, order.type, orderItem.amount);

		switch (transferResult) {
			case OK:
				if (order.amountFulfilled + orderItem.amount >= order.amount) {
					this.deleteOrder(order);
				} else {
					orderItem.fulfilled = true;
					order.amountFulfilled += orderItem.amount;
					order.amountPending -= orderItem.amount;

					Memory.resourceOrderItems[creep.memory.resourceOrderItemId] = orderItem;
					Memory.resourceOrders[orderItem.orderId] = order;
				}

				break;
			case ERR_NOT_ENOUGH_RESOURCES:
				this.checkCreepAmount(creep, orderItem, order);
				break;
			case ERR_FULL:
				this.deleteOrder(order);
				break;
			case ERR_NOT_IN_RANGE:
				return transferResult;
			case ERR_INVALID_ARGS:
				this.checkCreepAmount(creep, orderItem, order);
				break;
		}
	};

	this.checkCreepAmount = (creep, orderItem, order) => {
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
			this.deleteOrderItem(orderItem);
		}
	};

	this.getNextResourceOrderId = () => {
		return `rq${Memory.resourceOrders.count++}`;
	};

	this.getNextResourceOrderItemId = () => {
		return `rq${Memory.resourceOrderItems.count++}`;
	};

	this.deleteOrderItem = (orderItem) => {
		if (!orderItem) {
			console.log('deleteOrderItem: Invalid Parameters!');
			return false;
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

	this.deleteOrder = (order) => {
		if (!order) {
			console.log('deleteOrder: Invalid parameter!');
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

		if (Memory.resouceOrders[order.id]) {
			delete Memory.resouceOrders[order.id];
		}

		return true;
	};

	this.getStructureResourceOrderId = (struc, type) => {
		if (!struc || !type) {
			console.log('getStructureResourceOrderId: Invalid parameters!');
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

	this.getResourceOrderItemDestination = (resourceOrderItemId) => {
		if (!resourceOrderItemId) {
			console.log('getResourceOrderItemDestination: Invalid parameters');
			return false;
		}

		let resourceOrderItem = Memory.resourceOrderItem[resourceOrderItemId];

		if (!resourceOrderItem) {
			console.log(`getResourceOrderItemDestination: No resource order item found belonging to id: ${resourceOrderItemId}`);
			return false;
		}

		let resourceOrder = Memory.resourceOrder[resourceOrderItem.orderId];

		if (!resourceOrder) {
			console.log(`getResourceOrderItemDestination: No resource order found belonging to id: ${resourceOrderItem.orderId}`);

			this.deleteOrderItem(resourceOrderItem);
			return false;
		}

		let destination = Game.getObjectById(resourceOrder.destinationId);

		if (!destination) {
			// no destination found remove order
			console.log(`getResourceOrderItemDestination: No destination found for resource order belonging to id: ${resourceOrder.destinationId}`);
			this.deleteOrder(resourceOrder);
			return false;
		}

		return destination;
	};
};
