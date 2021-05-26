const TelegramBot = require("node-telegram-bot-api");
const CONFIG = require("./config/config.json");
const dbf = require("./db_functions/db_functions");
const cron = require("node-cron");
const controller = require("./controller/controller");
const bot = new TelegramBot(CONFIG.TOKEN, {polling: true});

require("https")
    .createServer()
    .listen(process.env.PORT || 5000)
    .on("request", function (req, res) {
        res.end("");
    });

//------------------------Cron every 5 minute---------------------------
cron.schedule('0 * * * * Mon,Tues,Wed,Thurs,Fri,Sat,Sun', async () => {
    let data = await controller.validatorSender(await dbf.getAllUsers());
    for (let i = 0; i < data.send.length; i++) {
        try {
            await bot.sendMessage(data.send[i].chatId, `Внимание Напоминание!\n${data.send[i].text}`);
        } catch (error) {
            // if user is block bot -> delete all him records
            if (error.response.statusCode === 403) {
                await dbf.deleteUser({chatId: data.send[i].chatId});
            }
        }
    }
    for (let i = 0; i < data.arrDel._id.length; i++) {
        try {
            await dbf.deleteUser({_id: data.arrDel._id[i]});
        } catch (error) {
            console.log(error);
        }
    }
});
//-------------------------------------------------------

/*bot.onText("/\/start/", async (msg) => {
 try {
 await bot.sendMessage(msg.chat.id, "<b>Введите данные в формате</b>: \n     <b>Количество дней</b>: где 0 - сегодня , 1 - завтра и т.д. \n     <b>В какое время уведомлять</b>: 08-00 15-25 19-05\n     (минимальное число для минут - 5. <u>Такой формат не работает: 15-03</u>) \n     <b>Текст задачи</b>: Покормить кошку. \n \n <b>Пример</b>: 2, 13-30, 09-00, 08-45, зарядка \n ");
 } catch (err) {
 console.log(err);
 }
 });*/

bot.on("message", async (msg) => {
    try {
        await bot.sendMessage(msg.chat.id, "<b>Примеры</b>:\n 2, 13-30 09-00 08-45, Зарядка \n 1, 08-05, Автобус!!!", {
            parse_mode: "HTML",
        });
        await bot.sendMessage(msg.chat.id, `${await controller.chackAndSave({text, chat, date, message_id} = msg)}`);
    } catch (err) {
        return console.log(err);
    }
});