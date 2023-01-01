console.log("skrypt walidacji działa")

function validForm(){
    const Nazwa_skrocona = document.getElementById('Nazwa_skrocona');
    const Opis = document.getElementById('Opis');
    const Imie_autora = document.getElementById('Imie_autora');
    const Nazwisko_autora = document.getElementById('Nazwisko_autora');

    const errorNazwa_skrocona = document.getElementById('errorNazwa_skrocona');
    const errorOpis = document.getElementById('errorOpis');
    const errorImie_autora = document.getElementById('Imie_autora');
    const errorNazwisko_autora = document.getElementById('errorNazwisko_autora');


    reset([Nazwa_skrocona, Opis, Imie_autora, Nazwisko_autora],
         [errorNazwa_skrocona, errorOpis, errorImie_autora, errorNazwisko_autora]);

    let valid = true;

    if(!Nazwa_skrocona.value){
        valid=false;
        Nazwa_skrocona.classList.add("error-input");
        errorNazwa_skrocona.inner = "Uzupełnij";
    }
    if(!Opis.value){
        valid=false;
        Opis.classList.add("error-input");
        errorOpis.inner = "Uzupełnij";
    }


    if(!Imie_autora.value){
        valid=false;
        Imie_autora.classList.add("error-input");
        errorImie_autora.inner = "Uzupełnij";
    }


    if(!Nazwisko_autora.value){
        valid=false;
        Nazwisko_autora.classList.add("error-input");
        errorNazwisko_autora.inner = "Uzupełnij";
    }
return valid;
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