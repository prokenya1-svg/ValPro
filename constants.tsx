


import React from 'react';
import { User, UserType, Job, JobStatus, InspectionTask } from './types';
import { DEFAULT_INSPECTION_TASKS } from './data/inspectionTasks';

export const ICONS = {
  spinner: <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
  bid: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.167-.337c-1.381 0-2.5 1.119-2.5 2.5 0 .341.069.668.195.957a.5.5 0 01-.858.514C4.243 11.65 4 10.849 4 10c0-2.21 1.79-4 4-4 .462 0 .907.079 1.317.227l.11-.11a.5.5 0 01.707 0l.09.09a.5.5 0 010 .707l-.11.11z" /><path d="M14.854 3.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L7.5 9.793l6.646-6.647a.5.5 0 01.708 0z" /></svg>,
  add: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  video: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  microphone: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
};

export const MOCK_USERS: { [key: string]: User } = {
  'user-1': {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    password: 'password',
    userType: UserType.CLIENT,
    avatarUrl: 'https://i.pravatar.cc/150?u=user-1',
  },
  'user-2': {
    id: 'user-2',
    name: 'Vance Refrigeration',
    email: 'contact@vancerefrigeration.com',
    password: 'password',
    userType: UserType.COMPANY,
    companyName: 'Vance Refrigeration',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-2',
  },
  'user-3': {
    id: 'user-3',
    name: 'Charlie Davis',
    email: 'charlie.d@example.com',
    password: 'password',
    userType: UserType.VALUER,
    avatarUrl: 'https://i.pravatar.cc/150?u=user-3',
    location: 'Nairobi County, Kenya',
    rating: 4.8,
    jobsCompleted: 25,
    subscriptionTier: 'Pro',
    specializations: ['Classic Cars', 'Exotics', 'EVs'],
    bidsThisMonth: 5,
    signatureUrl: '/signature-charlie.png',
    verified: true,
    certifications: [
        { name: 'Certified Vehicle Appraiser', issuingOrg: 'Auto Appraisal Network', date: '2020-05-15', status: 'verified' },
        { name: 'EV Valuation Specialist', issuingOrg: 'EV Institute', date: '2022-01-20', status: 'verified' }
    ]
  },
  'user-4': {
    id: 'user-4',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    password: 'password',
    userType: UserType.ADMIN,
    avatarUrl: 'https://i.pravatar.cc/150?u=user-4',
  },
  'user-5': {
    id: 'user-5',
    name: 'Eve Adams',
    email: 'eve.a@example.com',
    password: 'password',
    userType: UserType.VALUER,
    avatarUrl: 'https://i.pravatar.cc/150?u=user-5',
    location: 'Lagos State, Nigeria',
    rating: 4.5,
    jobsCompleted: 12,
    subscriptionTier: 'Free',
    specializations: ['Trucks', 'Motorcycles'],
    bidsThisMonth: 1,
    verified: false,
    certifications: [
        { name: 'Heavy Commercial Vehicle Certification', issuingOrg: 'Trucking Association of Nigeria', date: '2021-08-10', status: 'pending', documentUrl: '#' }
    ]
  },
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-12345',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      vin: '123VIN456ABC',
      imageUrl: 'https://picsum.photos/seed/job-12345/800/600',
      location: { lat: -1.286389, lng: 36.817223, address: 'Nairobi, Kenya' },
      carType: 'small',
    },
    client: MOCK_USERS['user-1'],
    valuer: MOCK_USERS['user-3'],
    status: JobStatus.IN_PROGRESS,
    createdAt: new Date('2023-10-26'),
    photos: ['https://picsum.photos/seed/photo1/400/300', 'https://picsum.photos/seed/photo2/400/300'],
    videos: [],
    documents: [{ name: 'Vehicle_Registration.pdf', url: '#', uploadedBy: 'Alice Johnson', uploadedAt: new Date('2023-10-25') }],
    signatures: {
      client: { userId: 'user-1', userName: 'Alice Johnson', signatureUrl: '', signedAt: new Date('2023-10-27')},
    },
    notes: "Initial inspection shows minor scratches on the rear bumper. Client has been notified.",
    paymentInfo: { amount: 4000, paid: true, paidAt: new Date('2023-10-26')},
    inspectionTasks: DEFAULT_INSPECTION_TASKS.map((task, index) => ({ ...task, completed: index < 2 })), // Mark first 2 as complete for demo
  },
  {
    id: 'job-67890',
    vehicle: {
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      vin: '789VIN012DEF',
      imageUrl: 'https://picsum.photos/seed/job-67890/800/600',
      location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
       carType: 'small',
    },
    client: MOCK_USERS['user-2'],
    valuer: MOCK_USERS['user-3'],
    status: JobStatus.COMPLETED,
    createdAt: new Date('2023-09-15'),
    photos: ['https://picsum.photos/seed/photo3/400/300'],
    videos: [],
    signatures: {
      client: { userId: 'user-2', userName: 'Vance Refrigeration', signatureUrl: '', signedAt: new Date('2023-09-20')},
      valuer: { userId: 'user-3', userName: 'Charlie Davis', signatureUrl: '', signedAt: new Date('2023-09-21')},
      admin: { userId: 'user-4', userName: 'Diana Prince', signatureUrl: '', signedAt: new Date('2023-09-21')},
    },
    paymentInfo: { amount: 6000, paid: true, paidAt: new Date('2023-09-15')},
    payoutInfo: { amount: 4800, paid: true, paidAt: new Date('2023-09-22'), transactionId: 'MPESA-QWERTY123' },
    review: {
        rating: 5,
        comment: "Charlie was extremely professional and thorough. The final report was detailed and delivered on time. Highly recommend!",
        clientName: 'Vance Refrigeration',
        createdAt: new Date('2023-09-22'),
    },
  },
  {
    id: 'job-ABCDE',
    vehicle: {
      make: 'Ford',
      model: 'Mustang',
      year: 2023,
      vin: 'ABCDEVIN123',
      imageUrl: 'https://picsum.photos/seed/job-ABCDE/800/600',
      location: { lat: 25.7617, lng: -80.1918, address: 'Miami, FL' },
      carType: 'big',
    },
    client: MOCK_USERS['user-1'],
    status: JobStatus.OPEN_FOR_BIDS,
    createdAt: new Date('2023-10-28'),
    photos: [],
    videos: [],
    signatures: {},
    bids: [
      { valuerId: 'user-5', valuerName: 'Eve Adams', amount: 5000, createdAt: new Date() }
    ],
    paymentInfo: { amount: 6000, paid: true, paidAt: new Date('2023-10-28')},
  },
  {
    id: 'job-FGHIJ',
    vehicle: {
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      vin: 'FGHIJVIN456',
      imageUrl: 'https://picsum.photos/seed/job-FGHIJ/800/600',
      location: { lat: 37.7749, lng: -122.4194, address: 'Westlands, Nairobi County, Kenya' },
      carType: 'small',
    },
    client: MOCK_USERS['user-2'],
    status: JobStatus.NEW,
    createdAt: new Date('2023-10-29'),
    photos: ['https://picsum.photos/seed/photo4/400/300', 'https://picsum.photos/seed/photo5/400/300', 'https://picsum.photos/seed/photo6/400/300'],
    videos: [],
    signatures: {},
  },
   {
    id: 'job-KLMNO',
    vehicle: {
      make: 'Porsche',
      model: '911',
      year: 2022,
      vin: 'KLMNOVIN789',
      imageUrl: 'https://picsum.photos/seed/job-KLMNO/800/600',
      location: { lat: 36.1699, lng: -115.1398, address: 'Ikeja, Lagos State, Nigeria' },
      carType: 'big',
    },
    client: MOCK_USERS['user-1'],
    status: JobStatus.OPEN_FOR_BIDS,
    createdAt: new Date('2023-10-30'),
    photos: [],
    videos: [],
    signatures: {},
    bids: [],
    paymentInfo: { amount: 6000, paid: true, paidAt: new Date('2023-10-30')},
  },
];