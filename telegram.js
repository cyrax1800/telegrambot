var TelegramBot = require('node-telegram-bot-api');

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
function runNotif(fromId) {
  timerknock = setTimeout(function () {
      bot.sendMessage(fromId, "lol");
      runAtDate();
  }, 5);
}

bot.onText(/\/runnotif/, function (msg) {
  var fromId = msg.from.id;
  runNotif(fromId)
});

bot.onText(/\/stopnotif/, function (msg) {
  clearTimeout(timerknock);
});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  // photo can be: a file path, a stream or a Telegram file_id
  var photo = 'cats.png';
  bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
});
