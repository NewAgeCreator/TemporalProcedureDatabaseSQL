var TematSelect = document.getElementById('Temat-select')
var WarstwaSelect = document.getElementById('Warstwa-select')



function validForm(){
    reset([TematSelect, WarstwaSelect]);
    let valid = true;


    if(TematSelect.value == 0){
        valid = false;
        TematSelect.classList.add("error-input");
    }

    
    if(WarstwaSelect.value == 0){
        valid = false;
        WarstwaSelect.classList.add("error-input");
    }

    return valid;
}

function reset(inputs){
    inputs.forEach(i => {
        i.classList.remove("error-input");
    })
}



function loadWarstwy(){
    if(TematSelect.value == 0)
        return
    getDataFromApi(TematSelect.value)
}

function getDataFromApi(id){
    var id = TematSelect.value;
    console.log(id)
    $.getJSON('/getWarstwyNotInTemat/'+id , function( json ) {
        console.log("recived " , json[0]);
        
        if(!json[0]){
                WarstwaSelect.innerHTML = '<option value="0" selected>Brak dostępnych Warstw</option>';
        }
        else {
            var selectBody;
            for(let i = 0 ; i < json.length ; i++){     
                if (i == 0) selectBody = selectBody + `<option value="${json[i].Id}" selected>${json[i].Nazwa_warstwa}</option>`
                else  selectBody = selectBody + `<option value="${json[i].Id}">${json[i].Nazwa_warstwa}</option>`
            
            }
            WarstwaSelect.innerHTML = selectBody;
        }
            
        

    })
}