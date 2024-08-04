import mongoose from "mongoose";
import { generateRandomStringCode, generateTimeStamp } from "../../../utils/functionsUtil.js";

const ticketCollection = "tickets";

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        require: true,
    },
    amount: {
        type: Number,
        require: true,
    },
    purchaser: {
        type: String,
        require: true,
    },
});

ticketSchema.pre("save", function () {
    this.code = generateRandomStringCode();
    this.purchase_datetime = generateTimeStamp();
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;