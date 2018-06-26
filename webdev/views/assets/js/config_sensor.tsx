import * as $ from 'jquery';
import * as React from "react";
import * as ReactDOM from "react-dom";

import {Basestation, Group, Sensor} from './util';
// import {BSLabel, BSDescr, Card, CardContainer} from './config_components';

let basestations: {[id: number]: Basestation} = {}; 

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
		}
		else {
				
		}

		return (
			<div className="card">

				<span className="border border-primary rounded"></span>
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