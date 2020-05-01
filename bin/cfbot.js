#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .command('get', 'get contest from codeforces')
    .parse(process.argv)
