import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String, required: true,
    },
    email: {
        type: String, required: true,
    },
    password: {
        type: String, required: true,
    },
    phone: {
        type: String, required: true,
    },
    avatar: {
        type: String, required: true,
    },
    properties:
        [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Property'
        }]
});


const userModel = mongoose.model('User', UserSchema);
export default userModel