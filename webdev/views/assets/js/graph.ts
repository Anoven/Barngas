import Chart = require('chart.js');
import moment = require('moment');
import * as $ from 'jquery';

import {Basestation, Group} from './util';

let timeFormat: string = 'MM/DD/YYYY HH:mm';
let curr_datetime: moment.Moment = moment();
let start_datetime: moment.Moment = moment(curr_datetime).startOf('day');
let end_datetime: moment.Moment  = moment(curr_datetime).endOf('day');

let basestations: {[id: number]: Basestation } = {};

let series_data: {[id: number]: Array<{t: Date, y: number}>} = {};
let series_names: {[id: number]: string} = {};           // names of the seires
let series_types: {[id: number]: string} = {};           // types of the series
let series_colors: {[id: number]: string} = {};          // color of each series
let active_types: {[type: string]: boolean} = {};        // types that are currently active

let sensor_types: {[type: string]: JQuery<HTMLElement>} = {'AMMONIA': $('#ammonia-tab'), 'CARBON DIOXIDE': $('#carbon-dioxide-tab'), 'HYDROGEN SULFIDE': $('#hydrogen-sulfide-tab'),'METHANE': $('#methane-tab'), 'HUMIDITY': $('#humidity-tab'),'TEMP': $('#temp-tab')};
let tab_types: {[id: string]: string} = {'ammonia-tab': 'AMMONIA' , 'carbon-dioxide-tab': 'CARBON DIOXIDE', 'hydrogen-sulfide-tab': 'HYDROGEN SULFIDE','methane-tab': 'METHANE', 'humidity-tab': 'HUMIDITY', 'temp-tab': 'TEMP'};
let curr_tab_id: string = 'ammonia-tab';


let htmlchart: any = document.getElementById("chart");
let chart: Chart = new Chart(htmlchart.getContext('2d'), {
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
        }
    }
});

let methane_min: Chart.ChartDataSets = limit_series('Methane LEL');
let ammonia_min: Chart.ChartDataSets = limit_series('Ammonia Lower Limit');
let hydrogen_sulfide_min: Chart.ChartDataSets = limit_series('Hydrogen Sulfide Lower Limit');
let carbon_dioxide_min: Chart.ChartDataSets = limit_series('Carbon Dioxide LEL');
let temp_max: Chart.ChartDataSets = limit_series('Temperature Upper Limit');
let temp_min: Chart.ChartDataSets = limit_series('Temperature Lower Limit');
let humidity_min: Chart.ChartDataSets = limit_series('Humidity Lower Limit');

//list of limits
let limits:  {[type: string]: Array<Chart.ChartDataSets>} = {'AMMONIA': [ammonia_min], 'CARBON DIOXIDE': [carbon_dioxide_min], 'HYDROGEN SULFIDE': [hydrogen_sulfide_min], 'METHANE': [methane_min], 'HUMIDITY': [humidity_min], 'TEMP': [temp_max, temp_min]};

function limit_series(label: string): Chart.ChartDataSets{
    return {
        label: label,
        backgroundColor: 'rgb(255,0,0)',
        pointHoverBackgroundColor: 'rgb(255,0,0)',
        borderColor: 'rgb(255,0,0)',
        pointHoverBorderColor: 'rgb(255,0,0)',
        fill: false,    
        data: []
    }
}

function randomColor(): string {
    //generate a random rgb string
    let r: number = Math.round(Math.random() * (255));
    let g: number = Math.round(Math.random() * (255));
    let b: number = Math.round(Math.random() * (255));
    let to_return: string = 'rgb('+ r +','+ g +','+ b + ')';
    return to_return;
}

