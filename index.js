const express = require("express");
//includem toate modulele de care avem nevoie
//nom install formidable nodemailer express-session
//pornim serverul cu nodemon se reporneste automat
//afyaxsziebogbtbt - parola gmail 2 stept authentication

const fs=require('fs');  //fs=filesystem
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');
const ejs=require('ejs');
const AccesBD=require("./module_proprii/accesbd.js");
const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");


const QRCode= require('qrcode');
const puppeteer=require('puppeteer');
const mongodb=require('mongodb');
const helmet=require('helmet');
const xmljs=require('xml-js');

const request=require("request");

const axios = require('axios');
const api_key='sULyZOuHdztJxK8fLmlwuARdJhTuQeAm'
const url_api='https://aeroapi.flightaware.com/aeroapi/airports/nearby?latitude=44.4268&longitude=26.1025&radius=1000&only_iap=false'
const data_type='application/json; charset=UTF-8'

//search for airports
// fetch("https://aeroapi.flightaware.com/aeroapi/airports?max_pages=1", {
//     method: 'GET',
//     headers: {
//         'Accept':data_type,
//         'x-apikey': api_key
//     }
// })
//     .then(response => response.json())
//     .then(data => {
//         // Handle the API response
//         console.log(data);
//     })
//     .catch(error => {
//         // Handle any errors
//         console.error(error);
//     });


//search flights with min lon min lat max lon max lat set for aprox europe
//GET /flights/search
// fetch("https://aeroapi.flightaware.com/aeroapi/flights/search?query=-latlong+%2236+-10+70+40%22", {
//     method: 'GET',
//     headers: {
//         'Accept': data_type,
//         'x-apikey': api_key
//     }
// })
//     .then(response => response.json())
//     .then(data => {
//         // Handle the API response
//         console.log(data);
//     })
//     .catch(error => {
//         // Handle any errors
//         console.error(error);
//     });



//
// fetch("https://aeroapi.flightaware.com/aeroapi/flights/search?query=-latlong+%2236+-10+70+40%22", {
//     method: 'GET',
//     headers: {
//         'Accept': data_type,
//         'x-apikey': api_key
//     }
// })
//     .then(response => response.json())
//     .then(data => {
//         // Handle the API response
//         console.log(data);
//
//
//
//     })
//     .catch(error => {
//         // Handle any errors
//         console.error(error);
//     });
//



AccesBD.getInstanta().select({  //ne ajutam de query builderul din accesbd.js
    tabel:"hotels",
    campuri:['name','price','km'],
    conditiiAnd:["price>10"]
}, function (err,rez){
    console.log(err);
    console.log(rez);
    }
    )



const {Client} = require('pg');


var client= new Client({database:"ProiectWBBD",
    user:"postgres",
    password:"admin2002",
    host:"localhost",
    port:5432});
client.connect();

// client.query("select * from prajituri", function(err, rez){
//     console.log("Eroare BD",err);
//
//     console.log("Rezultat BD",rez.rows);
// });




obGlobal={
    obErorrs:null,
    obImages:null,
    folderScss:path.join(__dirname,"resurse/scss"),
    folderCss:path.join(__dirname,"resurse/css"),
    folderBackup:path.join(__dirname,"backup"),
    optiuniMeniu: [],
    optiuniFood: [],
    protocol:"http://",
    numeDomeniu:"localhost:8000",
    clientMongo:mongodb.MongoClient,
    bdMongo:null,
    minPrice:[],
    maxPrice:null
}

var url = "mongodb://localhost:27017";//pentru versiuni mai vechi de Node
var url = "mongodb://0.0.0.0:27017";

//
// const socket = require('socket.io');
// var  io= socket(app)
// io = io.listen(app);//asculta pe acelasi port ca si
//

obGlobal.clientMongo.connect(url, function(err, bd) {
    if (err) console.log(err);
    else{
        obGlobal.bdMongo = bd.db("proiect_web"); //aici pun numele bd-ului meu
    }
});


