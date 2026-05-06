declare namespace Express {
  interface Request {
    user?: { id: string; role: string };
    admin?: { email: string; role: string };
  }
}
