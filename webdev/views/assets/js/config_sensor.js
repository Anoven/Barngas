"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const React = require("react");
const ReactDOM = require("react-dom");
const util_1 = require("./util");
const config_components_1 = require("./config_components");
let basestations = {};
class SensorLabel extends config_components_1.ClickyComponent {
    constructor(props) {
        super(props);
    }
    updateDB() {
        $.post('/sensors/updateName', { id: this.state.id, name: this.state.name }, function (response) {
            console.log(response.data);
        });
    }
    updateText(e) {
        this.setState({
            name: e.target.value
        });
    }
    render() {
        super.setButtons(this.state.name, 'btn-lg', 'form-control-lg', 'bslabel-lg');
        if (this.state.edit) {
            this.editButt = this.editButtInputMode;
            this.text = this.textInputMode;
        }
        else {
            this.editButt = this.editButtViewMode;
            this.text = this.textViewMode;
        }
        return (React.createElement("div", { className: 'row align-items-center' },
            React.createElement("div", { className: 'col col-sm-10' }, this.text),
            React.createElement("div", { className: 'col=sm-1' }, this.editButt)));
    }
}
class SensorDescr extends config_components_1.ClickyComponent {
    constructor(props) {
        super(props);
    }
    updateDB() {
        $.post('/sensors/updateDescription', { id: this.state.id, description: this.state.descr }, function (response) {
            console.log(response.data);
        });
    }
    updateText(e) {
        this.setState({
            descr: e.target.value
        });
    }
    render() {
        super.setButtons(this.state.descr, 'btn-sm', 'form-control-sm', 'bslabel-sm');
        if (this.state.edit) {
            this.editButt = this.editButtInputMode;
            this.text = this.textInputMode;
        }
        else {
            this.editButt = this.editButtViewMode;
            this.text = this.textViewMode;
        }
        return (React.createElement("div", { className: 'row align-items-center justify-content-between"' },
            React.createElement("div", { className: 'col col-sm-11' }, this.text),
            React.createElement("div", { className: 'col=sm-1' }, this.editButt)));
    }
}
class SensorSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: props.id, groups: props.groups, gid: props.gid };
        this.updateGroup = this.updateGroup.bind(this);
    }
    renderOptions() {
        let options = [];
        for (let gid in this.state.groups) {
            let group = this.state.groups[gid];
            if (this.state.gid === gid) {
                options.push(React.createElement("option", { value: gid, selected: true },
                    " ",
                    this.state.groups[gid].name,
                    " "));
            }
            else {
                options.push(React.createElement("option", { value: gid },
                    " ",
                    this.state.groups[gid].name,
                    " "));
            }
        }
        return options;
    }
    updateGroup(e) {
        $.post('/sensors/updateGroup', { id: this.state.id, group_id: e.target.value }, function (response) {
            console.log(response.data);
        });
    }
    render() {
        let options = this.renderOptions();
        return (React.createElement("div", null,
            React.createElement("select", { className: "custom-select select-lg", onChange: this.updateGroup }, options)));
    }
}
class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: props.id, sensor: props.sensor, groups: props.groups, gid: props.gid, expanded: false };
        this.toggleExpanded = this.toggleExpanded.bind(this);
    }
    toggleExpanded() {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    }
    render() {
        let expandIcon;
        let expandedButt;
        if (this.state.expanded) {
            expandIcon = React.createElement("i", { className: "fas fa-minus" });
        }
        else {
            expandIcon = React.createElement("i", { className: "fas fa-plus" });
        }
        expandedButt =
            React.createElement("button", { className: "btn btn-primary btn-lg float-right", type: "button", "data-toggle": "collapse", "data-target": "#" + this.state.sensor.name, "aria-expanded": "false", "aria-controls": this.state.sensor.name, onClick: this.toggleExpanded }, expandIcon);
        let typeToString = { 'AMMONIA': 'Ammonia',
            'CARBON DIOXIDE': 'Carbon Dioxide',
            'HYDROGEN SULFIDE': 'Hydrogen Sulfide',
            'METHANE': 'Methane',
            'HUMIDITY': 'Relative Humidity',
            'TEMP': 'Temperature' };
        let typeLabel = '';
        if (typeToString[this.state.sensor.type]) {
            typeLabel = typeToString[this.state.sensor.type];
        }
        return (React.createElement("div", { className: "card" },
            React.createElement("div", { className: "card-header" },
                React.createElement("div", { className: 'row align-items-center' },
                    React.createElement("div", { className: 'col col-sm-1 text-center' },
                        React.createElement("label", { className: "input-group-text bslabel-lg-2" },
                            " ",
                            this.state.id,
                            " ")),
                    React.createElement("div", { className: 'col col-sm-2 text-center' },
                        React.createElement("label", { className: "input-group-text bslabel-lg-2" },
                            " ",
                            typeLabel,
                            " ")),
                    React.createElement("div", { className: 'col col-sm-6' },
                        React.createElement(SensorLabel, { id: this.state.id, name: this.state.sensor.name, descr: this.state.sensor.description })),
                    React.createElement("div", { className: 'col col-sm-2 text-center', style: { padding: '0px' } },
                        React.createElement(SensorSelect, { id: this.state.id, groups: this.state.groups, gid: this.state.gid })),
                    React.createElement("div", { className: 'col col-sm-1 float-right' }, expandedButt))),
            React.createElement("div", { className: "collapse", id: this.state.sensor.name },
                React.createElement("div", { className: "container-fluid inner-padded" },
                    React.createElement(SensorDescr, { id: this.state.id, name: this.state.sensor.name, descr: this.state.sensor.description })))));
    }
}
class CardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dict: props.dict };
    }
    renderCards() {
        let cards = [];
        for (let bid in this.state.dict) {
            cards.push(React.createElement("hr", null));
            cards.push(React.createElement("h4", null, '' + bid + ': ' + this.state.dict[bid].name));
            cards.push(React.createElement("hr", null));
            let groups = this.state.dict[bid].groups;
            for (let gid in groups) {
                console.log(gid);
                let group = groups[gid];
                for (let sid in group.sensors) {
                    let sensor = group.sensors[sid];
                    cards.push(React.createElement(Card, { id: Number(sid), sensor: group.sensors[sid], groups: groups, gid: gid }));
                }
            }
        }
        return cards;
    }
    render() {
        let cards = this.renderCards();
        return (React.createElement("div", null, cards));
    }
}
exports.CardContainer = CardContainer;
$(document).ready(function () {
    $.get('/configure/basestations', function (response) {
        let data = response.data;
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                basestations[data[i].id] = new util_1.Basestation(data[i].id, data[i].name, data[i].description);
            }
        }
    }).then(function () {
        $.get('/configure/groups', function (response) {
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (basestations[data[i].basestation_id]) {
                        let bs = basestations[data[i].basestation_id];
                        bs.add_group(new util_1.Group(data[i].id, data[i].name, data[i].description));
                    }
                }
            }
        }).then(function () {
            $.get('/configure/sensors', function (response) {
                let data = response.data;
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (basestations[data[i].basestation_id]) {
                            let bs = basestations[data[i].basestation_id];
                            if (bs.groups[data[i].group_id]) {
                                let g = bs.groups[data[i].group_id];
                                g.add_sensor(new util_1.Sensor(data[i].id, data[i].name, data[i].description, data[i].type));
                            }
                        }
                    }
                }
                console.log(basestations);
            }).then(function () {
                console.log(basestations);
                ReactDOM.render(React.createElement(CardContainer, { dict: basestations }), document.getElementById('root'));
            });
        });
    });
});
