# node-s3-cli

## commands

avoid using these []  
they are only to show where info should be put

```bash
--list
--list [regex, without //] [optional regex flags, default flag  'g']
--upload [local file path]
--delete [regex, without //] [optional regex flags, default flag is 'g']
```

live examples
imaginary file name: file1.docx

```bash
node index --list
node index --list docx gi
node index --upload ~/Desktop/file.docx
node index --delete file
```