import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id, role = "user") => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET);
}

//Route For User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
        else {
            const token = createToken(user._id, user.role || "user");
            return res.json({ success: true, token, message: "User Logged In Successfully" })
        }
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//Route For User Registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // checking user already exist or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User Already Exist" });
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter Valid Email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password Must Be Strong" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save();
        const token = createToken(newUser._id, newUser.role || "user");

        return res.json({ success: true, token, message: "User Registered Successfully" })
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}
//Route For Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                { role: "admin", email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.json({
                success: true,
                token,
                message: "Admin Logged In Successfully"
            });
        }

        return res.json({ success: false, message: "Invalid Credentials" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const getUserCount = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        return res.json({ success: true, totalUsers });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel
            .find({})
            .select('-password -resetPasswordToken -resetPasswordExpire')
            .sort({ createdAt: -1 });

        return res.json({ success: true, users });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export { loginUser, registerUser, adminLogin, getUserCount, getUsers } 