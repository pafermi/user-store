import mongoose from "mongoose";


const adressSchema = new mongoose.Schema({
    adress1:   {type: String,required: true},
    adress2:   {type: String,required: false},
    number:    {type: Number,required: true},
    zipcode:   {type: String,required: true},
    city:      {type: String,required: true},
    state:     {type: String,required: true},
    country:   {type: String,required: true} 
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    lastname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    idCard: {
        type: String,
        required: [true, 'ID Card is required'],
        unique: true
    },
    membership: {
        type: String,
        required: [true, 'Membership is required'],
        enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
        default: 'BRONZE'
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    telephone: {
        type: String,
        required: false
    },
    otherphone: {
        type: String,
        required: false
    },
    adress: {
        type: [adressSchema],
        required: false
    },
    img: {
        type: String
    },
    role: {
        type: [String],
        default: ['USER_ROLE'],
        enum:['ADMIN_ROLE','USER_ROLE']
    }
});

userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret,options){
        delete ret._id;
        delete ret.password;
    }
})

export const UserModel = mongoose.model('User',userSchema);