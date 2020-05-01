# Codeforces Bot

This is a bot for competative programmers to help setting up things as fast as possible.

This bot fetch how many problems there are in a contest and for each problem it fatches test cases and create directory for individual problem. It also copies a template file to each problem folder.

# Installation

```
    npm i -g cfbot
```

# Usage

### Get contest by id

```
    cfbot get --id <contest_id>
```

or

```
    cfbot get -i <contest_id>
```

Here's an Example

```
    cfbot get --id 1348
```

### Get contest by url

```
    cfbot get --url <contest_url>
```

or

```
    cfbot get -u <contest_url>
```

Here's an example

```
    cfbot get --url https://codeforces.com/contest/1348
```

### Other commands

For checking version

```
    cfbot -V
```

For help

```
    cfbot -h
    cfbot --help
    cfbot get -h
```
