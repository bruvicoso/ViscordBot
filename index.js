const config = require("./config.json");
const binds = require("./binds.json");
const fs = require("fs");

const giphy = require('giphy-api')('mby82rmhIEMbF3H6U1GVLoM6rjUfKEZv');

const Discord = require('discord.js');
const bot = new Discord.Client();


bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);  // ${client.user.tag} - Nome do bot com tag
    bot.user.setActivity("Eu, Robô !", { type: "WATCHING" });
});

bot.on("message", async message => {
    if (message.author.bot) return;
    // if(message.channel.type === "dm") return;

    let prefix = config.discord.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    // LEMBRETES
    if (cmd === `${prefix}lembrete`) {
        let commands = `
        host_writeconfig nomeConfig
        cl_downloadfilter "none"
        cl_crosshair_sniper_width "1"
        m_rawinput "1"
        `;

        return message.channel.send(commands);
    }

    if(cmd === `${prefix}random`){
        let random = '';
        let query = messageArray[1];

        if (typeof query == 'undefined') {
            query = 'fail';
        }

        giphy.random(query).then(function (res) {
            random = res.data.image_url;

            let botembed = new Discord.RichEmbed()
                // .setColor("#000000")
                .setImage(random)
                .setFooter("Ref: giphy", "https://media.giphy.com/media/ToMjGpFB8ONlhzUK5Hi/giphy.gif");

            return message.channel.send(botembed);
        })
        .catch(function (err) {
            console.error(err);
            return message.channel.send(":shit: Erro ao buscar uma imagem !");
        });
    }

    // LEMBRETES
    if (cmd === `${prefix}help`) {

        // let botembed = new Discord.RichEmbed()
        //     .setColor("#ffffff")
        //     .addField("\u200b", `${arrayBinds[ranBind].bind} \n \u200b`);

        // Italics: \* italics\* or \_italics\_
        // Underline italics: \_\_\* underline italics\*\_\_
        // Bold:	** bold ** Underline bold	__ ** underline bold ** __
        // Bold Italics *** bold italics *** underline bold italics	__ *** underline bold italics *** __
        // Underline	__underline__	Strikethrough	 ~~Strikethrough~~

        let text = `Lista de comandos:
    
        **!bind:**  \*Mostra uma bind aleatoria\*
        **!random:**  \*Mostra uma imagem random.\* - __Parametros:__ Nome qualquer - \*Apenas uma palavra Ex: gato\*
    `;

        return message.channel.send(text);
    }

    // BINDS RANDOM
    if (cmd === `${prefix}bind`) {
        let arrayBinds = binds;
        let ranBind = Math.floor(Math.random() * arrayBinds.length);
        let date = new Date();
        let arrdate = date.toString().split(" ");
        let url_avatar = '';

        if(typeof arrayBinds[ranBind].user_id !== 'undefined'){
            let id = arrayBinds[ranBind].user_id;

            await bot.fetchUser(id)
            .then(user => {
                if (user.avatarURL !== null){
                    let verify = user.avatarURL.slice(user.avatarURL.length - 4, user.avatarURL.length);
                    if(verify === "2048"){
                        url_avatar = user.avatarURL.slice(0, user.avatarURL.length-4);
                        url_avatar = url_avatar + "64";
                    } else {
                        url_avatar = user.avatarURL;
                        console.log(url_avatar);
                    }
                }
                
            }, err => { console.log(err) })
        }else{
            url_avatar = 'https://i.imgur.com/uDXoLsE.gif';
        }
        
        // console.log(arrdate[3]); ANO AGORA
        let botembed = new Discord.RichEmbed()
            .setColor("#ff6600")
            .setAuthor(arrayBinds[ranBind].author)
            .setThumbnail(url_avatar)
            .addField("\u200b", `${arrayBinds[ranBind].bind} \n \u200b`)
            .setFooter(`#${arrayBinds[ranBind].id}  |   Criada em: ${arrayBinds[ranBind].created_at}`);

        return message.channel.send(botembed);
    }

    // BINDS EDIT
    if (cmd === `${prefix}add`) {
        if (messageArray.length > 1) {
            return message.channel.send("OK");
        } else {
            let text = `:warning: Comando incorreto:

            ***Exemplo***
            !add Digite sua bind aqui @AutorDaBind`;

            return message.channel.send(text);
        }
    }

    // BINDS EDIT
    if (cmd === `${prefix}edit`) {
        if (messageArray.length > 2) {

            let id = messageArray[1].slice(1, messageArray[1].length) - 1;
            let slicekey = messageArray.slice(2, messageArray.length).toString();
            let arrkey = slicekey.split(":");
            let key = arrkey[0];
            let slicemsg = messageArray.slice(3, messageArray.length).toString();
            let text = slicemsg.replace(",", " ");

            console.log("key:", key);
            console.log("text:", text);

            binds[`${id}`][`${key}`] = text;

                let teste = JSON.parse(binds);


            console.log(binds[`${id}`]);

            fs.writeFile("./binds.json", binds.toString(), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });



        } else if (messageArray.length == 2) {
            let text = `:warning: Descrever o que deseja alterar:

            *Exemplos*
            !edit    #999  autor:ViscordBot
            !edit    #999  bind:Escreve a bind completa
            !edit    #999  ano:2019`;

            return message.channel.send(text);
        } else {

            let text = `:warning: Falta parametros:
            
            *Exemplos*
            !edit    #999  autor:ViscordBot
            !edit    #999  bind:Escreve a bind completa
            !edit    #999  ano:2019`;

            return message.channel.send(text);
        }
    }


    function searchImg(json) {
        
        let id = Math.floor(Math.random() * json.data.length);
        let id2 = Math.floor(Math.random() * json.data[id].images.length);

        let type = json.data[id].images[id2].type;

        console.log(type);
        if (type === 'video/mp4') {
            return json.data[id].images[id2].gifv;
        } else {
            return json.data[id].images[id2].link;
        }
        
    }

});

bot.login(config.discord.token);