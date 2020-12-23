var result_val2 = 0.0;
function getData2() {
    //Ajax call
        $.ajax({url: "http://127.0.0.1:5000/chart-data", 
        success: function(data){
            // console.log("This is the test data : " + data.time)
            result_val2 = data
            document.getElementById('tramscore').innerHTML = data.results           
        }});
        return result_val2
}

function getSysFreq() {
    //Ajax call
        $.ajax({url: "http://127.0.0.1:5000/chart-data", 
        success: function(data){
            // console.log("This is the test data : " + data.time)
            document.getElementById('sysfreq').innerHTML = data.results           
        }});
        return result_val2
}

setInterval( function () {
    getSysFreq(); 
}, 2000 );


function getpacketloss() {
    //Ajax call
        $.ajax({url: "http://127.0.0.1:5000/chart-data", 
        success: function(data){
            // console.log("This is the test data : " + data.time)
            document.getElementById('packetloss').innerHTML = ("" + data.results + "%")           
        }});
        
}

setInterval( function () {
    getpacketloss(); 
}, 2000 );


var layout2 = {
    title: 'Tram Live Graph',
    xaxis: {
      title: 'Time',
    },
    yaxis: {
      title: 'Tram Score',
      range: [0,1],
      dtick: 0.1,
      showline: true,
      showgrid: true,
      zeroline: true,
    }, 
    margin: {
        l: 60,
        r: 40,
        b: 70,
        t: 50,
        pad: 4
      },
  };

OVERVIEW = document.getElementById('overview-chart');
Plotly.plot(OVERVIEW,[{
    x:[getData2().time],
    y:[getData2().results],
    type:'line',
    line: {shape: 'hv'},
}], layout2, {scrollZoom: true});

var overview_cnt = 0;
setInterval(function(){
    data = getData2()
    // console.log(typeof(data.time))
    Plotly.extendTraces(OVERVIEW,{ 
        x:[[data.time]], 
        y:[[data.results]],
    }, [0]);
    overview_cnt++;
    if(overview_cnt > 5) {
        Plotly.relayout(OVERVIEW,{
            xaxis: {
                range: [overview_cnt-5,overview_cnt-1],
                title: 'Time',
            },
            yaxis: {
                title: 'Tram Score',
                range: [0,1],
                dtick: 0.1,
                showline: true,
                showgrid: true,
                zeroline: true,
              }, 
            margin: {
                l: 60,
                r: 40,
                b: 70,
                t: 50,
                pad: 4
            }
        });
    }
},2000);


//Live Map

//Adding a map to the UI

var overviewmap = L.map('overview-map').setView([47.3055701300, -120.1623439000], 5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 30,
    id: 'mapbox/streets-v11',
    // id: 'mapbox/satellite-v9',
    accessToken: 'sk.eyJ1IjoiYW5zaHVtYW5sbnUiLCJhIjoiY2s0Z3BmeWYyMTFsMTNlbnFheXRoNGZwNCJ9.hrTQnuCBmTImKpG541vu9Q'
}).addTo(overviewmap);

// Calling the map-data API and adding markers to the map.
var location_arr_overview = []; 
function getOverviewMapData() {
    //Ajax call
        $.ajax({
            url: "http://127.0.0.1:5000/map-data", 
            success: function(results){
            let data = results.data
            // console.log("This is data " + data)
            // let connections = results.connections
            // console.log(connections)
            for( i=0; i<data.length; i++){
                lat = Number(data[i].gis_latitude); 
                long = Number(data[i].gis_longitude);
                isTrue = data[i].bus_status;
                // console.log(lat);
                L.circleMarker(([lat, long]), {   
                    color: 'green',
                    fillColor: isTrue==1 ? 'green' : 'red',
                    fillOpacity: 0.5,
                    riseOnHover: true,
                    radius: 10
                }).addTo(overviewmap).bindTooltip(String(data[i].bus_id), { permanent: true }).openTooltip();
            }

            let connectionfrom = results.connectionfrom
            let connectionto = results.connectionto
            // console.log(connectionfrom)
            // console.log(connectionto)
            for(j=0; j<connectionfrom.length; j++){
                let latlngs = [
                    [connectionfrom[j].gis_latitude, connectionfrom[j].gis_longitude], 
                    [connectionto[j].gis_latitude, connectionto[j].gis_longitude]
                ];
                // console.log(latlngs)
                L.polyline(latlngs, {color:'black'}).addTo(overviewmap);
            }
        }
    });
};
getOverviewMapData();
  
