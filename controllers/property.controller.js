import mongoose from "mongoose";
import propertyModel from "../models/property.js";
import userModel from "../models/user.js";
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { query } from "express";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const getAllProperties = async (req, res) => {

    const { _end, _order, _start, _sort, title_like = "", propertyType = "" } = req.query;
    const query = {}
    if (propertyType !== '') {
        query.propertyType = propertyType;
    }
    if (title_like) {
        query.title = { $regex: title_like, $options: 'i' };
    }
    try {
        const count = await propertyModel.countDocuments({ query });
        console.log(count)
        console.log(query)


        const properties = await propertyModel.find(query).limit(_end).skip(_start).sort({ [_sort]: _order });//sends all present properties
        res.header('x-total-count', count);
        res.header('Access-Control-Expose-Headers', 'x-total-count')

        res.status(200).json({
            properties
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPropertyById = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const propertyExists = await propertyModel.findOne({ _id: id }).populate('creator');
    if (propertyExists) {
        res.status(200).json(propertyExists)
    } else {
        res.status(404).json({ message: 'Property not found' });
    }
}

const createProperty = async (req, res) => {
    try {
        const { title, description, propertyType, location, price, featured_photo, phone } = req.body;
        /*start a new session i.e 
        session in mongo assures that an operation is atomic (atomic transaction)
        meaning it can either be either work or not work but no be stucked between*/
        const session = await mongoose.startSession();
        session.startTransaction();
        const user = await userModel.findOne({ phone }).session(session);

        if (!user) throw new Error('User not found');
        //const featured_image_url = await cloudinary.uploader.upload(featured_photo);
        const newProperty = await propertyModel.create({
            title,
            description,
            propertyType,
            location,
            price,
            //featured_photo: featured_image_url,
            featured_photo,
            creator: user._id
        });
        user.properties.push(newProperty._id);
        await user.save({ session });
        await session.commitTransaction();
        res.status(200).json({ message: 'Property created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })

    }


}

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, propertyType, location, price, featured_photo, phone } = req.body;
        await propertyModel.findByIdAndUpdate({ _id: id }, {
            title,
            description,
            propertyType,
            location,
            price,
            featured_photo
        })
        console.log(price);
        res.status(200).json({
            message: `Property with id ${id} updated sucessfully`
        })

    } catch (error) {
        res.status(500).json({ message: error.message })

    }

}

const deleteProperty = async (req, res) => {
    try {

        const { id } = req.params;
        const propertyToDelete = await propertyModel.findById({
            _id: id
        }).populate('creator');
        if (!propertyToDelete) {
            throw new Error('Property not found')
        }
        console.log(propertyToDelete)
        const session = await mongoose.startSession();
        session.startTransaction();

        await propertyModel.deleteOne({ _id: id }, { session });
        propertyToDelete.creator.properties.pull(propertyToDelete);
        await propertyToDelete.creator.save({ session });
        await session.commitTransaction();
        res.status(200).json({ message: 'Property deleted successfully' })

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

export {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
}