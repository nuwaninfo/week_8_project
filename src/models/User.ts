import mongoose, { Document, Schema, Model } from "mongoose"

interface IUser extends Document {
  email: string
  password: string
  username: string
  isAdmin: boolean
}

const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
})

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema)

export { User, IUser }
