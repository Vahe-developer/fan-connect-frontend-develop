const translationFile = process.argv[2]
const findFile        = process.argv[3]
const outputFile      = process.argv[4]

const translations = require(translationFile)
const fs           = require('fs')
var walk           = require('walk')

var files = []

// Walker options
var walker = walk.walk(findFile, {followLinks: false})

walker.on('file', function (root, stat, next) {
    // Add this file to the list of files
    files.push(root + '/' + stat.name)
    next()
})

walker.on('end', function () {
    let notFoundedFiles = {}

    Object.keys(translations)
        .filter(
            transKey =>
                !transKey.includes('topic.') ||
                !transKey.includes('bot.') ||
                !transKey.includes('app.') ||
                !transKey.includes('backend.')
        )
        .map((transKeys) => {

            let founded = false

            files.forEach((key) => {

                if (!key.includes('json')) {

                    const text = fs.readFileSync(key).toString()

                    if (text.includes(transKeys)) {
                        founded = true
                        return
                    }
                }
            })

            if (!founded) {
                notFoundedFiles[transKeys] = ''
            }
        })

    console.log(Object.keys(notFoundedFiles).length)

    fs.writeFile(outputFile, JSON.stringify(Object.keys(notFoundedFiles)), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.")
            return console.log(err)
        }

        console.log("JSON file has been saved.")
    })
})

/*
run for backend
node scripts/find-in-files.js ../frontoutput.json ../fan-connect-backend/app/src backoutput.json

run for frontend
node scripts/find-in-files.js ../src/translations/de.json ./src frontoutput.json
 */

