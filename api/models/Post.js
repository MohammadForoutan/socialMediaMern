const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		description: {
			type: String,
			max: 500 
		},
		image: {
			type: String
		},
		likes: {
			type: Array,
			default: []
		}
	},
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
