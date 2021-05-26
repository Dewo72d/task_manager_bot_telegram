const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
    name: String,
    chatId: Number,
    cronTime: Array,
    dateStart: Date,
    count: Number,
    text: String,
});
const User = mongoose.model("all-info", schema);

module.exports = User;
