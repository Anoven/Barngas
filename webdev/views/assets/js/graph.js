"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chart_js_1 = require("chart.js");
const moment = require("moment");
const $ = require("jquery");
const util_1 = require("./util");
let timeFormat = 'MM/DD/YYYY HH:mm';
let curr_datetime = moment();
let start_datetime = moment(curr_datetime).startOf('day');
let end_datetime = moment(curr_datetime).endOf('day');
let basestations = {};
let series_data = {};
let series_notes = {};
let series_names = {};
let series_types = {};
let series_colors = {};
let active_types = {};
let sensor_types = { 'AMMONIA': $('#ammonia-tab'), 'CARBON DIOXIDE': $('#carbon-dioxide-tab'), 'HYDROGEN SULFIDE': $('#hydrogen-sulfide-tab'), 'METHANE': $('#methane-tab'), 'HUMIDITY': $('#humidity-tab'), 'TEMP': $('#temp-tab') };
let tab_types = { 'ammonia-tab': 'AMMONIA', 'carbon-dioxide-tab': 'CARBON DIOXIDE', 'hydrogen-sulfide-tab': 'HYDROGEN SULFIDE', 'methane-tab': 'METHANE', 'humidity-tab': 'HUMIDITY', 'temp-tab': 'TEMP' };
let curr_tab_id = 'ammonia-tab';
let htmlchart = document.getElementById("chart");
let ctx = htmlchart.getContext('2d');
let chart = new chart_js_1.Chart(ctx, {
    type: 'line',
    options: {
        title: {
            text: 'Chart.js Time Scale'
        },
        scales: {
            xAxes: [{
                    type: 'time',
                    time: {
                        parser: timeFormat,
                        tooltipFormat: 'll HH:mm'
                    },
                    scaleLabel: {
                        display: true
                    }
                }],
            yAxes: [{
                    scaleLabel: {
                        display: true,
                    },
                    ticks: {
                        min: 0,
                        max: 100
                    }
                }]
        },
        legend: {
            position: 'right'
        },
        tooltips: {
            intersect: true,
            mode: 'point'
        },
    }
});
let methane_min = limit_series('Methane LEL');
let ammonia_min = limit_series('Ammonia Lower Limit');
let hydrogen_sulfide_min = limit_series('Hydrogen Sulfide Lower Limit');
let carbon_dioxide_min = limit_series('Carbon Dioxide LEL');
let temp_max = limit_series('Temperature Upper Limit');
let temp_min = limit_series('Temperature Lower Limit');
let humidity_min = limit_series('Humidity Lower Limit');
let type_thresholds = { 'AMMONIA': [ammonia_min], 'CARBON DIOXIDE': [carbon_dioxide_min], 'HYDROGEN SULFIDE': [hydrogen_sulfide_min], 'METHANE': [methane_min], 'HUMIDITY': [humidity_min], 'TEMP': [temp_max, temp_min] };
function limit_series(label) {
    return {
        label: label,
        backgroundColor: 'rgb(255,0,0)',
        pointHoverBackgroundColor: 'rgb(255,0,0)',
        borderColor: 'rgb(255,0,0)',
        pointHoverBorderColor: 'rgb(255,0,0)',
        fill: false,
        data: []
    };
}
function randomColor() {
    let r = Math.round(Math.random() * (255));
    let g = Math.round(Math.random() * (255));
    let b = Math.round(Math.random() * (255));
    let to_return = 'rgb(' + r + ',' + g + ',' + b + ')';
    return to_return;
}
function createLimits() {
    methane_min.data = [{ t: start_datetime.toDate(), y: 30 }, { t: end_datetime.toDate(), y: 30 }];
    ammonia_min.data = [{ t: start_datetime.toDate(), y: 30 }, { t: end_datetime.toDate(), y: 30 }];
    carbon_dioxide_min.data = [{ t: start_datetime.toDate(), y: 30 }, { t: end_datetime.toDate(), y: 30 }];
    hydrogen_sulfide_min.data = [{ t: start_datetime.toDate(), y: 30 }, { t: end_datetime.toDate(), y: 30 }];
    temp_min.data = [{ t: start_datetime.toDate(), y: 10 }, { t: end_datetime.toDate(), y: 10 }];
    temp_max.data = [{ t: start_datetime.toDate(), y: 40 }, { t: end_datetime.toDate(), y: 40 }];
    humidity_min.data = [{ t: start_datetime.toDate(), y: 30 }, { t: end_datetime.toDate(), y: 30 }];
}
function createLabels() {
    let time_unit = $('#time_unit_select').val().toString();
    let labels = [];
    if (time_unit === 'hourly') {
        labels = createLabelsHelper('minute', 4, 15);
    }
    else if (time_unit === 'daily') {
        labels = createLabelsHelper('hour', 6, 4);
    }
    else if (time_unit === 'monthly') {
        labels = createLabelsHelper('day', 4, 7);
    }
    else if (time_unit === 'yearly') {
        labels = createLabelsHelper('month', 12, 1);
    }
    return labels;
}
function createLabelsHelper(unit, ticks, interval) {
    let labels = [];
    let remaining_ticks = ticks - 2;
    let temp_moment = moment(start_datetime);
    labels.push(temp_moment.format(timeFormat));
    for (let i = 0; i < remaining_ticks; i++) {
        temp_moment.add(interval, unit);
        labels.push(temp_moment.format(timeFormat));
    }
    labels.push(end_datetime.format(timeFormat));
    return labels;
}
function createDataSet(label, data, color) {
    let dataset = {
        label: label,
        backgroundColor: color,
        pointHoverBackgroundColor: color,
        borderColor: color,
        pointHoverBorderColor: color,
        fill: false,
        data: data
    };
    return dataset;
}
function processResponse(response, adjust) {
    series_data = {};
    series_names = {};
    series_types = {};
    active_types = {};
    let data = response.data;
    if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
            if (series_data[data[i].id]) {
                series_data[data[i].id].push({ t: new Date(data[i].t), y: data[i].y });
            }
            else {
                series_data[data[i].id] = [{ t: new Date(data[i].t), y: data[i].y }];
                series_names[data[i].id] = data[i].name;
                series_types[data[i].id] = data[i].type;
                active_types[data[i].type] = true;
            }
            if (!series_colors[data[i].id]) {
                series_colors[data[i].id] = randomColor();
            }
        }
        if (adjust || $('#no-data-tab').hasClass('active')) {
            adjust_tabs();
        }
        createLimits();
        build_chart();
    }
    else {
        adjust_tabs();
        build_chart();
    }
}
function adjust_tabs() {
    $('.graph-link').hide();
    $('.graph-link').parent().hide();
    $('.graph-link').removeClass('active');
    $('#no-data-tab').hide();
    $('#no-data-tab').parent().hide();
    let visible_tabs = [];
    for (let type in active_types) {
        if (sensor_types[type]) {
            sensor_types[type].show();
            sensor_types[type].parent().show();
            visible_tabs.push(sensor_types[type]);
        }
    }
    if (visible_tabs.length > 0) {
        let curr_tab = null;
        for (let i = 0; i < visible_tabs.length; i++) {
            if (visible_tabs[i].attr('id') === curr_tab_id) {
                curr_tab = visible_tabs[i];
                break;
            }
        }
        if (curr_tab) {
            curr_tab.addClass('active');
        }
        else {
            visible_tabs.sort();
            visible_tabs[0].addClass('active');
            curr_tab_id = visible_tabs[0].attr('id');
        }
    }
    else {
        $('#no-data-tab').show();
        $('#no-data-tab').parent().show();
        $('#no-data-tab').addClass('active');
    }
}
function build_chart() {
    let curr_tab = $('.graph-link.active');
    chart.data.datasets = [];
    if (tab_types[curr_tab.attr('id')]) {
        curr_tab_id = curr_tab.attr('id');
        chart.data.datasets = chart.data.datasets.concat(type_thresholds[tab_types[curr_tab.attr('id')]]);
        for (let id in series_types) {
            if (series_types[id] === tab_types[curr_tab.attr('id')]) {
                chart.data.datasets.push(createDataSet(series_names[id], series_data[id], series_colors[id]));
                chart.data.labels = createLabels();
            }
        }
    }
    chart.update();
}
function is_threshold(selected_dataset) {
    let thresholds = [];
    for (let type in type_thresholds) {
        thresholds = thresholds.concat(type_thresholds[type]);
    }
    return !thresholds.every(threshold_dataset => !(threshold_dataset.label === selected_dataset.label));
}
function zoom(new_moment) {
    let time_unit = $('#time_unit_select').val().toString();
    if (time_unit === 'hourly') {
        $('#time_unit_select').val('hourly');
    }
    else if (time_unit === 'daily') {
        $('#time_unit_select').val('hourly');
    }
    else if (time_unit === 'monthly') {
        $('#time_unit_select').val('daily');
    }
    else if (time_unit === 'yearly') {
        $('#time_unit_select').val('monthly');
    }
    curr_datetime = new_moment;
    $('#time_unit_select').change();
}
function request_data(adjust) {
    let time_unit = $('#time_unit_select').val().toString();
    let start_date = start_datetime.toDate().toString();
    let end_date = end_datetime.toDate().toString();
    let b_id = $('#basestation_select').val();
    let g_id = $('#group_select').val();
    if (g_id === 'null') {
        g_id = '';
    }
    $.post('/graph/data', { time_unit: time_unit, start_date: start_date, end_date: end_date, b_id: b_id, g_id: g_id }, function (response) {
        processResponse(response, adjust);
        if (time_unit === 'hourly') {
            let temp = moment(end_datetime).add(1, 'hour');
            $('#timetitle').html('' + start_datetime.format('MMMM Do YYYY') + '<br/>' + start_datetime.format('h a') + ' - ' + temp.format('h a'));
        }
        else if (time_unit === 'daily') {
            $('#timetitle').html('' + start_datetime.format('MMMM Do YYYY'));
        }
        else if (time_unit === 'monthly') {
            $('#timetitle').html('' + start_datetime.format('MMMM YYYY'));
        }
        else if (time_unit === 'yearly') {
            $('#timetitle').html('' + start_datetime.format('YYYY'));
        }
    });
    $.post('/graph/notes', { time_unit: time_unit, start_date: start_date, end_date: end_date, b_id: b_id, g_id: g_id }, function (response) {
        console.log(response.data);
    });
}
function vertical_line(clientX) {
    let element = $("#cursor"), offsetLeft = element.offset().left, domElement = element.get(0), ctx = domElement.getContext('2d');
    ctx.beginPath(),
        ctx.moveTo(clientX - offsetLeft, 0),
        ctx.lineTo(clientX - offsetLeft, domElement.height),
        ctx.strokeStyle = "red",
        ctx.stroke();
}
$(document).ready(function () {
    let first_id;
    $.get('/graph/basestations', function (response) {
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
        $.get('/graph/groups', function (response) {
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (basestations[data[i].basestation_id]) {
                        basestations[data[i].basestation_id].add_group(new util_1.Group(data[i].id, data[i].name, data[i].description));
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
        });
    }).then(function () {
        for (let id in basestations) {
            $('#basestation_select').append($('<option>', {
                value: basestations[id].id,
                text: '(' + basestations[id].id + ')' + ' ' + basestations[id].name,
                title: basestations[id].description
            }));
        }
    }).then(function () {
        request_data(true);
    }).then(function () {
        let time_vals = ['hourly', 'daily', 'monthly', 'yearly'];
        let time_units = ['hour', 'day', 'month', 'year'];
        $('.graph-link').click(function () {
            if (!$(this).hasClass('active')) {
                $('.graph-link').removeClass('active');
                $(this).addClass('active');
                build_chart();
            }
        });
        $('#time_unit_select').change(function () {
            let time_unit = $('#time_unit_select').val().toString();
            for (let i = 0; i < time_vals.length; i++) {
                if (time_unit === time_vals[i]) {
                    start_datetime = moment(curr_datetime).startOf(time_units[i]);
                    end_datetime = moment(curr_datetime).endOf(time_units[i]);
                    let button_text = time_units[i].charAt(0).toUpperCase() + time_units[i].substr(1);
                    $("#previous_btn").prop('value', 'Prev. ' + button_text);
                    $("#next_btn").prop('value', 'Next ' + button_text);
                    break;
                }
            }
            request_data(false);
        });
        $('#basestation_select').change(function () {
            let id = Number($('#basestation_select').val());
            if (basestations[id]) {
                $('#group_select').html('');
                $('#group_select').append($('<option>', {
                    value: null,
                    text: 'None'
                }));
                let groups = basestations[id].groups;
                for (let gid in groups) {
                    $('#group_select').append($('<option>', {
                        value: groups[gid].id,
                        text: '' + groups[gid].name,
                        title: groups[gid].description
                    }));
                }
            }
            request_data(true);
        });
        $('#group_select').change(function () {
            request_data(true);
        });
        $('#previous_btn').click(function () {
            let time_unit = $('#time_unit_select').val().toString();
            for (let i = 0; i < time_vals.length; i++) {
                if (time_unit === time_vals[i]) {
                    let increment = 1;
                    curr_datetime.subtract(increment, time_units[i]);
                    start_datetime = moment(curr_datetime).startOf(time_units[i]);
                    end_datetime = moment(curr_datetime).endOf(time_units[i]);
                    break;
                }
            }
            request_data(false);
        });
        $('#next_btn').click(function () {
            let time_unit = $('#time_unit_select').val().toString();
            for (let i = 0; i < time_vals.length; i++) {
                if (time_unit === time_vals[i]) {
                    let increment = 1;
                    curr_datetime.add(increment, time_units[i]);
                    start_datetime = moment(curr_datetime).startOf(time_units[i]);
                    end_datetime = moment(curr_datetime).endOf(time_units[i]);
                    break;
                }
            }
            request_data(false);
        });
    });
    $("#cursor").attr('width', $("#chart").width());
    $("#cursor").attr('height', $("#chart").height());
    $("#chart").dblclick(function (event) {
        let activePoint = chart.getElementAtEvent(event);
        if (Object.keys(activePoint).length != 0) {
            let datasetIndex = activePoint[0]._datasetIndex;
            let pointIndex = activePoint[0]._index;
            let selected_dataset = chart.data.datasets[datasetIndex];
            let datasets = [];
            if (!is_threshold(selected_dataset)) {
                let point = selected_dataset.data[pointIndex];
                let new_moment = moment(point.t);
                console.log(point);
                console.log(new_moment.toString());
                zoom(new_moment);
            }
        }
    });
    $("#chart").click(function (event) {
        let activePoint = chart.getElementAtEvent(event);
        if (Object.keys(activePoint).length != 0) {
            console.log(activePoint[0]);
        }
    });
});
