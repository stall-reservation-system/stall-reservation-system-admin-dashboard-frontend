// Centralized mock data used by the in-browser mock REST endpoints

export const mockProfile = {
  employeeId: "CMBF001",
  firstName: "Nuwan",
  lastName: "Perera",
  email: "admin@bookfair.lk",
  phone: "+94 77 123 4567",
  address: "No. 123, Main Street, Colombo, Sri Lanka",
  role: "Administrator",
  dob: "1990-07-15",
  nic: "901234567V",
  joined: "Jan 10, 2023",
  lastLogin: "Nov 2, 2025, 09:15 AM",
  avatar:
    "https://ui-avatars.com/api/?name=Nuwan+Perera&background=0D8ABC&color=fff",
};

export const mockReservations = [
  {
    id: "R001",
    publisher: "Sarasavi Bookshop",
    contact: "+94 77 123 4567",
    email: "info@sarasavi.lk",
    stalls: ["A12", "A13"],
    genre: "General Books",
    emailSent: true,
    status: "confirmed",
    qrCode: "QR001",
  },
  {
    id: "R002",
    publisher: "Vijitha Yapa",
    contact: "+94 77 234 5678",
    email: "contact@vijithayapa.com",
    stalls: ["B05"],
    genre: "Academic",
    emailSent: false,
    status: "pending",
    qrCode: "QR002",
  },
  {
    id: "R003",
    publisher: "Godage Publishers",
    contact: "+94 77 345 6789",
    email: "info@godagepublishers.lk",
    stalls: ["C20", "C21", "C22"],
    genre: "Literature",
    emailSent: true,
    status: "confirmed",
    qrCode: "QR003",
  },
];

export const mockStalls = [
  // A small set to demonstrate functionality
  {
    id: "A01",
    size: "small",
    status: "reserved",
    publisher: "Sarasavi Bookshop",
  },
  { id: "A02", size: "small", status: "available" },
  { id: "B01", size: "medium", status: "reserved", publisher: "Vijitha Yapa" },
  { id: "C01", size: "large", status: "available" },
];

export const mockVendors = [
  {
    id: "V001",
    name: "Sarasavi Bookshop",
    contact: "+94 77 123 4567",
    email: "info@sarasavi.lk",
    stalls: ["A12", "A13"],
    category: "General Books",
  },
  {
    id: "V002",
    name: "Vijitha Yapa",
    contact: "+94 77 234 5678",
    email: "contact@vijithayapa.com",
    stalls: ["B05"],
    category: "Academic",
  },
];

// New mock businesses data matching backend response
export const mockBusinesses = [
  {
    businessId: 1,
    name: "Sarasavi Publishers",
    registrationNumber: "SAR-001",
    contactNumber: "0112233445",
    address: "Colombo",
    createdAt: "2025-11-10T20:20:56.825578",
    verified: true,
  },
  {
    businessId: 2,
    name: "MD Gunasena",
    registrationNumber: "MDG-002",
    contactNumber: "0114567890",
    address: "Colombo",
    createdAt: "2025-11-10T20:20:56.921703",
    verified: true,
  },
];

export const mockDashboard = {
  stats: [
    { title: "Total Stalls", value: 4, color: "text-primary" },
    { title: "Reserved", value: 2, color: "text-green-600" },
    { title: "Available", value: 2, color: "text-highlight" },
    { title: "Pending Email", value: 1, color: "text-destructive" },
  ],
  recentActivity: [
    {
      publisher: "Sarasavi Bookshop",
      stalls: "A12, A13",
      time: "2 hours ago",
      status: "confirmed",
    },
    {
      publisher: "Vijitha Yapa",
      stalls: "B05",
      time: "5 hours ago",
      status: "pending",
    },
    {
      publisher: "Godage Publishers",
      stalls: "C20, C21, C22",
      time: "1 day ago",
      status: "confirmed",
    },
  ],
};
