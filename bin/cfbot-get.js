const program = require('commander')

program.option('-i, --id <type>', 'get contest by id')
program.option('-u, --url <type>', 'get contest by url')
program.action(() => {
    if (program.url) {
        console.log(program.url)
    } else if (program.id) {
        console.log(program.id)
    } else {
        console.log('You need to enter an id or an url of a contest')
    }
})
program.parse(process.argv)
