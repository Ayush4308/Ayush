import { Farm } from '../types';

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-punjab-01',
    farmerName: 'Sardar Gurpreet Singh',
    phone: '9876543210',
    smsConsent: true,
    state: 'Punjab',
    district: 'Sangrur',
    village: 'Moonak (Near Ghaggar River)',
    centerLocation: { lat: 29.855, lng: 76.015 },
    polygon: [
      { lat: 29.852, lng: 76.010 },
      { lat: 29.858, lng: 76.012 },
      { lat: 29.859, lng: 76.022 },
      { lat: 29.853, lng: 76.020 }
    ],
    cropType: 'paddy',
    cropVariety: 'PR-126 (Short Duration)',
    plantingDate: '2024-06-25',
    growthStage: 'flowering',
    areaSqm: 40468.56, // 10 Acres = 80 Kanals = 40,468.56 m²
    enteredArea: 80,
    enteredUnit: 'punjab_kanal',
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-08-16T08:00:00Z'
  },
  {
    id: 'farm-up-02',
    farmerName: 'Ram Kumar Yadav',
    phone: '9812345678',
    smsConsent: true,
    state: 'Uttar Pradesh',
    district: 'Gorakhpur',
    village: 'Pipraich, Rapti Riverplain',
    centerLocation: { lat: 26.755, lng: 83.385 },
    polygon: [
      { lat: 26.752, lng: 83.380 },
      { lat: 26.759, lng: 83.382 },
      { lat: 26.758, lng: 83.392 },
      { lat: 26.751, lng: 83.390 }
    ],
    cropType: 'sugarcane',
    cropVariety: 'Co 0238',
    plantingDate: '2024-03-15',
    growthStage: 'vegetative',
    areaSqm: 15175.71, // 6 Pucca Bigha = 15,175.7 m²
    enteredArea: 6,
    enteredUnit: 'up_pucca_bigha',
    createdAt: '2024-06-12T11:30:00Z',
    updatedAt: '2024-08-15T09:00:00Z'
  },
  {
    id: 'farm-bihar-03',
    farmerName: 'Manoj Kumar Mandal',
    phone: '9431200000',
    smsConsent: true,
    state: 'Bihar',
    district: 'Supaul',
    village: 'Nirmali (Kosi Floodplain)',
    centerLocation: { lat: 26.135, lng: 86.595 },
    polygon: [
      { lat: 26.130, lng: 86.590 },
      { lat: 26.138, lng: 86.592 },
      { lat: 26.140, lng: 86.602 },
      { lat: 26.132, lng: 86.600 }
    ],
    cropType: 'maize',
    cropVariety: 'DKC 9108',
    plantingDate: '2024-06-10',
    growthStage: 'flowering',
    areaSqm: 20234.0, // ~8 Bigha Bihar = 20,234 m²
    enteredArea: 8,
    enteredUnit: 'bihar_bigha',
    createdAt: '2024-07-10T08:00:00Z',
    updatedAt: '2024-08-16T12:00:00Z'
  }
];