client.query("select * from unnest(enum_range(null::accomodation_type))", function (err,rezCategorie) {
    if(err){
        console.log(err);
    }
    else{
        obGlobal.optiuniMeniu=rezCategorie.rows;
        // console.log(obGlobal.optiuniMeniu);
    }
});


client.query("select * from unnest(enum_range(null::food_type))", function (err,rezCategorie) {

    if(err){
        console.log(err);
    }
    else{
        obGlobal.optiuniFood=rezCategorie.rows;
        // console.log(obGlobal.optiuniMeniu);
    }
});


client.query("SELECT MIN(price) FROM hotels", function( err, rez){

        if(err){
            console.log(err);
        }

        else {
            obGlobal.minPrice =rez.rows[0];
        }
});

console.log("THE VALUE IS"+obGlobal.minPrice);



app=express();
console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd);



//acest session  e valabil cat timp userul este logat
//cand userul da logout obiectul sesiune se distruge
app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));


vectorFoldere=["temp","temp1","backup", "poze_uploadate"]
for(let folder of vectorFoldere){
    //let caleFolder=__dirname+"/"+folder;
    let caleFolder=path.join(__dirname,folder)
    //caleFolder="./"+folder
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}


function compileazaScss(caleScss,caleCss){
    if(!caleCss) {
        //let vectorCale = caleScss.split("\\")  //split transforma un sir intr un vector de subsiruri in functie de separatorul oferit
        //let numeFisExt = vectorCale[vectorCale.length - 1] //numele fisierului cu tot cu extensiw  fiindca e ultimul
        let numeFisExt=path.basename(caleScss);
        let numeFis = numeFisExt.split(".")[0]
        caleCss=numeFis+".css";
    }


    if(!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss)
    if(!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss)
    //la acest punct avem cai absolute in caleScss si caleCss

    let vectorCale=caleCss.split("\\");
    //numeFisCss=vectorCale[vectorCale.length-1];

    let caleBackup=path.join(obGlobal.folderBackup,"resurse/css");
    if(!fs.existsSync(caleBackup)){
        fs.mkdirSync(caleBackup,{recursive:true});
    }

    let numeFisCss=path.basename(caleCss);

    //copiem fis in backup
    if(fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss,path.join(obGlobal.folderBackup,"resurse/css",numeFisCss))
    }

    //inainte de pauza
    rez=sass.compile(caleScss,{"sourceMap":true}); //rez este un obiect care va avea si o atributa
    //css in care se afla codul de css rezultat in urma compilarii
    fs.writeFileSync(caleCss,rez.css);
   // console.log("Compilare SCSS",rez);
}

app.set("view engine","ejs");
//compileazaScss("a.scss")


//vFisiere va contine toate fisierele din folderScss
vFisiere=fs.readdirSync(obGlobal.folderScss)
//console.log(vFisiere)
for(let numeFis of vFisiere){
    if(path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }

}



app.use("/*", function(req,res,next){

    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    res.locals.Drepturi=Drepturi;
    if (req.session.utilizator){

        //aici ne asiguram ca utilizatorul e trimis pe toate paginile (prin locals)
        req.utilizator=res.locals.utilizator=new Utilizator(req.session.utilizator);
    }
    next();
});



//se uitadupa modificari fs.watch()
fs.watch(obGlobal.folderScss,function (eveniment,numeFis){
    if(numeFis[numeFis.length-1]==='~' || path.extname(numeFis)!="scss")
        return;
    // console.log(eveniment,numeFis);
    //daca fis a fost sters tot cu rename apare
    //daca exista il compilez
    if(eveniment=="change" || eveniment=="rename") {
        let caleCompleta=path.join(obGlobal.folderScss,numeFis);
        if(fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }

})


// pt cos virtual

app.use(["/produse_cos","/cumpara"],express.json({limit:'2mb'}));//obligatoriu de setat pt request body de tip json

app.use(["/contact"], express.urlencoded({extended:true}));
/////////////////////////////////////////////






app.post('/mesaj', function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log("primit mesaj")
        //if(conexiune_index){
        //io.sockets.emit('mesaj_nou', fields.nume, fields.culoare, fields.mesaj);
        //}
        res.send("ok");


    });


});


