var TelegramBot = require('node-telegram-bot-api');
var moment = require('moment')

var token = '639750851:AAEFhGOkWaK7PuJndnC5zUHahMuHRcLXKwM';
// Setup polling way
var bot = new TelegramBot(token, { polling: true });

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.chat.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

function regexifyOptions(array) {
  return new RegExp(array.toString().replace(/,/g, '|'));
}

var songsArray = [
  "/Glass_Bead",
  "/Me_Gustas_Tu",
  "/Rough",
  "/Navillera",
  "/Fingertip",
  "/Love_Whisper",
  "/Summer_Rain",
  "/Time_For_The_Moon_Night",
  "/Sunny_Summer",
  "/Memoria",
]

var group = {};
var timeScheduleInterval = {}

var timerknock;
var timeInterval = 0;
function calculateNewTime(fromId, isAnnounceBefore = true) {
  var currentTime = moment()
  var predictedTime = moment().hours(6).minutes(50).seconds(0) // 10 menit sebelum stand up
  if (!isAnnounceBefore) {
    predictedTime = moment().hours(7).minutes(0).seconds(0)
  }
  var diffTime = predictedTime.diff(currentTime)
  if (diffTime < 0 && isAnnounceBefore) {
    calculateNewTime(fromId, !isAnnounceBefore)
    return
  }
  // bot.sendMessage(fromId, "current: " + currentTime.format() + "\nExpected: " + predictedTime.format() + "\nDiffTime: " + diffTime);
  if (diffTime > 0) {
    timeInterval = diffTime
  } else if (diffTime == 0) {
    timeInterval = 86400000
  } else {
    timeInterval = 86400000 + diffTime
  }
  var targetTime = currentTime.clone().milliseconds(timeInterval)
  if (targetTime.days() == 0) { // Sunday 
    timeInterval += 86400000
  } else if (targetTime.days() == 6) { // Saturday
    timeInterval += 86400000 * 2
  }
  timeScheduleInterval[fromId] = timeInterval
  targetTime = currentTime.clone().milliseconds(timeInterval)
  // bot.sendMessage(fromId, "Will Stand Up " + currentTime.to(targetTime) + "\nJam: " + predictedTime.format() +  "\nJam: " + currentTime.format()+  "\nJam: " + targetTime.format())
  runNotif(fromId, isAnnounceBefore)
}

function runNotif(fromId, isAnnounceBefore) {
  if (timeInterval < 0) {
    bot.sendMessage(fromId, "silahkan jalankan /run lagi");
    return;
  }
  group[fromId] = setTimeout(function () {
    var date = moment()
    if (isAnnounceBefore)
      bot.sendMessage(fromId, "Hello Fans, This Fans Meeting will be held in 10 Minutes, Just prepare yourself to meet with this cute Eunha <3 \n With Love.. h3h3")
    else
      bot.sendMessage(fromId, "Yuk Stand Up yang remote masuk hangout yahhh <3 \n\n https://hangouts.google.com/hangouts/_/bukalapak.com/ngobrol");
    calculateNewTime(fromId, !isAnnounceBefore)
  }, timeInterval);
}

bot.onText(/\/run/, function (msg) {
  // var fromId = msg.from.id;
  var fromId = msg.chat.id;
  if (fromId in group) {
    if (group[fromId] == null){
      bot.sendMessage(fromId, "Hello, I'm Eunha from GFriend. I will remind you for daily standUp Meeting. Saranghae <3.")
      calculateNewTime(fromId)
    }else
      bot.sendMessage(fromId, "jalankan /stop dulu");
  } else {
    bot.sendMessage(fromId, "Hello, I'm Eunha from GFriend. I will remind you for daily standUp Meeting. Saranghae <3.")
    calculateNewTime(fromId)
  }
});

bot.onText(/\/info/, function (msg) {
  var fromId = msg.chat.id;
  if (fromId in timeScheduleInterval) {
    bot.sendMessage(fromId, "Ih.. gak sabaren banget sih untuk tau kapan standup. masih ada sisa waktu " + moment(timeScheduleInterval[fromId]).toNow(true) + ". atau gk sabaran ketemu saya? <3");
  } else {
    bot.sendMessage(fromId, "Ooops, maaf fans Eunha, belum ada schedule untuk next event nih, coba jalankan /run dulu, mana tau doa dari kamu dapat Eunha kabulkan <3.")
  }
  // calculateNewTime(fromId)
});

bot.onText(/\/stop/, function (msg) {
  var fromId = msg.chat.id;
  if(fromId in group) {
    clearTimeout(group[fromId]);
    delete group[fromId]
    bot.sendMessage(fromId, "Goodbye my fans, I will miss you all. I always in your heart. If you miss me, you can call /run and I will join you again. <3.")
  } else {
    bot.sendMessage(fromId, "I already don't remind in this group again. Please if you miss me, just call /run and I will at your service. <3.")
  }
});

bot.onText(/\/sing/, function (msg) {
  var fromId = msg.chat.id;
  var text = "Mau nyanyi lagu apa? \n\n"
  songsArray.forEach(element => {
    text += element + "\n"
  });
  text += "\nPlease Choose one of above, and i will sing for you <3"
  bot.sendMessage(fromId, text)
});

bot.onText(regexifyOptions(songsArray), function (msg, match) {
  var fromId = msg.chat.id;
  var resp = match[0];
  bot.sendMessage(fromId, resp)
  // var index = songsArray.indexOf(resp)
  // switch (index) {
  //   case 0:
  //     break;
  //   case 1:
  //     break;
  //   case 2:
  //     break;
  //   case 3:
  //     break;
  //   case 4:
  //     break;
  //   case 5:
  //     break;
  //   case 6:
  //     break;
  //   case 7:
  //     break;
  //   case 8:
  //     break;
  //   case 9:
  //     break;
  //   default:
  //     break;
  // }
})