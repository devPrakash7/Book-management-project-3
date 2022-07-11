const mongoose = require ("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId



const bookSchema = new mongoose.Schema({
    title : {
        type :  String,
        required: [true, "Book title is required"],
        unique: true,
        trim : true
    },
    excerpt: {
        type :  String,
        required: [true, "Book excerpt are required"],
        trim : true
    },
    userId : {
        type:ObjectId,
        trim:true,
        refs: "User"
    },
    ISBN : {
        type :  String,
        required: [true, "ISBN number is required"],
        unique: true,
        trim : true
    },
    category: {
        type :  String,
        required: [true, "Category is required"],
        trim : true
    },
    subcategory: {
        type :  ['String'],
        required: [true, "Subcategory is required"],
        trim : true
    },
    reviews: {
        type : Number, 
        default: 0,         //// Holds number of reviews of this book
    },
    bookcover:{type : String},
     
    isDeleted: {
        type: Boolean, 
        default: false
    },
    releasedAt: {
        type: Date, 
        required: [true, "Book release date is required"], 
    }

},{timestamps:true})

module.exports = mongoose.model("book",bookSchema)