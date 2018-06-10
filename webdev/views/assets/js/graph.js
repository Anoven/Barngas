"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chart = require("chart.js");
const moment = require("moment");
let htmlCanvas = document.getElementById("myChart");
let ctx = htmlCanvas.getContext('2d');
let timeFormat = 'MM/DD/YYYY HH:mm';
let start_date = new Date("2018-6-1");
let end_date = new Date("2018-6-30");
function newDate(days) {
    return moment().add(days, 'd').toDate();
}
function newDateString(days) {
    return moment().add(days, 'd').format(timeFormat);
}
function randomColor() {
    let r = Math.round(Math.random() * (255));
    let g = Math.round(Math.random() * (255));
    let b = Math.round(Math.random() * (255));
    let a = 0.2;
    let to_return = 'rgb(' + r + ',' + g + ',' + b + '' + a + ')';
    console.log(to_return);
    return to_return;
}
function compare(a, b) {
    if (a.t < b.t)
        return -1;
    if (a.t > b.t)
        return 1;
    return 0;
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomScalingFactor() {
    return Math.random();
}
let dataset1 = [];
let dataset2 = [];
for (let i = 0; i < 50; i++) {
    dataset1.push({ t: randomDate(start_date, end_date), y: randomScalingFactor() });
    dataset2.push({ t: randomDate(start_date, end_date), y: randomScalingFactor() });
}
dataset1.sort(compare);
dataset2.sort(compare);
let color1 = randomColor();
let color2 = randomColor();
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
            newDateString(6)
        ],
        datasets: [
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
            }
        ]
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
    }
});
