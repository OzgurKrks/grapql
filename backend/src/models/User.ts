import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  posts?: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// Virtual posts field
UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
});

export default mongoose.model<IUser>('User', UserSchema); 