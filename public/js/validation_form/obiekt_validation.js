

function validForm(){
    const nazwa = document.getElementById('Nazwa'); 
    const Typ_wydarzenia = document.getElementById('Typ_wydarzenia'); 
    const WarstwaSelect = document.getElementById('Warstwa-select'); 
    const DataVTS = document.getElementById('VTS'); 
    const DataVTE = document.getElementById('VTE'); 
    const Mapa = document.getElementById('map')

    const errorNazwa = document.getElementById('errorNazwa');
    const errorTyp_wydarzenia = document.getElementById('errorTyp_wydarzenia'); 
    const errorWarstwa = document.getElementById('errorWarstwa'); 
    const errorVTS = document.getElementById('errorVTS'); 
    const errorVTE = document.getElementById('errorVTE'); 
    const errorMapa = document.getElementById('errorMap')
    reset([nazwa, Typ_wydarzenia, WarstwaSelect, DataVTS, DataVTE, Mapa] ,
         [errorNazwa, errorTyp_wydarzenia, errorWarstwa, errorVTS, errorVTE, errorMapa]);

    let valid = true;

    if(!checkExists(nazwa.value)){
        valid = false;
        nazwa.classList.add("error-input");
        errorNazwa.innerText = "Uzupełnij";
    }
    
    if(!checkExists(Typ_wydarzenia.value)){
        valid = false;
        Typ_wydarzenia.classList.add("error-input");
        errorTyp_wydarzenia.innerText = "Uzupełnij";
    }
    if(WarstwaSelect.value == 0){
        valid = false;
        WarstwaSelect.classList.add("error-input");
        errorWarstwa.innerText = "Wybierz warstwę"
    }
    if(!DataVTS.value){
        valid = false;
        DataVTS.classList.add("error-input");
        errorVTS.innerText = "Wybierz date"
    }   
    if(!DataVTE.value){
        valid = false;
        DataVTE.classList.add("error-input");
        errorVTE.innerText = "Wybierz date"
    }
    if(clickArray.length == 0){
        valid = false;
        Mapa.classList.add("error-map");
        errorMapa.innerText = "Nie wybrano żadanej współrzędnej"
    }
    
    if(valid) insertGEO();
    return valid;
}


function insertGEO(){
    var divGEO = document.getElementById('geo-inputs');
    var toInsert = "";
    for(var i = 0 ; i < clickArray.length ; i++) { 
        toInsert = toInsert + 
        `<input type="text" name="GEO" value="${clickArray[i]}">`;
    }
    console.log(toInsert)
    divGEO.innerHTML = toInsert;
}

function reset(inputs , err){
    inputs.forEach( i => {
        i.classList.remove("error-input");
        i.classList.remove("error-map");
    });

    err.forEach(e => {
        e.innerText = "";
    })
}

function checkExists(value){
    if(!value)
       return false
   else 
       return true
}