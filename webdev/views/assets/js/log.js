"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const React = require("react");
const moment = require("moment");
const util_1 = require("./util");
let basestations = {};
class LogEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { bid: props.bid, gid: props.gid, sid: props.sid, date: props.date, text: props.text };
    }
    render() {
        let datetime = moment(this.state.date).format('MM/DD/YYYY HH:mm');
        let group = basestations[this.state.bid].groups[this.state.gid];
        return (React.createElement("div", { className: 'box' },
            React.createElement("div", { className: 'row' },
                React.createElement("div", { className: 'col-lg-12' },
                    React.createElement("div", { className: 'input-group-prepend', style: { width: 'auto', float: 'left' } },
                        React.createElement("div", { className: 'input-group-text' }, "Date:"),
                        React.createElement("div", { className: 'input-group-text clear' }, datetime)),
                    React.createElement("div", { className: 'input-group-prepend', style: { width: 'auto', float: 'left', marginLeft: '12px' } },
                        React.createElement("div", { className: 'input-group-text' }, "Basestation:"),
                        React.createElement("div", { className: 'input-group-text clear' }, this.state.bid)),
                    React.createElement("div", { className: 'input-group-prepend', style: { width: 'auto', float: 'left', marginLeft: '12px' } },
                        React.createElement("div", { className: 'input-group-text' }, "Group:"),
                        React.createElement("div", { className: 'input-group-text clear' }, group.name)))),
            React.createElement("div", { className: 'row' },
                React.createElement("div", { className: 'col-lg-12' },
                    React.createElement("div", { className: 'input-group-text clear', style: { width: '100%', marginTop: '6px' } }, this.state.text)))));
    }
}
function to_log() {
    if ($('#dateInput').val() && $('#timeInput').val() && $('#textInput').val()) {
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
$(document).ready(function () {
    let first_id;
    $.get('/configure/basestations', function (response) {
        let data = response.data;
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                basestations[data[i].id] = new util_1.Basestation(data[i].id, data[i].name, data[i].description);
                if (i == 0) {
                    first_id = data[i].id;
                }
            }
        }
    }).then(function () {
        $.get('/configure/groups', function (response) {
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (basestations[data[i].basestation_id]) {
                        let bs = basestations[data[i].basestation_id];
                        bs.add_group(new util_1.Group(data[i].id, data[i].name, data[i].description));
                        if (data[i].basestation_id == first_id) {
                            $('#group_select').append($('<option>', {
                                value: data[i].id,
                                text: data[i].name,
                                title: data[i].description
                            }));
                        }
                    }
                }
            }
        }).then(function () {
            $.get("/log/notes", function (response) {
                let data = response.data;
                console.log(data);
                if (data) {
                    for (let i = 0; i < data.length; i++) {
                        let bid = Number(data[i].bid);
                        let gid = Number(data[i].gid);
                        let sid = Number(data[i].sid);
                        let date = data[i].date;
                        let text = data[i].text;
                    }
                }
            });
        });
    }).then(function () {
        for (let bid in basestations) {
            let groups = basestations[bid].groups;
            $('#basestation_select').append($('<option>', {
                value: basestations[bid].id,
                text: '' + basestations[bid].name,
                title: basestations[bid].description
            }));
        }
    });
    $('#basestation_select').change(function () {
        let id = Number($('#basestation_select').val());
        if (basestations[id]) {
            $('#group_select').html('');
            let groups = basestations[id].groups;
            for (let gid in groups) {
                $('#group_select').append($('<option>', {
                    value: groups[gid].id,
                    text: '' + groups[gid].name,
                    title: groups[gid].description
                }));
            }
        }
    });
    $('#dateInput').change(function () {
        to_log();
    });
    $('#timeInput').change(function () {
        to_log();
    });
    $('#textInput').change(function () {
        to_log();
    });
    $('#saveBtn').click(function () {
        let text = $('#textInput').val();
        let bid = $('#basestation_select').val();
        let gid = $('#group_select').val();
        let date = $('#dateInput').val();
        let time = $('#timeInput').val();
        console.log(text, bid, gid, date, time);
        $.post('/log/addNote', { text: text, bid: bid, gid: gid }, function (response) {
            console.log(response.data);
            document.location.reload();
        });
    });
});
