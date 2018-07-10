import * as $ from 'jquery';
import * as React from "react";
import * as ReactDOM from "react-dom";


// /*
// Bunch of react components that we use
// */

export abstract class ClickyComponent extends React.Component<{id: number, name: string, descr: string}, {edit: boolean, mousedown: boolean, id: number, name: string, descr: string}>{
	
	editButt: JSX.Element;
	editButtInputMode: JSX.Element;
	editButtViewMode: JSX.Element;

	text: JSX.Element;
	textInputMode: JSX.Element;
	textViewMode: JSX.Element;

	constructor(props: any) {
		super(props);
		this.state = {edit: false, mousedown: false, id: props.id, name: props.name, descr: props.descr};
		this.focusNameInput = this.focusNameInput.bind(this);
		this.toggleFocusNameInput = this.toggleFocusNameInput.bind(this);
		this.editText = this.editText.bind(this);
		this.enterPress = this.enterPress.bind(this);

	}
	focusNameInput(): void {
		console.log(this.state.mousedown);
		if(!this.state.mousedown){
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

	toggleFocusNameInput(): void {
		if(this.state.edit) {
			this.updateDB();
		}

	    this.setState({
	    	edit: !this.state.edit
	    });
	}

	abstract updateDB(): void;

	editText(e: React.ChangeEvent<HTMLInputElement>): void {
		this.updateText(e);
	}

	abstract updateText(e: React.ChangeEvent<HTMLInputElement>): void;

	enterPress(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.keyCode == 13) {
			this.setState({
		    	mousedown: false
		    });
			this.toggleFocusNameInput();
		}
	}

	setButtons(placeholder: string, btnSizeClass: string, textSizeClass: string, labelSizeClass: string): void {
		this.editButtInputMode = 
			<button className = {"btn btn-secondary " + btnSizeClass} onMouseUp = {this.toggleFocusNameInput}>
				<i className="fas fa-save" title = 'Save Changes'></i>
			</button>;

		this.editButtViewMode = 
			<button className = {"btn btn-secondary " + btnSizeClass} onMouseUp = {this.focusNameInput}>
	        	<i className="fas fa-edit" title = 'Edit Text'></i>
			</button>;

		this.textInputMode = 
			<input
				type='text'
				autoFocus={true}
				className= {'form-control ' + textSizeClass}
				placeholder={placeholder}
				onChange = {this.editText}
				onKeyDown = {this.enterPress}
				onBlur = {this.toggleFocusNameInput}>
			</input>;

		this.textViewMode = 
			<label 
				className = {labelSizeClass} 
				onDoubleClick={this.toggleFocusNameInput}>
				{placeholder}
			</label>
	}
}