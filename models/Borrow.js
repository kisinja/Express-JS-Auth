import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
    // Reference to the user who borrowed the book from the User model
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    // Reference to the book that was borrowed from the Book model
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required: true
    },
    returnDate:{
        type:Date,
        required: true
    },
    status:{
        type:String,
        enum:["borrowed", "returned", "overdue"],
        default:"borrowed"
    },
}, {timestamps: true});

const Borrow = mongoose.model('Borrow', borrowSchema);
export default Borrow;