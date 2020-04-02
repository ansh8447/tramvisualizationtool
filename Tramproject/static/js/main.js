var mymap = L.map('mapid').setView([46.7298, -117.1817], 7);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 30,
    id: 'mapbox/streets-v11',
    // id: 'mapbox/satellite-v9',
    accessToken: 'sk.eyJ1IjoiYW5zaHVtYW5sbnUiLCJhIjoiY2s0Z3BmeWYyMTFsMTNlbnFheXRoNGZwNCJ9.hrTQnuCBmTImKpG541vu9Q'
}).addTo(mymap);

// var marker = L.marker([46.7298, -117.1817]).addTo(mymap);
var circle = L.circle(([46.7298, -117.1817]), {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 5000
}).addTo(mymap);

var circle = L.circle(([47.6588, -117.4260]), {
    color: 'green',
    fillColor: 'green',
    fillOpacity: 0.5,
    radius: 5000
}).addTo(mymap);

var circle = L.circle(([47.6062, -122.3321]), {
    color: 'yellow',
    fillColor: 'yellow',
    fillOpacity: 0.5,
    radius: 5000
}).addTo(mymap);

var polygon = L.polygon([
    [47.6588, -117.4260],
    [46.7298, -117.1817],
    [47.6062, -122.3321]
]).addTo(mymap);

$("a[href='#physical']").on('shown.bs.tab', function (e) {
    mymap.invalidateSize();
    // $('#example').DataTable();
});

var planningctx2 = document.getElementById('linechart').getContext('2d');
var planning_pre_lineChart = new Chart(planningctx2, {
    type: 'bar',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            label: '',
            data: [10, 59, 200, 81, 32, 100, 48, 90, 70, 20],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Influence Factor Value'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
        }
    }
});