const mongoose = require ("mongoose")

let validatephone = function(phone){
    phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
}

let validateEmail = function(email) {
    let emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return emailRegex.test(email)
}

const userSchema = new mongoose.Schema({
    title : {
        type :  String,
        required: [true, "Title is required"],
        enum : ["Mr", "Mrs", "Miss"],
        trim : true
    },
    name: {
        type: String,
        required: [true, " Name is required"], 
        trim : true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim : true,
        validate:[validatephone, "Please enter a valid phone number"]
    },
    email : {
        type: String,
        lowercase: true,
        required: [true, " E-mail address is required"],
        trim: true,
        unique: true,
        validate:[validateEmail, "Please enter a valid E-mail address"]
    },
    password: {
        type: String,
        minlength : 8,
        maxlength : 15,
        required: [true, " Password is required"]
    },
    address: {
        street: String ,
        city: String,
        pincode: String
    }

}, {timestamps: true})

module.exports = mongoose.model("User",userSchema)
