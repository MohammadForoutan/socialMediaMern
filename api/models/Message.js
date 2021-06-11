const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
	{
    conversationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Conversation"
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    text: {
      type: String,
      required: true
    }
	},
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
