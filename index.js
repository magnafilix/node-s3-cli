const fs = require('fs')
const uuid = require('uuid')
const AWS = require('aws-sdk')
const colors = require('colors')

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const BUCKET_NAME = 'lcloud-427-ts'
const FLAG = process.argv[2]
const ARGV_3 = process.argv[3]

//---> LIST BUCKET FILES
if (FLAG === '--list' && !ARGV_3)
  return S3.listObjects({ Bucket: BUCKET_NAME }, (err, files) => {
    if (err) throw err
    console.log(files)
  })

//---> LIST FILES BY PREFIX
if (FLAG === '--list' && ARGV_3)
  return S3.listObjects({ Bucket: BUCKET_NAME, Prefix: ARGV_3 }, (err, files) => {
    if (err) throw err
    console.log(files)
  })

//---> UPLOAD LOCAL FILE TO BUCKET
if (FLAG === '--upload' && ARGV_3)
  return fs.readFile(ARGV_3, (err, file) => {
    if (err) throw err

    const pathHasSlash = ARGV_3.indexOf('/') > -1
    const fileName = pathHasSlash && ARGV_3.split('/').pop()

    const params = {
      Bucket: BUCKET_NAME,
      Key: (fileName || `file(${new Date().toJSON()})`),
      Body: JSON.stringify(file, null, 2)
    }

    S3.upload(params, (err, data) => {
      if (err) throw err
      console.log(`File uploaded successfully at ${data.Location}`.bgGreen)
    })
  })

//---> DELETE FILES BY PREFIX
if (FLAG === '--delete' && ARGV_3)
  return S3.listObjects({ Bucket: BUCKET_NAME, Prefix: ARGV_3 }, (err, files) => {
    if (err) throw err
    if (files && files.Contents) {
      const keysToRemove = files.Contents.map(file => ({ Key: file.Key }))
      S3.deleteObjects(
        {
          Bucket: BUCKET_NAME,
          Delete: {
            Objects: keysToRemove
          }
        }, (err, res) => {
          if (err) throw err
          console.log(res)
        }
      )
    }
  })

//---> WRONG COMMAND HANDLER
console.log(`The command was not recognized`.bgRed)