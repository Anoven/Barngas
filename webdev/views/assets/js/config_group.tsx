import * as $ from 'jquery';
import * as React from "react";
import * as ReactDOM from "react-dom";

import {Basestation, Group, Sensor} from './util';
// import {BSLabel, BSDescr, Card, CardContainer} from './config_components';

let basestations: {[id: number]: Basestation} = {}; 

export class BSLabel extends React.Component<{id: number, name: string}, {id: number, name: string, edit: boolean , mousedown: boolean}> {
	name_text: JSX.Element;
	editButt: JSX.Element;
	constructor(props: any) {
		super(props);
		this.state = {edit: false, id: props.id, name: props.name, mousedown: false};
		this.mouseDowned = this.mouseDowned.bind(this);
		this.blurred = this.blurred.bind(this);
		this.toggleEdit = this.toggleEdit.bind(this);
		this.editName = this.editName.bind(this);
		this.enterPress = this.enterPress.bind(this);
		// this.textInput = React.createRef();
	}

	mouseDowned() {
		this.setState({
	    	mousedown: true
	    });

		this.toggleEdit();

	}

	blurred() {
		if(this.state.mousedown) {
			this.setState({
		    	mousedown: false
		    });
		}
		else {
			this.toggleEdit();
		}
	}

	toggleEdit(): void {
		if(this.state.edit) {
			$.post('/groups/updateName', {id: this.state.id, name: this.state.name}, function(response) {
				console.log(response.data);
			})
		}

	    this.setState({
	    	edit: !this.state.edit
	    });
	    console.log(this.state.edit);
	}

	editName(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
	    	name: e.target.value
	    });
	}
	enterPress(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.keyCode == 13) {
			this.toggleEdit();
		}
	}

	render() {
		if(this.state.edit) {


			this.editButt =  
				<button className="btn btn-secondary" onMouseDown = {this.blurred}>
					<i className="fas fa-save"></i>
				</button>



			this.name_text =  
				<input
					type='text'
					autoFocus={true}
					className='form-control form-control-lg'
					placeholder={this.state.name}
					onChange = {this.editName}
					onKeyDown = {this.enterPress} 
					onBlur = {this.blurred}/>;
			
		}
		else {
			this.name_text =	<label 
							className = 'bslabel-lg' 
							onDoubleClick={this.toggleEdit}>
							{this.state.name}
						</label>

			this.editButt =  <button className="btn btn-secondary" onMouseDown = {this.mouseDowned}>
				        	<i className="fas fa-edit"></i>
						</button>
		}

		return (
				<div className='row align-items-center'>
			  		<div className = 'col-sm-10'>
				        {this.name_text}
			      	</div>
			      	<div className = 'col=sm-1'>
			      		{this.editButt}
			      	</div>
			    </div>
		);
	}
}

export class BSDescr extends React.Component<{id: number, name: string, descr: string}, {edit: boolean, id: number, name: string, descr: string}> {
	constructor(props: any) {
		super(props);
		this.state = {edit: false, id: props.id, name: props.name, descr: props.descr};
		this.toggleEdit = this.toggleEdit.bind(this);
		this.editName = this.editName.bind(this);
		this.enterPress = this.enterPress.bind(this);
	}

	toggleEdit(): void {
		if(this.state.edit) {
			$.post('/groups/updateDescription', {id: this.state.id, description: this.state.descr}, function(response) {
				console.log(response.data);
			})
		}

		this.setState(prevState => ({
	    	edit: !prevState.edit
	    }));
	}

	editName(e: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
	    	descr: e.target.value
	    });
	}
	enterPress(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.keyCode == 13) {
			this.toggleEdit();
		}
	}

	render() {
		let name_text: JSX.Element;
		let expandButt: JSX.Element;
		let editButt: JSX.Element;
		if(this.state.edit) {
			name_text = 
				<input
					autoFocus
					type='text'
					className='form-control form-control-sm'
					placeholder={this.state.descr}
					onChange = {this.editName}
					onKeyDown = {this.enterPress}
					onBlur = {this.toggleEdit} />;

			editButt =  
				<button className="btn btn-secondary">
		        	<i className="fas fa-save"></i>
				</button>
		}
		else {
			name_text = 
				<label 
					className = 'form-control form-control-sm' 
					onDoubleClick={this.toggleEdit}>
					{this.state.descr}
				</label>

			editButt =  
				<button className="btn btn-secondary" onClick = {this.toggleEdit}>
		        	<i className="fas fa-edit"></i>
				</button>
		}

		return (
				<div className='row align-items-center justify-content-between"'>
			  		<div className = 'col-sm-11'>
				        {name_text}
			      	</div>
			      	<div className = 'col=sm-1'>
			      		{editButt}
			      	</div>
			    </div>
		);
	}
}

export class Card extends React.Component<{id: number, name: string, descr: string}, {id: number, name: string, descr: string, expanded: boolean}> {
	constructor(props: any) {
		super(props);
		this.state = {id: props.id, name: props.name, descr: props.descr, expanded: false};
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
				  			<label className ="input-group-text bslabel-lg-2"> {'Group: '+this.state.id} </label>
				  		</div>
				  		<div className = 'col-sm-8'>
				  			<BSLabel id = {this.state.id} name= {this.state.name} />
				  		</div>
						<div className = 'col-sm-1'>
							{expandedButt}
						</div>
					</div>
				</div>

				<div className="collapse" id={this.state.name}>
					<div className="container-fluid inner-padded">
						<BSDescr id = {this.state.id} name = {this.state.name} descr={this.state.descr} />
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
			cards.push(<hr/>)
			let groups = this.state.dict[bid].groups;
			for(let gid in groups){
				let group = groups[gid];
				cards.push(<Card id = {Number(gid)} name = {group.name} descr = {group.description}/>);
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
        	console.log(basestations);
			ReactDOM.render(<CardContainer dict = {basestations} />, document.getElementById('root'));
    	});
	});
});

// .then(function() {
//     	$.get('/basestations/groups', function(response) {
// 	        let data = response.data;
// 	        if(data.length > 0) {
//                 for(let i = 0; i < data.length; i++) {
//                     if(basestations[data[i].basestation_id]){
//                     	let bs: Basestation = basestations[data[i].basestation_id];
//                         bs.add_group(new Group(data[i].id, data[i].name, data[i].description));
//                     }
//                 }
//             }
// 	    }).then(function() {
// 	    	$.get('/basestations/sensors', function(response) {
// 		        let data = response.data;
// 		        if(data.length > 0) {
// 	                for(let i = 0; i < data.length; i++) {
// 	                    if(basestations[data[i].basestation_id]){
// 	                    	let bs: Basestation = basestations[data[i].basestation_id];
// 	                    	if(bs.groups[data[i].group_id]) {
// 	                    		let g = bs.groups[data[i].group_id];
// 	                    		g.add_sensor(new Sensor(data[i].id, data[i].name, data[i].description));
// 	                    	}
// 	                    }
// 	                }
// 	            }
// 	            console.log(basestations);
// 	    	})