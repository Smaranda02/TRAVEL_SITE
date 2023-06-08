
//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
    d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()}`;  //
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"]
    console.log(vectorParametri);
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"=")) {
            console.log(param.split("=")[1])
            return param.split("=")[1]
        }
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}

function deleteAllCookies() {

    let cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        let name=cookie.split("=")[0];
        // console.log(" cookie : " +  cookie);
        deleteCookie(name)
    }
}


function accordionState() {
     const accordions=document.querySelectorAll(".accordion-item");
     let accordionState = [];

   accordions.forEach((item) => {
        let expanded = item.querySelector('.accordion-button').getAttribute('aria-expanded');
        accordionState.push(expanded);
    });

    setCookie("accordion",accordionState,60000);

}


window.addEventListener("load", function(){
    if (getCookie("acceptat_banner")){
        document.getElementById("banner").style.display="none";
    }

    let accordions=getCookie("accordion");
    if(accordions){

        let accordionsValue=accordions.split(',');
        let nr=1;
        for(let accordion of accordionsValue){

            console.log("value: "+accordion);
            if(accordion=="true")
                document.getElementById("collapse"+nr).classList.add('show');
            nr+=1;
        }
    }

    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("acceptat_banner",true,6000);
        document.getElementById("banner").style.display="none";
    }


    //set last page cookie
    let currentPage=window.location.href;
    if(!getCookie("currentPage")) {
        setCookie("currentPage", currentPage, 60000);
        setCookie("lastPage", "", 60000);
    }

    if (currentPage != getCookie("currentPage")) {
        let oldCurrPage=getCookie("currentPage");
            setCookie("lastPage", oldCurrPage , 60000);
            setCookie("currentPage", currentPage, 60000);
    }
    console.log(getCookie("currentPage"));


    //banner
    this.document.getElementsByName("gr_rad").onclick=function(){
        setCookie("acceptat_banner",true,60000);
        document.getElementById("banner").style.display="none"
    }


    let v=this.document.getElementsByClassName("accordion-item");
    for(let item of v){
        item.onclick=function () {
            accordionState();
        }
    }

})
