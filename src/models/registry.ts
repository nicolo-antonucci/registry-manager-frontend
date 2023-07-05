export interface Registry {
  id: number;
  name: string;
  surname: string;
  email: string;
  address?: string | null;
  location?: string | null;
  city?: string | null;
  province?: string | null;
  string?: string | null;
}
