var TelegramBot = require('node-telegram-bot-api');
var moment = require('moment')

var token = '639750851:AAEFhGOkWaK7PuJndnC5zUHahMuHRcLXKwM';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp + "lol");
});

var timerknock;
var timeInterval = 0;
function calculateNewTime() {
  var currentTime = moment()
  var predictedTime = moment().second(10)
  var diffTime = predictedTime.subtract(currentTime).millisecond()
  if(diffTime >= 0) {
      timeInterval = diffTime
  } else {
      timeInterval = 60 - diffTime
  }
}


function runNotif(fromId) {
  calculateNewTime()
  if(timeInterval <= 0) {
    bot.sendMessage(fromId, "silahkan jalankan /runnotif lagi");
    return;
  }
  timerknock = setTimeout(function () {
    var date = moment()
      bot.sendMessage(fromId, date.format());
      runNotif(fromId)
  }, timeInterval);
}

bot.onText(/\/runnotif/, function (msg) {
  var fromId = msg.from.id;
  if(timerknock == null)
    runNotif(fromId)
  else 
    bot.sendMessage(fromId, "jalankan /stopnotif dulu");
});

bot.onText(/\/stopnotif/, function (msg) {
  clearTimeout(timerknock);
  timerknock = null
});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  // photo can be: a file path, a stream or a Telegram file_id
  var photo = 'cats.png';
  bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
});
