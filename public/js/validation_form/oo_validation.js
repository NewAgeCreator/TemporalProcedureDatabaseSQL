var ObiektSelect = document.getElementById('Obiekt-select')
var OpisSelect = document.getElementById('Opis-select')


function validForm(){
    reset([ObiektSelect, OpisSelect]);
    let valid = true;


    if(ObiektSelect.value == 0){
        valid = false;
        ObiektSelect.classList.add("error-input");
    }

    
    if(OpisSelect.value == 0){
        valid = false;
        OpisSelect.classList.add("error-input");
    }

    return valid;
}

function reset(inputs){
    inputs.forEach(i => {
        i.classList.remove("error-input");
    })
}


function loadOpisy(){
    if(ObiektSelect.value == 0)
        return
    getDataFromApi(ObiektSelect.value)
}

function getDataFromApi(id){
    console.log("DZIAŁAM")
    var id = ObiektSelect.value;
    console.log(id)
    $.getJSON('/getOpisyNotInObiekt/'+id , function( json ) {
        console.log("recived " , json[0]);
        
        if(!json[0]){
            OpisSelect.innerHTML = '<option value="0" selected>Brak dostępnych Opisów</option>';
        }
        else {
            var selectBody;
            for(let i = 0 ; i < json.length ; i++){     
                if (i == 0) selectBody = selectBody + `<option value="${json[i].Id_opisu}" selected>${json[i].Nazwa_skrocona}</option>`
                else  selectBody = selectBody + `<option value="${json[i].Id_opisu}">${json[i].Nazwa_skrocona}</option>`
            
            }
            OpisSelect.innerHTML = selectBody;
        }
            
        

    })
}