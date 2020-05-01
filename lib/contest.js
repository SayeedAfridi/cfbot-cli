const axios = require('axios')

const BASE_URL = 'https://codeforces.com'

exports.getContestById = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}/contest/${id}`)
        console.log(res)
    } catch (error) {
        console.log(error.message)
    }
}

exports.getContestByUrl = async (url) => {
    try {
        const res = await axios.get(url)
        console.log(res)
    } catch (error) {
        console.log(error.message)
    }
}
