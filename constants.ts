import { Transaction, Contact, User } from './types';

export const MOCK_USER: User = {
  id: 'u123',
  name: 'Aarav Sharma',
  balance: 45250.75,
  currency: 'NPR',
  avatarUrl: 'https://picsum.photos/200/200',
  kycStatus: 'verified'
};

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Sita', phone: '9841XXXXXX', avatar: 'https://picsum.photos/100/100?random=1' },
  { id: 'c2', name: 'Ram', phone: '9801XXXXXX', avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 'c3', name: 'Hari', phone: '9851XXXXXX', avatar: 'https://picsum.photos/100/100?random=3' },
  { id: 'c4', name: 'Gita', phone: '9741XXXXXX', avatar: 'https://picsum.photos/100/100?random=4' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    type: 'payment',
    amount: 1200,
    currency: 'NPR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    recipient: 'Bhatbhateni Supermarket',
    description: 'Grocery shopping',
    category: 'shopping',
    status: 'success'
  },
  {
    id: 'tx2',
    type: 'bill_payment',
    amount: 1500,
    currency: 'NPR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    recipient: 'Nepal Electricity Authority',
    description: 'Electricity Bill',
    category: 'utilities',
    status: 'success'
  },
  {
    id: 'tx3',
    type: 'receive',
    amount: 5000,
    currency: 'NPR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    sender: 'Sita Sharma',
    description: 'Lunch money',
    category: 'others',
    status: 'success'
  },
  {
    id: 'tx4',
    type: 'payment',
    amount: 350,
    currency: 'NPR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    recipient: 'Pathao Ride',
    description: 'Ride to office',
    category: 'transport',
    status: 'success'
  },
  {
    id: 'tx5',
    type: 'payment',
    amount: 2500,
    currency: 'NPR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    recipient: 'Worldlink',
    description: 'Internet Bill',
    category: 'utilities',
    status: 'success'
  },
  {
    id: 'tx6',
    type: 'payment',
    amount: 850,
    currency: 'NPR',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    recipient: 'Burger House',
    description: 'Dinner with friends',
    category: 'food',
    status: 'success'
  }
];

export const QUICK_ACTIONS = [
  { id: 'send', label: 'Send', icon: 'Send', color: 'bg-blue-500' },
  { id: 'load', label: 'Load', icon: 'Download', color: 'bg-green-500' },
  { id: 'request', label: 'Request', icon: 'Users', color: 'bg-purple-500' },
  { id: 'bank', label: 'Bank Transfer', icon: 'Landmark', color: 'bg-orange-500' },
];
