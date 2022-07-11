const reviewModel = require("../Models/reviewModel")
const bookModel = require("../Models/bookModel")
const mongoose = require('mongoose')



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true
}

const isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}

const ratingRegex = /^[1-5]$/

const createReview = async function (req, res) {
    try {
        let requestBody = req.body
        let bookId = req.params.bookId
        let { rating, review } = requestBody

        //-----------------------------   validations start from here   ----------------------------------//

        if (!isValidRequestBody(requestBody)) 
        return res.status(400).send({ status: false, message: "Invalid request parameters.Please provide review details" })

        if (!isValidRequestBody(bookId)) 
        return res.status(400).send({ status: false, message: "Invalid request parameters.Please provide Book id" })

        if (!isValidObjectId(bookId)) 
        return res.status(400).send({ status: false, message: "Please provide valid book Id" })


        if (!isValid(rating)) 
        return res.status(400).send({ status: false, message: "Rating is required." })

        if (!ratingRegex.test(rating)) 
        return res.status(400).send({ status: false, message: " Rating should be on a scale of 1-5." })

        if (!isValid(review)) 
        return res.status(400).send({ status: false, message: "Review is required." })


        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!findBook) 
        return res.status(404).send({ status: false, message: "No document found with this book Id or it maybe deleted" })

        const  filterReview = ({bookId:bookId, reviewedBy:requestBody.reviewedBy, rating:rating, review:review,reviewedAt:Date.now()})

        const newReview = await reviewModel.create(filterReview)

        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },{ $inc: { reviews: +1 }},{updatedAt:Date.now()}) //reviews increament

        return res.status(201).send({ status: true, message: "new review created successfully", data: newReview })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        let data = req.body

        //-----------------------------   validations start from here   ----------------------------------//

        if (!isValidRequestBody(data)) 
        return res.status(400).send({ status: false, message: "Invalid request parameters.Please provide the fields that you want to update" })

        if (!isValidObjectId(bookId)) 
        return res.status(400).send({ status: false, message: "Please provide valid book Id" })

        if (!isValidObjectId(reviewId)) 
        return res.status(400).send({ status: false, message: "Please provide valid review Id" })


        const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!findBook) 
        return res.status(404).send({ status: false, message: "No book found or it maybe deleted" })

        const findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })

        if (!findReview) 
        return res.status(404).send({ status: false, message: "No review found or it maybe deleted" })

        

        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId },{reviewedBy:data.reviewedBy,rating:data.rating, review:data.review},{ new:true,updatedAt: Date.now()})


        return res.status(200).send({ status: true, message: "successfully updated", data: updatedReview })


    }
    catch (err) {
        return res.status(500).send({ status: false, message: "error", error: err.message })
    }
}

const deleteReview = async function(req,res){
    try{
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        //-----------------------------   validations start from here   ----------------------------------//

        if (!isValid(bookId)) 
        return res.status(400).send({ status: false, message: "book Id is required." })

        if (!isValid(reviewId)) 
        return res.status(400).send({ status: false, message: "Review Id is required." })

        if (!isValidObjectId(bookId)) 
        return res.status(400).send({ status: false, message: "Please provide valid book Id" })

        if (!isValidObjectId(reviewId)) 
        return res.status(400).send({ status: false, message: "Please provide valid review Id" })


        const findBook = await bookModel.findOne({_id : bookId, isDeleted:false})

        if(!findBook) 
        return res.status(404).send({status:false, message:"No book found with this Id"})

        const findReview = await reviewModel.findOne({_id:reviewId, isDeleted: false})
        
        if(!findReview) 
        return res.status(404).send({status:false, message:"No review found with this Id"})

        const deletedReview = await reviewModel.findOneAndUpdate({_id:reviewId, bookId:bookId},{$set:{isDeleted:true}},{new:true})
        
        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },{ $inc: { reviews: -1 }},{updatedAt: Date.now()}) //review:-1

        

        return res.status(200).send({status:true, message:"Review deleted successfully", data:deletedReview})

    }
     catch (err) {
        return res.status(500).send({ status: false, message: "error", error: err.message })
    }
}

module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview