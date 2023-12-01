import userModel from "../models/user.js";

const getAllUsers = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const users = await userModel.find({}).skip(offset).limit(pageSize);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUser = async (req, res) => {

    try {
        const { name, email, phone, avatar, password } = req.body;
        const userExists = await userModel.findOne({ phone });
        if (userExists) {
            return res.status(200).json(userExists);
        }
        const newUser = await userModel.create({
            name, email, phone, avatar, password
        })
        return res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getUserInfoById = async (req, res) => {

}

const getUserInfoByPhone = async (req, res) => {

    try {
        const user = await userModel.find({ phone });
        return res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message })

    }

}

export {
    getAllUsers,
    createUser,
    getUserInfoById,
    getUserInfoByPhone
}