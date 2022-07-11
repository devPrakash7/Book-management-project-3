const express = require("express");
const router = express.Router()
const userController = require('../Controllers/userController')
const bookController = require('../Controllers/bookController')
const reviewController = require('../Controllers/reviewController')
const mid = require("../middleware/midfile")


//--------------------------------------------------------//


//--------------------------------------------------------//

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)


router.post("/books",mid.authentication, bookController.createBook)
router.get("/books",mid.authentication, bookController.getBooks)
router.get("/books/:bookId", mid.authentication, bookController.getBookReviews)
router.put("/books/:bookId", mid.authentication, mid.authorization, bookController.updateBook)
router.delete("/books/:bookId", mid.authentication, mid.authorization, bookController.deleteBook)

router.post("/books/:bookId/review", reviewController.createReview)
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)





module.exports = router