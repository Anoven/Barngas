import Chart = require('chart.js');
import moment = require('moment');
import * as $ from 'jquery';



// let labels_per_size: {[size: string]: number; } = {
//     'hourly': 60,
//     'daily': 24,
//     'monthly': 31,
//     'yearly': 12
// };

let timeFormat: string = 'MM/DD/YYYY HH:mm';
// Chart.Chart.defaults.global.defaultFontSize = 16;

let htmlCanvas: any = document.getElementById("myChart")
let ctx: CanvasRenderingContext2D = htmlCanvas.getContext('2d');

let myChart = new Chart(ctx, {    
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
                    labelString: 'Time',
                    // fontSize: 8
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: '% of Lower Explosive Limit (LEL)'
                }
            }]
        },
        legend: {
            position: 'left'
        }
    }
});


let methane_limit_dataset: Chart.ChartDataSets = {
    label: 'Methane LEL',
    backgroundColor: 'rgb(255,0,0,1)',
    pointHoverBackgroundColor: 'rgb(255,0,0,1)',
    borderColor: 'rgb(255,0,0,1)',
    pointHoverBorderColor: 'rgb(255,0,0,1)',
    fill: false,    
    data: []
}

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

function createLabels(start_date: Date, end_date: Date): Array<string> {
    let time_interval_size: string = $('#time_interval_size_select').val().toString();

    
    let labels: Array<string> = [];
    let num = 10;
    // let num = labels_per_size[time_interval_size];
    if (time_interval_size === 'hourly') {
        let date = new Date();
        let year = start_date.getFullYear();
        let month = start_date.getMonth();
        let day = start_date.getDay();
        let hour = start_date.getHours();

        let first_date = new Date(year, month, day, hour, 1);    //get first date of the year
        let start_moment: moment.Moment = moment(first_date.toString());

        let temp_moment: moment.Moment = start_moment;
        for(let i = 0 ; i < 10; i++){
            temp_moment.add(6, 'minute');
            labels.push(temp_moment.format(timeFormat));
        }
    }
    else if (time_interval_size === 'daily') {
        let date = new Date();
        let year = start_date.getFullYear();
        let month = start_date.getMonth();
        let day = start_date.getDay();

        let first_date = new Date(year, month, day, 1);    //get first date of the year
        let start_moment: moment.Moment = moment(first_date.toString());

        let temp_moment: moment.Moment = start_moment;
        for(let i = 0 ; i < 12; i++){
            temp_moment.add(2, 'hour');
            labels.push(temp_moment.format(timeFormat));
        }
    }
    else if (time_interval_size === 'monthly') {
        let date = new Date();
        let year = start_date.getFullYear();
        let month = start_date.getMonth();

        let first_date = new Date(year, month, 1);    //get first date of the year
        let start_moment: moment.Moment = moment(first_date.toString());

        let temp_moment: moment.Moment = start_moment;
        for(let i = 0 ; i < 8; i++){
            temp_moment.add(4, 'day');
            labels.push(temp_moment.format(timeFormat));
        }
    }
    else if (time_interval_size === 'yearly') {
        let date = new Date();
        let year = start_date.getFullYear();

        let first_date = new Date(year, 1, 1);    //get first date of the year
        let start_moment: moment.Moment = moment(first_date.toString());

        let temp_moment: moment.Moment = start_moment;
        for(let i = 0 ; i < 12; i++){
            temp_moment.add(1, 'month');
            labels.push(temp_moment.format(timeFormat));
        }
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
    let parsedData: Array<{t: Date, y: number}> = parseData(response.data);
    let labels = createLabels(parsedData[0].t, parsedData[parsedData.length - 1].t);
    let series: string = response.data[0].sensor.name;
    let dataset = createDataSet(series, parsedData);
    
    //Create the threshold lines
    methane_limit_dataset.data = [{t: parsedData[0].t, y: 30}, {t: parsedData[parsedData.length - 1].t, y: 30}]

    //Add the relevant data to the chart
    clearDataSets(myChart);

    addDataset(myChart, labels, methane_limit_dataset);
    addDataset(myChart, labels, dataset);
}

$('#time_interval_size_select').change(function() {
    let time_interval_size: string = $('#time_interval_size_select').val().toString();
    $.get('/graph/'+ time_interval_size, function(response) {
        processResponse(response);
    });
});

$(document).ready(function() {
    let time_interval_size: string = $('#time_interval_size_select').val().toString();
    $.get('/graph/'+ time_interval_size, function(response) {
        processResponse(response);
    });
});


