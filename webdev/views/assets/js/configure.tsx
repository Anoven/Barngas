import Chart = require('chart.js');
import moment = require('moment');
import * as $ from 'jquery';

import * as React from "react";
import * as ReactDOM from "react-dom";
// import classNames = require('classnames');

// import {Button} from 'react-bootstrap';

import {Basestation, Group, Sensor} from './util';

let basestations: {[id: number]: Basestation} = {}; 

class BSLabel extends React.Component<{name: string}, {edit: boolean, name: string}> {
	constructor(props: any) {
		super(props);
		this.state = {edit: false, name: props.name};
		this.toggle_edit = this.toggle_edit.bind(this);
		this.editName = this.editName.bind(this);
		this.enterPress = this.enterPress.bind(this);
	}

	toggle_edit(): void {
		this.setState(prevState => ({
	    	edit: !prevState.edit
	    }));
	}

	editName(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
	    	name: e.target.value
	    });
	}
	enterPress(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.keyCode == 13) {
			this.toggle_edit();
		}
	}

	render() {
		let name_text: JSX.Element;
		if(this.state.edit) {
			name_text = 
				<input
					autoFocus
					type='text'
					className='form-control form-control-lg'
					placeholder={this.state.name}
					onChange = {this.editName}
					onKeyDown = {this.enterPress} />;
		}
		else {
			name_text = 
				<label 
					className = 'bslabel-lg' 
					onDoubleClick={this.toggle_edit}
				>
					{this.state.name}
				</label>
		}

		return (
				<div className='row align-items-center'>
			  		<div className = 'col-sm-10'>
				        {name_text}
			      	</div>
			      	<div className = 'col=sm-1'>
			      		<button className="btn btn-secondary" onClick = {this.toggle_edit}>
				        	<i className="fas fa-edit"></i>
						</button>
			      	</div>
			    </div>
		);
	}
}

class BSDescr extends React.Component<{name: string}, {edit: boolean, name: string}> {
	constructor(props: any) {
		super(props);
		this.state = {edit: false, name: props.name};
		this.toggle_edit = this.toggle_edit.bind(this);
		this.editName = this.editName.bind(this);
		this.enterPress = this.enterPress.bind(this);
	}

	toggle_edit(): void {
		this.setState(prevState => ({
	    	edit: !prevState.edit
	    }));
	}

	editName(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
	    	name: e.target.value
	    });
	}
	enterPress(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.keyCode == 13) {
			this.toggle_edit();
		}
	}

	render() {
		let name_text: JSX.Element;
		let expand_btn: JSX.Element;
		if(this.state.edit) {
			name_text = 
				<input
					autoFocus
					type='text'
					className='form-control form-control-sm'
					placeholder={this.state.name}
					onChange = {this.editName}
					onKeyDown = {this.enterPress} />;
		}
		else {
			name_text = 
				<label 
					className = 'form-control form-control-sm' 
					onDoubleClick={this.toggle_edit}>
					{this.state.name}
				</label>
		}

		return (
				<div className='row align-items-center justify-content-between"'>
			  		<div className = 'col-sm-11'>
				        {name_text}
			      	</div>
			      	<div className = 'col=sm-1'>
			      		<button className="btn btn-secondary btn-sm" onClick = {this.toggle_edit}>
				        	<i className="fas fa-edit"></i>
						</button>
			      	</div>
			    </div>
		);
	}
}

class Card extends React.Component<{}, {expanded: boolean}> {
	constructor(props: any) {
		super(props);
		this.state = {expanded: false};
		this.toggleExpanded = this.toggleExpanded.bind(this);
	}

	toggleExpanded() {
		this.setState(prevState => ({
	    	expanded: !prevState.expanded
	    }));	
	}

	render() {
		let expand_icon: JSX.Element;
		let expanded_btn: JSX.Element;

		if(this.state.expanded) {
			expand_icon = <i className="fas fa-minus"></i>
		}
		else {
			expand_icon = <i className="fas fa-plus"></i>
				
		}

		expanded_btn = 
			<button 
				className="btn btn-primary btn-lg" 
				type="button" 
				data-toggle="collapse" 
				data-target="#collapseExample" 
				aria-expanded="false" 
				aria-controls="collapseExample"
				onClick={this.toggleExpanded} >
					{expand_icon}
			</button>

		return (
			<div className="card">
				<div className="card-header">
					<div className = 'row align-items-center'>
						<div className = 'col-sm-3'>
				  			<label className ="input-group-text bslabel-lg-2"> Basestation: </label>
				  		</div>
				  		<div className = 'col-sm-8'>
				  			<BSLabel name='basestation name' />
				  		</div>
						<div className = 'col-sm-1'>
							{expanded_btn}
						</div>
					</div>
				</div>

				<div className="collapse" id="collapseExample">
					<div className="container-fluid inner-padded">
						<BSDescr name='description' />
					</div>
				</div>
			</div>
		)
		
	}
}


$(document).ready(function() {
	$.get('/configure/basestations', function(response) {
        let data = response.data;
        if (data.length > 0) {
            for(let i = 0 ; i < data.length; i++) {
                basestations[data[i].id] = new Basestation(data[i].id, data[i].name, data[i].description);
        	}
        }
    }).then(function() {
    	$.get('/configure/groups', function(response) {
	        let data = response.data;
	        if(data.length > 0) {
                for(let i = 0; i < data.length; i++) {
                    if(basestations[data[i].basestation_id]){
                    	let bs: Basestation = basestations[data[i].basestation_id];
                        bs.add_group(new Group(data[i].id, data[i].name, data[i].description));
                    }
                }
            }
	    }).then(function() {
	    	$.get('/configure/sensors', function(response) {
		        let data = response.data;
		        if(data.length > 0) {
	                for(let i = 0; i < data.length; i++) {
	                    if(basestations[data[i].basestation_id]){
	                    	let bs: Basestation = basestations[data[i].basestation_id];
	                    	if(bs.groups[data[i].group_id]) {
	                    		let g = bs.groups[data[i].group_id];
	                    		g.add_sensor(new Sensor(data[i].id, data[i].name, data[i].description));
	                    	}
	                    }
	                }
	            }
	            console.log(basestations);
	    	}).then(function() {
	    		ReactDOM.render(<Card />, document.getElementById('root'));
	    	});
    	});
    });
});