$("a[href='#overview']").on('shown.bs.tab', function (e) {
    overviewmap.invalidateSize();
    // $('#example').DataTable();
});




// var layout2 = {
//     title: 'Cyber-Physical Resiliency Live Graph',
//     xaxis: {
//       title: 'Time'
//     },
//     yaxis: {
//       title: 'Cyber-Physical Resiliency Score',
//       range: [0,1.3],
//       dtick: 0.1,
//     }, 
//     margin: {
//         l: 60,
//         r: 0,
//         b: 60,
//         t: 30,
//         pad: 4
//       },
//     showlegend: true,
// 	legend: {"orientation": "h"},
//   };


// //Cyber physical Temporary Line Chart
// var trace1 = {
//     x: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
//     y: [0.299965392,
//         0.299965392,
//         0.29417606,
//         0.29417606,
//         0.28151752,
//         0.28151752,
//         0.308154447,
//         0.308154447,
//         0.266489254,
//         0.266489254,
//         0.334971353,
//         0.334971353],
//     type: 'scatter',
//     mode: 'lines',
//     line: {shape: 'hv'},
//     name: 'Security Strategy 2',
//   };
  
//   var trace2 = {
//     x: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
//     y: [1,
//         1,
//         0.9807,
//         0.9807,
//         0.9385,
//         0.9385,
//         1.0273,
//         1.0273,
//         0.8884,
//         0.8884,
//         1.1167, 
//         1.1167
//     ],
//     type: 'scatter',
//     mode: 'lines',
//     line: {shape: 'vh'},
//     name: 'Security Strategy 1',
//   };
  
//   var data = [trace1, trace2];
  
// //   Plotly.newPlot('overview-chart', data);

// OVERVIEW = document.getElementById('overview-chart');
// Plotly.newPlot(OVERVIEW, data, layout2, {scrollZoom: true});


// var dataforX = [
// '0:00:00',
// '0:01:00',
// '0:02:00',
// '0:03:00',
// '0:04:00',
// '0:05:00',
// '0:06:00',
// '0:07:00',
// '0:08:00',
// '0:09:00',
// '0:10:00',
// '0:11:00',
// '0:12:00',
// '0:13:00',
// '0:14:00',
// '0:15:00',
// '0:16:00',
// '0:17:00',
// '0:18:00',
// '0:19:00',
// '0:20:00',
// '0:21:00',
// '0:22:00',
// '0:23:00',
// '0:24:00',
// '0:25:00',
// '0:26:00',
// '0:27:00',
// '0:28:00',
// '0:29:00',
// '0:30:00',
// '0:31:00',
// '0:32:00',
// '0:33:00',
// '0:34:00',
// '0:35:00',
// '0:36:00',
// '0:37:00',
// '0:38:00',
// '0:39:00',
// '0:40:00',
// '0:41:00',
// '0:42:00',
// '0:43:00',
// '0:44:00',
// '0:45:00',
// '0:46:00',
// '0:47:00',
// '0:48:00',
// '0:49:00',
// '0:50:00',
// '0:51:00',
// '0:52:00',
// '0:53:00',
// '0:54:00',
// '0:55:00',
// '0:56:00',
// '0:57:00',
// '0:58:00',
// '0:59:00',
// '1:00:00',
// '1:01:00',
// '1:02:00',
// '1:03:00',
// '1:04:00',
// '1:05:00',
// '1:06:00',
// '1:07:00',
// '1:08:00',
// '1:09:00',
// '1:10:00',
// '1:11:00',
// '1:12:00',
// '1:13:00',
// '1:14:00',
// '1:15:00',
// '1:16:00',
// '1:17:00',
// '1:18:00',
// '1:19:00',
// '1:20:00',
// '1:21:00',
// '1:22:00',
// '1:23:00',
// '1:24:00',
// '1:25:00',
// '1:26:00',
// '1:27:00',
// '1:28:00',
// '1:29:00',
// '1:30:00',
// '1:31:00',
// '1:32:00',
// '1:33:00',
// '1:34:00',
// '1:35:00',
// '1:36:00',
// '1:37:00',
// '1:38:00',
// '1:39:00',
// '1:40:00',
// '1:41:00',
// '1:42:00',
// '1:43:00',
// '1:44:00',
// '1:45:00',
// '1:46:00',
// '1:47:00',
// '1:48:00',
// '1:49:00',
// '1:50:00',
// '1:51:00',
// '1:52:00',
// '1:53:00',
// '1:54:00',
// '1:55:00',
// '1:56:00',
// '1:57:00',
// '1:58:00',
// '1:59:00'] 