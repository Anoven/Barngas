import Chart = require('chart.js');
import moment = require('moment');
import * as $ from 'jquery';
// import express = require('express');

let timeFormat: string = 'MM/DD/YYYY HH:mm';
let start_date: Date = new Date("2018-6-1");
let end_date: Date = new Date("2018-6-30");


function newDate(days: number): Date {
    return moment().add(days, 'd').toDate();
}
function newDateString(days: number): string {
    return moment().add(days, 'd').format(timeFormat);
}

function randomColor(): string {
    let r: number = Math.round(Math.random() * (255));
    let g: number = Math.round(Math.random() * (255));
    let b: number = Math.round(Math.random() * (255));
    let a: number = 1;
    let to_return: string = 'rgb('+ r +','+ g +','+ b +''+ a +')'
    console.log(to_return);
    return to_return;
}

function compare(a: any, b: any) {
  if (a.t < b.t)
    return -1;
  if (a.t > b.t)
    return 1;
  return 0;
}

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomScalingFactor() {
    return Math.random();
}

let baseline: Array<{t: Date, y: number}> = [{t: start_date, y: 0.3}, {t: end_date, y: 0.3}];
let dataset1: Array<{t: Date, y: number}> = [];
let dataset2: Array<{t: Date, y: number}> = [];

for(let i = 0; i < 50; i++){
    dataset1.push({t: randomDate(start_date, end_date), y: randomScalingFactor()});
    dataset2.push({t: randomDate(start_date, end_date), y: randomScalingFactor()});
}

dataset1.sort(compare);
dataset2.sort(compare);

let color1: string = randomColor();
let color2: string = randomColor();

Chart.Chart.defaults.global.defaultFontSize = 16;

let htmlCanvas: any = document.getElementById("myChart")
let ctx: CanvasRenderingContext2D = htmlCanvas.getContext('2d');

let myChart = new Chart(ctx, {    
    type: 'line',
    // data: {
    //     labels: [
    //         newDateString(0),
    //         newDateString(1),
    //         newDateString(2),
    //         newDateString(3),
    //         newDateString(4),
    //         newDateString(5),
    //         newDateString(6)],
    //     datasets: [
    //             {
    //                 label: 'Baseline',
    //                 backgroundColor: 'rgb(255,0,0,1)',
    //                 pointHoverBackgroundColor: 'rgb(255,0,0,1)',
    //                 borderColor: 'rgb(255,0,0,1)',
    //                 pointHoverBorderColor: 'rgb(255,0,0,1)',
    //                 fill: false,
    //                 data: baseline
    //             },
    //             {
    //                 label: 'series 1',
    //                 backgroundColor: color1,
    //                 pointHoverBackgroundColor: color1,
    //                 borderColor: color1,
    //                 pointHoverBorderColor: color1,
    //                 fill: false,
    //                 data: dataset1
    //             },
    //             {
    //                 label: 'series 2',
    //                 backgroundColor: color2,
    //                 pointHoverBackgroundColor: color2,
    //                 borderColor: color2,
    //                 pointHoverBorderColor: color2,
    //                 fill: false,
    //                 data: dataset2
    //             }]
    //         },
    options: {
        title: {
            text: 'Chart.js Time Scale'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    parser: timeFormat,
                    // round: 'day'
                    tooltipFormat: 'll HH:mm'
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'value'
                }
            }]
        },
        legend: {
            position: 'left'
        }
    }
});

function parseData(data: Array<{t: string, y: number}>): Array<{t: Date, y: number}>{
    let parsed_data: Array<{t: Date, y: number}> = [];
    // console.log(data[0].t);
    for (let i = 0; i < data.length; i++) {
        let new_data: {t: Date, y: number} = {t: new Date(data[i].t), y: data[i].y};
        parsed_data.push(new_data);

        // console.log(new_data);
    }
    // console.log(parsed_data);
    return parsed_data;
} 

// function createLabels(data: Array<{t: Date, y: number}>): Array<string> {
//     let labels: Array<string> = [];
//     for (let i = 0; i < data.length; i++) {
//         let year: number = data[i].t.getFullYear();
//         let month: number = data[i].t.getMonth();
//         let day: number = data[i].t.getDay();
//         let hour: number = data[i].t.getHours();

//         let date = new Date
//     }
//     return labels;
// }

function createLabels(data: Array<{t: Date, y: number}>): Array<string> {
    let labels: Array<string> = [];
    // for (let i = 0; i < data.length; i++) {
    //     labels.push(moment(data[i].t.toString()).format(timeFormat));
    // }
    labels.push(moment(data[0].t.toString()).format(timeFormat));
    labels.push(moment(data[data.length - 1].t.toString()).format(timeFormat));
    return [];
}

function createDataSet(data: Array<{t: Date, y: number}>) {
    let dataset: Chart.ChartDataSets = {
        label: 'raw_data',
        backgroundColor: color1,
        pointHoverBackgroundColor: color1,
        borderColor: color1,
        pointHoverBorderColor: color1,
        fill: false,
        data: data
    }
    return dataset;
}

function addData(chart: Chart, label: Array<string>, dataset: Chart.ChartDataSets) {
    chart.data.labels = label;
    // chart.data.datasets.forEach((dataset) => {
    //     dataset.data.push(data);
    // });
    chart.data.datasets.push(dataset);
    chart.update();
}

$(document).ready(function() {
  // Handler for .ready() called.
  // console.log('ready');
  $.get('/graph/rawData', function(data) {
        // console.log(data);
        let parsedData: Array<{t: Date, y: number}> = parseData(data.raw_data);
        let labels = createLabels(parsedData);
        let dataset = createDataSet(parsedData);

        // console.log(parsedData);
        // console.log(labels);
        // console.log(dataset);
        addData(myChart, labels, dataset);
  });
});
