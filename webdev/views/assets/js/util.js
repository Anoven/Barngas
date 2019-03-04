"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Basestation {
    constructor(id, name, description) {
        this.groups = {};
        this.id = id;
        this.name = name;
        this.description = description;
    }
    add_group(group) {
        this.groups[group.id] = group;
    }
}
exports.Basestation = Basestation;
class Group {
    constructor(id, name, description) {
        this.sensors = {};
        this.id = id;
        this.name = name;
        this.description = description;
    }
    add_sensor(sensor) {
        this.sensors[sensor.id] = sensor;
    }
}
exports.Group = Group;
class Sensor {
    constructor(id, name, description, type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
    }
}
exports.Sensor = Sensor;
