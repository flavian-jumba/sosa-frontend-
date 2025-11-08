export interface Cottage {
  id: number;
  name: string;
  image: string;
  price: number;
  capacity: number;
  description: string;
  amenities: string[];
}

export const cottages: Cottage[] = [
  {
    id: 1,
    name: "Garden View Cottage",
    image: "/placeholder.svg",
    price: 8500,
    capacity: 4,
    description: "Spacious cottage with stunning garden views and modern amenities.",
    amenities: ["Free WiFi", "Breakfast Included", "Air Conditioning", "Private Bathroom", "TV"],
  },
  {
    id: 2,
    name: "Forest Retreat",
    image: "/placeholder.svg",
    price: 10000,
    capacity: 6,
    description: "Luxurious cottage nestled in the forest, perfect for families.",
    amenities: [
      "Free WiFi",
      "Breakfast Included",
      "Air Conditioning",
      "Private Bathroom",
      "TV",
      "Kitchenette",
    ],
  },
  {
    id: 3,
    name: "Lakeside Haven",
    image: "/placeholder.svg",
    price: 9000,
    capacity: 4,
    description: "Peaceful cottage with beautiful lake views and private terrace.",
    amenities: [
      "Free WiFi",
      "Breakfast Included",
      "Air Conditioning",
      "Private Bathroom",
      "TV",
      "Balcony",
    ],
  },
  {
    id: 4,
    name: "Premium Suite",
    image: "/placeholder.svg",
    price: 12000,
    capacity: 6,
    description: "Our most luxurious cottage with premium amenities and services.",
    amenities: [
      "Free WiFi",
      "Breakfast Included",
      "Air Conditioning",
      "Private Bathroom",
      "TV",
      "Kitchenette",
      "Room Service",
    ],
  },
];
