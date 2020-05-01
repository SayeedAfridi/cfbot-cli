const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

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
        getTestCaseFromProblemUrl(problem_url)
    })
}

const getTestCaseFromProblemUrl = async (url) => {
    try {
        const problem = url.substring(url.lastIndexOf('/') + 1)
        const dir = `${process.cwd()}/${problem}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        const res = await axios.get(url)
        getTestCaseFromProblemHtml(dir, res.data, problem)
    } catch (error) {
        console.log(error.message)
    }
}

const getTestCaseFromProblemHtml = (dir, html, problem) => {
    let template
    if (fs.existsSync(`${process.cwd()}/template.cpp`)) {
        template = `${process.cwd()}/template.cpp`
    } else {
        template = `${path.join(__dirname, 'static')}/template.cpp`
    }
    fs.copyFileSync(template, `${dir}/sol_${problem && problem}.cpp`)
    const data = []
    const $ = cheerio.load(html)
    $('div.input').each((i, elem) => {
        data[i] = {
            ...data[i],
            input: $(elem).text().substring('Input'.length),
        }
    })
    $('div.output').each((i, elem) => {
        data[i] = {
            ...data[i],
            output: $(elem).text().substring('Output'.length),
        }
    })
    console.log(`Found ${data.length} test case(s) for Problem ${problem}`)
    data.forEach((test, i) => {
        fs.writeFile(`${dir}/in${i + 1}.txt`, test.input, function (err) {
            if (err) {
                console.log(err)
            }
            console.log(`The file ${dir}/in${i + 1}.txt was saved!`)
        })
        fs.writeFile(`${dir}/out${i + 1}.txt`, test.output, function (err) {
            if (err) {
                console.log(err)
            }
            console.log(`The file ${dir}/out${i + 1}.txt was saved!`)
        })
    })
}
