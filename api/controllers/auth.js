const User = require('../models/User');
const bcrypt = require('bcrypt')


exports.registerUser = async(req, res) => {
    try {
        // get data
        const {username, email, password} = req.body;


        // generate hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        })

        // save user and response
        await user.save();
        res.status(200).json({user});
    } catch (err) {
       
        console.log(err)
        res.status(500).json(err)
    }
}


exports.loginUser = async(req, res) => {
    try {
        // get and find user
        const {email, password} = req.body;
        const user = await User.findOne({email});

        // if no found
        if(!user) {
            return res.status(404).json('user not found')
        }

        // validate password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword) {
            return res.status(400).json('wrong password')
        }


        // successfullt login and response
        res.status(200).json(user)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}