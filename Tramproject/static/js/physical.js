//Adding a map to the UI
var mymap = L.map('mapid').setView([47.3055701300, -120.1623439000], 5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 30,
    id: 'mapbox/streets-v11',
    accessToken: 'sk.eyJ1IjoiYW5zaHVtYW5sbnUiLCJhIjoiY2s0Z3BmeWYyMTFsMTNlbnFheXRoNGZwNCJ9.hrTQnuCBmTImKpG541vu9Q'
}).addTo(mymap);

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
                }).addTo(mymap).bindTooltip(String(data[i].bus_id), { permanent: true }).openTooltip();
            }

            let connectionfrom = results.connectionfrom
            let connectionto = results.connectionto
            for(j=0; j<connectionfrom.length; j++){
                let latlngs = [
                    [connectionfrom[j].gis_latitude, connectionfrom[j].gis_longitude], 
                    [connectionto[j].gis_latitude, connectionto[j].gis_longitude]
                ];
                L.polyline(latlngs, {color:'black'}).addTo(mymap);
            }
        }
    });
};
getMapData();
  
$("a[href='#physical']").on('shown.bs.tab', function (e) {
    mymap.invalidateSize();
});


//Calling the score API and Adding information to the tables
var table = $('#businfo').DataTable( {
    paging: true,
    "sDom":"tipr",
    pageLength : 5,
    order: [[3, 'desc']],
    "ajax": {
        "url": "http://127.0.0.1:5000/physical/livevoltages",
        "type": "GET",
        "datatype": 'json',
    },
    columns: [
        { 'data': 'bus_id' },
        { 'data': 'bus_name' },
        { 
            'data': 'base_kv',
            render: function(data, type, row){
                return parseFloat(data).toFixed(2);
            }
        },
        { 
            'data': 'bus_voltage',
            render: function(data, type, row){
                return parseFloat(data).toFixed(4);
            }
        }
    ],
    "createdRow": function( row, data, dataIndex ) {
        if ( data.bus_voltage < 0.95 || data.bus_voltage > 1.05) {        
            $(row).addClass('red');
        }
        else if (data.bus_voltage > 0.95 && data.bus_voltage < 0.98) {
            $(row).addClass('orange');
        }
        else if (data.bus_voltage >= 0.98 && data.bus_voltage <= 1.05){
            $(row).addClass('green');
        }
  }
} );


var powerTable = $('#powerTable').DataTable( {
    paging: true,
    "sDom":"tipr",
    pageLength : 5,
    order: [[3, 'desc']],
    "ajax": {
        "url": "http://127.0.0.1:5000/physical/transpower",
        "type": "GET",
        "datatype": 'json',
    },
    columns: [
        { 
            data: 'branch_id',

        },
        { 
            'data': 'voltage_level',
            render: function(data, type, row){
                return parseFloat(data).toFixed(2) + ' kV';
            }
        },
        { 
            'data': 'transferred_mva',
            render: function(data, type, row){
            return parseFloat(data).toFixed(3);
        }
        },
        {
            data: null, 
            render: function(data, type, row){
                // console.log("This is f data " + parseFloat(data)/parseFloat(row.transferred_mva));
                // console.log("This is f data " + row.transferred_mva)
                percentage = ((row.transferred_mva / row.mva_line_rating) * 100); 
                if(percentage > 90){
                    return  '<progress class="progress" id="progressred" value="' + percentage + '" max="100" data-text="'+ parseInt(percentage) +'%">'+ percentage +'</progress>';
                }
                else if(percentage > 80 && percentage <= 90){
                    return  '<progress class="progress" id="progressorange" value="' + percentage + '" max="100" data-text="'+ parseInt(percentage) +'%">'+ percentage +'</progress>';
                }
                return  '<progress class="progress" id="progressgreen" value="' + percentage + '" max="100" data-text="'+ parseInt(percentage) +'%">'+ percentage +'</progress>';
               
            } 
        }
    ]
//     ,
//     "createdRow": function( row, data, dataIndex ) {
//         if ( data.transferred_mva < 0.95 || data.transferred_mva > 1.05) {        
//             $(row).addClass('red');
//         }
//         else if (data.transferred_mva > 0.95 && data.transferred_mva < 0.98) {
//             $(row).addClass('orange');
//         }
//         else if (data.transferred_mva >= 0.98 && data.transferred_mva <= 1.05){
//             $(row).addClass('green');
//         }
//   }
 
} );

 
setInterval( function () {
    table.ajax.reload();
    // powerTable.ajax.reload(); 
}, 30000 );


