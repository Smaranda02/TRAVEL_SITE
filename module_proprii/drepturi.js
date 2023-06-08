
/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara

 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
 @property {Symbol}  editareBazaDate Dreptul de a edita BD cu produse/utilizatori
 @property {Symbol} adaugareUtilizatori Dreptul de a adauga noi useri in BD
 @property {Symbol} editareCookies Dreptul de a edita cookiurile de pe site
 @property {Symbol} editareContinut Dreptul de a modifica continutul afisat pe pagina clientilor
 */


/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
	vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
	stergereUtilizatori: Symbol("stergereUtilizatori"),
	cumparareProduse: Symbol("cumparareProduse"),
	vizualizareGrafice: Symbol("vizualizareGrafice"),
	editareBazaDate : Symbol("editareBazaDate"),
	adaugareUtilizatori: Symbol("adaugareUtilizatori"),
	editareCookies : Symbol("editareCookies "),
	editareContinut : Symbol("editareContinut")

}

module.exports=Drepturi;