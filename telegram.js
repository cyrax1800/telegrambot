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
function calculateNewTime(fromId) {
  var currentTime = moment()
  var predictedTime = moment().seconds(10)
  var diffTime = predictedTime.diff(currentTime)
  bot.sendMessage(fromId, "current: " + currentTime.format() + "\nExpected: " + predictedTime.format() + "\nDiffTime: " + diffTime);
  if(diffTime > 0) {
      timeInterval = diffTime
  } else if (diffTime == 0) {
      timeInterval = 60000
  } else {
      timeInterval = 60000 + diffTime
  }
}


function runNotif(fromId) {
  calculateNewTime(fromId)
  if(timeInterval < 0) {
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
