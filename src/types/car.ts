export type CarCategory = 'Sedan' | 'SUV' | 'Luxury' | 'Electric' | 'Sports';
export type CarFuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type CarTransmission = 'Automatic' | 'Manual';

export interface Car {
  _id: string;
  id?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  category: CarCategory | string;
  fuelType: CarFuelType | string;
  transmission: CarTransmission | string;
  seats: number;
  images: string[];
  isAvailable: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarFilterState {
  search: string;
  brand: string;
  category: string;
  fuelType: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  isAvailableOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'year-desc';
}
