const mongoose = require("mongoose")
const { Schema } = mongoose
const validator = require("validator")
const slug = require('mongoose-slug-generator')
//Initialize
mongoose.plugin(slug);

const ProductSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title field required']
    },
    description: {
        type: String,
        required: [true, 'Description field required']
    },
    category: {
        type: String,
        required: [true, 'Category field required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required']
    },
    slug: { 
        type: String, 
        slug: "title", 
        unique: true 
    },
    createdAt: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model("product", ProductSchema)