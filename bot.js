var Twit = require('twit');
var config = require('./config/twitter');
var emailer = require('./emailer');

var T = new Twit(config);

var keyword = '...'; // The keyword to track
var streamParams = {
	follow: '...' // The ID number fo the user to track
}

var stream = T.stream('statuses/filter', streamParams);
stream.on('tweet', filterTweets);

function filterTweets(input) {
	if (input.text.toLowerCase().includes(keyword)) {
		console.log(input);
		emailer.alertUsers(input);
	}
}