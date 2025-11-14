


export enum UserType {
  VALUER = 'Valuer',
  COMPANY = 'Company',
  CLIENT = 'Client',
  ADMIN = 'Admin',
}

export interface Certification {
  name: string;
  issuingOrg: string;
  date: string; // Using string for simplicity in mock data
  documentUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  userType: UserType;
  avatarUrl: string;
  companyName?: string;
  signatureUrl?: string;
  location?: string;
  rating?: number;
  jobsCompleted?: number;
  subscriptionTier?: 'Free' | 'Pro' | 'Enterprise';
  specializations?: string[];
  bidsThisMonth?: number;
  certifications?: Certification[];
  notes?: string;
  verified?: boolean;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  vin: string;
  imageUrl: string;
  carType?: 'small' | 'big';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export enum JobStatus {
  PENDING_PAYMENT = 'Pending Payment',
  OPEN_FOR_BIDS = 'Open for Bids',
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  REVISIONS_REQUESTED = 'Revisions Requested',
  REPORT_READY = 'Report Ready',
  PENDING_CLIENT_SIGNATURE = 'Pending Client Signature',
  PENDING_VALUER_SIGNATURE = 'Pending Valuer Signature',
  PENDING_FINAL_SIGNATURE = 'Pending Final Signature',
  COMPLETED = 'Completed',
}

export interface Signature {
  userId: string;
  userName: string;
  signatureUrl: string;
  signedAt: Date;
}

export interface Bid {
  valuerId: string;
  valuerName: string;
  amount: number;
  createdAt: Date;
}

export interface PaymentInfo {
    amount: number;
    paid: boolean;
    paidAt?: Date;
}

export interface PayoutInfo {
    amount: number;
    paid: boolean;
    paidAt: Date;
    transactionId: string;
}

export interface InspectionTask {
    text: string;
    completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  text: string;
  createdAt: Date;
}

export interface Document {
    name: string;
    url: string;
    uploadedBy: string;
    uploadedAt: Date;
}

export interface Review {
    rating: number; // 1-5
    comment: string;
    clientName: string;
    createdAt: Date;
}

export type InspectionPoint = 
    | 'front-bumper' | 'rear-bumper' | 'hood' | 'roof' | 'trunk'
    | 'driver-door' | 'passenger-door' | 'driver-rear-door' | 'passenger-rear-door'
    | 'windshield' | 'rear-window'
    | 'front-left-tire' | 'front-right-tire' | 'rear-left-tire' | 'rear-right-tire'
    | 'engine' | 'interior';

export interface InspectionPointData {
    notes?: string;
    photoUrl?: string;
    aiAnalysis?: string;
}

export interface Job {
  id: string;
  vehicle: Vehicle;
  client: User;
  valuer?: User;
  status: JobStatus;
  createdAt: Date;
  reportUrl?: string;
  photos: string[];
  videos?: string[];
  documents?: Document[];
  signatures: {
    client?: Signature;
    valuer?: Signature;
    admin?: Signature;
  };
  bids?: Bid[];
  notes?: string;
  paymentInfo?: PaymentInfo;
  payoutInfo?: PayoutInfo;
  inspectionTasks?: InspectionTask[];
  interactiveInspectionData?: Partial<Record<InspectionPoint, InspectionPointData>>;
  comments?: Comment[];
  aiDamageReport?: string;
  damageNotes?: string;
  review?: Review;
}

export interface ValuationResult {
    valueRange: {
        min: number;
        max: number;
    };
    confidenceScore: number;
    justification: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  sources?: GroundingSource[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}