# node-s3-cli

## commands

avoid using these []  
they are only to show where info should be put

```bash
--list
--list [regex, not /regex/] [regex flags]
--upload [local file path]
--delete [regex, not /regex/] [regex flags]
```

live examples
imaginary file name: file1.docx

```bash
node index --list
node index --list docx gi
node index --upload ~/Desktop/file.docx
node index --delete file
```