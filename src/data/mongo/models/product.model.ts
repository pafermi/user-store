import mongoose, { Schema } from "mongoose";

const productSizeSchema = new mongoose.Schema({
    name:   {type: String,required: true},
    stock:  {type: Number,required: true}
});

const productVariantSchema = new mongoose.Schema({
    color:  {type: String,required: true},
    image:  {type: String,required: true},
    size:   {type: [productSizeSchema],required: true},  
});

const productSchema = new mongoose.Schema({
    //id:                 {type: BigInt,required: true},
    sku:                {type: String,required: true},
    name:               {type: String,required: true},
    price:              {type: Number,required: true},
    discount:           {type: Number,required: true},
    offerEnd:           {type: Date,required: true},
    new:                {type: Boolean,required: true},
    rating:             {type: Number,required: true},
    saleCount:          {type: Number,required: true},
    category:           {type: [String],required: true},
    tag:                {type: [String],required: true},
    stock:              {type: Number, rquired: false},
    variation:          {type: [productVariantSchema],required: false},
    image:              {type: [String],required: true},
    shortDescription:   {type: String,required: true},
    fullDescription:    {type: String,required: true}
});

productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret,options){
        delete ret._id;
    }
})

export const ProductModel = mongoose.model('Product',productSchema);