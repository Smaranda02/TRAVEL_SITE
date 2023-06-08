
const Drepturi=require('./drepturi.js');


/**
 * Definim o clasa de baza, ca o interfata, care definiste un rol pe care il pot avea cei care acceseaza site-ul, acestea derivandu-se din sablonul
 * de baza al clasei rol
 * @class
 */
class Rol{


    /**
     * Functia tip() statica (nu necesita crearea unui obiect Rol pentru a fi apelata) ne da rolul default "generic"
     * @returns {string} returnam rolul uzual/default numit generic
     */
    static get tip() {return "generic"}

    /**
     * Functia drepturi() ne returneaza drepturile default
     * @returns {*[]} returnam o lista vida intrucat by default un user nu are drepturi
     */
    static get drepturi() {return []}

    constructor (){
        this.cod=this.constructor.tip;
    }


    /**
     * Se verifica in lista de drepturi posibile daca are dreptul precizat ca parametru
     * @param {string} drept pe care vrem sa l verificam daca il are un anumit user
     * @return {boolean} returneaza true sau false in functie de daca are dreptul primit ca parametr sau nu
     */
    areDreptul(drept){ //drept trebuie sa fie tot Symbol
        console.log("in metoda rol!!!!")
        return this.constructor.drepturi.includes(drept); //pentru ca e admin
    }
}

/**
 * @class RolAdmin mosteneste clasa Rol si defineste rolul de administrator al site-ului
 */
class RolAdmin extends Rol{


    /**
     * Se returneaza tipul dee admin
     * @return {string}
     */
    static get tip() {return "admin"}

    /**
     *
     * @constructor
     * apelam construnctorul clasei parinte cu metoda super()
     */
    constructor (){

        super();
    }


    /**
     * Inturcat e admin are dreptul sa faca de aceea se retunreaza true
     * @return {boolean} se returneaza true pentru orice tip de drept
     */
    areDreptul(){
        return true; //pentru ca e admin
    }
}


/**
 * Clasa moderator
 * @class
 */
class RolModerator extends Rol{

    /**
     *
     * @return {string}
     */

    static get tip() {return "moderator"}

    /**
     * Moderatorul are rolul de a vizualiza si de a sterge utilizatori
     * @returns {symbol[]}
     */
    static get drepturi() { return [
        Drepturi.vizualizareUtilizatori,
        Drepturi.stergereUtilizatori
    ] }
    constructor (){
        super()
    }
}

/**
 * Se creeaza si rolul uilizatorului vizitator sau logat
 * @class
 *
 * @returns {symbol[]} userul comun are dreptul de a cumpara produse
 */
class RolClient extends Rol{
    static get tip() {return "comun"}
    static get drepturi() { return [
        Drepturi.cumparareProduse
    ] }
    constructor (){
        super()
    }
}


/**
 * Se creeaza o clasa bazata pe design patternul Factory care creeaza in functie de rolul cerut, cate un obiect specific clasei rolului
 * @class
 */
class RolFactory{

    /**
     * @param {string} tip Verifica de care tip e rolul primit ca parametru
     * @return {Rol} se returneaza un nou obiect din clasa ceruta
     */
    static creeazaRol(tip) {
        switch(tip){
            case RolAdmin.tip : return new RolAdmin();
            case RolModerator.tip : return new RolModerator();
            case RolClient.tip : return new RolClient();
        }
    }
}


module.exports={
    RolFactory:RolFactory,
    RolAdmin:RolAdmin
}