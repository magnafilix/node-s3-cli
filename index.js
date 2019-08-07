const fs = require('fs')
const AWS = require('aws-sdk')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config()

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const BUCKET = process.env.BUCKET_NAME
const FLAG = process.argv[2]
const ARGV_3 = process.argv[3]
const ARGV_4 = process.argv[4]

const uploadFileToBucket = () => fs.readFile(ARGV_3, (err, file) => {
  if (err) return console.log(err)

  const pathHasSlash = ARGV_3.indexOf('/') > -1
  const fileName = pathHasSlash && ARGV_3.split('/').pop()

  const params = {
    Bucket: BUCKET,
    Key: (fileName || `file(${new Date().toJSON()})`),
    Body: JSON.stringify(file, null, 2)
  }

  S3.upload(params, (err, data) => {
    if (err) return console.log(err)
    console.log(`File uploaded successfully at ${data.Location}`.bgGreen)
  })
})

const listFiles = async (byMatch = false) => {
  let isTruncated = true
  let marker

  while (isTruncated) {
    const params = { Bucket: BUCKET }
    if (marker) params.Marker = marker

    try {
      const response = await S3.listObjects(params).promise()

      if (byMatch) {
        const regexFlags = ARGV_4
        const regex = new RegExp(ARGV_3, regexFlags)

        response.Contents.forEach(item => item.Key.match(regex) && console.log(`${item.Key}`.cyan))
      } else {
        response.Contents.forEach(item => console.log(`${item.Key}`.cyan))
      }

      isTruncated = response.IsTruncated
      if (isTruncated) marker = response.Contents.slice(-1)[0].Key

    } catch (error) {
      console.log(error)
    }
  }
}

const deleteFilesByMatch = async () => {
  const keysToRemove = await listFilesByMatch()

  S3.deleteObjects(
    {
      Bucket: BUCKET,
      Delete: {
        Objects: keysToRemove
      }
    }, (err, res) => {
      if (err) return console.log(err)
      console.log(res)
    }
  )
}

//---> LIST ALL BUCKET FILES
if (FLAG === '--list' && !ARGV_3) return listFiles()

//---> UPLOAD LOCAL FILE TO A BUCKET
if (FLAG === '--upload' && ARGV_3) return uploadFileToBucket()

//---> LIST FILES FILTERED/MATCHED
if (FLAG === '--list' && ARGV_3) return listFiles(true)

//---> DELETE FILES FILTERED/MATCHED
if (FLAG === '--delete' && ARGV_3) return deleteFilesByMatch()

//---> WRONG COMMAND HANDLER
console.log(`The command was not recognized`.bgRed)