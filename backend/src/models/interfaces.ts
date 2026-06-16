// Interfaces do Sticker Tracker

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export interface Sticker {
  id: number;
  sticker_number: number;
  player_name: string;
  country: string;
  position: string;
}

export interface UserSticker {
  id: number;
  user_id: number;
  sticker_id: number;
  quantity: number;
}

// Interfaces para respostas da API

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

export interface AuthPayload {
  userId: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}