app.post("/produse_cos",function(req, res){
    console.log("PRODUSE COS AOLEU" + req.body);
    //ids_prod -> id-urile din cosul virtual
    if(req.body.ids_prod.length!=0){
        //TO DO : cerere catre AccesBD astfel incat query-ul sa fi `select nume, descriere, pret, gramaj, imagine from prajituri where id in (lista de id-uri)`
        AccesBD.getInstanta().select({tabel:"hotels", campuri:"name,description,price,km,image".split(","),conditiiAnd:[`id in (${req.body.ids_prod})`]},
            function(err, rez){
                if(err)
                    res.send([]);
                else
                    res.send(rez.rows);  //rez.rows e vectorul de inregistrari returnate de select
            });
    }
    else{
        res.send([]);
    }

});


cale_qr=__dirname+"/resurse/imagini/qrcode";
if (fs.existsSync(cale_qr))
    //daca folderul exista ls o noua generare de factura il stergem si il recream iar
    fs.rmSync(cale_qr, {force:true, recursive:true});
fs.mkdirSync(cale_qr);
client.query("select id from hotels", function(err, rez){
    for(let prod of rez.rows){
        let cale_prod=obGlobal.protocol+obGlobal.numeDomeniu+"/hotel/"+prod.id;
        //console.log(cale_prod);
        QRCode.toFile(cale_qr+"/"+prod.id+".png",cale_prod);
    }
});

async function genereazaPdf(stringHTML,numeFis, callback) {
    //puppeteer e motorul grafic al chromeului
    const chrome = await puppeteer.launch();  //lansez chrome in background
    const document = await chrome.newPage();  //deschide in background unn tab nou
    console.log("inainte load")
    await document.setContent(stringHTML, {waitUntil:"load"});

    console.log("dupa load")
    await document.pdf({path: numeFis, format: 'A4'});  //face ca o captura sub forma de pdf a html-ului care ar fi fost randat in pagina
    await chrome.close();  //inchid instanta de chrome
    if(callback)
        callback(numeFis);  //apelez callbackul
}

