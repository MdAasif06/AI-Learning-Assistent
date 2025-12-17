import mongoose from "mongoose";
const chatHistorySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistent"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        releventChunks: {
          type: [Number],
          default: [],
        },
      },
    ],
  },
  { timestamp: true }
);

//index for faster quries
chatHistorySchema.index({ userId: 1, documentId: 1 });
const chatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default chatHistory;
