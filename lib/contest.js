const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const Spinner = require('cli-spinner').Spinner
let spinner = null

const BASE_URL = 'https://codeforces.com'
const createNewSpinner = (str) => {
    if (spinner !== null) {
        spinner.stop()
        process.stdout.write('\n')
    }
    spinner = new Spinner(str)
    spinner.setSpinnerString(27)
    spinner.start()
    if (str === 'Done!') {
        spinner.stop()
        process.stdout.write('\n')
        return
    }
}
exports.getContestById = async (id) => {
    try {
        createNewSpinner(`getting data from ${BASE_URL}/contest/${id}`)
        const res = await axios.get(`${BASE_URL}/contest/${id}`)
        await getTotalProblemsFromHtml(res.data)
    } catch (error) {
        console.log(error.message)
    }
}

exports.getContestByUrl = async (url) => {
    try {
        createNewSpinner(`getting data from ${url}`)
        const res = await axios.get(url)
        await getTotalProblemsFromHtml(res.data)
    } catch (error) {
        console.log(error.message)
    }
}

const getTotalProblemsFromHtml = async (html) => {
    createNewSpinner(`Parsing Html`)
    const $ = cheerio.load(html)
    process.stdout.write('\n')
    $('tr td.id a').each(async (i, elem) => {
        problem_url = 'https://codeforces.com' + $(elem).attr('href')
        await getTestCaseFromProblemUrl(problem_url)
    })
}

const getTestCaseFromProblemUrl = async (url) => {
    try {
        const problem = url.substring(url.lastIndexOf('/') + 1)
        const dir = `${process.cwd()}/${problem}`
        if (!fs.existsSync(dir)) {
            createNewSpinner(`Creating Directory for problem ${problem}`)
            fs.mkdirSync(dir)
        }
        createNewSpinner(`Getting test cases of problem ${problem}`)
        const res = await axios.get(url)
        await getTestCaseFromProblemHtml(dir, res.data, problem)
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
    createNewSpinner(`Copying template for solution ${problem}`)
    fs.copyFileSync(template, `${dir}/sol_${problem && problem}.cpp`)
    const data = []
    createNewSpinner(`Parsing test case(s) of problem ${problem}`)
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
    createNewSpinner(
        `writing ${data.length} test case(s) of problem  ${problem}`
    )
    data.forEach((test, i) => {
        fs.writeFile(`${dir}/in${i + 1}.txt`, test.input, function (err) {
            if (err) {
                console.log(err)
            }
        })
        fs.writeFile(`${dir}/out${i + 1}.txt`, test.output, function (err) {
            if (err) {
                console.log(err)
            }
        })
    })
    createNewSpinner('Done!')
}
