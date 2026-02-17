export interface Transaction {
  id: string;
  type: 'payment' | 'receive' | 'load' | 'transfer' | 'bill_payment';
  amount: number;
  currency: string;
  date: string;
  recipient?: string;
  sender?: string;
  description: string;
  category: 'food' | 'utilities' | 'entertainment' | 'shopping' | 'transport' | 'others';
  status: 'success' | 'pending' | 'failed';
}

export interface User {
  id: string;
  name: string;
  balance: number;
  currency: string;
  avatarUrl: string;
  kycStatus: 'verified' | 'pending' | 'unverified';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
}

export type ViewState = 
  | 'landing' 
  | 'dashboard' 
  | 'scan' 
  | 'analytics' 
  | 'chat' 
  | 'merchant' 
  | 'profile'
  | 'send_money'
  | 'load_money'
  | 'request_money'
  | 'bank_transfer'
  | 'transactions';
