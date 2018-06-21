import Chart = require('chart.js');
import moment = require('moment');
import * as $ from 'jquery';

import * as React from "react";
import * as ReactDOM from "react-dom";


import {Basestation, Group, Sensor} from './util';

let basestations: {[id: number]: Basestation} = {}; 

// ReactDOM.render(
// 	<div>
// 	<h1>Hello, Welcome to the first page</h1>
// 	</div>,
// 	  document.getElementById("root")
// );




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
	    	});
    	});
    });
});