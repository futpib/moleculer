"use strict";

const ServiceBroker = require("../src/service-broker");
const util = require("util");

const MW = {
	// After broker is created
	created(broker) {
		console.log("MW created is fired.");
	},

	// Wrap local action calls (legacy middleware handler)
	localAction(handler, action) {
		//console.log("MW localAction is fired.", action.name);
		return handler;
	},

	// Wrap remote action calls
	remoteAction(handler, action) {
		//console.log("MW remoteAction is fired.", action.name);
		return handler;
	},

	// When event is emitted
	emit(eventName, payload) {
		console.log("MW emit is fired.", eventName);
	},

	// When broadcast event is emitted
	broadcast(eventName, payload, groups) {
		console.log("MW broadcast is fired.", eventName);
	},

	// When local broadcast event is emitted
	broadcastLocal(eventName, payload, groups) {
		console.log("MW broadcastLocal is fired.", eventName);
	},

	// After a new local service created
	serviceCreated(service) {
		console.log("MW serviceCreated is fired", service.name);
	},

	// After a local service started
	serviceStarted(service) {
		console.log("MW serviceStarted is fired", service.name);
	},

	// After a local service stopped
	serviceStopped(service) {
		console.log("MW serviceStopped is fired", service.name);
	},

	// Before broker starting
	starting(broker) {
		console.log("MW starting is fired.");
	},

	// After broker started
	started(broker) {
		console.log("MW started is fired.");
	},

	// Before broker stopping
	stopping(broker) {
		console.log("MW stopping is fired.");
	},

	// After broker stopped
	stopped(broker) {
		console.log("MW stopped is fired.");
	},
};

const broker = new ServiceBroker({
	nodeID: "mw",
	transporter: "NATS",
	//logLevel: "debug",
	logFormatter: "short",
	middlewares: [MW]
});



broker.createService({
	name: "test",
	actions: {
		hello(ctx) {
			return "Hello Moleculer";
		},
	},
	events: {
		"test.**"(payload, sender, eventName) {
			this.logger.info(`Event '${eventName}' is received.`, payload);
		}
	}
});


broker.start()
	.then(() => broker.repl())
	.then(() => {
		broker.emit("test.emitted.event", { a: 5 });
		broker.broadcast("test.broadcasted.event", { b: "John" });
	});