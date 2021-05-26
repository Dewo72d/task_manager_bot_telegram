const UserModel = require("../schema/schema");

exports.fullUser = (chatId, name, text, count, date, time) => {
    return new UserModel({
        name: name,
        chatId: chatId,
        cronTime: time,
        dateStart: new Date().getTime(),
        count: count,
        text: text
    });
};

/*-------------Delete user-------------- */
exports.deleteUser = async (id) => {
    return await UserModel.deleteMany(id, (err) => {
        if (err) return console.log(err);
        return console.log("DONE DELETE");
    });
};
/*------------------------------------ */
/*---------------Get all Users----------*/
exports.getAllUsers = async () => {
    return UserModel.find({}, (err, result) => {
        if (err) return err;
        return result;
    });
};
/*------------------------------------ */