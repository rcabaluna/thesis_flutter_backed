const bcrypt = require("bcryptjs");
const mongoose = require("mongoose"),
Schema = mongoose.Schema,
ObjectId = Schema.Types.ObjectId;
let ProductsSchema=new Schema({
    productName:{
        type:String,
        require
    },
    productImage:{
        type:String
    },
    productPrice:{
        type:Float64Array
    },
    productDescription:{
        type:String
    },
    stocks:{
        type:Int32Array
    },
    sellerID:{
        type:ObjectId,
        ref:"Seller"
    },
    productAdmin:{
        type: ObjectId,
        ref: "Product",
    }
});
const Products = mongoose.model("Products", ProductsSchema);
module.exports = Products;
