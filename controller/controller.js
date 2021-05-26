const mongoose = require("mongoose");
const cron = require("node-cron");
const CONFIG = require("../config/config.json");
const dbf = require("../db_functions/db_functions");
const db = mongoose.connection;

/*-----------Conncet to MongoDb-------------- */
mongoose.Promise = global.Promise;
mongoose
    .connect(`${CONFIG.MONGO}`, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Done connection!");
    })
    .catch((err) => console.log(`mongoDB ERROR!!!\n ${err}`));
/*------------------------------------ */

/*--------------Valid and Save------------------ */
exports.chackAndSave = async () => {
    try {
        if (typeof text === "undefined") return "Неверный формат, внесите данные корректно."; // check for other data (picture, music, etc)
        let data = text.split(",");
        if (data.length > 3 || data.length < 3 || isNaN(data[0]) || +(data[0]) > 10 || +(data[0]) <= 0) return "Неверный формат, внесите данные корректно.";
        let cronTime = data[1].trim().split(" "); // сlean cron time from shelupon (rubbish)

        let cleanCronTime = [];
        for (let i = 0; i < cronTime.length; i++) { // check format cron time
            if (cronTime[i].indexOf("-") !== 2 || cronTime[i].split("-")[1] > 59 || cronTime[i].split("-")[0] > 23) { // check for more "-"
                return "Неверный формат времени.";
            }
            +function async() { //clean out of symbols
                cleanCronTime.push(cronTime[i].replace(/[^\-\d]/g, ''));
                return cleanCronTime;
            }();
        }
        dbf.fullUser(+(chat.id), chat.first_name, data[2], data[0].trim(), date, cleanCronTime).save((err, user) => {
            err === true ? console.log(`Save Error: ${err}`) : "Отправил!";
        });
        return "Успешно!";
    } catch (err) {
        console.log(err);
    }
};
/*------------------------------------ */

/*-----------Send tusks------------ */
exports.validatorSender = (res) => {
    let now = new Date().getTime();
    let arrDel = {_id: []};
    let arrValid = [];
    let send = [];
    for (let i = 0; i < res.length; i++) {
        //Check for valid DATE
        +function () {
            if (Math.ceil(Math.abs(now - new Date(res[i].dateStart).getTime()) / (1000 * 3600 * 24)) > res[i].count) return arrDel._id.push(res[i]._id);
            arrValid.push(res[i]);//Valid data
            return null;
        }();
    }
    +function () {
        for (let i = 0; i < arrValid.length; i++) {
            for (let ii = 0; ii < arrValid[i].cronTime.length; ii++) { //loop of cron values  for check on valid
                let cronTime = arrValid[i].cronTime[ii].split("-"); //converting cron values
                let cronDate = new Date(new Date().setHours(+(cronTime[0]), +(cronTime[1]))).getTime();//creat DATE from cron values
                if (Date.now() === cronDate) {
                    send.push(arrValid[i]);
                }
            }
        }
        return null;
    }();
    return ({arrDel, send});
};
/*------------------------------------ */