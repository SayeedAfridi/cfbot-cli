const axios = require('axios')
const cheerio = require('cheerio')

const BASE_URL = 'https://codeforces.com'

exports.getContestById = async (id) => {
    try {
        console.log(`getting data from ${BASE_URL}/contest/${id}`)
        const res = await axios.get(`${BASE_URL}/contest/${id}`)
        getTotalProblemsFromHtml(res.data)
    } catch (error) {
        console.log(error.message)
    }
}

exports.getContestByUrl = async (url) => {
    try {
        console.log(`getting data from ${url}`)
        const res = await axios.get(url)
        getTotalProblemsFromHtml(res.data)
    } catch (error) {
        console.log(error.message)
    }
}

const getTotalProblemsFromHtml = (html) => {
    const data = []
    const $ = cheerio.load(html)
    console.log('parsing...')
    $('tr td.id a').each((i, elem) => {
        problem_url = 'https://codeforces.com' + $(elem).attr('href')
        console.log(problem_url)
    })
}
