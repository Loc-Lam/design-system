// Mock Receipt Data Types and Constants
// Following component hierarchy: Design Tokens → Base

export interface MockReceipt {
  id: string;
  url: string;
  type: string;
  merchantName: string;
  amount: number;
  date: string;
  category: string;
}

export const MOCK_RECEIPTS: MockReceipt[] = [
  {
    id: 'receipt-1',
    url: '/images/mock-receipts/receipt-starbucks.png',
    type: 'image',
    merchantName: 'Starbucks Coffee',
    amount: 10.30,
    date: '2024-03-15',
    category: 'Meals & Entertainment'
  },
  {
    id: 'receipt-2',
    url: '/images/mock-receipts/receipt-wholefoods.png',
    type: 'image',
    merchantName: 'Whole Foods Market',
    amount: 19.78,
    date: '2024-03-16',
    category: 'Office Supplies'
  },
  {
    id: 'receipt-3',
    url: '/images/mock-receipts/receipt-shell.png',
    type: 'image',
    merchantName: 'Shell Gas Station',
    amount: 57.42,
    date: '2024-03-17',
    category: 'Travel & Transportation'
  },
  {
    id: 'receipt-4',
    url: '/images/mock-receipts/receipt-bestbuy.png',
    type: 'image',
    merchantName: 'Best Buy',
    amount: 68.11,
    date: '2024-03-18',
    category: 'Equipment & Software'
  },
  {
    id: 'receipt-5',
    url: '/images/mock-receipts/receipt-ubereats.png',
    type: 'image',
    merchantName: 'Uber Eats',
    amount: 46.84,
    date: '2024-03-19',
    category: 'Meals & Entertainment'
  }
];

// Helper function to get random receipts for mock data
export function getRandomReceipts(count: number = 1): MockReceipt[] {
  const shuffled = [...MOCK_RECEIPTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, MOCK_RECEIPTS.length));
}

// Helper function to get receipt by ID
export function getReceiptById(id: string): MockReceipt | undefined {
  return MOCK_RECEIPTS.find(receipt => receipt.id === id);
}