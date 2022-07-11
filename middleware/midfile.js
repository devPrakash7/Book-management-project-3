const jwt = require("jsonwebtoken");
const bookModel = require("../Models/bookModel");
mongoose = require("mongoose")

const tokenRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}




const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        let secretKey = "Group49-book/management"


        if (!token) {
            return res.status(400).send({ status: false, msg: "Token must be present", });
        }

        if (!tokenRegex.test(token))
            return res.status(400).send({ status: false, message: "Please provide a valid token." })

        let decodedToken = jwt.verify(token, secretKey)

        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "Authentication error" });
        }
        req.decodedToken = decodedToken

        next()


    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

const authorization = async function (req, res, next) {
    try {


        let bookId = req.params.bookId

        let decodedToken = req.decodedToken

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please provide valid book Id" })


        const findBook = await bookModel.findOne({ _Id: bookId, isDeleted: false })

        if (!findBook)
            res.status(404).send({ status: false, msg: "No book found or it maybe deleted" });



        if (decodedToken.userId = findBook.userId) {
            next()
        } else {
            res.status(401).send({ status: false, msg: "user logged in is not allowed to modify or access the author data" });
        }
    }

    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports.authentication = authentication
module.exports.authorization = authorization