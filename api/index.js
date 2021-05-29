const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const messageRoute = require('./routes/message');
const conversationRoute = require('./routes/conversation');

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
		cb(null, 'public/images');
	},
	filename: (req, file, cb) => {
		cb(
			null,
			req.body.name
		);
	}
});
const upload = multer({ storage });

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cookieParser())
app.use("/images",express.static(path.join(__dirname, 'public', 'images')));

app.post('/api/upload', upload.single('file'), (req, res) => {
	res.status(200).json('File uploaded');
});
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.listen(8800, () => {
	console.log('server is running');
});
