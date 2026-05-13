"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Account from "@/database/account.model";
import User from "@/database/user.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { signIn } from "next-auth/react";
import { SignUpSchema } from "../validation";

export async function signUpWithCredentials(params: AuthCredentails): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  console.log("validation results", validationResult);

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ username, name, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { success: true } as ActionResponse;
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  }
}
