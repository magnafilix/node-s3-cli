const fs = require('fs')
const uuid = require('uuid')
const AWS = require('aws-sdk')
const colors = require('colors')

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

if (process.argv[2] === '-lf')
  return S3.listObjects({ Bucket: (process.argv[3] || 'lcloud-427-ts') }, (err, files) => {
    if (err) return console.log(`Error listing files ${err.message && `: ${err.message}`}`.red)
    console.log(files)
  })

console.log(`The command was not recognized`.bgRed)