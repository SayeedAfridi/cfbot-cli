const program = require('commander')
const contest = require('../lib/contest')

program.option('-i, --id <type>', 'get contest by id')
program.option('-u, --url <type>', 'get contest by url')
program.action(() => {
    if (program.url) {
        contest.getContestByUrl(program.url)
    } else if (program.id) {
        contest.getContestById(program.id)
    } else {
        console.log(
            'You need to enter an id or an url of a contest. EX: cfbot get --id 1348'
        )
    }
})
program.parse(process.argv)
