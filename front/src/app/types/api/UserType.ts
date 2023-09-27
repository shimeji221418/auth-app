export type GetUserType = {
  id: number;
  name: string;
  email: string;
  is_staff: boolean;
};

export type LoginUserType = {
  email: string;
  password: string;
};

export type NewUserType = LoginUserType & { name: string };
