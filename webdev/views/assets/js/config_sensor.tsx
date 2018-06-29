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
		  		<div className = 'col col-sm-10'>
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
		  		<div className = 'col col-sm-11'>
			        {this.text}
		      	</div>
		      	<div className = 'col=sm-1'>
		      		{this.editButt}
		      	</div>
		    </div>
		);
	}
}

class SensorSelect extends React.Component<{id: number, groups: {[id: number]: Group}, gid: string}, {id: number, groups: {[id: number]: Group}, gid: string}>{
	constructor(props: any) {
		super(props);
		this.state = {id: props.id, groups: props.groups, gid: props.gid}
		this.updateGroup = this.updateGroup.bind(this);
	}

	renderOptions(): Array<JSX.Element>{
		let options: Array<JSX.Element> = [];
		for(let gid in this.state.groups) {
			let group = this.state.groups[gid];
			if(this.state.gid === gid){
				options.push(<option value = {gid} selected> {this.state.groups[gid].name} </option>);
			}
			else{
				options.push(<option value = {gid} > {this.state.groups[gid].name} </option>);
			}
		}
		return options;
	}

	updateGroup(e: React.ChangeEvent<HTMLSelectElement>) {
		$.post('/sensors/updateGroup', {id: this.state.id, group_id: e.target.value}, function(response) {
			console.log(response.data);
		})
	}

	render() {
		
		let options = this.renderOptions();

		return (
			<div>
				<select className = "custom-select select-lg" onChange = {this.updateGroup}>
					{options}
				</select>
			</div>
		);
	}
}

class Card extends React.Component<{id: number, sensor: Sensor, groups: {[id: number]: Group}, gid: string}, {id: number, sensor: Sensor, groups: {[id: number]: Group}, gid: string, expanded: boolean}> {
	constructor(props: any) {
		super(props);
		this.state = {id: props.id, sensor: props.sensor, groups: props.groups, gid: props.gid, expanded: false};
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
				className="btn btn-primary btn-lg float-right" 
				type="button" 
				data-toggle="collapse" 
				data-target={"#"+this.state.sensor.name} 
				aria-expanded="false" 
				aria-controls={this.state.sensor.name}
				onClick={this.toggleExpanded} >
					{expandIcon}
			</button>

		let typeToString: {[type: string]: string} =   {'AMMONIA': 'Ammonia',
														'CARBON DIOXIDE': 'Carbon Dioxide', 
														'HYDROGEN SULFIDE': 'Hydrogen Sulfide',
														'METHANE': 'Methane',
														'HUMIDITY': 'Relative Humidity',
														'TEMP': 'Temperature'};
		let typeLabel: string = '';
		if(typeToString[this.state.sensor.type]){
			typeLabel = typeToString[this.state.sensor.type]
		}

		return (
			<div className="card">
				<div className="card-header">
					<div className = 'row align-items-center'>
						<div className = 'col col-sm-1 text-center'>
				  			<label className ="input-group-text bslabel-lg-2"> {this.state.id} </label>
				  		</div>

				  		<div className = 'col col-sm-2 text-center'>
				  			<label className ="input-group-text bslabel-lg-2"> {typeLabel} </label>
				  		</div>
				  		
				  		<div className = 'col col-sm-6'>
				  			<SensorLabel id = {this.state.id} name= {this.state.sensor.name} descr={this.state.sensor.description} />
				  		</div>


				  		<div className = 'col col-sm-2 text-center' style={{padding: '0px'}}>
							<SensorSelect id = {this.state.id} groups = {this.state.groups} gid = {this.state.gid}/>
						</div>

						<div className = 'col col-sm-1 float-right'>
							{expandedButt}
						</div>
					</div>
				</div>

				<div className="collapse" id={this.state.sensor.name}>
					<div className="container-fluid inner-padded">
						<SensorDescr id = {this.state.id} name = {this.state.sensor.name} descr={this.state.sensor.description} />
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
			cards.push(<h4>{'' + bid + ': ' + this.state.dict[bid].name}</h4>);
			cards.push(<hr/>);
			let groups = this.state.dict[bid].groups;
			for(let gid in groups){
				console.log(gid);
				let group = groups[gid];
				for(let sid in group.sensors){
					let sensor = group.sensors[sid];
					cards.push(<Card id = {Number(sid)} sensor = {group.sensors[sid]} groups = {groups} gid = {gid}/>);
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
	                    		g.add_sensor(new Sensor(data[i].id, data[i].name, data[i].description, data[i].type));
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