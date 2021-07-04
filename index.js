const dotenv = require('dotenv');
const reddit = require('./reddit');
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.login(TOKEN);


dotenv.config();
(async () => {

    try{
    await reddit.initialize('memes');

    let results = await reddit.getResults(10);
    console.log(results);
    }catch(e){
        console.log(e);
    }


})();