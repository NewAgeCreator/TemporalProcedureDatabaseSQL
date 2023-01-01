
const TableOpisBody = document.getElementById('TableOpisBody');

const map = L.map('map').setView([52.237049,21.017532], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 23,
    attribution: '@Dawka Historii'
}).addTo(map);


var popup = L.popup();



let markerArray = new Array();
let polygonArray = new Array();

let obiekty;
let warstwy = new Array();


function getTematObjects(temat_id){
    $.get('/getObiektyFromTemat/'+temat_id,
    function(data, statusTxt) {
        console.log('zwracam = ', data);
        for(d of data) { d.GEO=JSON.parse(d.GEO) }
        obiekty =  data;
    })
}

function draw(){
   
        resetRenderPolygon();
        resetRenderMarker();

    for(obiekt of obiekty){
        if(warstwy.includes(obiekt.Warstwa_id) && obiekt.Rodzaj_stanu == 'A')
        {
            console.log( "ZOOM = ",map.getZoom())
            if(obiekt.GEO.length > 1)
            {
                if(map.getZoom() > 5)
                    { drawPolygon(obiekt);} 
                else 
                { drawMarkerFromPolygon(obiekt) }

            } else {
                drawMarker(obiekt); 
            }
        
        }
    }

}
function drawMarker(obiekt){
    var obiektGEO = getDisplayGEO(obiekt.GEO);
    console.log('DRAW MARKER GEO = ' , obiektGEO )
    var marker = L.marker(obiektGEO[0], {alt: obiekt.Id_obiektu} ).addTo(map)
        .bindPopup(obiekt.Nazwa);
    markerArray.push(marker);
    marker.on('click', markerOnClick)
}

function drawPolygon(obiekt){
    var obiektGEO = getDisplayGEO(obiekt.GEO);
    console.log("RYSUJE POLYGON ", obiektGEO)
    var polygon = L.polygon(obiektGEO, {alt: obiekt.Id_obiektu}).addTo(map)
        .bindPopup(obiekt.Nazwa);
    polygonArray.push(polygon);
    polygon.on('click', markerOnClick)
}

function drawMarkerFromPolygon(obiekt){
    var obiektGEO = getDisplayGEO(obiekt.GEO);
    
    var x = 0;
    var y = 0;
    var i;
    for(i = 0 ; i < obiektGEO.length ; i++){
        x = x + obiektGEO[i][0];
        y = y + obiektGEO[i][1];
    }
    x = x/i;
    y = y/i;
    console.log("X = ", x ,  " | ", "Y = ", y , " I =" , i)
    var marker = L.marker([x,y], {alt: obiekt.Id_obiektu}).addTo(map)
        .bindPopup(obiekt.Nazwa)
        markerArray.push(marker);
        marker.on('click', markerOnClick)
        
        
    
}

function markerOnClick(e){
    var id = this.options.alt;
    console.log("ID OBIEKTU = " , this.options.alt)
    getOpisyObiektu(id)
}

function getOpisyObiektu(id){
    $.getJSON('/getOpisyFromObiekt/'+id , function(json) {
        if(!json[0]){
            TableOpisBody.innerHTML = '<td>Brak opisów</td>'
        }
        else{
            var tableBodyTmp = "";
            for(var i = 0 ; i < json.length; i++){
                if(json[i].Rodzaj_stanu == 'A')
                tableBodyTmp = tableBodyTmp + `<tr><td>${json[i].Id_opisu}</td><td>${json[i].Nazwa_skrocona}</td><td id="opis">${json[i].Opis}</td></tr>`
            }
            TableOpisBody.innerHTML = tableBodyTmp;

        }
        
    })
}

function resetRenderPolygon(){
    for(p of polygonArray){
        map.removeLayer(p)
    }
    polygonArray = new Array();
}
function resetRenderMarker(){
    for(m of markerArray){
        map.removeLayer(m)
    }
    markerArray = new Array();
}

function getDisplayGEO(data) {
    var GEO = [];
    for(var i = 0 ; i < data.length; i++){
        GEO.push(data[i].split(',').map(Number));
    }
    return GEO
}

function onChangeCheckBox(){
    warstwy = new Array();
    var checkboxes = document.getElementsByClassName('warstwa_checkbox');
    for(check of checkboxes){
        if(check.checked)
            warstwy.push(Number(check.value));
    }
    draw();
}


map.on('zoomend', function() {
    draw();
});

window.onload = function(){
    let currentTemat = document.getElementById('currentTematInput').value;
    obiekty = getTematObjects(currentTemat);
    onChangeCheckBox();
    
}