app.post("/cumpara",function(req, res){
    console.log("AOLEU"+ req.body);
    console.log("Utilizator:", req?.utilizator);
    console.log("Utilizator:", req?.utilizator?.rol?.areDreptul?.(Drepturi.cumparareProduse));  //verif daca utilizatorul logat are dreptul de a cumpara produse
    //in utilizator salvam utilizator logat in sesiunea curenta
    console.log("Drept:", req?.utilizator?.areDreptul?.(Drepturi.cumparareProduse));
    if (req?.utilizator?.areDreptul?.(Drepturi.cumparareProduse)){
        AccesBD.getInstanta().select({
            tabel:"hotels",
            campuri:["*"],
            conditiiAnd:[`id in (${req.body.ids_prod})`]
        }, function(err, rez){
            if(!err  && rez.rowCount>0){  //daca n avem eroare si avem macar o inregistrare generam factura
                console.log("AICI hotels:", rez.rows);
                //rezFacutra contine un string cu html corespunzator randarii lui ejs
                //render folosim cand avem un app.get si transforma un ejs intr-un html
                //la fel face si ejs.render doar ca nu mai face send (cum faceam cu res.render)
                //aici nu il trimitem noi vrem doar sa obtinem html-ul (un string coresp html-ului) pe care il punem in rezFactura
                let rezFactura= ejs.render(fs.readFileSync("./views/pagini/factura.ejs").toString("utf-8"),{
                    protocol: obGlobal.protocol,
                    domeniu: obGlobal.numeDomeniu,
                    utilizator: req.session.utilizator,
                    produse: rez.rows
                });
                console.log(rezFactura);
                //pt fiecare factura fac un fiesier temporar cu factura+timestampul in ms de la 1 ian 1970
                let numeFis=`./temp/factura${(new Date()).getTime()}.pdf`;
                genereazaPdf(rezFactura, numeFis, function (numeFis){
                    mesajText=`Stimate ${req.session.utilizator.username} aveti mai jos rezFactura.`;
                    mesajHTML=`<h2>Stimate ${req.session.utilizator.username},</h2> aveti mai jos rezFactura.`;
                    req.utilizator.trimiteMail("Factura", mesajText,mesajHTML,[{
                        //vectorul de atatsamente din mail
                        filename:"factura.pdf",  //fisiere atasate la mail
                        content: fs.readFileSync(numeFis)
                    }] );
                    res.send("Totul e bine!");
                });

                //salvam facutruile si in in mongo (un fel de log)
                rez.rows.forEach(function (elem){ elem.cantitate=1});
                let jsonFactura= {
                    data: new Date(),
                    username: req.session.utilizator.username,
                    produse:rez.rows
                }
                if(obGlobal.bdMongo){  //mongo e nosql
                    //monogodb ajuta la administarrea mai multor fisisere json
                    //nosql e util atunci cand vrem sa inseram date intr o proporie mai mare decat sa selectm
                    //baza de date sql e optimizat pt selecturi
                    //nosql nu e optimizat pt selecturi complicate
                    obGlobal.bdMongo.collection("facturi").insertOne(jsonFactura, function (err, rezmongo){
                        if (err) console.log(err)
                        else console.log ("Am inserat factura in mongodb");

                        //afisam toate fcaturile
                        obGlobal.bdMongo.collection("facturi").find({}).toArray(
                            function (err, rezInserare){
                                if (err) console.log(err)
                                else console.log (rezInserare);
                            })
                    })
                }
            }
        })
    }
    else{
        res.send("Nu puteti cumpara daca nu sunteti logat sau nu aveti dreptul!");
    }

});

app.get("/grafice", function(req,res){
    if (! (req?.session?.utilizator && req.utilizator.areDreptul(Drepturi.vizualizareGrafice))){
        afisareEroare(res, 403);
        return;
    }
    res.render("pagini/grafice");

})

app.get("/update_grafice",function(req,res){
    obGlobal.bdMongo.collection("facturi").find({}).toArray(function(err, rezultat) {
        res.send(JSON.stringify(rezultat));
    });
})



app.get("/flights", function(req,res) {

    fetch("https://aeroapi.flightaware.com/aeroapi/flights/search?query=-latlong+%2236+-10+70+40%22", {
        method: 'GET',
        headers: {
            'Accept': 'application/json; charset=UTF-8',
            'x-apikey': api_key
        }
    })
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });

});



app.get("/privacy", function(err,res) {
    if (err) {
        console.log(err);
        afisareEroare(res, 404);
    }
    else res.render("pagini/privacy");
});



/*
Metoda use() este folosită pentru a adăuga un middleware pentru cererile de orice tip. Conform specificațiilor, formatul metodei este:
app.use([path,] callback [, callback...])
 */
app.use("/resurse",express.static(__dirname+"/resurse"));
app.use("/node_modules",express.static(__dirname+"/node_modules"));





app.post("/inregistrare",function(req, res){
    var username;
    var poza;
    console.log("ceva");
    var formular= new formidable.IncomingForm()  //obiectul formular va astepta si reconstrui, capta datele din browser din formular
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log("Inregistrare:",campuriText);

        console.log(campuriFisier);
        var eroare="";

        var utilizNou=new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume;  //se apeleaza seter-ul, dar nu scriem ca apel de functie ci punem egal intre functie si parametru
            utilizNou.setareUsername=campuriText.username;
            utilizNou.email=campuriText.email
            utilizNou.prenume=campuriText.prenume
            utilizNou.ocupatie=campuriText.job;
            utilizNou.parola=campuriText.parola;
            utilizNou.culoare_chat=campuriText.culoare_chat;
            utilizNou.data_nastere=campuriText.birth;
            utilizNou.poza= poza;


            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    utilizNou.salvareUtilizator();
                }
                else{
                    eroare+="Mai exista username-ul";
                }

                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})

                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })


        }
        catch(e){
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }




    });
    formular.on("field", function(nume,val){  // 1

        console.log(`--- ${nume}=${val}`);

        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");

        console.log(nume,fisier);
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului
        let folderUser=path.join(__dirname, "poze_uploadate",username);
        //folderUser=__dirname+"/poze_uploadate/"+username
        console.log(folderUser);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser);
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename
        //fisier.filepath=folderUser+"/"+fisier.originalFilename

    })
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    });
});


