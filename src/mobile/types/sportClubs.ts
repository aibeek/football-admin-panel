export interface SportClubAddress {
  id: number;
  streetLine1?: string;
  streetLine2?: string;
  cityId?: number;
  cityName?: string;
  zipCode?: string;
  description?: string;
  isPrimary?: boolean;
}

export interface SportClubOpeningHours {
  id: number;
  dayOfWeek: string;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
}

export interface SportClubAgeCategory {
  id: number;
  ageCategory?: string;
  ageCategoryDisplayName?: string;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  categoryDescription?: string;
}

export interface SportClubTeam {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface SportClubItem {
  id: number;
  name: string;
  description?: string;
  clubType?: string;
  addresses: SportClubAddress[];
  openingHours?: SportClubOpeningHours[];
  ageCategories?: SportClubAgeCategory[];
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  facilities?: string;
  membershipFee?: number;
  membershipBenefits?: string;
  sportTypeId?: number;
  sportTypeName?: string;
  establishmentYear?: number;
  active?: boolean;
  memberCount?: number;
  teams?: SportClubTeam[];
}

export type SportClubDetail = SportClubItem;
