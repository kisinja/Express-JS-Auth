import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    },
    author:{
        type:String,
        required: true,
    },
    price:{
        type:Number,
        required: true,
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
        min: 0,
        max: 5,
    },
    stock:{
        type:Number,
        required:true,
        min: 0,
    },
    pages:{
        type:Number,
        required:true,
        min: 1,
    },
    publishedYear:{
        type:Number,
        required:true,
        min: 1450, // The year the printing press was invented
    },
    isbn:{
        type:String,
        required:true,
        unique: true, // ISBN should be unique
    },
    language:{
        type:String,
        required:true,
    },
    publisher:{
        type:String,
        required:true,
    },
    isBookmarked:{
        type:Boolean,
        default: false, // Default value for isBookmarked
    }
}, {timestamps:true});

const Book = mongoose.model('Book', bookSchema);

export default Book;