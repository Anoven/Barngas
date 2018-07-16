import * as $ from 'jquery';
import * as React from "react";
import * as ReactDOM from "react-dom";
import moment = require('moment');

import {Basestation, Group, Sensor} from './util';
let basestations: {[id: number]: Basestation} = {}; 


class LogEntry extends React.Component<{bid: number, gid: number, sid: number, date: string, text: string}, {bid: number, gid: number, sid: number, date: string, text: string}> {
	constructor(props: any) {
		super(props);
		this.state = {bid: props.bid, gid: props.gid, sid: props.sid, date: props.date, text: props.text};
	}

	render() {
		let datetime = moment(this.state.date).format('MM/DD/YYYY HH:mm');
		let group: Group = basestations[this.state.bid].groups[this.state.gid];
		return(
			<div className = 'box'>
				<div className = 'row'>
					<div className = 'col-lg-12'>
						<div className = 'input-group-prepend' style={{width: 'auto', float: 'left'}}>
							<div className = 'input-group-text'>
								Date:
							</div>
							<div className = 'input-group-text clear'>
								{datetime}
							</div>
						</div>

						<div className = 'input-group-prepend' style={{width: 'auto', float: 'left', marginLeft: '12px'}}>
							<div className = 'input-group-text'>
								Basestation:
							</div>
							<div className = 'input-group-text clear'>
								{this.state.bid}
							</div>
						</div>

						<div className = 'input-group-prepend' style={{width: 'auto', float: 'left', marginLeft: '12px'}}>
							<div className = 'input-group-text'>
								Group:
							</div>
							<div className = 'input-group-text clear'>
								{group.name}
							</div>
						</div>
					</div>
				</div>

				<div className = 'row'>
					<div className = 'col-lg-12'>
						<div className = 'input-group-text clear' style = {{width: '100%', marginTop: '6px'}}>
							{this.state.text}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

function to_log() {
	if($('#dateInput').val() && $('#timeInput').val() && $('#textInput').val()){
    	let datetime = new Date($('#dateInput').val().toString());
    	let hours = Number($('#timeInput').val().toString().split(':')[0]);
    	let minutes = Number($('#timeInput').val().toString().split(':')[1]);

    	datetime.setHours(hours);
    	datetime.setMinutes(minutes);
    	console.log(datetime.toString());

    	$('#saveBtn').prop('disabled', false);
    }
    else {
    	$('#saveBtn').prop('disabled', true);
    }
}

$(document).ready(function() {
	let first_id: number;

	$.get('/configure/basestations', function(response) {
        let data = response.data;
        if (data.length > 0) {
            for(let i = 0 ; i < data.length; i++) {
                basestations[data[i].id] = new Basestation(data[i].id, data[i].name, data[i].description);
                if(i == 0){
                    first_id = data[i].id;
                }
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

                        if(data[i].basestation_id == first_id){
                            $('#group_select').append($('<option>', {
                                value: data[i].id,
                                text:  data[i].name,
                                title: data[i].description
                            })); 
                        }
                    }
                }

            }
        }).then(function() {
        	$.get("/log/notes", function(response) {
        		let data = response.data;
        		console.log(data);
        		if(data) {
        			for(let i = 0; i < data.length; i++) {
						let bid: number = Number(data[i].bid);
						let gid: number = Number(data[i].gid);
        				let sid: number = Number(data[i].sid);
        				let date: string = data[i].date;
        				let text: string = data[i].text;
        				ReactDOM.render(<LogEntry bid = {bid} gid = {gid} sid = {sid} date = {date} text = {text} />, document.getElementById('root'));
        			}
        		}
        	});
        });
    }).then(function() {

    	for(let bid in basestations) {
    		let groups: {[id: number]: Group} = basestations[bid].groups;

    		$('#basestation_select').append($('<option>', {
    			value: basestations[bid].id,
				text: '' + basestations[bid].name,
				title: basestations[bid].description	
    		}));
    	}
    });


    $('#basestation_select').change(function() {
            //Happens when we change the basestation

        let id = Number($('#basestation_select').val());
        if(basestations[id]) {
            $('#group_select').html('');    //clear the group select/dropdown

            //append all the groups for the basestation
            let groups = basestations[id].groups;
            for(let gid in groups){
                $('#group_select').append($('<option>', {
                    value: groups[gid].id,
                    text: '' + groups[gid].name,
                    title: groups[gid].description
                }));    
            }
        }
    });

    $('#dateInput').change(function() {
    	to_log();
    });

    $('#timeInput').change(function() {
    	to_log();
    });

    $('#textInput').change(function() {
    	to_log();
    });

    $('#saveBtn').click(function() {
        let text = $('#textInput').val();
        let bid = $('#basestation_select').val();
        let gid =  $('#group_select').val();
        console.log(text, bid, gid);
        $.post('/log/addNote', {text: text, bid: bid, gid: gid}, function (response) {
            console.log(response.data);
            document.location.reload();
        })
    });


})