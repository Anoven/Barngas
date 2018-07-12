import * as $ from 'jquery';
import * as React from "react";
import * as ReactDOM from "react-dom";

import {Basestation, Group, Sensor} from './util';
import {ClickyComponent} from './config_components';

let basestations: {[id: number]: Basestation} = {}; 

class GroupLabel extends ClickyComponent {
	constructor(props: any) {
		super(props);
	}

	updateDB() {
		$.post('/groups/updateName', {id: this.state.id, name: this.state.name}, function(response) {
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

class GroupDescr extends ClickyComponent {
	constructor(props: any) {
		super(props);
	}

	updateDB() {
		$.post('/groups/updateDescription', {id: this.state.id, description: this.state.descr}, function(response) {
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

class NewGroupComp extends React.Component<{bid: string, name: string}, {bid: string, name: string, groupName: string, descr: string}> {
	constructor(props: any) {
		super(props);
		this.state = {bid: props.bid, name: props.name, groupName: 'Group Name', descr: 'Description'};
		this.addGroup = this.addGroup.bind(this);
		this.updateName = this.updateName.bind(this);
		this.updateDescr = this.updateDescr.bind(this);
	}

	addGroup() {
		$.post('/groups/addGroup', {name: this.state.groupName, description: this.state.descr, bid: this.state.bid}, function(response) {
			console.log(response.data);
			document.location.reload();
		})
	}

	updateName(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
	    	groupName: e.target.value
	    });
	}

	updateDescr(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
	    	descr: e.target.value
	    });
	}

	render() {
		return (
			<div>
				<button 
					className = 'btn btn-info' 
					data-toggle="modal"
					data-target= {'#' + this.state.name}
					style = {{width: 'calc(100% - 10px)', height: '10vh', margin:'5px 5px'}}>
					Add a New Group
				</button>

				<div className="modal fade" id = {this.state.name} role="dialog" aria-labelledby={this.state.name + 'label'} aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id={this.state.name + 'label'}>{'Add a new group to ' + this.state.name}</h5>

								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>

							<div className="modal-body">
								<input type = 'text' className = 'form-control' autoFocus placeholder = {this.state.groupName} onChange = {this.updateName}></input>
								<input type = 'text' className = 'form-control' autoFocus placeholder = {this.state.descr} onChange = {this.updateDescr}></input>
							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
								<button type="button" className="btn btn-primary" onClick = {this.addGroup}>Save changes</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class Card extends React.Component<{id: number, name: string, descr: string, canRemove: boolean}, {id: number, name: string, descr: string, expanded: boolean, canRemove: boolean}> {
	constructor(props: any) {
		super(props);
		this.state = {id: props.id, name: props.name, descr: props.descr, expanded: false, canRemove: props.canRemove};
		this.toggleExpanded = this.toggleExpanded.bind(this);
		this.deleteGroup = this.deleteGroup.bind(this);
	}

	toggleExpanded() {
		this.setState(prevState => ({
	    	expanded: !prevState.expanded
	    }));	
	}

	deleteGroup() {
		$.post('/groups/deleteGroup', {id: this.state.id}, function(response) {
			console.log(response.data);
			document.location.reload();
		})
	}

	render() {
		let expandIcon: JSX.Element;
		let expandedButt: JSX.Element;
		let removeButton: JSX.Element;

		if(this.state.expanded) {
			expandIcon = <i className="fas fa-minus" title = {'Hide Description'}></i>
		}
		else {
			expandIcon = <i className="fas fa-plus" title = {'Show Description'}></i>
				
		}

		if(this.state.canRemove) {
			removeButton = 	<button className="btn btn-primary btn-lg"
									title = {'Delete Group'}
									onClick = {this.deleteGroup}>
								<i className="fas fa-trash-alt"></i>
							</button>
		}
		else {
			removeButton = 	<button className="btn btn-primary btn-lg" 
									title = {'Cannot Delete a Group with Sensors In It!'} 
									onClick = {this.deleteGroup}
									disabled >
								<i className="fas fa-trash-alt"></i>
							</button>
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
				  			<label className ="input-group-text bslabel-lg-2"> {'Group: '} </label>
				  		</div>
				  		<div className = 'col-sm-7'>
				  			<GroupLabel id = {this.state.id} name= {this.state.name} descr={this.state.descr} />
				  		</div>
						<div className = 'col-sm-2'>
							<div style = {{display: 'flex', justifyContent: 'space-around'}}>
								{expandedButt}
								{removeButton}
							</div>
						</div>
					</div>
				</div>

				<div className="collapse" id={this.state.name}>
					<div className="container-fluid inner-padded">
						<GroupDescr id = {this.state.id} name = {this.state.name} descr={this.state.descr} />
					</div>
				</div>
			</div>
		)
	}
}

class CardContainer extends React.Component<{dict: {[id: number]: Basestation}}, {dict: any}> {
	constructor(props: any) {
		super(props);
		this.state = {dict: props.dict};
	}
	renderCards(): Array<JSX.Element> {
		let cards: Array<JSX.Element> = [];
		for(let bid in this.state.dict) {
			cards.push(<hr/>);
			cards.push(<h4>{'Basestation ' + bid + ': ' + this.state.dict[bid].name}</h4>);
			cards.push(<hr/>)
			let groups = this.state.dict[bid].groups;
			for(let gid in groups){
				let group = groups[gid];
				if(Object.keys(group.sensors).length == 0){
					cards.push(<Card id = {Number(gid)} name = {group.name} descr = {group.description} canRemove = {true} />);
				}
				else {
					cards.push(<Card id = {Number(gid)} name = {group.name} descr = {group.description} canRemove = {false} />);
				}
				
			}
			cards.push(<NewGroupComp bid = {bid} name = {this.state.dict[bid].name} />);
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
	    	}).then(function() {
	    		$('.modal').on('show', function () {
				   $('input:text:visible:first').focus();
				});
			});
    	});
	});
});