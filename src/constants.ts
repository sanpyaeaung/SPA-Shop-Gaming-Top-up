export interface Game {
  id: string;
  name: string;
  logo: string;
  banner: string;
  items: GameItem[];
  requiresZone?: boolean;
}

export interface GameItem {
  id: string;
  name: string;
  price: number;
  amount: number;
}

export const GAMES: Game[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    requiresZone: true,
    logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=128&h=128&fit=crop', // Placeholder, will update with relevant generated images
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    items: [
      { id: 'ml_1', name: '86 Diamonds', price: 2100, amount: 86 },
      { id: 'ml_2', name: '172 Diamonds', price: 4200, amount: 172 },
      { id: 'ml_3', name: '257 Diamonds', price: 6300, amount: 257 },
      { id: 'ml_4', name: '706 Diamonds', price: 16800, amount: 706 },
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    logo: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=128&h=128&fit=crop',
    banner: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=800&h=400&fit=crop',
    items: [
      { id: 'pubg_1', name: '60 UC', price: 1800, amount: 60 },
      { id: 'pubg_2', name: '325 UC', price: 8500, amount: 325 },
      { id: 'pubg_3', name: '660 UC', price: 16500, amount: 660 },
    ]
  },
  {
    id: 'ff',
    name: 'Free Fire',
    logo: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=128&h=128&fit=crop',
    banner: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=400&fit=crop',
    items: [
      { id: 'ff_1', name: '100 Diamonds', price: 1500, amount: 100 },
      { id: 'ff_2', name: '310 Diamonds', price: 4500, amount: 310 },
      { id: 'ff_3', name: '520 Diamonds', price: 7500, amount: 520 },
    ]
  },
  {
    id: 'efootball',
    name: 'eFootball',
    logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=128&h=128&fit=crop',
    banner: 'https://images.unsplash.com/photo-1431324155629-1a6eda1dec2d?w=800&h=400&fit=crop',
    items: [
      { id: 'ef_1', name: '100 Coins', price: 3000, amount: 100 },
      { id: 'ef_2', name: '500 Coins', price: 14000, amount: 500 },
    ]
  },
  {
    id: 'fcmobile',
    name: 'FC Mobile',
    logo: 'https://images.unsplash.com/photo-1614632537190-23e414d40000?w=128&h=128&fit=crop',
    banner: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=400&fit=crop',
    items: [
      { id: 'fc_1', name: '500 Points', price: 5500, amount: 500 },
      { id: 'fc_2', name: '1050 Points', price: 11000, amount: 1050 },
    ]
  }
];
