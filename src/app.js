const express = require('express')
const app = express()
const path = require('path')
const multer  = require('multer')

const Api = require('./api')

const router = express.Router()
var upload = multer()

const api = new Api()

app.use(express.static('src/public'))
app.use('/', router)

router.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'))
})

router.post('/upload', upload.single('file'), async function (req, res, next) {

	if (!req.file) return res.status(500).send('File not uploaded')

	const buffer = req.file.buffer

	try {
		const id = await api.upload(buffer)
		res.status(200).send(`Ok`)
	} catch (err) {
		res.status(500).send(err.message)
	}

})

app.listen(process.env.PORT || 3310, () => console.log(`Example app listening on port ${process.env.PORT || 3310}!`))