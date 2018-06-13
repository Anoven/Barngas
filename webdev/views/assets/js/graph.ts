import Chart = require('chart.js');
import moment = require('moment');
import * as $ from 'jquery';

let timeFormat: string = 'MM/DD/YYYY HH:mm';
let curr_datetime: moment.Moment = moment();
console.log(curr_datetime.format(timeFormat));

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
                        display: true,
                        labelString: xLabel,
                        // fontSize: 8
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: yLabel
                    }
                }]
            },
            legend: {
                position: 'left'
            }
        }
    });
}

function makeDataset(label: string): Chart.ChartDataSets{
    return {
        label: 'Methane LEL',
        backgroundColor: 'rgb(255,0,0,1)',
        pointHoverBackgroundColor: 'rgb(255,0,0,1)',
        borderColor: 'rgb(255,0,0,1)',
        pointHoverBorderColor: 'rgb(255,0,0,1)',
        fill: false,    
        data: []
    }
}
let htmlCanvas: any = document.getElementById("methane_chart");
let methane_chart = makeChart(htmlCanvas.getContext('2d'), 'Methane', 'Time', '% of LEL');

htmlCanvas = document.getElementById("amonia_chart");
let amonia_chart = makeChart(htmlCanvas.getContext('2d'), 'Amonia', 'Time', '% of LEL');

htmlCanvas = document.getElementById("hydrogen_sulfide_chart");
let hydrogen_sulfide_chart = makeChart(htmlCanvas.getContext('2d'), 'Hydrogen Sulfide', 'Time', '% of LEL');

htmlCanvas = document.getElementById("carbon_dioxide_chart");
let carbon_dioxide_chart = makeChart(htmlCanvas.getContext('2d'), 'Carbon Dioxide', 'Time', '% of LEL');

htmlCanvas = document.getElementById("temp_chart");
let temp_chart = makeChart(htmlCanvas.getContext('2d'), 'Temperature', 'Time', '% of LEL');

htmlCanvas = document.getElementById("humidity_chart");
let humidity_chart = makeChart(htmlCanvas.getContext('2d'), 'Relative Humidity', 'Time', '% of LEL');



let methane_min: Chart.ChartDataSets = makeDataset('Methane LEL');
let amonia_min: Chart.ChartDataSets = makeDataset('Amonia Lower Limit');
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

function parseData(data: Array<{t: string, y: number, sensor_name: string}>): Array<{t: Date, y: number}>{
    let parsed_data: Array<{t: Date, y: number}> = [];
    
    for (let i = 0; i < data.length; i++) {
        let new_data: {t: Date, y: number} = {t: new Date(data[i].t), y: data[i].y};
        parsed_data.push(new_data);
    }
    return parsed_data;
}

function setLimitBounds(start_datetime: Date, finsih_datetime: Date): void {
    methane_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
    amonia_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
    carbon_dioxide_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
    hydrogen_sulfide_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
    temp_min.data = [{t: start_datetime, y: 10}, {t: finsih_datetime, y: 10}];
    temp_max.data = [{t: start_datetime, y: 40}, {t: finsih_datetime, y: 40}];
    humidity_min.data = [{t: start_datetime, y: 30}, {t: finsih_datetime, y: 30}];
}

