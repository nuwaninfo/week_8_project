import mongoose, { Document, Schema, Model } from "mongoose"

interface ITopic extends Document {
  title: string
  content: string
  username: string
  createdAt: Date
}

const UserSchema: Schema = new Schema<ITopic>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, required: true },
})

const Topic: Model<ITopic> = mongoose.model<ITopic>("Topic", UserSchema)

export { Topic, ITopic }
