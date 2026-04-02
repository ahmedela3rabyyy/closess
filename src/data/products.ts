export interface Product {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: 'men' | 'women' | 'accessories';
  sizes: string[];
  colors: { name: string; hex: string }[];
  soldOut: boolean;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'MEN BOXY BABY BLUE',
    subtitle: 'KNITTED CREW NECK',
    description: 'Oversized boxy fit knitted sweater in soft baby blue. Made from premium wool blend for ultimate comfort and warmth. Features dropped shoulders and ribbed cuffs.',
    price: 89,
    originalPrice: 120,
    image: '/product-blue.jpg',
    images: ['/product-blue.jpg', '/product-blue.jpg', '/product-blue.jpg'],
    category: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Baby Blue', hex: '#87CEEB' }],
    soldOut: true,
    isSale: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: 'MEN BOXY PINK',
    subtitle: 'KNITTED CREW NECK',
    description: 'Oversized boxy fit knitted sweater in soft pastel pink. Made from premium wool blend for ultimate comfort and warmth. Features dropped shoulders and ribbed cuffs.',
    price: 89,
    originalPrice: 120,
    image: '/product-pink.jpg',
    images: ['/product-pink.jpg', '/product-pink.jpg', '/product-pink.jpg'],
    category: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Pastel Pink', hex: '#FFB6C1' }],
    soldOut: true,
    isSale: true,
    rating: 4.7,
    reviews: 98,
  },
  {
    id: 3,
    name: 'WOMEN CROP BEIGE',
    subtitle: 'CABLE KNIT SWEATER',
    description: 'Stylish cropped cable knit sweater in warm beige. Perfect for layering with high-waisted jeans. Features a relaxed fit and soft texture.',
    price: 75,
    image: '/product-women-beige.jpg',
    images: ['/product-women-beige.jpg', '/product-women-beige.jpg'],
    category: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Beige', hex: '#F5F5DC' }],
    soldOut: false,
    isNew: true,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: 4,
    name: 'WOMEN OVERSIZED GREY',
    subtitle: 'CHUNKY KNIT CARDIGAN',
    description: 'Ultra-soft oversized cardigan in heather grey. Features large buttons and deep pockets. Perfect for cozy days.',
    price: 95,
    image: '/product-women-grey.jpg',
    images: ['/product-women-grey.jpg', '/product-women-grey.jpg'],
    category: 'women',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Grey', hex: '#808080' }],
    soldOut: false,
    rating: 4.6,
    reviews: 45,
  },
  {
    id: 5,
    name: 'CLASSIC BLACK BEANIE',
    subtitle: 'RIBBED KNIT HAT',
    description: 'Essential ribbed beanie in classic black. Made from soft acrylic blend. One size fits all.',
    price: 25,
    image: '/product-beanie.jpg',
    images: ['/product-beanie.jpg'],
    category: 'accessories',
    sizes: ['One Size'],
    colors: [{ name: 'Black', hex: '#000000' }, { name: 'Grey', hex: '#808080' }],
    soldOut: false,
    rating: 4.5,
    reviews: 234,
  },
  {
    id: 6,
    name: 'WOOL BLEND SCARF',
    subtitle: 'CHUNKY KNIT SCARF',
    description: 'Luxurious wool blend scarf in cream. Extra long and warm, perfect for winter days.',
    price: 45,
    image: '/product-scarf.jpg',
    images: ['/product-scarf.jpg'],
    category: 'accessories',
    sizes: ['One Size'],
    colors: [{ name: 'Cream', hex: '#FFFDD0' }, { name: 'Black', hex: '#000000' }],
    soldOut: false,
    isNew: true,
    rating: 4.8,
    reviews: 89,
  },
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.subtitle.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
  );
};
