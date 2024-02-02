const redis = require('redis');

let client = redis.createClient();
client.connect()

const setData = async (token, data) => {
    await client.set(token, data);
}

const getData = async (token) => {
    return await client.get(token);
}

const delData = async (token) => {
    await client.del(token);
}

module.exports = { setData, getData, delData }