console.log("działam")
const PointDiv = document.getElementById('point-div');

const map = L.map('map').setView([52.237049,21.017532], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 23,
    attribution: '@Dawka Historii'
}).addTo(map);



    var clickArray = new Array(0);
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            // .setContent("You clicked the map at " + e.latlng.toString())
            //.openOn(map);
        
        clickArray.push([e.latlng.lat , e.latlng.lng]);
        console.log(clickArray)
        showPointView();
    }


    function showPointView(){
        PointDiv.innerHTML = "";
        var pointDivBody = "";
        for(var i = 0 ; i < clickArray.length ; i++){
            pointDivBody = pointDivBody + `<div class="obiekt-point-line"><p>${clickArray[i]}</p> 
            <button type="button" class="delete-obiekt-button" onClick="deletePoint(${i})"> X </button>
            </div>`
        }
        PointDiv.innerHTML = pointDivBody;
        draw();
    }

    function deletePoint(i){
        clickArray.splice(i, 1)            
        showPointView();

    }
    
    var polygon = L.polygon([[0,10] , [10,0]]).addTo(map);
    
    function draw(){
        polygon.setLatLngs(clickArray)
    }


    window.onload = function readPoints(){
        var inputs = document.getElementsByClassName('geo-inputs-load');
        var arrayLines = Array();
        for(var i = 0; i < inputs.length; i++){
            var cords = inputs[i].value.split(',');
            for( var j = 0 ; j < cords.length; j++) {
                cords[j] = Number(cords[j])
                console.log( cords[j])
            }
           
            arrayLines.push(cords);
        }
      console.log(arrayLines)
      clickArray = arrayLines;
      showPointView()
      clearInputs()
    }

    function clearInputs(){ 
        var GEOInputsDiv = document.getElementById('geo-inputs');
        GEOInputsDiv.innerHTML = "";
    }
    map.on('click', onMapClick);