app.post("/login",function(req, res){
    var username;
    console.log("ceva");
    var formular= new formidable.IncomingForm() //preluare date dintr un formular
    formular.parse(req, function(err, campuriText, campuriFisier ){

        console.log(campuriText);

        Utilizator.getUtilizDupaUsername (campuriText.username,{
            req:req,
            res:res,
            parola:campuriText.parola
        }, function(u, obparam ){
            let parolaCriptata=Utilizator.criptareParola(obparam.parola);
            if(u.parola==parolaCriptata && u.confirmat_mail ){  //daca a apasat pe linkul primit in mail at confirmat mail era true
                u.poza=u.poza?path.join("poze_uploadate",u.username, u.poza):"";
                obparam.req.session.utilizator=u;

                obparam.req.session.mesajLogin="Bravo! Te-ai logat!";
                obparam.res.redirect("/index");
                //obparam.res.render("/login");
            }
            else{
                console.log("Eroare logare")
                obparam.req.session.mesajLogin="Date logare incorecte sau nu a fost confirmat mailul!";
                obparam.res.redirect("/index");
            }
        })
    });
});


app.post("/profil", function(req, res){
    console.log("profil");
    if (!req.session.utilizator){
        randeazaEroare(res,403,)
        res.render("pagini/eroare_generala",{text:"Nu sunteti logat."});
        return;
    }
    var formular= new formidable.IncomingForm();

    //fromular primeste campurile completate de user in campurti text
    formular.parse(req,function(err, campuriText, campuriFile) {

        var parolaCriptata = Utilizator.criptareParola(campuriText.parola);
        // AccesBD.getInstanta().update(
        //     {tabel:"utilizatori",
        //     campuri:["nume","prenume","email","culoare_chat"],
        //     valori:[`${campuriText.nume}`,`${campuriText.prenume}`,`${campuriText.email}`,`${campuriText.culoare_chat}`],
        //     conditiiAnd:[`parola='${parolaCriptata}'`]
        // },


        AccesBD.getInstanta().updateParametrizat(
            {
                tabel: "utilizatori",
                campuri: ["nume", "prenume", "email", "culoare_chat"],
                valori: [`${campuriText.nume}`, `${campuriText.prenume}`, `${campuriText.email}`, `${campuriText.culoare_chat}`],
                conditiiAnd: [`parola='${parolaCriptata}'`, `username='${campuriText.username}'`]
            },
            //aici e functia callback
            function (err, rez) {
                if (err) {

                    //eroare baza date
                    console.log(err);
                    afisareEroare(res, 2);
                    return;
                }
                console.log(rez.rowCount);
                if (rez.rowCount == 0) {
                    res.render("pagini/profil", {mesaj: "Update-ul nu s-a realizat. Verificati parola introdusa."});
                    return;
                } else {
                    //actualizare sesiune
                    console.log("ceva");
                    req.session.utilizator.nume = campuriText.nume;
                    req.session.utilizator.prenume = campuriText.prenume;
                    req.session.utilizator.email = campuriText.email;
                    req.session.utilizator.culoare_chat = campuriText.culoare_chat;
                    res.locals.utilizator = req.session.utilizator;
                }

                res.render("pagini/profil", {mesaj: "Update-ul s-a realizat cu succes."});

            });

    });
});




