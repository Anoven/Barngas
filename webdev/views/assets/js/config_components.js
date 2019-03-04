"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ClickyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { edit: false, mousedown: false, id: props.id, name: props.name, descr: props.descr };
        this.focusNameInput = this.focusNameInput.bind(this);
        this.toggleFocusNameInput = this.toggleFocusNameInput.bind(this);
        this.editText = this.editText.bind(this);
        this.enterPress = this.enterPress.bind(this);
    }
    focusNameInput() {
        console.log(this.state.mousedown);
        if (!this.state.mousedown) {
            this.setState({
                mousedown: true
            });
            this.toggleFocusNameInput();
        }
        else {
            this.setState({
                mousedown: false
            });
        }
    }
    toggleFocusNameInput() {
        if (this.state.edit) {
            this.updateDB();
        }
        this.setState({
            edit: !this.state.edit
        });
    }
    editText(e) {
        this.updateText(e);
    }
    enterPress(e) {
        if (e.keyCode == 13) {
            this.setState({
                mousedown: false
            });
            this.toggleFocusNameInput();
        }
    }
    setButtons(placeholder, btnSizeClass, textSizeClass, labelSizeClass) {
        this.editButtInputMode =
            React.createElement("button", { className: "btn btn-secondary " + btnSizeClass, onMouseUp: this.toggleFocusNameInput },
                React.createElement("i", { className: "fas fa-save", title: 'Save Changes' }));
        this.editButtViewMode =
            React.createElement("button", { className: "btn btn-secondary " + btnSizeClass, onMouseUp: this.focusNameInput },
                React.createElement("i", { className: "fas fa-edit", title: 'Edit Text' }));
        this.textInputMode =
            React.createElement("input", { type: 'text', autoFocus: true, className: 'form-control ' + textSizeClass, placeholder: placeholder, onChange: this.editText, onKeyDown: this.enterPress, onBlur: this.toggleFocusNameInput });
        this.textViewMode =
            React.createElement("label", { className: labelSizeClass, onDoubleClick: this.toggleFocusNameInput }, placeholder);
    }
}
exports.ClickyComponent = ClickyComponent;
