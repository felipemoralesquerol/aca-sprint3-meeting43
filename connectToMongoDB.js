const mongoose = require('mongoose');

const schema = { name: String, lastName: String, age: Number }
const Users = mongoose.model("Users", schema);

const uri = process.env.MONGODB_URI;

mongoose.connect(uri);


exports.addNewUser = async function addNewUser() {
    // Datos fijos!
    const newPerson = { name: "Juan", lastName: "Perez", age: 24 };
    let newUser = new Users(newPerson);

    return await newUser.save();
}

exports.getAllUsers = async function getAllUsers() {
    return await Users.findOne({ name: "Juan" });
}
