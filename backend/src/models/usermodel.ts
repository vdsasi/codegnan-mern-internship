import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface Event {
  title: string;
  start: Date;
  end: Date;
}

export const eventSchema = new Schema<Event>({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
});

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  tasks: Event[];
}

const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  name: {
    type: String,
  },
  tasks: {
    type: [eventSchema],
    default: [],
  },
});

userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    return next(error);
  }
});

const User = mongoose.model<UserDocument>("User", userSchema);

module.exports = User;