function createLabels(): Array<string> {
    let time_interval_size: string = $('#time_interval_size_select').val().toString();

    let label_datetime: moment.Moment = moment(curr_datetime);
    
    let labels: Array<string> = [];
    // let num = labels_per_size[time_interval_size];
    if (time_interval_size === 'hourly') {
        labels.push(label_datetime.startOf('hour').format(timeFormat));
        let temp_moment: moment.Moment = label_datetime.startOf('hour');
        labels.push(temp_moment.format(timeFormat));
        for(let i = 0 ; i < 2; i++){
            temp_moment.add(15, 'day');
            labels.push(temp_moment.format(timeFormat));
        }
        labels.push(label_datetime.endOf('hour').format(timeFormat));
        setLimitBounds(label_datetime.startOf('hour').toDate(), label_datetime.endOf('hour').toDate());
        
    
    }
    else if (time_interval_size === 'daily') {
        labels.push(label_datetime.startOf('day').format(timeFormat));
        let temp_moment: moment.Moment = label_datetime.startOf('day');
        labels.push(temp_moment.format(timeFormat));
        for(let i = 0 ; i < 4; i++){
            temp_moment.add(4, 'day');
            labels.push(temp_moment.format(timeFormat));
        }
        labels.push(label_datetime.endOf('day').format(timeFormat));

        setLimitBounds(label_datetime.startOf('day').toDate(), label_datetime.endOf('day').toDate());
    }
    else if (time_interval_size === 'monthly') {
        labels.push(label_datetime.startOf('month').format(timeFormat));
        let temp_moment: moment.Moment = label_datetime.startOf('month');
        labels.push(temp_moment.format(timeFormat));
        for(let i = 0 ; i < 2; i++){
            temp_moment.add(7, 'day');
            labels.push(temp_moment.format(timeFormat));
        }
        labels.push(label_datetime.endOf('month').format(timeFormat));

        setLimitBounds(label_datetime.startOf('month').toDate(), label_datetime.endOf('month').toDate());
    }
    else if (time_interval_size === 'yearly') {
        labels.push(label_datetime.startOf('year').format(timeFormat));
        let temp_moment: moment.Moment = label_datetime.startOf('year');
        for(let i = 0 ; i < 10; i++){
            temp_moment.add(1, 'month');
            labels.push(temp_moment.format(timeFormat));
        }
        labels.push(label_datetime.endOf('year').format(timeFormat));

        setLimitBounds(label_datetime.startOf('year').toDate(), label_datetime.endOf('year').toDate());
    }
    console.log(labels);
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
    if (response.data.length != 0){
        let parsedData: Array<{t: Date, y: number}> = parseData(response.data);
        let labels = createLabels();
        let series: string = response.data[0].sensor.name;
        let dataset = createDataSet(series, parsedData);
        
        //Create the threshold lines
        // methane_min.data = [{t: parsedData[0].t, y: 30}, {t: parsedData[parsedData.length - 1].t, y: 30}]

        //Add the relevant data to the chart
        clearDataSets(methane_chart);
        clearDataSets(amonia_chart);
        clearDataSets(carbon_dioxide_chart);
        clearDataSets(hydrogen_sulfide_chart);
        clearDataSets(temp_chart);
        clearDataSets(humidity_chart);

        addDataset(methane_chart, labels, methane_min); 
        addDataset(amonia_chart, labels, amonia_min); 
        addDataset(carbon_dioxide_chart, labels, carbon_dioxide_min); 
        addDataset(hydrogen_sulfide_chart, labels, hydrogen_sulfide_min); 
        addDataset(temp_chart, labels, temp_max); 
        addDataset(temp_chart, labels, temp_min); 
        addDataset(humidity_chart, labels, humidity_min); 

        addDataset(methane_chart, labels, dataset);
    }
    else {
       let labels = createLabels();
       methane_chart.data.labels = labels; 
       methane_chart.update();
    }
}

$('#time_interval_size_select').change(function() {
    let time_interval_size: string = $('#time_interval_size_select').val().toString();
    $.get('/graph/'+ time_interval_size, function(response) {
        processResponse(response);
    });
    // processResponse({data: []});
});

$(document).ready(function() {
    let time_interval_size: string = $('#time_interval_size_select').val().toString();
    $.get('/graph/user', function(response) {
        let devices: any = response.data;
        console.log(devices);
        if (devices != null){
            for(let i = 0 ; i < devices.length; i++){
                if(devices[i].group_name == null) {
                    $('#basestation_select').append($('<option>', {
                        value: devices[i].basestation_name,
                        text: devices[i].basestation_name
                    }));
                } 
                else if(devices[i].basestation_name == null) {
                    $('#group_select').append($('<option>', {
                        value: devices[i].group_name,
                        text: devices[i].group_name
                    }));
                }
            }
        }
        
    }).then(function(val){
        $.get('/graph/'+ time_interval_size, function(response) {
            processResponse(response);
        });
    });
});


