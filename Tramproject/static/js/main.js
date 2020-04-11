
//Adding a map to the UI
var mymap = L.map('mapid').setView([47.3055701300, -120.1623439000], 5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 30,
    id: 'mapbox/streets-v11',
    // id: 'mapbox/satellite-v9',
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
            // let connections = results.connections
            // console.log(connections)
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
            // console.log(connectionfrom)
            // console.log(connectionto)
            for(j=0; j<connectionfrom.length; j++){
                let latlngs = [
                    [connectionfrom[j].gis_latitude, connectionfrom[j].gis_longitude], 
                    [connectionto[j].gis_latitude, connectionto[j].gis_longitude]
                ];
                // console.log(latlngs)
                L.polyline(latlngs, {color:'black'}).addTo(mymap);
            }
        }
    });
};
getMapData();
  
$("a[href='#physical']").on('shown.bs.tab', function (e) {
    mymap.invalidateSize();
    // $('#example').DataTable();
});


//Calling the score API and Adding information to the tables
var table = $('#businfo').DataTable( {
    paging: true,
    "sDom":"tipr",
    // autowidth: true,
    pageLength : 5,
    order: [[3, 'desc']],
    "ajax": {
        "url": "http://127.0.0.1:5000/livevoltages",
        "type": "GET",
        "datatype": 'json',
        // "data": 'data.data'
    },
    columns: [
        { 'data': 'bus_id' },
        { 'data': 'bus_name' },
        { 'data': 'base_kv'},
        { 'data': 'bus_voltage'}
    ],
    "createdRow": function( row, data, dataIndex ) {
        // console.log(data)
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
 
// }
    
} );

  
 
setInterval( function () {
    table.ajax.reload();
}, 30000 );


// Calling the chart-data api to plot chart
var result_val = 0.0;
function getData() {
    //Ajax call
        $.ajax({url: "http://127.0.0.1:5000/chart-data", 
        success: function(data){
            // var obj= JSON.parse(result);
            // console.log(data.results);
            result_val = data
        }});
        // console.log(result_val);
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
        l: 50,
        r: 10,
        b: 50,
        t: 50,
        pad: 4
      },
  };


TESTER = document.getElementById('tester');
// function getData() {
//     return Math.random();
// }  
Plotly.plot(TESTER,[{
    y:[getData()],
    type:'line'
}], layout);

var cnt = 0;
setInterval(function(){
    data = getData()
    Plotly.extendTraces(TESTER,{ y:[[data.results]]}, [0]);
    // console.log("y " + y);
    cnt++;
    if(cnt > 15) {
        Plotly.relayout(TESTER,{
            xaxis: {
                range: [cnt-15,cnt],
                title: 'Time'
            }
        });
    }
},2000);
