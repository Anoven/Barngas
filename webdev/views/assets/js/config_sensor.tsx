import * as $ from 'jquery';
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Basestation, Group, Sensor} from './util';
import {ClickyComponent} from './config_components';

let basestations: {[id: number]: Basestation} = {}; 

class SensorLabel extends ClickyComponent {
	constructor(props: any) {
		super(props);
	}

	updateDB() {
		$.post('/sensors/updateName', {id: this.state.id, name: this.state.name}, function(response) {
			console.log(response.data);
		})
	}

	updateText(e: React.ChangeEvent<HTMLInputElement>){
		this.setState({
	    	name: e.target.value
	    });
	}

	render() {
		super.setButtons(this.state.name, 'btn-lg', 'form-control-lg', 'bslabel-lg');
		if(this.state.edit) {
			this.editButt =  this.editButtInputMode
			this.text =  this.textInputMode;	
		}
		else {
			this.editButt =  this.editButtViewMode;
			this.text =	this.textViewMode;
		}

		return (
				<div className='row align-items-center'>
			  		<div className = 'col-sm-10'>
				        {this.text}
			      	</div>
			      	<div className = 'col=sm-1'>
			      		{this.editButt}
			      	</div>
			    </div>
		);
	}
}

class SensorDescr extends ClickyComponent {
	constructor(props: any) {
		super(props);
	}

	updateDB() {
		$.post('/sensors/updateDescription', {id: this.state.id, description: this.state.descr}, function(response) {
			console.log(response.data);
		})
	}

	updateText(e: React.ChangeEvent<HTMLInputElement>){
		this.setState({
	    	descr: e.target.value
	    });
	}

	render() {
		super.setButtons(this.state.descr, 'btn-sm', 'form-control-sm', 'bslabel-sm');
		console.log(this.state.descr);
		if(this.state.edit) {
			this.editButt =  this.editButtInputMode
			this.text =  this.textInputMode;	
		}
		else {
			this.editButt =  this.editButtViewMode;
			this.text =	this.textViewMode;
		}

		return (
			<div className='row align-items-center justify-content-between"'>
		  		<div className = 'col-sm-11'>
			        {this.text}
		      	</div>
		      	<div className = 'col=sm-1'>
		      		{this.editButt}
		      	</div>
		    </div>
		);
	}
}

class SensorSelect extends React.Component<{groups: {[id: number]: Group}}, {groups: {[id: number]: Group}}>{
	constructor(props: any) {
		super(props);
		this.state = {groups: props.groups}
	}

	renderOptions(): Array<JSX.Element>{
		let options: Array<JSX.Element> = [];
		for(let gid in this.state.groups) {
			let group = this.state.groups[gid];
			options.push(<option value = {gid} > {'(' + gid + ') ' + this.state.groups[gid].name} </option>);
		}
		return options;
	}

	render() {
		
		let options = this.renderOptions();

		return (
			<div>
				<select>
					{options}
				</select>
			</div>
		);
	}
}

class Card extends React.Component<{id: number, name: string, descr: string, groups: {[id: number]: Group}}, {id: number, name: string, descr: string, expanded: boolean, groups: {[id: number]: Group}}> {
	constructor(props: any) {
		super(props);
		this.state = {id: props.id, name: props.name, descr: props.descr, expanded: false, groups: props.groups};
		this.toggleExpanded = this.toggleExpanded.bind(this);
	}

	toggleExpanded() {
		this.setState(prevState => ({
	    	expanded: !prevState.expanded
	    }));	
	}

	render() {
		let expandIcon: JSX.Element;
		let expandedButt: JSX.Element;

		if(this.state.expanded) {
			expandIcon = <i className="fas fa-minus"></i>
		}
		else {
			expandIcon = <i className="fas fa-plus"></i>
		}

		expandedButt = 
			<button 
				className="btn btn-primary btn-lg" 
				type="button" 
				data-toggle="collapse" 
				data-target={"#"+this.state.name} 
				aria-expanded="false" 
				aria-controls={this.state.name}
				onClick={this.toggleExpanded} >
					{expandIcon}
			</button>

		return (
			<div className="card">
				<div className="card-header">
					<div className = 'row align-items-center'>
						<div className = 'col-sm-3'>
				  			<label className ="input-group-text bslabel-lg-2"> {'Sensor: '+this.state.id} </label>
				  		</div>
				  		<div className = 'col-sm-8'>
				  			<SensorLabel id = {this.state.id} name= {this.state.name} descr={this.state.descr} />
				  		</div>
						<div className = 'col-sm-1'>
							{expandedButt}
						</div>
					</div>
				</div>

				<div className="collapse" id={this.state.name}>
					<div className="container-fluid inner-padded">
						<SensorDescr id = {this.state.id} name = {this.state.name} descr={this.state.descr} />
						<SensorSelect groups = {this.state.groups} />
					</div>
				</div>
			</div>
		)
	}
}

export class CardContainer extends React.Component<{dict: {[id: number]: Basestation}}, {dict: any}> {
	constructor(props: any) {
		super(props);
		this.state = {dict: props.dict};
	}
	renderCards(): Array<JSX.Element> {
		let cards: Array<JSX.Element> = [];
		for(let bid in this.state.dict) {
			cards.push(<hr/>);
			cards.push(<h4>{'Basestation ' + bid + ': ' + this.state.dict[bid].name}</h4>);
			cards.push(<hr/>);
			let groups = this.state.dict[bid].groups;
			for(let gid in groups){
				let group = groups[gid];
				for(let sid in group.sensors){
					let sensor = group.sensors[sid];
					cards.push(<Card id = {Number(sid)} name = {sensor.name} descr = {sensor.description} groups = {groups} />);
				}
			}
		}
		return cards;
	}
	render() {
		let cards = this.renderCards();
		return(
			<div>
				{cards}
			</div>
		)
	}
}

$(document).ready(function() {
	// pull all the relevant information and set up a dictionary to store it 
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
	        	console.log(basestations);
				ReactDOM.render(<CardContainer dict = {basestations} />, document.getElementById('root'));
			});
    	});
	});
});