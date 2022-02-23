const axios = require('axios');
const tmi = require('tmi.js');
require('dotenv').config()

// Populate with the light id's you want to change
const lightIds = [1, 2, 3];
// twitch channel name
const channelName = 'imbasaurtv';

const colorDictionary = {
    "red": { hue: 0, sat: 254, bri: 254, on: true },
    "blue": { bri: 254, hue: 47158, sat: 254, on: true },
    "purple": { bri: 254, hue: 49863, sat: 254, on: true },
    "green": { bri: 254, hue: 24555, sat: 254, on: true },
    "pink": { bri: 254, hue: 54568, sat: 254, on: true },
    "orange": { bri: 254, hue: 3687, sat: 252, on: true },
    "yellow": { bri: 254, hue: 10635, sat: 254, on: true },
    "white": { bri: 254, hue: 41278, sat: 67, on: true },
}

const client = new tmi.Client({
    connection: {
        reconnect: true
    },
    channels: [channelName]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(message);
    if (message[0] == '!') {
        let splitMessage = message.split(" ");
        if (splitMessage.length == 2 && splitMessage[0].toLowerCase() == "!color") {
            updateAllLights(splitMessage[1]);
        }
    }
});

const updateAllLights = (color) => {
    lightIds.forEach(id => controlLight(id, color))
}

const controlLight = async (lightId, color) => {
    try {
        colorValue = colorDictionary[color.toLowerCase()];
        if (color.toLowerCase() == "random") {
            colorValue = getRandomColor();
        }
        if (colorValue) {
            return await axios.put(
                `http://${process.env.HUE_BRIDGE_IP}/api/${process.env.HUE_USERNAME}/lights/${lightId}/state`,
                colorValue
            )
        }
    } catch (error) {
        console.error(error);
    }
}

const getRandomColor = () => {
    return {
        bri: 254,
        sat: 254,
        hue: Math.floor(Math.random() * 65535) + 1,
        on: true
    }
}

