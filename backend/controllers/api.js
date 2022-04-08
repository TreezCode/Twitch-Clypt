const axios = require('axios')

const api = axios.create({
    headers: {
        'Client-ID': process.env.CLIENT_ID,
        'Authorization': `Bearer ${process.env.GET_TOKEN}`
    }
})

module.exports = {
    api
}