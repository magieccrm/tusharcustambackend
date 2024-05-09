const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //required: true,
      trim: true,
    },
    user_id:{
      type: String,
      required: true,
      trim: true,
    },
    datetime: {
      type: String,
      trim: true,
    },
    calldate: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      trim: true,
    },
    phone_number: {
      type: Number,
      trim: true,
    },
    rawtype: {
        type: Number,
       trim: true,
      },
      type: {   
        type: String,
        trim: true,
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crm_calllog", callLogSchema);
