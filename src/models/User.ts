import mongoose, { Document, Schema, Model } from "mongoose"

interface IUser extends Document {
  name: string
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
})

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema)

export { User, IUser }
