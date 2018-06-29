export class Basestation {
    id: number;
    name: string;
    description: string;
    groups: {[id: number]: Group} = {};
    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    add_group(group: Group): void {
        this.groups[group.id] = group;
    }
}

export class Group {
    id: number;
    name: string;
    description: string;
    sensors: {[id: number]: Sensor} = {};
    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    add_sensor(sensor: Sensor): void {
        this.sensors[sensor.id] = sensor;
    }
}

export class Sensor {
    id: number;
    name: string;
    description: string;
    type: string;
    constructor(id: number, name: string, description: string, type: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
    }
}