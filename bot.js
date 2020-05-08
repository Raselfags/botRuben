var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var ultimoUser = '';
var numComandos = 0;
var entra = true;
const mysql = require("mysql");


function randomizar(s){
    var palabras = s.split(' ');
    var longitud = palabras.length;
    var numero = (Math.floor(Math.random() * longitud-1) + 1) 
    var res = palabras.splice(numero).toString().replace(/,/gi, " ")
    return res

}

function esEmote(mensaje){
    if (mensaje.toString().includes(":")) return true
    else return false
}

function esComando(mensaje){
    if (mensaje.substring(0, 1) == "-") return true
    else return false
}

function esEnlace(mensaje){
    if (mensaje.substring(0,4) == "http") return true
    else return false
}
var con = mysql.createConnection({
       host: "localhost",
       user: "root",
       password: "",
       database: "db_ruben"
});

con.connect(err => {
    if(err) throw err;
    console.log("Connected To Database!");
    con.query("SHOW TABLES", console.log);

});


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '+') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'welcome':
                bot.sendMessage({
                    to: channelID,
                    message: 'Enhorabuena Rasel, has aprendido a hacer que un bot diga algo. Tu familia debe de estar orgullosa'
                });
            break;
            // Just add any case commands if you want to..
         }
     }


     if (message.substring(0, 1) == '-'){
         entra = true;
        if(ultimoUser == user)
        {
            numComandos = numComandos + 1;
            if(numComandos > 2){
            
            bot.sendMessage({
                to: channelID,
                message: 'Ya te vale ' + user + ', deja de usar los putos comandos' 
                
            });
            entra = false;

        }
        }
        else {numComandos = 0}
        if(entra){
        var args = message.substring(1).split(' ');
        var comando = args[0];
        var a = args[2];
        var res;
        res = args.splice(1).toString();
        switch(comando){
            case 'joder':
                if(a == 'Ruben'){
                    bot.sendMessage({
                        to: channelID,
                        message: 'Jodete @Dartex#4658 '
                    });
                }
                else{
                    bot.sendMessage({
                        to: channelID,
                        message: 'Jodete '+a,
                        files: ["./nostal/Suso.jpg"]
                        });                   
                }
                break;
            case 'suso':
               
                
                bot.sendMessage({
                    to: channelID,
                    message: '<:pepelaugh:618809772711346236>'
                    
                });

                
                break;
            
            case 'baila':
                bot.sendMessage({
                    to: channelID,
                    message: '<a:yaiaspaz:560306058535370773>'
                });
                break;

            case 'addQuote':
                res = res.replace(/,/gi, " ");
                con.query("insert into tbfrasesruben (frase) values ('"+ res +"')" ,function (err, result, fields) {
                    // if any error while executing above query, throw error
                    if (err) throw err;
                    // if there is no error, you have the result
                    console.log(result);
                  });
                  break;

            case 'quote':

                var respuesta;

                con.query("SELECT * FROM tbfrasesruben ORDER BY RAND() LIMIT 3", function (err, result, fields) {
                     if (err) throw err;
                     var f1 = randomizar(result[0].frase.toString());
                     var f2 = randomizar(result[1].frase.toString());
                     var f3 = randomizar(result[2].frase.toString());
                     console.log(f1)
                     console.log(f2)
                     console.log(f3)

                     respuesta = f1+ " " + f2 + " " + f3;
                     console.log(respuesta)
                        bot.sendMessage({
                        to: channelID,
                        message: respuesta
                        });
                     });
                     ultimoUser = user;
                     break;

        
            case 'rate':
                res = res.replace(/,/gi, " ");
                var respuesta;
                var random = (Math.floor(Math.random() * 101)) 
                respuesta = 'I give ' + res + ' a rate of ' + random +'/100'
                bot.sendMessage({
                    to: channelID,
                    message: respuesta
                    });
                 ultimoUser = user;
                 break;

            case 'talk':

                con.query("SELECT * FROM tbfrasesruben WHERE frase like '%" +res + "%' ORDER BY RAND() LIMIT 1", function (err, result, fields) {

                    if(result.length > 0){
                    bot.sendMessage({
                        to: channelID,
                        message: result[0].frase.toString()
                        });
                    }
                    else {
                        bot.sendMessage({
                            to: channelID,
                            message: "No se han encontrado resultados, por favor pongase en contacto con el verdadero Ruben (de momento) para que el personalmente añada esa frase al diccionario."
                            });
                    }

                    ultimoUser = user;
                });
                



            


        }
    }



     }

     if(user == 'Suso' && message == "<:sadpepe:230440573469851649>"){
        bot.uploadFile({
            to: channelID,
            file: "./nostal/Suso.jpg"
            }); 
       

     }

     if(user == 'Dartex'){

        if(message == '' || esEmote(message) || esEnlace(message) || esComando(message)) { var aaaa = 1}
        else{
        con.query("insert into tbfrasesruben (frase) values ('"+ message +"')" ,function (err, result, fields) {
            // if any error while executing above query, throw error
            if (err) throw err;
            // if there is no error, you have the result
            console.log(result);
          });
       
        }
     }

});