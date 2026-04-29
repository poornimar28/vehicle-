export const MOCK_VEHICLES = [
  { id: 1, modelNumber: 'MH12-AB-1234', chassisNumber: 'CHN-2020-HONDA-001', make: 'Honda', model: 'City', year: 2020, createdAt: '2024-01-15' },
  { id: 2, modelNumber: 'MH14-XY-5678', chassisNumber: 'CHN-2019-SWIFT-002', make: 'Maruti', model: 'Swift', year: 2019, createdAt: '2024-02-10' },
]

export const MOCK_APPOINTMENTS = [
  { id: 1, vehicleId: 1, vehicle: { modelNumber: 'MH12-AB-1234', make: 'Honda', model: 'City' }, date: '2025-05-20', timeSlot: '10:00 AM', status: 'ACCEPTED', notes: 'Regular service' },
  { id: 2, vehicleId: 2, vehicle: { modelNumber: 'MH14-XY-5678', make: 'Maruti', model: 'Swift' }, date: '2025-05-25', timeSlot: '02:00 PM', status: 'BOOKED', notes: 'Oil change' },
  { id: 3, vehicleId: 1, vehicle: { modelNumber: 'MH12-AB-1234', make: 'Honda', model: 'City' }, date: '2025-04-10', timeSlot: '11:00 AM', status: 'COMPLETED', notes: 'Brake check' },
]

export const MOCK_SERVICE_HISTORY = [
  { id: 1, vehicle: { modelNumber: 'MH12-AB-1234', make: 'Honda', model: 'City' }, date: '2025-04-10', faults: 'Brake pads worn, minor oil leak', notes: 'Replaced brake pads, topped oil', cost: 4500, healthStatus: 'Good', mechanic: 'Ravi Kumar', rating: 4 },
  { id: 2, vehicle: { modelNumber: 'MH14-XY-5678', make: 'Maruti', model: 'Swift' }, date: '2025-03-05', faults: 'Engine noise, coolant low', notes: 'Fixed gasket, refilled coolant', cost: 8200, healthStatus: 'Moderate', mechanic: 'Suresh Patil', rating: 3 },
]

export const MOCK_ADMIN_REQUESTS = [
  { id: 1, customer: { name: 'Ananya Sharma', email: 'ananya@email.com' }, vehicle: { modelNumber: 'MH12-AB-1234', make: 'Honda', model: 'City' }, date: '2025-05-20', timeSlot: '10:00 AM', status: 'BOOKED', notes: 'Full service' },
  { id: 2, customer: { name: 'Rohan Mehta', email: 'rohan@email.com' }, vehicle: { modelNumber: 'MH14-XY-5678', make: 'Maruti', model: 'Swift' }, date: '2025-05-25', timeSlot: '02:00 PM', status: 'BOOKED', notes: 'Oil change only' },
  { id: 3, customer: { name: 'Priya Verma', email: 'priya@email.com' }, vehicle: { modelNumber: 'DL09-ZZ-9999', make: 'Hyundai', model: 'i20' }, date: '2025-05-18', timeSlot: '09:00 AM', status: 'ACCEPTED', notes: 'AC not working' },
  { id: 4, customer: { name: 'Kiran Joshi', email: 'kiran@email.com' }, vehicle: { modelNumber: 'KA03-MN-4567', make: 'Tata', model: 'Nexon' }, date: '2025-05-15', timeSlot: '11:00 AM', status: 'COMPLETED', notes: 'Engine overhaul' },
]

export const MOCK_MECHANIC_JOBS = [
  { id: 1, vehicle: { modelNumber: 'DL09-ZZ-9999', make: 'Hyundai', model: 'i20' }, customer: { name: 'Priya Verma' }, date: '2025-05-18', timeSlot: '09:00 AM', status: 'ACCEPTED', faults: '', notes: '' },
  { id: 2, vehicle: { modelNumber: 'KA03-MN-4567', make: 'Tata', model: 'Nexon' }, customer: { name: 'Kiran Joshi' }, date: '2025-05-15', timeSlot: '11:00 AM', status: 'ACCEPTED', faults: 'Transmission slip', notes: 'Needs full check' },
]

export const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
]
