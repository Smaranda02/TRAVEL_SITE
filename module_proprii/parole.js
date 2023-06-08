/**
 *
 * @typedef {string}  sirAlphaNum contine toate literle mari,mici si cifrele
 * @typedef {number[] } v_intervale contine codurile ASCII ale literelor mari,mici,cifrelor
 */
sirAlphaNum="";
v_intervale=[[48,57],[65,90],[97,122]]
for(let interval of v_intervale){
    for(let i=interval[0]; i<=interval[1]; i++)
        sirAlphaNum+=String.fromCharCode(i)
}


/**
 * Generam un token de identificare spefic fiecarui user in parte
 * @param n - numarul de caractere dorite in token
 * @returns {string}  se returneaza tokenul creat din n caractere random din sirAlphaNum
 */
function genereazaToken(n){
    let token="";
    for (let i=0;i<n; i++){
        token+=sirAlphaNum[Math.floor(Math.random()*sirAlphaNum.length)]
    }
    return token;
}

module.exports.genereazaToken=genereazaToken;