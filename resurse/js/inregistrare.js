 window.onload= function(){
     const regex = /^[a-zA-Z -]+$/; //doar litere
     const regex_mail= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     const regex2= /.*[a-zA-Z].*/; //macar o litera printre alte caractere speciale


     var formular=document.getElementById("form_inreg");
     var prenume=document.getElementById("inp-prenume").value;
     var nume=document.getElementById("inp-nume").value;
     var email=document.getElementById("inp-email ").value;
     var username=document.getElementById("inp-username").value;

    if(formular){
    formular.onsubmit= function(){  //cand apasa butonul de trimite
            if(document.getElementById("parl").value!=document.getElementById("rparl").value){
                alert("Nu ati introdus acelasi sir pentru campurile \"parola\" si \"reintroducere parola\".");
                return false;
            }

            if(!regex.test(prenume) || !regex.test(nume) || prenume[0]=='-' || nume[0]=='-' || prenume.length==1 || nume.length==1){
                alert("Numele sau prenumele introduse nu sunt valide.");
                return false;
            }

            if(!regex_mail.test(email))
            {
                alert("Adresa de mail introdusa nu este valida");
                return false;
            }

            if(!regex2(username)){
                alert("Username-ul introdus trebuie sa contina macar o litera");
                return false;
            }

            return true;
        }
    }
 }