//aici delogam utilizatorul
app.get("/logout", function(req, res){
    req.session.destroy(); //distrugem sesiune si il stergem din locals
    res.locals.utilizator=null;
    res.render("pagini/logout");

});


app.get("/chat", function (req,res){
        //
        // if(req?.utilizator){
        //         res.render("pagini/chat", );
        //     }
        //
        // else{
        //     //document.getElementsByTagName("main")[0].innerHTML="<p>Nu aveti nimic in cos!</p>";
        //     afisareEroare(res, 403);
        // }

    res.render("pagini/chat");
})



//http://${Utilizator.numeDomeniu}/confirmare/${utiliz.username}/${token}
app.get("/confirmare/:username/:token",function(req,res){  //params sunt :username, :token
    console.log(req.params);
    try {
        /**
         * daca utilizatorul a fost gasit dupa username atunci:
         */
        Utilizator.getUtilizDupaUsername(req.params.username,{res:res,token:req.params.token} ,function(u,obparam){
            /**
             * updatam tabelul utilizatori cu faptul ca mailul a fost confirmat . tokenul e trimis din params in obparam
             */
            AccesBD.getInstanta().update(
                {tabel:"utilizatori",
                    campuri:{confirmat_mail:'true'},
                    conditiiAnd:[`cod='${obparam.token}'`]},
                function (err, rezUpdate){
                    if(err || rezUpdate.rowCount==0){
                        console.log("Cod:", err);
                        afisareEroare(res,3);
                    }
                    else{
                        res.render("pagini/confirmare.ejs");
                    }
                })
        })
    }
    catch (e){
        console.log(e);
        renderError(res,2);
    }
})




app.get("/useri", function(req, res){

    //daca are dreptul de a vizualiza userii atunci selectM DIN TABelul utilizatori
    //fie avem eroare fie trimitem in pgina toate ranruile din tabel
    if(req?.utilizator?.areDreptul?.(Drepturi.vizualizareUtilizatori)){
        AccesBD.getInstanta().select({tabel:"utilizatori", campuri:["*"]}, function(err, rezQuery){
            console.log(err);
            //console.log("DATE USER" + req.utilizator);
            res.render("pagini/useri", {admin_id:req.utilizator.id, useri: rezQuery.rows});
        });
    }
    else{
        afisareEroare(res, 403);
    }
});


app.post("/sterge_utiliz", function(req, res){
    if(req?.utilizator?.areDreptul?.(Drepturi.stergereUtilizatori)){
        var formular= new formidable.IncomingForm();

        formular.parse(req,function(err, campuriText, campuriFile){

            AccesBD.getInstanta().delete({tabel:"utilizatori", conditiiAnd:[`id=${campuriText.id_utiliz}`]}, function(err, rezQuery){
                console.log(err);
                mesajText=`Cu sinceră părere de rău, vă anunțăm că ați fost șters! Adio`;
                mesajHTML=`Cu sinceră părere de rău, vă anunțăm că ați fost șters! Adio.`;
                req.utilizator.trimiteMail("Byebye", mesajText,mesajHTML);

                res.redirect("/useri");

            });
        });
    }else{
        afisareEroare(res,403);
    }
})




app.get("/favicon.ico", function (req,res){
    res.sendFile(__dirname+"/resurse/ico/favicon.ico")
})

//app use trebuie sa se potriveasca doar cu inceputul caii
//app get vrea calea exacta
// app.use("/resurse",function (req,res){
//     res.send("Ceva");
//     console.log(req.originalUrl)
//     console.log(req.url)
// })

//dupa resurse pot sa am oricate /sn8/9w8d/3rd adica oricate combinatii de litere si cifre  de asta am pus *
app.use(/^\/resurse(\/[a-zA-Z0-9]*)*$/,function (req,res) {
    // res.send("Ceva");
    // console.log(req.originalUrl)
    // console.log(req.url)

    afisareEroare(res,403)

})

app.get("/ceva", function(req,res) {
    // console.log("cale:",req.url)
    res.send("altceva ip:"+req.ip)
})


