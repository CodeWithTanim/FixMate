export type UserRole = "customer" | "technician" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
  createdAt?: string;
}

export type ServiceCategory =
  | "Smartphone"
  | "Laptop & PC"
  | "AC"
  | "Refrigerator"
  | "TV"
  | "Washing Machine"
  | "Electrical";

export type ServiceMode = "Home Visit" | "Shop Drop-off";

export interface ServiceItem {
  id: string;
  _id?: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  technicianId?: string;
  technician?: {
    id?: string;
    name?: string;
    image?: string | null;
    area?: string | null;
    bio?: string | null;
  };
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
}
