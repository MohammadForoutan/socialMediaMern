const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const cors = require('cors');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const messageRoute = require('./routes/message');
const conversationRoute = require('./routes/conversation');
const { verify } = require('./middlewares/auth');

dotenv.config();

mongoose.connect(
	process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log('mongodb is connect');
	}
);

// multer config
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/images');
	},
	filename: (req, file, cb) => {
		cb(
			null,
			req.body.name
			// `${file.fieldname}-${Math.random()}-${Date.now()}-${
			// 	file.originalname
			// }`
		);
	},
});
const upload = multer({ storage });

// middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.post('/api/upload', verify, upload.single('file'), async (req, res) => {
	res.status(200).json('File uploaded');
});

app.post(
	'/api/upload/avatar',
	verify,
	upload.single('file'),
	async (req, res) => {
		req.user.avatar = req.file.filename;
		await req.user.save();
		res.status(200).json('File uploaded');
	}
);

app.post(
	'/api/upload/cover',
	verify,
	upload.single('file'),
	async (req, res) => {
		req.user.cover = req.file.filename;
		await req.user.save();
		res.status(200).json('File uploaded');
	}
);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.use((error, req, res, next) => {
	console.log(error);
	res.status(500).json('500 something wrong in server');
});

module.exports = app;
