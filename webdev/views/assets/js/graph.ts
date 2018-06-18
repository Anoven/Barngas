import Chart = require('chart.js');
import moment = require('moment');
import * as $ from 'jquery';
import 'bootstrap';

let timeFormat: string = 'MM/DD/YYYY HH:mm';
let curr_datetime: moment.Moment = moment();
let start_datetime: moment.Moment = moment(curr_datetime).startOf('day');
let end_datetime: moment.Moment  = moment(curr_datetime).endOf('day');

let basestations: {[id: number]: Basestation } = {};

class Basestation {
    id: number;
    name: string;
    description: string;
    groups: Array<Group> = [];
    constructor(id: number, name: string, description: string){
        this.id = id;
        this.name = name;
        this.description = description;
    }
    add_group(group: Group): void {
        this.groups.push(group);
    }
}

class Group {
    id: number;
    name: string;
    description: string;
    constructor(id: number, name: string, description: string){
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

function makeChart(ctx: CanvasRenderingContext2D, title: string, xLabel: string, yLabel: string): Chart {
    return new Chart(ctx, {
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
                        labelString: yLabel,
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
}

function makeDataset(label: string): Chart.ChartDataSets{
    return {
        label: label,
        backgroundColor: 'rgb(255,0,0,1)',
        pointHoverBackgroundColor: 'rgb(255,0,0,1)',
        borderColor: 'rgb(255,0,0,1)',
        pointHoverBorderColor: 'rgb(255,0,0,1)',
        fill: false,    
        data: []
    }
}
let htmlCanvas: any = document.getElementById("methane_chart");
let methane_chart: Chart = makeChart(htmlCanvas.getContext('2d'), 'Methane', 'Time', '% of LEL');

htmlCanvas = document.getElementById("ammonia_chart");
let ammonia_chart: Chart = makeChart(htmlCanvas.getContext('2d'), 'Ammonia', 'Time', 'Concentration');

htmlCanvas = document.getElementById("hydrogen_sulfide_chart");
let hydrogen_sulfide_chart: Chart = makeChart(htmlCanvas.getContext('2d'), 'Hydrogen Sulfide', 'Time', 'Concentration');

htmlCanvas = document.getElementById("carbon_dioxide_chart");
let carbon_dioxide_chart: Chart = makeChart(htmlCanvas.getContext('2d'), 'Carbon Dioxide', 'Time', 'Concentration');

htmlCanvas = document.getElementById("temp_chart");
let temp_chart: Chart = makeChart(htmlCanvas.getContext('2d'), 'Temperature', 'Time', 'Temperature (°C)');

htmlCanvas = document.getElementById("humidity_chart");
let humidity_chart: Chart = makeChart(htmlCanvas.getContext('2d'), 'Relative Humidity', 'Time', 'Relative Humidity');

let methane_min: Chart.ChartDataSets = makeDataset('Methane LEL');
let ammonia_min: Chart.ChartDataSets = makeDataset('Ammonia Lower Limit');
let hydrogen_sulfide_min: Chart.ChartDataSets = makeDataset('Hydrogen Sulfide Lower Limit');
let carbon_dioxide_min: Chart.ChartDataSets = makeDataset('Carbon Dioxide LEL');
let temp_max: Chart.ChartDataSets = makeDataset('Temperature Upper Limit');
let temp_min: Chart.ChartDataSets = makeDataset('Temperature Lower Limit');
let humidity_min: Chart.ChartDataSets = makeDataset('Humidity Lower Limit');

function randomColor(): string {
    let r: number = Math.round(Math.random() * (255));
    let g: number = Math.round(Math.random() * (255));
    let b: number = Math.round(Math.random() * (255));
    let a: number = 1;
    let to_return: string = 'rgb('+ r +','+ g +','+ b +''+ a +')'
    return to_return;
}

function setLimitBounds(start_datetime: Date, finsih_datetime: Date): void {
    methane_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
    ammonia_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
    carbon_dioxide_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
    hydrogen_sulfide_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
    temp_min.data = [{t: start_datetime, y: 10}, {t: finsih_datetime, y: 10}];
    temp_max.data = [{t: start_datetime, y: 40}, {t: finsih_datetime, y: 40}];
    humidity_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
}

function createLabelsHelper(unit: moment.unitOfTime.StartOf, ticks: number, interval: any): Array<string> {
    let labels: Array<string> = [];

    let remaining_ticks:number = ticks - 2;

    labels.push(start_datetime.format(timeFormat));
    let temp_moment: moment.Moment = moment(start_datetime);
    labels.push(temp_moment.format(timeFormat));
    for(let i = 0 ; i < remaining_ticks; i++){
        temp_moment.add(interval, unit);
        labels.push(temp_moment.format(timeFormat));
    }
    labels.push(end_datetime.format(timeFormat));

    setLimitBounds(start_datetime.toDate(), end_datetime.toDate());

    return labels;
}

function createLabels(): Array<string> {
    let time_unit: string = $('#time_unit_select').val().toString();

    let labels: Array<string> = [];
    // let num = labels_per_size[time_unit];
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

function createDataSet(label: string, data: Array<{t: Date, y: number}>) {
    let color: string = randomColor();
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

function addDataset(chart: Chart, label: Array<string>, dataset: Chart.ChartDataSets) {
    chart.data.labels = label;
    chart.data.datasets.push(dataset);
    chart.update();
}

function clearDataSets(chart: Chart): void {
    chart.data.datasets = [];
}

function processResponse(response: any) {
    console.log(response);

    // Parse The data and create a dataset
    let data = response.data;
    if (data.length != 0){
        let series_data: {[id: number]: Array<{t: Date, y: number}>} = {}
        let series_names: {[id: number]: string} = {}
        let series_types: {[id: number]: string} = {}
        let parsedData: Array<{t: Date, y: number}> =[];

        for (let i = 0; i < data.length; i++) {
            if(series_data[data[i].id]) {
                series_data[data[i].id].push({t: new Date(data[i].t), y: data[i].y});
            }
            else {
                series_data[data[i].id] = [{t: new Date(data[i].t), y: data[i].y}];
                series_names[data[i].id] = data[i].name;
                series_types[data[i].id] = data[i].type;
            }
        }

        let labels = createLabels();

        clearDataSets(methane_chart);
        clearDataSets(ammonia_chart);
        clearDataSets(carbon_dioxide_chart);
        clearDataSets(hydrogen_sulfide_chart);
        clearDataSets(temp_chart);
        clearDataSets(humidity_chart);

        addDataset(methane_chart, labels, methane_min); 
        addDataset(ammonia_chart, labels, ammonia_min); 
        addDataset(carbon_dioxide_chart, labels, carbon_dioxide_min); 
        addDataset(hydrogen_sulfide_chart, labels, hydrogen_sulfide_min); 
        addDataset(temp_chart, labels, temp_max); 
        addDataset(temp_chart, labels, temp_min); 
        addDataset(humidity_chart, labels, humidity_min); 

        for(let key in series_data){
            let dataset = createDataSet(series_names[key], series_data[key]);
            if (series_types[key] === 'METHANE') {
                addDataset(methane_chart, labels, dataset);
                methane_chart.data.labels = labels; 
                methane_chart.update();
            }
            else if (series_types[key] === 'AMMONIA') {
                addDataset(ammonia_chart, labels, dataset);
            }
            else if (series_types[key] === 'CARBON_DIOXIDE') {
                addDataset(carbon_dioxide_chart, labels, dataset);
            }
            else if (series_types[key] === 'HYDROGEN_SULFIDE') {
                addDataset(hydrogen_sulfide_chart, labels, dataset);
            }
            else if (series_types[key] === 'TEMP') {
                addDataset(temp_chart, labels, dataset);
            }
            else if (series_types[key] === 'HUMIDITY') {
                addDataset(humidity_chart, labels, dataset);
            }
        }
        $('.nav-link').show();
        $('.nav-link').parent().show();

        let charts: Array<Chart> = [methane_chart, ammonia_chart, carbon_dioxide_chart, hydrogen_sulfide_chart, temp_chart, humidity_chart];
        let tabs: Array<JQuery<HTMLElement>> = [$('#methane-tab'), $('#ammonia-tab'), $('#carbon-dioxide-tab'), $('#hydrogen-sulfide-tab'), $('#temp-tab'), $('#humidity-tab')];
        let panes: Array<JQuery<HTMLElement>> = [$('#methane'), $('#ammonia'), $('#carbon-dioxide'), $('#hydrogen-sulfide'), $('#temp'), $('#humidity')];
        let showing: any = [];
        let showing2: any = []

        for(let i = 0; i < charts.length; i ++) {
            tabs[i].removeClass('active');
            panes[i].removeClass('active');
            panes[i].removeClass('show');
            charts[i].update();
            if(charts[i].data.datasets.length == 1 || (i == 4 && charts[i].data.datasets.length == 2)){
                tabs[i].hide();
                tabs[i].parent().hide();
            }
            else {
                showing.push(tabs[i]);
                showing2.push(panes[i]);
            }
        }
        if(showing.length > 0) {
            showing[0].addClass('active');
            showing2[0].addClass('active');
            showing2[0].addClass('show');
            // showing[0].tab('show') // Select first tab
        }
    }
    else {
        let labels = createLabels();

        clearDataSets(methane_chart);
        clearDataSets(ammonia_chart);
        clearDataSets(carbon_dioxide_chart);
        clearDataSets(hydrogen_sulfide_chart);
        clearDataSets(temp_chart);
        clearDataSets(humidity_chart);

        addDataset(methane_chart, labels, methane_min); 
        addDataset(ammonia_chart, labels, ammonia_min); 
        addDataset(carbon_dioxide_chart, labels, carbon_dioxide_min); 
        addDataset(hydrogen_sulfide_chart, labels, hydrogen_sulfide_min); 
        addDataset(temp_chart, labels, temp_max); 
        addDataset(temp_chart, labels, temp_min); 
        addDataset(humidity_chart, labels, humidity_min); 
    }
}
function request_data(){
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
            processResponse(response);
            if(time_unit === 'hourly'){
                let temp: moment.Moment = moment(end_datetime).add(1, 'hour');
                $('#timetitle').html('' + start_datetime.format('MMMM Do YYYY, h a') + ' - ' + temp.format('h a'));
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

$(document).ready(function() {
    let first_id: number;    
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
        $.get('/graph/groups', function(response) {
            // processResponse(response);
            let data = response.data;
            if(data.length > 0) {
                for(let i = 0; i < data.length; i++) {
                    if(basestations[data[i].basestation_id]){
                        basestations[data[i].basestation_id].add_group(new Group(data[i].id, data[i].name, data[i].description));

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
        for(let id in basestations){
            $('#basestation_select').append($('<option>', {
                value: basestations[id].id,
                text: '(' + basestations[id].id + ')' + ' ' + basestations[id].name,
                title: basestations[id].description
            }));
        }        
    }).then(function() {
       request_data();
    }).then(function() {
        $('#time_unit_select').change(function() {
            let time_unit: string = $('#time_unit_select').val().toString();
            if(time_unit === 'hourly'){
                start_datetime = moment(curr_datetime).startOf('hour');
                end_datetime = moment(curr_datetime).endOf('hour');

                $("#previous_btn").prop('value', 'Prev. Hour');
                $("#next_btn").prop('value', 'Next  Hour');
            }
            else if(time_unit === 'daily'){
                start_datetime = moment(curr_datetime).startOf('day');
                end_datetime = moment(curr_datetime).endOf('day');

                $("#previous_btn").prop('value', 'Prev. Day');
                $("#next_btn").prop('value', 'Next  Day');
            }
            else if(time_unit === 'monthly'){
                start_datetime = moment(curr_datetime).startOf('month');
                end_datetime = moment(curr_datetime).endOf('month');

                $("#previous_btn").prop('value', 'Prev. Month');
                $("#next_btn").prop('value', 'Next  Month');
            }
            else if(time_unit === 'yearly'){
                start_datetime = moment(curr_datetime).startOf('year');
                end_datetime = moment(curr_datetime).endOf('year');

                $("#previous_btn").prop('value', 'Prev. Year');
                $("#next_btn").prop('value', 'Next  Year');
            }
            createLabels();
            setLimitBounds(start_datetime.toDate(), end_datetime.toDate());
            request_data();
        });

        $('#basestation_select').change(function() {
            let id = Number($('#basestation_select').val());
            if(basestations[id]) {
                $('#group_select').html('');
                $('#group_select').append($('<option>', {
                        value: null,
                        text: 'None'
                    }));

                let groups = basestations[id].groups;

                console.log(id);
                console.log(groups);

                for(let i = 0; i < groups.length; i++){
                    $('#group_select').append($('<option>', {
                        value: groups[i].id,
                        text: '(' + groups[i].id + ')' + ' ' + groups[i].name,
                        title: groups[i].description
                    }));    
                }
            }
            createLabels();
            setLimitBounds(start_datetime.toDate(), end_datetime.toDate());
            request_data();
        });

        $('#group_select').change(function() {
            createLabels();
            setLimitBounds(start_datetime.toDate(), end_datetime.toDate());
            request_data();
        });

        $('#previous_btn').click(function() {
            let time_unit: string = $('#time_unit_select').val().toString();
            if(time_unit === 'hourly'){
                curr_datetime.subtract(1, 'hour');
                start_datetime = moment(curr_datetime).startOf('hour');
                end_datetime = moment(curr_datetime).endOf('hour');
            }
            else if(time_unit === 'daily'){
                curr_datetime.subtract(1, 'day');
                start_datetime = moment(curr_datetime).startOf('day');
                end_datetime = moment(curr_datetime).endOf('day');
            }
            else if(time_unit === 'monthly'){
                curr_datetime.subtract(1, 'month');
                start_datetime = moment(curr_datetime).startOf('month');
                end_datetime = moment(curr_datetime).endOf('month');
            }
            else if(time_unit === 'yearly'){
                curr_datetime.subtract(1, 'year');
                start_datetime = moment(curr_datetime).startOf('year');
                end_datetime = moment(curr_datetime).endOf('year');
            }
            createLabels();
            setLimitBounds(start_datetime.toDate(), end_datetime.toDate());
            request_data();
        })

        $('#next_btn').click(function() {
            let time_unit: string = $('#time_unit_select').val().toString();
            if(time_unit === 'hourly'){
                curr_datetime.add(1, 'hour');
                start_datetime = moment(curr_datetime).startOf('hour');
                end_datetime = moment(curr_datetime).endOf('hour');
            }
            else if(time_unit === 'daily'){
                curr_datetime.add(1, 'day');
                start_datetime = moment(curr_datetime).startOf('day');
                end_datetime = moment(curr_datetime).endOf('day');
            }
            else if(time_unit === 'monthly'){
                curr_datetime.add(1, 'month');
                start_datetime = moment(curr_datetime).startOf('month');
                end_datetime = moment(curr_datetime).endOf('month');
            }
            else if(time_unit === 'yearly'){
                curr_datetime.add(1, 'year');
                start_datetime = moment(curr_datetime).startOf('year');
                end_datetime = moment(curr_datetime).endOf('year');
            }
            createLabels();
            setLimitBounds(start_datetime.toDate(), end_datetime.toDate());
            request_data();
        })
    })
});

