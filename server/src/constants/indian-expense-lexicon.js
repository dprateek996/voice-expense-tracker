const CANONICAL_EXPENSE_CATEGORIES = [
  'Groceries',
  'Dining',
  'Transport',
  'Shopping',
  'Utilities',
  'Health',
  'Entertainment',
  'Travel',
  'Education',
  'Work',
  'Personal Care',
  'Fuel',
  'Other',
];

const HINGLISH_HINT_TOKENS = [
  'ka',
  'ki',
  'ke',
  'ko',
  'pe',
  'aur',
  'bhai',
  'kharcha',
  'liye',
  'diya',
  'diye',
  'liya',
  'wali',
  'wala',
  'se',
];

const INDIAN_EXPENSE_LEXICON = [
  {
    category: 'Dining',
    subcategory: 'Street Food',
    keywords: ['samosa', 'samsoe', 'samsa', 'patties', 'kachori', 'vadapav', 'vada pav', 'chaat', 'golgappa', 'pani puri', 'momos', 'roll', 'pakoda'],
  },
  {
    category: 'Dining',
    subcategory: 'Cafe',
    keywords: ['coffee', 'cofee', 'chai', 'tea', 'cafe', 'sandwich', 'pastry', 'snack'],
  },
  {
    category: 'Dining',
    subcategory: 'Restaurant',
    keywords: ['lunch', 'dinner', 'breakfast', 'restaurant', 'meal', 'thali', 'biryani', 'pizza', 'burger'],
  },
  {
    category: 'Groceries',
    subcategory: 'Daily Essentials',
    keywords: ['grocery', 'groceries', 'ration', 'kirana', 'kiryana', 'sabzi', 'vegetable', 'fruit', 'atta', 'rice', 'dal', 'milk', 'doodh', 'bread', 'eggs'],
  },
  {
    category: 'Transport',
    subcategory: 'Local Commute',
    keywords: ['auto', 'rickshaw', 'cab', 'taxi', 'uber', 'ola', 'metro', 'bus', 'train ticket', 'rapido'],
  },
  {
    category: 'Transport',
    subcategory: 'Delivery/Travel Ride',
    keywords: ['fare', 'ride', 'ticket', 'toll', 'parking'],
  },
  {
    category: 'Fuel',
    subcategory: 'Vehicle Fuel',
    keywords: ['petrol', 'diesel', 'cng', 'fuel', 'pump'],
  },
  {
    category: 'Personal Care',
    subcategory: 'Grooming',
    keywords: ['haircut', 'salon', 'parlour', 'parlor', 'spa', 'shampoo', 'conditioner', 'facewash', 'grooming', 'trim', 'beard'],
  },
  {
    category: 'Health',
    subcategory: 'Pharmacy',
    keywords: ['medicine', 'medicines', 'tablet', 'doctor', 'clinic', 'hospital', 'pharmacy', 'chemist', 'checkup'],
  },
  {
    category: 'Utilities',
    subcategory: 'Bills',
    keywords: ['electricity', 'light bill', 'water bill', 'gas bill', 'wifi', 'internet', 'broadband', 'recharge', 'mobile bill'],
  },
  {
    category: 'Shopping',
    subcategory: 'General Shopping',
    keywords: ['shopping', 'amazon', 'flipkart', 'myntra', 'mall', 'clothes', 'shirt', 'pant', 'shoe', 'shoes', 'bag', 'watch'],
  },
  {
    category: 'Entertainment',
    subcategory: 'Digital',
    keywords: ['movie', 'cinema', 'netflix', 'spotify', 'subscription', 'game', 'gaming', 'ott'],
  },
  {
    category: 'Travel',
    subcategory: 'Trip',
    keywords: ['flight', 'hotel', 'trip', 'vacation', 'tour', 'booking', 'airbnb'],
  },
  {
    category: 'Education',
    subcategory: 'Learning',
    keywords: ['course', 'fees', 'tuition', 'class', 'exam', 'book', 'books', 'stationery', 'notebook'],
  },
  {
    category: 'Work',
    subcategory: 'Office/Tools',
    keywords: ['office', 'workspace', 'software', 'saas', 'license', 'domain', 'hosting', 'notion', 'slack'],
  },
];

module.exports = {
  CANONICAL_EXPENSE_CATEGORIES,
  HINGLISH_HINT_TOKENS,
  INDIAN_EXPENSE_LEXICON,
};
