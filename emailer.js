const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const config = require('./config/database');

// Setting up mongodb connection
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
	console.log('Emailer Connected to database ' + config.database);
});

mongoose.connection.on('error', (err) => {
	console.log('Emailer Database error: ' + err);
});

// User Schema
const UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
})

const User = module.exports = mongoose.model('User', UserSchema);


function sendEmail(user, tweetData) {
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
        	user: '...',
        	pass: '...'
    	}
	});

	const mailOptions = {
		from: '...', // sender address
		to: user.email, // list of receivers
		subject: 'New tweet from TwitterAlerts!', // Subject line
		html: '<p>' + tweetData.text + '</p>'// plain text body
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if(err)
			console.log(err)
		else
			console.log(info);
	});
}

module.exports.alertUsers = function(tweetData) {
	User.find({}, function(err, users) {
		if (err) throw err;
		users.forEach(function (myUser) {
			sendEmail(myUser, tweetData);
		});
	});
}