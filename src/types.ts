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

export type cart = {
  id?: number;
  product_name: string;
  product_id: number;
  product_price: number;
  user_id: number;
  quantity: number;
};
