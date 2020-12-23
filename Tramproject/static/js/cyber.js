//Adding a map to the UI
var cybermap = L.map('cyber-map').setView([47.3055701300, -120.1623439000], 5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 30,
    id: 'mapbox/streets-v11',
    accessToken: 'sk.eyJ1IjoiYW5zaHVtYW5sbnUiLCJhIjoiY2s0Z3BmeWYyMTFsMTNlbnFheXRoNGZwNCJ9.hrTQnuCBmTImKpG541vu9Q'
}).addTo(cybermap);

// Calling the map-data API and adding markers to the map.
var location_arr = []; 
function getMapData() {
    //Ajax call
        $.ajax({
            url: "http://127.0.0.1:5000/map-data", 
            success: function(results){
            let data = results.data
            for( i=0; i<data.length; i++){
                lat = Number(data[i].gis_latitude); 
                long = Number(data[i].gis_longitude);
                isTrue = data[i].bus_status;
                L.circleMarker(([lat, long]), {   
                    color: 'green',
                    fillColor: isTrue==1 ? 'green' : 'red',
                    fillOpacity: 0.5,
                    riseOnHover: true,
                    radius: 10
                }).addTo(cybermap).bindTooltip(String(data[i].bus_id), { permanent: true }).openTooltip();
            }

            let connectionfrom = results.connectionfrom
            let connectionto = results.connectionto
            for(j=0; j<connectionfrom.length; j++){
                let latlngs = [
                    [connectionfrom[j].gis_latitude, connectionfrom[j].gis_longitude], 
                    [connectionto[j].gis_latitude, connectionto[j].gis_longitude]
                ];
                L.polyline(latlngs, {color:'black'}).addTo(cybermap);
            }
        }
    });
};
getMapData();
  
$("a[href='#cyber']").on('shown.bs.tab', function (e) {
    cybermap.invalidateSize();
});


//Live Cyber Chart

// var result_val2 = 0.0;
// function getData2() {
//     //Ajax call
//         $.ajax({url: "http://127.0.0.1:5000/chart-data", 
//         success: function(data){
//             result_val2 = data
//         }});
//         return result_val2
// }

// var layout2 = {
//     // title: 'Tram Live Graph',
//     xaxis: {
//       title: 'Time'
//     },
//     yaxis: {
//       title: 'Physical Resiliency Score',
//       range: [0,1],
//       dtick: 0.1,
//     }, 
//     margin: {
//         l: 60,
//         r: 10,
//         b: 70,
//         t: 50,
//         pad: 4
//       },
//   };

// OVERVIEW = document.getElementById('cyberchart');
// Plotly.plot(OVERVIEW,[{
//     x:[getData2().time],
//     y:[getData2().results],
//     type:'line'
// }], layout2, {scrollZoom: true});

// var overview_cnt = 0;
// setInterval(function(){
//     data = getData2()
//     // console.log(typeof(data.time))
//     Plotly.extendTraces(OVERVIEW,{ 
//         x:[[data.time]], 
//         y:[[data.results]],
//     }, [0]);
//     overview_cnt++;
//     if(overview_cnt > 10) {
//         Plotly.relayout(OVERVIEW,{
//             xaxis: {
//                 range: [overview_cnt-10,overview_cnt-1],
//                 title: 'Time',
//             }
            
//         });
//     }
// },2000);


//Adding data into cyber vulnerabilities table

//Calling the score API and Adding information to the tables
var table = $('#cybervulnerablities').DataTable( {
    paging: true,
    responsive: true,
    "sDom":"tipr",
    pageLength : 3,
    order: [[3, 'desc']],
    "ajax": {
        "url": "http://127.0.0.1:5000/cyber/vulnerabilities",
        "type": "GET",
        "datatype": 'json',
    },
    columns: [
        { 'data': 'cyber_cve_id' },
        { 'data': 'cyber_score' },
        { 'data': 'cyber_av'},
        { 'data': 'cyber_ac'},
        { 'data': 'cyber_au'},
        { 'data': 'cyber_c'}, 
        { 'data': 'cyber_i'},
        { 'data': 'cyber_a'},
        { 'data': 'cyber_device'}, 
        { 'data': 'cyber_substation'}
    ],
//     "createdRow": function( row, data, dataIndex ) {
//         if ( data.bus_voltage < 0.95 || data.bus_voltage > 1.05) {        
//             $(row).addClass('red');
//         }
//         else if (data.bus_voltage > 0.95 && data.bus_voltage < 0.98) {
//             $(row).addClass('orange');
//         }
//         else if (data.bus_voltage >= 0.98 && data.bus_voltage <= 1.05){
//             $(row).addClass('green');
//         }
//   }
 
} );

  
 
setInterval( function () {
    table.ajax.reload();
}, 30000 );


//Temporary Chart
var layout2 = {
    // title: 'Tram Live Graph',
    xaxis: {
      title: 'Time'
    },
    yaxis: {
      title: 'Cyber Resiliency Score',
      range: [0,1.3],
      dtick: 0.1,
    }, 
    margin: {
        l: 60,
        r: 0,
        b: 60,
        t: 10,
        pad: 4
      },
    showlegend: true,
	legend: {"orientation": "h"},
  };


//Cyber physical Temporary Line Chart
var trace1 = {
    x: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
    y: [0.299965392,
        0.299965392,
        0.29417606,
        0.29417606,
        0.28151752,
        0.28151752,
        0.308154447,
        0.308154447,
        0.266489254,
        0.266489254,
        0.334971353,
        0.334971353],
    type: 'scatter', 
    name: 'Security Strategy 2',
    mode: 'lines',
    line: {shape: 'vh'},
  };
  
  var trace2 = {
    x: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
    y: [1,
        1,
        0.9807,
        0.9807,
        0.9385,
        0.9385,
        1.0273,
        1.0273,
        0.8884,
        0.8884,
        1.1167, 
        1.1167],
    type: 'scatter',
    mode: 'lines',
    line: {shape: 'vh'},
    name: 'Security Strategy 1',
  };
  
  var data = [trace1, trace2];
  
//   Plotly.newPlot('overview-chart', data);

OVERVIEW = document.getElementById('cyberchart');
Plotly.newPlot(OVERVIEW, data, layout2, {scrollZoom: true});    