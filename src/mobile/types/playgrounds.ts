export interface PlaygroundSportType {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
}

export interface PlaygroundFacility {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  active?: boolean;
}

export interface PlaygroundFacilityMapping {
  id: number;
  facility?: PlaygroundFacility | null;
  quantity?: number;
  notes?: string;
}

export interface PlaygroundItem {
  id: number;
  name: string;
  cityId?: number;
  description?: string;
  maxCapacity?: number;
  currentCapacity?: number;
  pricePerHour?: number;
  availableFrom?: string;
  availableTo?: string;
  active?: boolean;
  images?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  facilities?: PlaygroundFacilityMapping[];
  sportType?: PlaygroundSportType | null;
}

export type PlaygroundDetail = PlaygroundItem;