// Calling the chart-data api to plot chart
var result_val = 0.0;
function getData() {
    //Ajax call
        $.ajax({url: "http://127.0.0.1:5000/chart-data", 
        success: function(data){
            result_val = data
        }});
        document.getElementById('tramscore').innerHTML = result_val.results;
        return result_val
}

var layout = {
    title: 'Tram Live Graph',
    xaxis: {
      title: 'Time'
    },
    yaxis: {
      title: 'Tram Score',
      range: [0,1],
      dtick: 0.1,
    }, 
    margin: {
        l: 60,
        r: 10,
        b: 70,
        t: 50,
        pad: 4
      },
  };


TESTER = document.getElementById('tester');
Plotly.plot(TESTER,[{
    x:[getData().time],
    y:[getData().results],
    type:'line'
}], layout, {scrollZoom: true});

var cnt = 0;
setInterval(function(){
    data = getData()
    Plotly.extendTraces(TESTER,{ 
        x:[[data.time]], 
        y:[[data.results]],
    }, [0]);
    cnt++;
    if(cnt > 6) {
        Plotly.relayout(TESTER,{
            xaxis: {
                range: [cnt-6,cnt-1],
                title: 'Time',
            }
            
        });
    }
},2000);



// // Temporary Chart 
// var layout2 = {
//     // title: 'Tram Live Graph',
//     xaxis: {
//       title: 'Time'
//     },
//     yaxis: {
//       title: 'Physical Resiliency Score',
//       range: [0,1.3],
//       dtick: 0.1,
//     }, 
//     margin: {
//         l: 60,
//         r: 0,
//         b: 90,
//         t: 50,
//         pad: 4
//       },
//     showlegend: true,
//     legend: {
//         "orientation": "h",
//         x: 1,
//         xanchor: 'right',
//         y: 1
        
//     },
    
//   };


//Cyber physical Temporary Line Chart
// var trace1 = {
//     x: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
//     y: [0.299965392,
//         0.29417606,
//         0.28151752,
//         0.308154447,
//         0.266489254,
//         0.334971353],
//     type: 'scatter',
//     name: 'Security Strategy 2',
//   };
  
  var trace2 = {
    x: ['22:00', '23:00', '00:00'],
    y: [1,
        1,
        0.547266881        
    ],
    type: 'scatter',
    name: 'TRAM',
    mode: 'lines',
    line: {shape: 'vh'}
  };
  
  var trace1 = {
    x: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00','11:00'],
    y: [
        // 0.547266881,
        // 0.547266881,
        // 0.546323687,
        // 0.546323687,
        // 0.545144695,
        // 0.545144695,
        // 0.547266881,
        // 0.547266881,
        // 0.395884244,
        // 0.395884244,
        // 0.721616292,
        // 0.721616292
        
        ],
    type: 'scatter',
    name: 'TRAM-ERROR',
    mode: 'lines',
    line: {
        dash: 'dot',
        width: 4,
        color: 'red',
        shape: 'vh'
    }
  };
  


  var data = [trace2,trace1];
  
//   Plotly.newPlot('overview-chart', data);

physicalchart = document.getElementById('tester');
Plotly.newPlot(physicalchart, data, layout2, {scrollZoom: true});