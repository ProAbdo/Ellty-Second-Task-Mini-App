import jwt from 'jsonwebtoken';

export const generateToken = (userId: number): string => {
  const secret: string = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = { expiresIn };
  return jwt.sign(
    { userId },
    secret,
    options
  );
};

