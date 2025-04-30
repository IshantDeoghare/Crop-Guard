// server/controllers/authController.js
const User = require('../models/User');
const admin = require('../config/firebaseAdmin');


const getMe = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        let user = await User.findOne({ firebaseUid });

        if (!user) {
            user = await User.create({
                firebaseUid: firebaseUid,
                email: req.user.email,
                name: req.user.name || '',
            });
            console.log(`New user created in DB: ${user.email}`);
        }

        res.json({
            _id: user._id, 
            firebaseUid: user.firebaseUid,
            email: user.email,
            name: user.name,
        });
    } catch (error) {
        console.error("Error in getMe controller:", error);
        res.status(500).json({ message: "Server error retrieving user data" });
    }
};

module.exports = { getMe };