app.get(["/index", "/","/home", "/login" ], async function(req,res) {

    let sir=req.session.mesajLogin;
    req.session.mesajLogin=null;

    //generare evenimente random pentru calendar
    // var texteEvenimente=["Eveniment important", "Festivitate", "Prajituri gratis", "Zi cu soare", "Aniversare"];
    // dataCurenta=new Date();
    // for(i=0;i<texteEvenimente.length;i++){
    //     evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), Math.ceil(Math.random()*27) ), text:texteEvenimente[i]});
    // }
    // console.log(evenimente)
    // console.log("inainte",req.session.mesajLogin);


    res.render("pagini/index",{ip:req.ip, a:10, b:20,imagini:obGlobal.obImages.imagini, mesajLogin:sir
       // , evenimente:evenimente
    });
})

/*
app.get("/despre", function(req,res) {
    res.render("pagini/despre");  //ce am scris aici e locals
})
*/


//vreau fisierele cu expresia ejs
// in regex \w inseamana orice caracter alfanumeric (wildcard)
// ^\w+\.ejs$



app.get("/produse",function(req, res){


    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura

    //putem avea un singu res.render

    client.query("select * from unnest(enum_range(null::categ_prajitura))", function (err,rezCategorie) {
        if(err){
            console.log(err);
        }
        else {
            let conditieWhere="";
            if(req.query.tip)
                conditieWhere=`where tip_produs='${req.query.tip}'`;
            client.query("select * from prajituri "+conditieWhere , function( err, rez){  //fac al doilea query in callbackul primului
                console.log(300)
                if(err){
                    console.log(err);
                    afisareEroare(res, 2);
                }
                else
                    res.render("pagini/produse", {produse:rez.rows, optiuni:rezCategorie.rows});
                    // console.log(rezCategorie.rows);
            });

        }
    })




});



//HOTELS
app.get("/hotels",function(req, res){


    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura

    //putem avea un singu res.render

    client.query("select * from unnest(enum_range(null::accomodation_type))", function (err,rezCategorie) {
        if(err){
            console.log(err);
        }
        else {
            let conditieWhere="";
            if(req.query.tip)
                conditieWhere=`where home_type='${req.query.tip}'`;
            client.query("select * from hotels" +
                " "+conditieWhere , function( err, rez){  //fac al doilea query in callbackul primului
                console.log(300)
                if(err){
                    console.log(err);
                    afisareEroare(res, 2);
                }
                else
                    res.render("pagini/hotels", {produse:rez.rows, optiuni:rezCategorie.rows, optiuni_food: obGlobal.optiuniFood });
                // console.log(rezCategorie.rows);
            });

        }
    })

});




