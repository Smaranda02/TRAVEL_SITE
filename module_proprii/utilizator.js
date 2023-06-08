const AccesBD=require('./accesbd.js');
const parole=require('./parole.js');

const {RolFactory}=require('./roluri.js');
const crypto=require("crypto");  //pt criptarea parolei
const nodemailer=require("nodemailer");


/**
 * @class
 * @classdesc definim datele generale despre server

 */
class Utilizator{
    static tipConexiune="local";
    static tabel="utilizatori"
    static parolaCriptare="tehniciweb";
    static emailServer="sitewebnici@gmail.com";
    static lungimeCod=64;
    static numeDomeniu="localhost:8000";
    #eroare;

    /**
     *
     * Creeam un utilizator conform datelor necesare in formularul de inregistrare
     * @constructor
     * @param {number} id id-ul userului
     * @param {string} username
     * @param {string} nume
     * @param {string} prenume
     * @param {string} email
     * @param {string} parola
     * @param {string} rol
     * @param {string} culoare_chat
     * @param  poza
     */
    constructor({id, username, nume, prenume,ocupatie="nu vreau sa spun", email, parola, rol, culoare_chat="black",  data_nastere="1970-01-01", poza}={}) {
        this.id=id;

        //optional sa facem asta in constructor
        try{
        if(this.checkUsername(username))
            this.username = username;
        }
        catch(e){ this.#eroare=e.message}

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }
        if(this.rol)
            this.rol=this.rol.cod? RolFactory.creeazaRol(this.rol.cod):  RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare="";
    }

    /**
     * Verificam daca numele e format doar din litere si e nenul
     * @param nume
     * @return {false|*}
     */
    checkName(nume){
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
    }

    /**
     * Setam numele doar daca e format doar din litere si e nenul
     * @param nume
     */
    set setareNume(nume){
        if (this.checkName(nume)) this.nume=nume
        else{
            throw new Error("Nume gresit")
        }
    }

    /*
    * folosit doar la inregistrare si modificare profil
    */
    /**
     * Setam username-ul doar daca e format doar din litere si cifre si e nenul
     * @param username
     */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }


    /**
     * Verificam daca username-ul e format doar din litere si cifre si e nenul
     * @param username
     * @return {false|*}
     */
    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }

    /**
     *
     * @param {string} parola parola care trebuie criptata
     * @return {string}
     */
    static criptareParola(parola){
        return crypto.scryptSync(parola,Utilizator.parolaCriptare,Utilizator.lungimeCod).toString("hex");
    }

    /**
     * daca nu a fost gasit utilizatorul in baza de date cand cautam in index.js in app.post(/inregistrare) atunci il aduagam
     */
    salvareUtilizator(){

        let parola=this.parola;

        let parolaCriptata=Utilizator.criptareParola(this.parola);
        let utiliz=this;
        let token=parole.genereazaToken(100);
        /**
         * inserez in tabelul de utilizatori
         */
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel,
            campuri:{
                username:this.username,
                nume: this.nume,
                prenume:this.prenume,
                ocupatie:this.ocupatie,
                parola:parolaCriptata,
                email:this.email,
                culoare_chat:this.culoare_chat,
                data_nastere:this.data_nastere,
                cod:token,
                poza:this.poza}
            }, function(err, rez){
            if(err)
                console.log(err);
            else
                /**
                 * setam argumentele pentru functia trimiteMail
                 */
                utiliz.trimiteMail("Cont nou","Username-ul tau este "+utiliz.username,
            `<h1>Bine ai venit în comunitatea WonderWorld!</h1><p style='color:blue'>Username-ul tau este <b style="color: #0c4128">${utiliz.username}.</b></p> <p><a href='http://${Utilizator.numeDomeniu}/confirmare/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
            )
        });
    }
//xjxwhotvuuturmqm


    /**
     *
     * @param subiect - subiectul mailului
     * @param mesajText - continutul mailului
     * @param mesajHtml - contine si linkul de confirmare pe langa mesaj
     * @param atasamente
     * @returns {Promise<void>}
     */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:Utilizator.emailServer,
                pass:"afyaxsziebogbtbt"  //app passwordul generat de noi
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
   
    static async getUtilizDupaUsernameAsync(username){
        if (!username) return null;
        try{
            let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]
            });
            if(rezSelect.rowCount!=0){
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e){
            console.log(e);
            return null;
        }
        
    }

    /**
     *
     * @param username
     * @param obparam
     * @param proceseazaUtiliz - este o functie apelata in index.js in app.post(/inregistrare) in blocul try
     * @returns {null} daca nu am furnizat un username returnam null
     */
    static getUtilizDupaUsername (username,obparam, proceseazaUtiliz){
        if (!username) return null;
        let eroare=null;

        /**
         * ne folosim de query builder si cautam username-ul in BD
         * -2 este eroare la BD, iar -1 inseamna ca nu exista utilizatori
         */
        AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",campuri:['*'],conditiiAnd:[`username='${username}'`]}, function (err, rezSelect){
           let u=null;
            if(err){
                console.error("Utilizator:", err);
                console.log("Utilizator",rezSelect.rows.length);
                //throw new Error()
                eroare=-2;
            }

            //daca n a gasit niciun utilizator
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})

            else {  //doar daca nu am eroare creez utilizatorul
                u = new Utilizator(rezSelect.rows[0]);
            }

            proceseazaUtiliz(u, obparam, eroare);
        });
    }


    /**
     * Verifica daca userl are dreptul primit ca parametru
     * @param  drept
     * @return {boolean}
     */
    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }
}
module.exports={Utilizator:Utilizator}