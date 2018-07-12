import * as $ from 'jquery';
import * as React from "react";
import * as ReactDOM from "react-dom";

import {Basestation, Group, Sensor} from './util';
let basestations: {[id: number]: Basestation} = {}; 


class LogEntry extends React.Component<{}, {}> {
	constructor(props: any) {
		super(props);
		this.state = {dict: props.dict};
	}

	render() {
		return(
			<div>
				'Log entry'
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
                console.log('got logs');
            }
        })
    }).then(function() {
    	console.log(basestations);
    	for(let bid in basestations) {
    		let groups = basestations[bid].groups
    		for (let gid in groups) {
    			$('#group_select').append($('<option>', {
                        value: groups[gid].id,
                        text: '' + groups[gid].name,
                        title: groups[gid].description
                    }));  
    		}
    	}
		ReactDOM.render(<LogEntry/>, document.getElementById('root'));
    });

})