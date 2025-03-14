export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  rating: number;
  reviews: number;
  relatedProducts: string[];
}

export const products: Product[] = [
  {
    id: 'laptop-1',
    name: 'UltraBook Pro X1',
    price: 1299.99,
    category: 'laptops',
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    description:
      "The UltraBook Pro X1 is a powerful and lightweight laptop designed for professionals. With its high-performance processor and stunning display, it's perfect for both work and entertainment.",
    features: [
      'Intel Core i7 processor',
      '16GB RAM',
      '512GB SSD',
      '14-inch 4K display',
      'Backlit keyboard',
      'Fingerprint sensor',
    ],
    specs: {
      Processor: 'Intel Core i7-1165G7',
      Memory: '16GB LPDDR4X',
      Storage: '512GB NVMe SSD',
      Display: '14-inch 4K (3840 x 2160) IPS',
      Graphics: 'Intel Iris Xe Graphics',
      Battery: 'Up to 12 hours',
      Weight: '1.2 kg',
    },
    rating: 4.8,
    reviews: 124,
    relatedProducts: ['laptop-2', 'laptop-3', 'accessory-1', 'accessory-3'],
  },
  {
    id: 'laptop-2',
    name: 'PowerBook Elite',
    price: 1499.99,
    category: 'laptops',
    image:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    description:
      'The PowerBook Elite is a high-performance laptop with a sleek design. It features a powerful processor, ample storage, and a vibrant display, making it ideal for creative professionals.',
    features: [
      'AMD Ryzen 9 processor',
      '32GB RAM',
      '1TB SSD',
      '15.6-inch OLED display',
      'RGB keyboard',
      'Thunderbolt 4 ports',
    ],
    specs: {
      Processor: 'AMD Ryzen 9 5900HX',
      Memory: '32GB DDR4',
      Storage: '1TB NVMe SSD',
      Display: '15.6-inch OLED (2560 x 1440) 165Hz',
      Graphics: 'NVIDIA RTX 3070',
      Battery: 'Up to 8 hours',
      Weight: '1.9 kg',
    },
    rating: 4.7,
    reviews: 89,
    relatedProducts: ['laptop-1', 'laptop-3', 'accessory-2', 'accessory-4'],
  },
  {
    id: 'laptop-3',
    name: 'ThinBook Air',
    price: 899.99,
    category: 'laptops',
    image:
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    description:
      "The ThinBook Air is an ultra-portable laptop that doesn't compromise on performance. Its slim design and long battery life make it perfect for users on the go.",
    features: [
      'Intel Core i5 processor',
      '8GB RAM',
      '256GB SSD',
      '13.3-inch Retina display',
      'Backlit keyboard',
      'Touch ID',
    ],
    specs: {
      Processor: 'Intel Core i5-1135G7',
      Memory: '8GB LPDDR4X',
      Storage: '256GB NVMe SSD',
      Display: '13.3-inch Retina (2560 x 1600) IPS',
      Graphics: 'Intel Iris Xe Graphics',
      Battery: 'Up to 18 hours',
      Weight: '1.29 kg',
    },
    rating: 4.5,
    reviews: 156,
    relatedProducts: ['laptop-1', 'laptop-2', 'accessory-1', 'accessory-5'],
  },
  {
    id: 'smartphone-1',
    name: 'Galaxy Ultra',
    price: 1099.99,
    category: 'smartphones',
    image:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    description:
      'The Galaxy Ultra is a premium smartphone with cutting-edge features. Its advanced camera system, powerful processor, and stunning display make it a top choice for tech enthusiasts.',
    features: [
      '6.8-inch Dynamic AMOLED display',
      'Triple camera system',
      '12GB RAM',
      '256GB storage',
      '5000mAh battery',
      'IP68 water resistance',
    ],
    specs: {
      Processor: 'Snapdragon 8 Gen 1',
      Memory: '12GB LPDDR5',
      Storage: '256GB UFS 3.1',
      Display: '6.8-inch Dynamic AMOLED 2X (3088 x 1440) 120Hz',
      Camera: '108MP wide + 12MP ultrawide + 10MP telephoto',
      Battery: '5000mAh',
      OS: 'Android 12',
    },
    rating: 4.9,
    reviews: 203,
    relatedProducts: ['smartphone-2', 'smartphone-3', 'accessory-2', 'accessory-4'],
  },
  {
    id: 'smartphone-2',
    name: 'iPhone Pro Max',
    price: 1199.99,
    category: 'smartphones',
    image:
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    description:
      'The iPhone Pro Max is the ultimate iPhone experience. With its Pro camera system, Super Retina XDR display, and A15 Bionic chip, it delivers exceptional performance and capabilities.',
    features: [
      '6.7-inch Super Retina XDR display',
      'Pro camera system',
      'A15 Bionic chip',
      '128GB storage',
      'Face ID',
      'MagSafe',
    ],
    specs: {
      Processor: 'A15 Bionic',
      Memory: '6GB',
      Storage: '128GB',
      Display: '6.7-inch Super Retina XDR (2778 x 1284) 120Hz',
      Camera: '12MP wide + 12MP ultrawide + 12MP telephoto',
      Battery: 'Up to 28 hours video playback',
      OS: 'iOS 15',
    },
    rating: 4.8,
    reviews: 187,
    relatedProducts: ['smartphone-1', 'smartphone-3', 'accessory-3', 'accessory-5'],
  },
  {
    id: 'smartphone-3',
    name: 'Pixel Pro',
    price: 899.99,
    category: 'smartphones',
    image:
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1227&q=80',
    description:
      "The Pixel Pro is known for its exceptional camera capabilities and clean Android experience. It combines Google's software expertise with premium hardware for a seamless user experience.",
    features: [
      '6.4-inch OLED display',
      'Advanced camera system',
      'Google Tensor chip',
      '128GB storage',
      'Fast charging',
      'Adaptive Battery',
    ],
    specs: {
      Processor: 'Google Tensor',
      Memory: '12GB LPDDR5',
      Storage: '128GB UFS 3.1',
      Display: '6.4-inch OLED (3120 x 1440) 120Hz',
      Camera: '50MP wide + 12MP ultrawide + 48MP telephoto',
      Battery: '5003mAh',
      OS: 'Android 12',
    },
    rating: 4.7,
    reviews: 142,
    relatedProducts: ['smartphone-1', 'smartphone-2', 'accessory-1', 'accessory-4'],
  },
  {
    id: 'accessory-1',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 249.99,
    category: 'accessories',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1165&q=80',
    description:
      "These premium wireless headphones feature active noise cancellation, high-quality sound, and long battery life. They're perfect for music lovers and frequent travelers.",
    features: [
      'Active noise cancellation',
      'Bluetooth 5.0',
      '30-hour battery life',
      'Comfortable over-ear design',
      'Built-in microphone',
      'Touch controls',
    ],
    specs: {
      Driver: '40mm dynamic',
      'Frequency Response': '20Hz - 20kHz',
      Bluetooth: '5.0',
      Battery: '30 hours (ANC on)',
      Charging: 'USB-C',
      Weight: '250g',
    },
    rating: 4.6,
    reviews: 98,
    relatedProducts: ['accessory-2', 'accessory-3', 'smartphone-1', 'smartphone-2'],
  },
  {
    id: 'accessory-2',
    name: 'Wireless Charging Pad',
    price: 39.99,
    category: 'accessories',
    image:
      'https://images.unsplash.com/photo-1608751819407-8c8734b2c66a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    description:
      'This wireless charging pad offers fast charging for compatible devices. Its sleek design and compact size make it a perfect addition to your desk or nightstand.',
    features: [
      'Qi wireless charging',
      'Fast charging up to 15W',
      'LED indicator',
      'Anti-slip surface',
      'Overcharge protection',
      'Foreign object detection',
    ],
    specs: {
      Input: 'USB-C',
      Output: 'Up to 15W',
      Compatibility: 'Qi-enabled devices',
      Dimensions: '100 x 100 x 10mm',
      'Cable Length': '1.5m',
      Weight: '120g',
    },
    rating: 4.4,
    reviews: 76,
    relatedProducts: ['accessory-1', 'accessory-4', 'smartphone-1', 'smartphone-2'],
  },
  {
    id: 'accessory-3',
    name: 'Laptop Sleeve',
    price: 29.99,
    category: 'accessories',
    image:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1168&q=80',
    description:
      'This stylish laptop sleeve provides protection for your laptop while on the go. It features a water-resistant exterior and soft interior lining to keep your device safe.',
    features: [
      'Water-resistant exterior',
      'Soft interior lining',
      'Slim design',
      'Front pocket for accessories',
      'Available in multiple sizes',
      'Durable YKK zipper',
    ],
    specs: {
      Material: 'Polyester, Neoprene',
      Sizes: '13-inch, 14-inch, 15-inch, 16-inch',
      Colors: 'Black, Gray, Navy',
      'Water Resistance': 'Yes',
      Dimensions: '35 x 25 x 2cm (14-inch)',
      Weight: '180g',
    },
    rating: 4.5,
    reviews: 112,
    relatedProducts: ['accessory-5', 'laptop-1', 'laptop-2', 'laptop-3'],
  },
  {
    id: 'accessory-4',
    name: 'Bluetooth Speaker',
    price: 79.99,
    category: 'accessories',
    image:
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
    description:
      "This portable Bluetooth speaker delivers rich, clear sound in a compact design. It's water-resistant, has a long battery life, and is perfect for outdoor activities.",
    features: [
      '360° sound',
      'Bluetooth 5.1',
      '12-hour battery life',
      'IPX7 waterproof',
      'Built-in microphone',
      'Compact design',
    ],
    specs: {
      Driver: '2 x 40mm',
      'Output Power': '20W',
      'Frequency Response': '60Hz - 20kHz',
      Battery: '3600mAh',
      Charging: 'USB-C',
      Dimensions: '180 x 70 x 70mm',
      Weight: '540g',
    },
    rating: 4.7,
    reviews: 89,
    relatedProducts: ['accessory-1', 'accessory-2', 'smartphone-1', 'smartphone-3'],
  },
  {
    id: 'accessory-5',
    name: 'External SSD',
    price: 119.99,
    category: 'accessories',
    image:
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80',
    description:
      "This external SSD offers fast data transfer speeds and reliable storage in a compact, durable design. It's perfect for backing up important files or expanding your storage capacity.",
    features: [
      '500GB capacity',
      'USB 3.2 Gen 2',
      'Read speeds up to 1050MB/s',
      'Shock-resistant',
      'Compact design',
      'Compatible with PC, Mac, and gaming consoles',
    ],
    specs: {
      Capacity: '500GB',
      Interface: 'USB 3.2 Gen 2',
      'Read Speed': 'Up to 1050MB/s',
      'Write Speed': 'Up to 1000MB/s',
      Dimensions: '95 x 55 x 8mm',
      Weight: '58g',
      Compatibility: 'Windows, macOS, PS4, PS5, Xbox',
    },
    rating: 4.8,
    reviews: 65,
    relatedProducts: ['accessory-3', 'laptop-1', 'laptop-2', 'laptop-3'],
  },
];
