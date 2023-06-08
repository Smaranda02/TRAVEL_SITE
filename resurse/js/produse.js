window.addEventListener("load", function () {

    let iduriProduse=localStorage.getItem("cos_virtual");
    iduriProduse=iduriProduse?iduriProduse.split(","):[];      //["3","1","10","4","2"]  ; daca nu aveam nimic puneam vectorul vid in iduriProduse

    for(let idp of iduriProduse){

        //querySelector selecteaza dupa un selector de CSS
        //practic caut primul element care are val egala cu idp (id ul produsului)
        let ch = document.querySelector(`[value='${idp}'].select-cos`);  //[] inseamna atribut
        //value sa fie egal cu id-ul produsului
        if(ch){
            ch.checked=true; //daca exista checkbox il bifez
        }
        else{
            console.log("id cos virtual inexistent:", idp);
        }
    }


    //----------- adaugare date in cosul virtual (din localStorage)
    let checkboxuri= document.getElementsByClassName("select-cos");
    for(let ch of checkboxuri){

        //la bifare/debifare
        ch.onchange=function(){
            let iduriProduse=localStorage.getItem("cos_virtual");  //vector de iduri
            iduriProduse=iduriProduse?iduriProduse.split(","):[];

            if( this.checked){

                //daca e bifat pun in vectorul de id-uri si pordusul actual
                iduriProduse.push(this.value)
            }
            else{ //daca l am debifat trebuie sa scot produsul din cos
                let poz= iduriProduse.indexOf(this.value);  //cauta pozitia
                if(poz != -1){
                    iduriProduse.splice(poz,1);  //cu splice sterg un element de pe pozitia poz
                }
            }

            localStorage.setItem("cos_virtual", iduriProduse.join(","))
        }

    }




    document.getElementById("resetare").onclick= function(){

        if(confirm("Are you sure you want to reset filters?")) {

            document.getElementById("inp-nume").value = "";

            document.getElementById("inp-pret-min").value = document.getElementById("inp-pret-min").min;
            document.getElementById("inp-pret-max").value = document.getElementById("inp-pret-max").min;

            document.getElementById("inp-categorie").value = "all";
            document.getElementById("inp-categ-food").value = "all";
            document.getElementById("i_rad5").checked = true;
            var produse = document.getElementsByClassName("produs");
            document.getElementById("infoRange1").innerHTML = "(0)";
            document.getElementById("infoRange2").innerHTML = "(20)";


            let noResultText = document.getElementById("no-result").value;
            noResultText.style.display = "none";

            //for (let prod of produse){
            for (let prod of locals.produse) {
                prod.style.display = "block";
            }
        }
    }

    function sortare(semn) {
            var produse = document.getElementsByClassName("produs");  //array dinamic -> getbyclassname
            var v_produse = Array.from(produse); //transformam in array simplu
            v_produse.sort(function (a, b) {

                let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                let nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                if(nume_a==nume_b){
                    let descriere_a = a.getElementsByClassName("val-descriere")[0].innerHTML;
                    let descriere_b = b.getElementsByClassName("val-descriere")[0].innerHTML;
                    return descriere_a.length-descriere_b.length;
                }
                return semn*(nume_a.localeCompare(nume_b));

            });

            for (let prod of v_produse) {
                prod.parentElement.appendChild(prod);
            }
        }

        document.getElementById("sortCrescNume").onclick=function (){
            sortare(1);
        }

        document.getElementById("sortDescrescNume").onclick=function (){
            sortare(-1);
        }




    document.getElementById("inp-pret-min").onchange=function (){
        document.getElementById("infoRange1").innerHTML=`(${this.value})`
    }


    document.getElementById("inp-pret-max").onchange=function (){
        document.getElementById("infoRange2").innerHTML=`(${this.value})`
    }


    function filter(){
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();
        let regex1=/^[a-zA-Z]+$/;
        if(!regex1.test(val_nume) && val_nume) {
            alert("Input name invalid")
            document.getElementById("inp-nume").innerHTML="";
        }


        let radiobuttons=document.getElementsByName("gr_rad");
        let val_km;
        for(let r of radiobuttons){
            if(r.checked){
                val_km=r.value;
                break;
            }
        }

        var km_min, km_max;
        if(val_km!="all")
        {
            [km_min, km_max]=val_km.split(":");
            km_min=parseFloat(km_min);
            km_max=parseFloat(km_max);
        }

        let foodSelected=[]
        let optionsFood=document.getElementById("inp-categ-food");
        console.log(optionsFood);
        for(let food of optionsFood)
            if(food.selected){
                foodSelected.push(food.value);
            }


        checkBox=document.getElementById("inp-checkbox");

         let val_pret_min= document.getElementById("inp-pret-min").value;
         let val_pret_max= document.getElementById("inp-pret-max").value;

         console.log(val_pret_min,val_pret_max);


        let floatingText=document.getElementById("floatingInputValue").value.toLowerCase();
        let regex2=/^[a-zA-Z]+(\*?|(\*[a-zA-Z]+))?$/;

        if(!regex2.test(floatingText) && floatingText) {
            alert("Input name invalid")
            document.getElementById("floatingInputValue").value="";
        }

        let nume2=null;
        let start=null,finish=null;
        const parti=floatingText.split("*");
        if(parti.length==2){
            start=parti[0];
            finish=parti[1];
            console.log(start,finish);
        }
        else if(parti.length==1)
            start=parti[0];

        else nume2=parti;

        var produse=document.getElementsByClassName("produs");

        let val_categ=document.getElementById("inp-categorie").value;

        var foundResults=false;
        let noResultText=document.getElementById("no-result");
        noResultText.style.display="none";

        for (let prod of produse){

            prod.style.display="none";
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();


            let cond1=true;
            if(val_nume)
                cond1=nume.startsWith(val_nume); //sau includes


            let cond8=true;
            if(start)
                if(!nume.startsWith(start))
                    cond8 = false;
            if(finish)
                if(!nume.endsWith(finish))
                    cond8 = false;

            if(!start && !finish)
                if(nume2)
                    cond8= nume.startsWith(nume2);

            let km=parseFloat(prod.getElementsByClassName("val-km")[0].innerHTML);
            let cond2= (val_km=="all" || (km_min<=km && km<km_max));

            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);

            let cond3=true;
            if(val_pret_max!=20 || val_pret_min!=0)
                cond3=(pret>=val_pret_min && pret<=val_pret_max);

            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML;

            let cond4=(val_categ=="all" || val_categ==categorie)

            let cond6=true;
            let freeCancelValue=prod.getElementsByClassName("val-free-cancel")[0].innerHTML;
            if(checkBox.checked.toString()=="true" && freeCancelValue=="false")
                cond6=false;


            let food=prod.getElementsByClassName("val-food")[0].innerHTML;
            let cond7=foodSelected.includes(food) || foodSelected=="all";


           //if(cond8){
            let alwaysShow=prod.classList.contains("alwaysShow");
            if((cond1 && cond2 && cond3 && cond4 && cond6 && cond7 && cond8) || alwaysShow){
                prod.style.display="block";
                foundResults=true
            }
        }

        if(foundResults==false)
            noResultText.style.display="block";

    }


    document.getElementById("filtrare").onclick=filter;



    document.getElementById("calcul").onclick=function (){

        let minPrice=10000
        var produse=document.getElementsByClassName("produs");
        for(let prod of produse) {
            let price= prod.getElementsByClassName("val-pret")[0].innerHTML;
            checkBox=document.getElementsByClassName("selecteaza-cos");
            if(checkBox.checked==true)
                if(price<minPrice) {
                    let minProd=prod;
                    minPrice=price;
                }
        }

        let p = document.createElement("p");
        p.innerHTML=minPrice;
        p.id="info-suma";
        ps=document.getElementById("p-suma");
        container = ps.parentNode;
        frate=ps.nextElementSibling
        container.insertBefore(p, frate);
        p.style.position="fixed";

        setTimeout(function(){
            let info=document.getElementById("info-suma");
            if(info)
                info.remove();
        }, 100000)
    }


    window.onkeydown= function(e){
        if (e.key=="c" && e.altKey){
            if(document.getElementById("info-suma"))
                return;
            var produse=document.getElementsByClassName("produs");
            let minPrice=10000;
            for (let prod of produse){
                if(prod.style.display!="none")
                {
                    let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                    if(pret<minPrice)
                        minPrice=pret;
                }
            }

            let p=document.createElement("p");
            p.innerHTML="The minimum price from all the hotels listed is : " + minPrice;
            p.id="info-suma";
            ps=document.getElementById("p-suma");
            container = ps.parentNode;
            frate=ps.nextElementSibling
            container.insertBefore(p, frate);
            setTimeout(function(){
                let info=document.getElementById("info-suma");
                if(info)
                    info.remove();
            }, 3000)
        }
    }


     let minButton=document.getElementById("calcul");
     minButton.onclick=function (){
         if(document.getElementById("info-suma"))
             return;
         var produse=document.getElementsByClassName("produs");
         let minPrice=10000;
         for (let prod of produse){
             if(prod.style.display!="none")
             {
                 let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                 if(pret<minPrice)
                     minPrice=pret;
             }
         }

         let p=document.createElement("p");
         p.innerHTML="The minimum price from all the hotels listed is : " + minPrice;
         p.id="info-suma";
         ps=document.getElementById("p-suma");
         container = ps.parentNode;
         frate=ps.nextElementSibling
         container.insertBefore(p, frate);
         setTimeout(function(){
             let info=document.getElementById("info-suma");
             if(info)
                 info.remove();
         }, 3000)
     }


    // window.onkeydown=function (e){
    //     var keyCode = e.code || e.key;
    //     if (keyCode == 'Enter') filter();
    // }


    var switchButton = document.getElementById("theme_button");

    let sun=document.getElementById("sun");
    let moon=document.getElementById("moon");
    sun.style.display="block";
    moon.style.display="none";


    switchButton.addEventListener("click", function() {
        if (this.checked) {
            sun.style.display="none";
            moon.style.display="block";
            console.log("Switch button is pressed.");
        } else {
            moon.style.display="none";
            sun.style.display="block";
            console.log("Switch button is not pressed.");
        }
    });


    let freeCancelButton=document.getElementById("free_cancel");
    freeCancelButton.addEventListener("click", function (){
        checkBox=document.getElementById("inp-checkbox");
        if(checkBox.checked) {
            freeCancelButton.classList.remove("btn-outline-secondary");
            freeCancelButton.classList.add("btn-secondary");
        }

        else {
            freeCancelButton.classList.add("btn-outline-secondary");
            freeCancelButton.classList.remove("btn-secondary");
        }
    });


    // addEventListener primeste o referinta catre o functie.
    // window.addE...(in care le pun pe toate)
    document.getElementById("sortCrescNume").addEventListener("change",filter);
    document.getElementById("sortDescrescNume").addEventListener("change",filter);
    let array=document.getElementsByName("gr_rad");
    for(let elem of array)
        elem.addEventListener("change", filter);
    document.getElementById("inp-categorie").addEventListener("change",filter);
    document.getElementById("inp-pret-min").addEventListener("change",filter);
    document.getElementById("inp-pret-max").addEventListener("change",filter);
    document.getElementById("inp-categ-food").addEventListener("change",filter);
    document.getElementById("free_cancel").addEventListener("change",filter);
    document.getElementById("floatingInputValue").addEventListener("change",filter);




    var eraseButtons=document.getElementsByClassName("erase");
    for(let button of eraseButtons) {
        button.onclick = function () {

            var produse = document.getElementsByClassName("produs");
            for (let prod of produse) {

                let idProdus=prod.getElementsByClassName("val-id")[0].innerHTML;

                let eraseButton = document.getElementById("erase" + idProdus);

                    eraseButton.onclick = function () {
                        prod.style.display = "none";
                    }
             }
        }
    }


    var stayButtons=document.getElementsByClassName("stay");
    for(let button of stayButtons) {
        button.onclick = function () {

            var produse = document.getElementsByClassName("produs");
            for (let prod of produse) {

                let idProdus=prod.getElementsByClassName("val-id")[0].innerHTML;

                let stayButton = document.getElementById("stay" + idProdus);

                    stayButton.onclick = function () {
                        stayButton.classList.toggle("pressed");
                        prod.classList.toggle("alwaysShow");
                    }

            }
        }
    }


});

