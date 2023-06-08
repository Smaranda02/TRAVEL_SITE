
    let tema=localStorage.getItem("tema");
    if(tema) {
        document.body.classList.add("dark");

    }

    window.addEventListener("DOMContentLoaded", function (){ //se face load dupa ce s au incarcat toate resursele
        document.getElementById("theme_button").onclick=function (){
        if(document.body.classList.contains("dark")){   //schimb clasa unui elem in mod dinamic
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
    }
        else{
            document.body.classList.add("dark");
            localStorage.setItem("tema", "dark");
        }
    }
});

    //localStorage nu expira (tre sa le dam remove manual), cookies expira. ambele au continut de tipul cheie valoare. ambele sunt pe partea de client nu de server
