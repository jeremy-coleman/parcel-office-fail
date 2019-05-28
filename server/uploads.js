//@ts-check
const express = require("express")
const bodyParser = require("body-parser")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

const upload = multer({})

const app = express()
app.use(express.static("public"))
app.use(require("cors")())
app.use(bodyParser.json())

app.post("/fileupload", upload.any(), (req, res) => {
  let userAccount = req.userAccount || "guest"
  console.log("Fileupload called on server, with " + JSON.stringify(req.files.length) + " files.")

  if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads")
    console.log("Folder created ./uploads")
  }

  let files = req.files

  try {
    files.map((file) => {
      console.log("File being uploaded " + file.originalname)

      fs.writeFile("./uploads/" + userAccount + "_" + file.originalname, file.buffer, "binary", (err) => {
        if (err) {
          res.send("Error uploading file " + file.originalname)
        }
      })
    })
  } catch (e) {
    res.send("Error uploading files.")
  }

  res.send(`${files.length} file(s) uploaded.`)
})

app.listen(3000, () => {
  console.log("Server listening at port 3000.")
})
