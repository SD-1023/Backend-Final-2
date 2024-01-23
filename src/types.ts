export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  user_image: string;
};

export type Session = {
  sid: string;
  userId?: number;
};
