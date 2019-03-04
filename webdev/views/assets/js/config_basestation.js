"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const React = require("react");
const ReactDOM = require("react-dom");
const util_1 = require("./util");
const config_components_1 = require("./config_components");
let basestations = {};
class BSLabel extends config_components_1.ClickyComponent {
    constructor(props) {
        super(props);
    }
    updateDB() {
        $.post('/basestations/updateName', { id: this.state.id, name: this.state.name }, function (response) {
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
class BSDescr extends config_components_1.ClickyComponent {
    constructor(props) {
        super(props);
    }
    updateDB() {
        $.post('/basestations/updateDescription', { id: this.state.id, description: this.state.descr }, function (response) {
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
class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: props.id, name: props.name, descr: props.descr, expanded: false };
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
            React.createElement("button", { className: "btn btn-primary btn-lg", type: "button", "data-toggle": "collapse", "data-target": "#" + this.state.name, "aria-expanded": "false", "aria-controls": this.state.name, onClick: this.toggleExpanded }, expandIcon);
        return (React.createElement("div", { className: "card" },
            React.createElement("div", { className: "card-header" },
                React.createElement("div", { className: 'row align-items-center' },
                    React.createElement("div", { className: 'col-sm-3' },
                        React.createElement("label", { className: "input-group-text bslabel-lg-2" },
                            " ",
                            'Basestation ' + this.state.id + ": ",
                            " ")),
                    React.createElement("div", { className: 'col-sm-8' },
                        React.createElement(BSLabel, { id: this.state.id, name: this.state.name, descr: this.state.descr })),
                    React.createElement("div", { className: 'col-sm-1' }, expandedButt))),
            React.createElement("div", { className: "collapse", id: this.state.name },
                React.createElement("div", { className: "container-fluid inner-padded" },
                    React.createElement(BSDescr, { id: this.state.id, name: this.state.name, descr: this.state.descr })))));
    }
}
class CardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dict: props.dict };
    }
    renderCards() {
        let cards = [];
        for (let id in this.state.dict) {
            cards.push(React.createElement(Card, { id: Number(id), name: this.state.dict[id].name, descr: this.state.dict[id].description }));
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
        ReactDOM.render(React.createElement(CardContainer, { dict: basestations }), document.getElementById('root'));
    });
});
