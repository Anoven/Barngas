"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const React = require("react");
const ReactDOM = require("react-dom");
const util_1 = require("./util");
const config_components_1 = require("./config_components");
let basestations = {};
class GroupLabel extends config_components_1.ClickyComponent {
    constructor(props) {
        super(props);
    }
    updateDB() {
        $.post('/groups/updateName', { id: this.state.id, name: this.state.name }, function (response) {
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
            React.createElement("div", { className: 'col-sm-10' }, this.text),
            React.createElement("div", { className: 'col=sm-1' }, this.editButt)));
    }
}
class GroupDescr extends config_components_1.ClickyComponent {
    constructor(props) {
        super(props);
    }
    updateDB() {
        $.post('/groups/updateDescription', { id: this.state.id, description: this.state.descr }, function (response) {
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
        console.log(this.state.descr);
        if (this.state.edit) {
            this.editButt = this.editButtInputMode;
            this.text = this.textInputMode;
        }
        else {
            this.editButt = this.editButtViewMode;
            this.text = this.textViewMode;
        }
        return (React.createElement("div", { className: 'row align-items-center justify-content-between"' },
            React.createElement("div", { className: 'col-sm-11' }, this.text),
            React.createElement("div", { className: 'col=sm-1' }, this.editButt)));
    }
}
class NewGroupComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { bid: props.bid, name: props.name, groupName: 'Group Name', descr: 'Description' };
        this.addGroup = this.addGroup.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateDescr = this.updateDescr.bind(this);
    }
    addGroup() {
        $.post('/groups/addGroup', { name: this.state.groupName, description: this.state.descr, bid: this.state.bid }, function (response) {
            console.log(response.data);
            document.location.reload();
        });
    }
    updateName(e) {
        this.setState({
            groupName: e.target.value
        });
    }
    updateDescr(e) {
        this.setState({
            descr: e.target.value
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("button", { className: 'btn btn-info', "data-toggle": "modal", "data-target": '#' + this.state.name, style: { width: 'calc(100% - 10px)', height: '10vh', margin: '5px 5px' } }, "Add a New Group"),
            React.createElement("div", { className: "modal fade", id: this.state.name, role: "dialog", "aria-labelledby": this.state.name + 'label', "aria-hidden": "true" },
                React.createElement("div", { className: "modal-dialog modal-dialog-centered", role: "document" },
                    React.createElement("div", { className: "modal-content" },
                        React.createElement("div", { className: "modal-header" },
                            React.createElement("h5", { className: "modal-title", id: this.state.name + 'label' }, 'Add a new group to ' + this.state.name),
                            React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                                React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                        React.createElement("div", { className: "modal-body" },
                            React.createElement("input", { type: 'text', className: 'form-control', autoFocus: true, placeholder: this.state.groupName, onChange: this.updateName }),
                            React.createElement("input", { type: 'text', className: 'form-control', autoFocus: true, placeholder: this.state.descr, onChange: this.updateDescr })),
                        React.createElement("div", { className: "modal-footer" },
                            React.createElement("button", { type: "button", className: "btn btn-secondary", "data-dismiss": "modal" }, "Close"),
                            React.createElement("button", { type: "button", className: "btn btn-primary", onClick: this.addGroup }, "Save changes")))))));
    }
}
class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: props.id, name: props.name, descr: props.descr, expanded: false, canRemove: props.canRemove };
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
    }
    toggleExpanded() {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    }
    deleteGroup() {
        $.post('/groups/deleteGroup', { id: this.state.id }, function (response) {
            console.log(response.data);
            document.location.reload();
        });
    }
    render() {
        let expandIcon;
        let expandedButt;
        let removeButton;
        if (this.state.expanded) {
            expandIcon = React.createElement("i", { className: "fas fa-minus", title: 'Hide Description' });
        }
        else {
            expandIcon = React.createElement("i", { className: "fas fa-plus", title: 'Show Description' });
        }
        if (this.state.canRemove) {
            removeButton = React.createElement("button", { className: "btn btn-primary btn-lg", title: 'Delete Group', onClick: this.deleteGroup },
                React.createElement("i", { className: "fas fa-trash-alt" }));
        }
        else {
            removeButton = React.createElement("button", { className: "btn btn-primary btn-lg", title: 'Cannot Delete a Group with Sensors In It!', onClick: this.deleteGroup, disabled: true },
                React.createElement("i", { className: "fas fa-trash-alt" }));
        }
        expandedButt =
            React.createElement("button", { className: "btn btn-primary btn-lg", type: "button", "data-toggle": "collapse", "data-target": "#" + this.state.name, "aria-expanded": "false", "aria-controls": this.state.name, onClick: this.toggleExpanded }, expandIcon);
        return (React.createElement("div", { className: "card" },
            React.createElement("div", { className: "card-header" },
                React.createElement("div", { className: 'row align-items-center' },
                    React.createElement("div", { className: 'col-sm-3' },
                        React.createElement("label", { className: "input-group-text bslabel-lg-2" },
                            " ",
                            'Group: ',
                            " ")),
                    React.createElement("div", { className: 'col-sm-7' },
                        React.createElement(GroupLabel, { id: this.state.id, name: this.state.name, descr: this.state.descr })),
                    React.createElement("div", { className: 'col-sm-2' },
                        React.createElement("div", { style: { display: 'flex', justifyContent: 'space-around' } },
                            expandedButt,
                            removeButton)))),
            React.createElement("div", { className: "collapse", id: this.state.name },
                React.createElement("div", { className: "container-fluid inner-padded" },
                    React.createElement(GroupDescr, { id: this.state.id, name: this.state.name, descr: this.state.descr })))));
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
            cards.push(React.createElement("h4", null, 'Basestation ' + bid + ': ' + this.state.dict[bid].name));
            cards.push(React.createElement("hr", null));
            let groups = this.state.dict[bid].groups;
            for (let gid in groups) {
                let group = groups[gid];
                if (Object.keys(group.sensors).length == 0) {
                    cards.push(React.createElement(Card, { id: Number(gid), name: group.name, descr: group.description, canRemove: true }));
                }
                else {
                    cards.push(React.createElement(Card, { id: Number(gid), name: group.name, descr: group.description, canRemove: false }));
                }
            }
            cards.push(React.createElement(NewGroupComp, { bid: bid, name: this.state.dict[bid].name }));
        }
        return cards;
    }
    render() {
        let cards = this.renderCards();
        return (React.createElement("div", null, cards));
    }
}
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
            }).then(function () {
                $('.modal').on('show', function () {
                    $('input:text:visible:first').focus();
                });
            });
        });
    });
});
