import type { Request, Response } from "express";
import oauth2Client from "@/config/google";
import { env } from "@/env";
import { EntityNotFoundError } from "@/errors";
import { User } from "@/models/userModel";

// STEP 1: Redirect user to Google
export const connectGoogle = (_req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // Essential for getting the refresh_token
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    prompt: "consent",
  });
  res.redirect(url);
};

// STEP 2: Handle Callback and save to MongoDB
export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code as string);

  await User.findByIdAndUpdate(req.user?.id, {
    googleTokens: tokens,
    isGoogleLinked: true,
  });

  res.redirect(`${env.FRONTEND_URL}/profile?google=success`);
};

export async function getGoogleStatus(req: Request, res: Response) {
  const user = await User.findById(req.user?.id);
  if (!user) throw new EntityNotFoundError("User not found");

  res.json({ success: true, isGoogleLinked: user.isGoogleLinked });
}
