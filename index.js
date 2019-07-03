const fs = require('fs')
const uuid = require('uuid')
const AWS = require('aws-sdk')
const colors = require('colors')

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const FLAG = process.argv[2]
const NAMEorPATH = process.argv[3]

//---> LISTING FILES FROM A BUCKET
if (FLAG === '-lf')
  return S3.listObjects({ Bucket: (NAMEorPATH || 'lcloud-427-ts') }, (err, files) => {
    if (err) throw err
    console.log(files)
  })


if (FLAG === '-uf' && NAMEorPATH)
  return fs.readFile(NAMEorPATH, (err, file) => {
    if (err) throw err

    const pathHasSlash = NAMEorPATH.indexOf('/') > -1
    const fileName = pathHasSlash && NAMEorPATH.split('/').pop()

    const params = {
      Bucket: 'lcloud-427-ts',
      Key: (fileName || `file(${new Date().toJSON()})`),
      Body: JSON.stringify(file, null, 2)
    }

    S3.upload(params, (err, data) => {
      if (err) throw err
      console.log(`File uploaded successfully at ${data.Location}`.bgGreen)
    })
  })

//---> WRONG COMMAND HANDLER
console.log(`The command was not recognized`.bgRed)