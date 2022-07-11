const userModel = require("../Models/userModel")
const jwt = require("jsonwebtoken")

const nameRegex = /^[a-zA-Z ]{2,45}$/             //  /^[a-zA-Z\\s]*$/   <--- will not consider space between

const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/

const mobileRegex = /^[6-9]\d{9}$/                // /^[0-9]{10}$/  <--Only verify numbers

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/

const pincodeRegex = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}

// function for title validation
const isValidTitle = function(title){
    return ["Mr", "Mrs","Miss"].indexOf(title)!== -1
}


const createUser = async function(req, res){
    try{
        let userData = req.body
        let {title, name, phone, email, password, address} = userData

        //-----------------------------   validations start from here   ----------------------------------//

        if (!isValidRequestBody(userData)){ 
        return res.status(400).send({ status: false, message: "No input by user.." })
        }
        if (!isValid(title)){ 
        return res.status(400).send({ status: false, message: "Title is required." })
        }
        if (!isValid(name)){ 
        return res.status(400).send({ status: false, message: "Name is required." })
    }
        if (!isValid(phone)){ 
        return res.status(400).send({ status: false, message: "Phone number is required." })
        }
        if (!isValid(email)) {
        return res.status(400).send({ status: false, message: "E-mail address is required." })
        }
        if (!isValid(password)){ 
        return res.status(400).send({ status: false, message: "Password is required." })
        }
        if (!isValid(address)) 
        return res.status(400).send({ status: false, message: "Address is required."})

        if (!pincodeRegex.test(address.pincode)) 
        return res.status(400).send({ status: false, message: "Pincode must be of 6 digits." })

        if (!isValidTitle(title))
            return res.status(400).send({ status: false, message: "Title should be among Mr, Mrs, Miss" })

        if (!nameRegex.test(name)) 
        return res.status(400).send({ status: false, message: "Not a valid name." })

        if (!emailRegex.test(email)) 
        return res.status(400).send({ status: false, message: "Please provide a valid email address." })

        if (!mobileRegex.test(phone)) 
        return res.status(400).send({ status: false, message: "Please provide a valid 10 digits phone number. Phone number should start 6-9." })

        if (!passwordRegex.test(password)) 
        return res.status(400).send({ status: false, message: "Password is not strong enough.Please provide a password of minimum length of 8 characters containing 1 Uppercase, 1 lowecase, 1 special symbole and number " })

        const duplicateEmail = await userModel.findOne({ email })

        if (duplicateEmail) 
        return res.status(400).send({ status: false, message: "Email address already exists. Please use another email address." })

        const duplicatePhone = await userModel.findOne({ phone })

        if (duplicatePhone) 
        return res.status(400).send({ status: false, message: "Phone number already exists. Please use another phone number" })

        const newUser = await userModel.create(userData)
        return res.status(201).send({status: true, message: "New User created successfully", data: newUser })



    }
    catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}



const loginUser = async function (req, res) {
    try{
    
    let loginData =req.body
    let {email,password}=loginData //extract params


    if(!isValidRequestBody(loginData)){
    return res.status(400).send({status:false, msg : "Invalid request parameters.Please provide login details"})
    }

    if(!isValid(email)){
    return res.status(400).send({status:false, msg:"E-mail is required"})
    }

    if(!(emailRegex.test(email))){
    return res.status(400).send({status:false, msg:"E-mail should be a valid e-mail address"})
    }

    if(!isValid(password)){
    return res.status(400).send({status:false, msg:"password must be present"})
    }
    let user = await userModel.findOne({ email: email, password: password });

    if (!user){
      return res.status(401).send({status: false,msg: "Invalid login credenctial",});
    }

    
    

let token = jwt.sign(
    {
      userId: user._id.toString(),
      iat: 48784,
      expiresIn: "365d",
    },
    'Group49-book/management'
  )
   res.setHeader("x-api-key", token);
  return res.status(200).send({ status: true, msg: "User successfully logged in" ,data: token });
}
catch (err){
    return res.status(500).send({ msg: "Error", error: err.message })
}
};


module.exports.createUser = createUser
module.exports.loginUser = loginUser