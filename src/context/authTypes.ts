export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signout: () => void;
};