// :id ->query parametrizat
app.get("/produs/:id",function(req, res){
    console.log(req.params);

    client.query(`select * from prajituri where id = ${req.params.id}`, function( err, rezultat){
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});




//HOTELS
app.get("/hotel/:id",function(req, res){
    console.log(req.params);

    client.query(`select * from hotels where id = ${req.params.id}`, function( err, rezultat){
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else
            res.render("pagini/hotel", {prod:rezultat.rows[0]});
    });
});





app.get("/*.ejs",function (req,res){
    afisareEroare(res,400);
})



app.get("/*",function(req,res){  //functia function data ca parametu e callback (fucntie asincrona)
    try {
        res.render("pagini" + req.url, function (err, rezRandare) {
            if (err) {
                console.log(err);
                if (err.message.startsWith("Failed to lookup view"))
                    //afisareEroare(res,{_identificator:404,_titlu:"ceva"});
                    afisareEroare(res, 404, "titlu custom");
                else afisareEroare(res);
            } else {
                // console.log(rezRandare);
                res.send(rezRandare);
            }


        }); //cerere generala
    }catch(err) {
        if (err.message.startsWith("Cannot find module"))
            //afisareEroare(res,{_identificator:404,_titlu:"ceva"});
            afisareEroare(res, 404, "titlu custom");
        else afisareEroare(res);
    }
});




function initErrors(){
    var continut = fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8"); //daca nu are var sau let e globala
    //console.log(continut);
    obGlobal.obErrors=JSON.parse(continut);
    let vErrors=obGlobal.obErrors.info_erori;
    //for(let i=0; i<vErrors.length;i++)
    for(let eroare of vErrors){
        eroare.imagine="/"+obGlobal.obErrors.cale_baza+"/"+eroare.imagine;


    }
}

initErrors();


function initImages(){
    var continut = fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8"); //daca nu are var sau let e globala
    obGlobal.obImages=JSON.parse(continut); //transformam intr un obiect cu ajutorul lui parse. va avea 2 proprieteati imagini si cale
    let vImages=obGlobal.obImages.imagini;
    let caleAbs=path.join(__dirname, obGlobal.obImages.cale_galerie);
    let caleAbsMediu=path.join(caleAbs,"mediu");
    if(!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    //for(let i=0; i<vErrors.length;i++)
    for(let imag of vImages){
        //eroare.imagine="/"+obGlobal.obErrors.cale_baza+"/"+eroare.imagine;
        [numeFis,ext]=imag.cale_relativa.split(".");
        let caleFisAbs=path.join(caleAbs,imag.cale_relativa);
        let caleFisMediuAbs=path.join(caleAbsMediu,numeFis+".webp"); //webp are factor de compresie mai bun
        sharp(caleFisAbs).resize(400).toFile(caleFisMediuAbs);
        imag.fisier_mediu="/"+path.join(obGlobal.obImages.cale_galerie,"mediu",numeFis+".webp");
        imag.cale_relativa="/"+path.join(obGlobal.obImages.cale_galerie,imag.cale_relativa);
    }
}

initImages();


// const resizeImage = () => {
//     const resize = sharp('./images/robo.jpg')
//         .resize(350, 260)
//         .toFile(__dirname + '/processed_images/resize_robo.jpg')
//
//     console.log(resize)
// }
//
// resizeImage()





//daca prgramatorul seteaza titlul, se ia titlul din argument
//daca nu e setat se ia cel din json
//daca nu ave, titlul nici in json se ia titlul de la valoare default
//idem pt celelalte

//function afisareEroare(res,{_identificator, _titlu, _text, _imagine} ={} )
function afisareEroare(res,_identificator, _titlu="titlu default", _text,_imagine){
    let vErrors=obGlobal.obErrors.info_erori;
    let eroare=vErrors.find(function (elem) {return elem.identificator===_identificator; })
    if(eroare) {
        let titlu1= _titlu==="titlu default" ?( eroare.titlu || _titlu): _titlu;
        let text1= _text || eroare.text;
        let imagine1= _imagine || eroare.imagine;
        if(eroare.status)
            res.status(eroare.identificator).render("/pagini/eroare",{titlu:titlu1, text:text1, imagine:imagine1});
        else
            res.render("/pagini/eroare",{titlu:titlu1, text:text1, imagine:imagine1});

    }
    else
    {
        let errDef=obGlobal.obErrors.eroare_default;
        res.render("/pagini/eroare",{titlu:errDef.titlu, text:errDef.text, imagine:errDef.imagine});
    }

}


app.listen(8001);

console.log("Server ON");

//galeria animata o fac cu for in scss


// AccesBD.getInstanta().delete({
//         tabel: "utilizatori",
//         conditiiAnd: [`id=${campuriText.id_utiliz}`, `parola='${parolaCriptata}'`]
//     },
//     function (err, rez) {
//
//         if (err) {
//
//             //eroare baza date
//             console.log(err);
//             afisareEroare(res, 2);
//             return;
//         }
//         console.log(rez.rowCount);
//         if (rez.rowCount == 0) {
//             res.render("pagini/profil", {mesaj: "Stergerea nu s-a realizat. Verificati parola introdusa."});
//             return;
//         }
//
//         res.render("pagini/profil", {mesaj: "Stergerea s-a realizat cu succes."});
//
//
//     });
//