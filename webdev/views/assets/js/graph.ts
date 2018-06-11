// let Chart = require('chart.js');
// import Chart from 'chart.js';
import Chart = require('chart.js');
import moment = require('moment');

let htmlCanvas: any = document.getElementById("myChart")
let ctx: CanvasRenderingContext2D = htmlCanvas.getContext('2d');

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

let myChart = new Chart(ctx, {    
    type: 'line',
    data: {
        labels: [
            newDateString(0),
            newDateString(1),
            newDateString(2),
            newDateString(3),
            newDateString(4),
            newDateString(5),
            newDateString(6)],
        datasets: [
                {
                    label: 'Baseline',
                    backgroundColor: 'rgb(255,0,0,1)',
                    pointHoverBackgroundColor: 'rgb(255,0,0,1)',
                    borderColor: 'rgb(255,0,0,1)',
                    pointHoverBorderColor: 'rgb(255,0,0,1)',
                    fill: false,
                    data: baseline
                },
                {
                    label: 'series 1',
                    backgroundColor: color1,
                    pointHoverBackgroundColor: color1,
                    borderColor: color1,
                    pointHoverBorderColor: color1,
                    fill: false,
                    data: dataset1
                },
                {
                    label: 'series 2',
                    backgroundColor: color2,
                    pointHoverBackgroundColor: color2,
                    borderColor: color2,
                    pointHoverBorderColor: color2,
                    fill: false,
                    data: dataset2
                }]
            },
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