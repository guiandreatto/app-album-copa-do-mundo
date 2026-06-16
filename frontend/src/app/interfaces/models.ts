// Interfaces do Frontend - Sticker Tracker

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Sticker {
  id: number;
  sticker_number: number;
  player_name: string;
  country: string;
  position: string;
}

export interface StickerWithQuantity extends Sticker {
  quantity: number;
  user_sticker_id?: number;
}

export interface DashboardStats {
  total: number;
  obtained: number;
  missing: number;
  repeated: number;
  completionPercentage: number;
  countryProgress: CountryProgress[];
}

export interface CountryProgress {
  country: string;
  obtained: number;
  total: number;
  completed: boolean;
}
