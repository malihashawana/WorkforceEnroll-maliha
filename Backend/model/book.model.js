import mongoose from "mongoose";
const bookSchema= new mongoose.Schema({
    name:String,
    price:Number,
    category:String,
    image:String,
    title:String,
})
const Book=mongoose.model("Book",bookSchema);
export const getBook = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export default Book;