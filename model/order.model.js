const mongoose = require("mongoose")
const { Schema } = mongoose

const OrderSchema = new Schema({
    userId: {
        type: String
    },
    products: [
      {
        productId: {
            type: String
        },
        name: String,
        quantity: {
            type: Number,
            trquired: true,
            min: [1, 'Quantity can not be less than 1'],
            default: 1
        },
        price: Number
      }  
    ],
    bill: {
        type: Number,
        required: true,
        dedault: 0
    },
    made_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("order", OrderSchema)