function createLimits(): void {
    /*
    Creates the threshold series (e.g. methane upper limit)
    */
    methane_min.data = [{t: start_datetime.toDate(), y: 30}, {t: end_datetime.toDate(), y: 30}];
    ammonia_min.data = [{t: start_datetime.toDate(), y: 30}, {t: end_datetime.toDate(), y: 30}];
    carbon_dioxide_min.data = [{t: start_datetime.toDate(), y: 30}, {t: end_datetime.toDate(), y: 30}];
    hydrogen_sulfide_min.data = [{t: start_datetime.toDate(), y: 30}, {t: end_datetime.toDate(), y: 30}];
    temp_min.data = [{t: start_datetime.toDate(), y: 10}, {t: end_datetime.toDate(), y: 10}];
    temp_max.data = [{t: start_datetime.toDate(), y: 40}, {t: end_datetime.toDate(), y: 40}];
    humidity_min.data = [{t: start_datetime.toDate(), y: 30}, {t: end_datetime.toDate(), y: 30}];
}

// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
//Create the scale for the x axis

function createLabels(): Array<string> {
    let time_unit: string = $('#time_unit_select').val().toString();

    let labels: Array<string> = [];
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

function createLabelsHelper(unit: moment.unitOfTime.StartOf, ticks: number, interval: any): Array<string> {
    /*
    Generate the labels for the x-axis
    @param ticks - the total number labels
    @interval - the size of the interval between two ticks
    @param unit - the unit of time (e.g. day, hour, min, year, etc)
    */

    let labels: Array<string> = [];
    let remaining_ticks:number = ticks - 2;    //reaming ticks needed (exlude 2 because we hard code the first
                                               //and last one)

    //loop through the remaining ticks and get the timestamp
    let temp_moment: moment.Moment = moment(start_datetime);    //keep track of the moment
    // labels.push(start_datetime.format(timeFormat));
    labels.push(temp_moment.format(timeFormat));
    for(let i = 0 ; i < remaining_ticks; i++){
        temp_moment.add(interval, unit);
        labels.push(temp_moment.format(timeFormat));
    }
    labels.push(end_datetime.format(timeFormat));

    return labels;
}

// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

function createDataSet(label: string, data: Array<{t: Date, y: number}>, color: string) {
    /*
    Create a ChartDataSet object using the data generated by an array of data
    */

    let dataset: Chart.ChartDataSets = {
        label: label,
        backgroundColor: color,
        pointHoverBackgroundColor: color,
        borderColor: color,
        pointHoverBorderColor: color,
        fill: false,    
        data: data
    }

    return dataset;
}

function processResponse(response: any, adjust: boolean) {

    //since we are going to pull new data - we are going to wipe the data we previously had
    series_data = {};    //Clear all the data for the tables
    series_names = {};   //clear all the names for the tables
    series_types = {};    //clear all the types off the series
    active_types = {};    //clear all the active graphs

    //NOTE: we don't wipe the color data since we want to keep the colors consistent for each sensor
    //(even with different datasets)

    // Parse The data and create a dataset
    let data = response.data;
    if (data.length != 0){
        for (let i = 0; i < data.length; i++) {
            if(series_data[data[i].id]) {
                series_data[data[i].id].push({t: new Date(data[i].t), y: data[i].y});
            }
            else {
                //set up the stuff for the graph building
                series_data[data[i].id] = [{t: new Date(data[i].t), y: data[i].y}];
                series_names[data[i].id] = data[i].name;
                series_types[data[i].id] = data[i].type;
                active_types[data[i].type] = true;        //Let us know which tabs we should have open
            }

            //assigns each sensor a random colour - the colour should persist until the user leaves the page
            if(!series_colors[data[i].id]) {
                series_colors[data[i].id] = randomColor();            }
        }

        if (adjust || $('#no-data-tab').hasClass('active')){
            //if we have no data we want to adjust the tables for that
            adjust_tabs();
        }
        createLimits();
        build_chart();
    }
    else {
        //If theres no data: just do everything - its fine
        adjust_tabs();
        build_chart();
    }
}
function adjust_tabs() {
    //Hide all the tabs before we decide which ones we want to turn on
    $('.graph-link').hide();
    $('.graph-link').parent().hide();
    $('.graph-link').removeClass('active');

    $('#no-data-tab').hide();
    $('#no-data-tab').parent().hide();

    //figure out which types of graphs need to be shown and show those tabs
    let visible_tabs: Array<JQuery<HTMLElement>> = []
    for(let type in active_types) {
        if (sensor_types[type]){
            sensor_types[type].show();
            sensor_types[type].parent().show();
            visible_tabs.push(sensor_types[type]);
        }
    }
    if (visible_tabs.length > 0) {
        //go through the visible tabs and see if we can find the current tab the user was looking at
        let curr_tab: JQuery<HTMLElement> = null;
        for(let i = 0; i < visible_tabs.length; i++) {
            if (visible_tabs[i].attr('id') === curr_tab_id){
                curr_tab = visible_tabs[i];
                break;
            }
        }
        if(curr_tab){
            //if we found the tab, we open that tab
            curr_tab.addClass('active');
        }
        else{
            //otherwise we open the first tab and save that id
            visible_tabs.sort();
            visible_tabs[0].addClass('active');
            curr_tab_id = visible_tabs[0].attr('id');
        }
        
    }
    else {
        //If there is no data - then show nothing
        $('#no-data-tab').show();
        $('#no-data-tab').parent().show();
        $('#no-data-tab').addClass('active');
    }
}

function build_chart() {
    /*
    Populate the graph with relevant data 
    */
    let curr_tab: JQuery<HTMLElement> = $('.graph-link.active');
    chart.data.datasets = [];
    if(tab_types[curr_tab.attr('id')]) {
        curr_tab_id = curr_tab.attr('id');
        //Get the type of sensor we want to look at
        chart.data.datasets = chart.data.datasets.concat(limits[tab_types[curr_tab.attr('id')]]);
        for(let id in series_types) {
            if(series_types[id] === tab_types[curr_tab.attr('id')]) {
                chart.data.datasets.push(createDataSet(series_names[id], series_data[id], series_colors[id]));
                chart.data.labels = createLabels();
            }
        }
    }
    chart.update();
}

function request_data(adjust: boolean){
    let time_unit: string = $('#time_unit_select').val().toString();
    let start_date: string = start_datetime.toDate().toString();
    let end_date: string = end_datetime.toDate().toString();

    let b_id = $('#basestation_select').val();
    let g_id = $('#group_select').val();

    if(g_id === 'null'){
        g_id = '';
    }

    $.post('/graph/data', 
        {time_unit: time_unit, start_date: start_date, end_date: end_date, b_id: b_id, g_id: g_id}, 
        function(response) {
            
            processResponse(response, adjust);    //self explanatory

            //adjust the title of the graph
            if(time_unit === 'hourly'){
                let temp: moment.Moment = moment(end_datetime).add(1, 'hour');
                $('#timetitle').html('' + start_datetime.format('MMMM Do YYYY') + '<br/>' + start_datetime.format('h a') + ' - ' + temp.format('h a'));
            }
            else if(time_unit === 'daily'){
                $('#timetitle').html('' + start_datetime.format('MMMM Do YYYY'));
            }
            else if(time_unit === 'monthly'){
                $('#timetitle').html('' + start_datetime.format('MMMM YYYY'));
            }
            else if(time_unit === 'yearly'){
                $('#timetitle').html('' + start_datetime.format('YYYY'));
            }
        }
    );
}
// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
// Start doing everything

$(document).ready(function() {
    let first_id: number;    //record the id of the first basestation that was pulled

    // Get the basestation info
    $.get('/graph/basestations', function(response) {
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

        //Get the info on the groups
        $.get('/graph/groups', function(response) {
            let data = response.data;
            if(data.length > 0) {
                for(let i = 0; i < data.length; i++) {
                    if(basestations[data[i].basestation_id]){
                        basestations[data[i].basestation_id].add_group(new Group(data[i].id, data[i].name, data[i].description));

                        //take the first id and immediatly generate options for it in the basestation dropdown
                        if(data[i].basestation_id == first_id){
                            $('#group_select').append($('<option>', {
                                value: data[i].id,
                                text: '(' + data[i].id + ')' + ' ' + data[i].name,
                                title: data[i].description
                            })); 
                        }
                    }
                }
            }
        });
    }).then(function() {

        // build the select options for the basestation dropdown
        for(let id in basestations){
            $('#basestation_select').append($('<option>', {
                value: basestations[id].id,
                text: '(' + basestations[id].id + ')' + ' ' + basestations[id].name,
                title: basestations[id].description
            }));
        }        
    }).then(function() {
        request_data(true);    //request the data to populate the graphs

    }).then(function() {
        //Set up Buttons and click events
        let time_vals: Array<string> = ['hourly', 'daily', 'monthly', 'yearly'];                //values of the time_selector
        let time_units: Array<moment.unitOfTime.StartOf> = ['hour', 'day', 'month', 'year'];    //viable units of time for moments

        $('.graph-link').click(function() {
            //When we click a tab - we want to open the tab and repopulate the graph with the data
            //relevant to this specific graph
            if(! $(this).hasClass('active')){
                $('.graph-link').removeClass('active');
                $(this).addClass('active')

                build_chart();  
            }
        })

        $('#time_unit_select').change(function() {
            let time_unit: string = $('#time_unit_select').val().toString();    //get selected unit of time the user selected

            //find out which unit of time we are using and adjust the text + starting and finishing time
            for(let i = 0; i < time_vals.length; i++) {
                if(time_unit === time_vals[i]) {
                    //update the current starting and finishing time of the data we are looking at
                    start_datetime = moment(curr_datetime).startOf(time_units[i]);
                    end_datetime = moment(curr_datetime).endOf(time_units[i]);

                    //edit the text on the previous and next buttons
                    $("#previous_btn").prop('value', 'Prev. ' + time_units[i]);
                    $("#next_btn").prop('value', 'Next ' + time_units[i]);
                    
                    break;        
                }
            }
            request_data(false);
        });

        $('#basestation_select').change(function() {
            //Happens when we change the basestation

            let id = Number($('#basestation_select').val());
            if(basestations[id]) {
                $('#group_select').html('');    //clear the group select/dropdown

                //Add a empty option
                $('#group_select').append($('<option>', {
                        value: null,
                        text: 'None'
                    }));

                //append all the groups for the basestation
                let groups = basestations[id].groups;
                for(let gid in groups){
                    $('#group_select').append($('<option>', {
                        value: groups[gid].id,
                        // text: '(' + groups[gid].id + ')' + ' ' + groups[gid].name,
                        text: '' + groups[gid].name,
                        title: groups[gid].description
                    }));    
                }
            }
            request_data(true);
        });

        $('#group_select').change(function() {
            //happens when we change the group of sensors we want to look at
            request_data(true);
        });


        $('#previous_btn').click(function() {
            //happens when we want to go backwards in time

            let time_unit: string = $('#time_unit_select').val().toString();

            for(let i = 0; i < time_vals.length; i++) {
                if(time_unit === time_vals[i]) {
                    let increment: any = 1;
                    curr_datetime.subtract(increment, time_units[i]);
                    start_datetime = moment(curr_datetime).startOf(time_units[i]);
                    end_datetime = moment(curr_datetime).endOf(time_units[i]);

                    break;        
                }
            }
            request_data(false);
        });

        $('#next_btn').click(function() {
            //happens when we want to go forwards in time

            let time_unit: string = $('#time_unit_select').val().toString();

            for(let i = 0; i < time_vals.length; i++) {
                if(time_unit === time_vals[i]) {
                    let increment: any = 1;
                    curr_datetime.add(increment, time_units[i]);
                    start_datetime = moment(curr_datetime).startOf(time_units[i]);
                    end_datetime = moment(curr_datetime).endOf(time_units[i]);

                    break;    
                }
            }
            request_data(false);
        });
    });
});

