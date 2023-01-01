console.log("podłaczyli mnie ");


function validForm(){

    const nazwa = document.getElementById('Nazwa');
    const opis = document.getElementById('Opis');
    const imie = document.getElementById('Imie_autora');
    const nazwisko = document.getElementById('Nazwisko_autora');
    const date = document.getElementById('data_utworzenia');

    const errorNazwa = document.getElementById('errorNazwa');
    const errorOpis = document.getElementById('errorOpis');
    const errorImie = document.getElementById('errorImie');
    const errorNazwisko = document.getElementById('errorNazwisko');
  
console.log(nazwa)
console.log(opis)
console.log(imie)
console.log(nazwisko)


   
    reset([nazwa, opis, imie, nazwisko, date], [errorNazwa, errorOpis, errorImie, errorNazwisko]);
    
    let valid = true;

    if(!checkExists(nazwa.value)){
        valid = false;
        nazwa.classList.add("error-input");
        errorNazwa.innerText = "Uzupełnij"
    }
    if(!checkExists(opis.value)){
        valid = false;
        opis.classList.add("error-input");
        errorOpis.innerText = "Uzupełnij"
    }
    if(!checkExists(imie.value)){
        valid = false;
        imie.classList.add("error-input");
        errorImie.innerText = "Uzupełnij"
    }
    if(!checkExists(nazwisko.value)){
        valid = false;
        nazwisko.classList.add("error-input");
        errorNazwisko.innerText = "Uzupełnij"
    }


    console.log(date.value)
    return valid;

}

function reset(inputs , err){
    inputs.forEach( i => {
        i.classList.remove("error-input");
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


function getDate() {
    var input_date = document.getElementById("data_utworzenia");
    if(!input_date.value){

        var today = new Date();
        var d = today.getDate();
        var m = today.getMonth() + 1; 
        var y = today.getFullYear();
        
        if(d<10) {
            d = '0'+d
        } 
        
        if(m<10) {
            m= '0'+m
        } 
        
        today = y + '-' + m + '-' + d;
        console.log(today);
        document.getElementById("data_utworzenia").value = today;
        }   
    }
    
    
  window.onload = function() {
    getDate();
  };