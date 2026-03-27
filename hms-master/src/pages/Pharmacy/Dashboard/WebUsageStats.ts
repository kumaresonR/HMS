// Sample data representing medicine stock details
export const medicines = [
  {
    label: 'Paracetamol',
    value: 500, // Quantity in milligrams (or another unit)
  },
  {
    label: 'Aspirin',
    value: 300, // Quantity in milligrams (or another unit)
  },
  {
    label: 'Ibuprofen',
    value: 200, // Quantity in milligrams (or another unit)
  },
  {
    label: 'Amoxicillin',
    value: 1000, // Quantity in milligrams (or another unit)
  },

];

// Normalize function for calculating medicine stock proportion based on a total available stock value
const normalize = (v: number, totalStock: number) => Number.parseFloat(((v * totalStock) / 100).toFixed(2));

// Define the total stock or other reference values (this could be a predefined total stock or specific calculation)
export const totalStock = 10000; // Example: total stock available across all medicines

// Merge the normalized data for each medicine, calculating its proportion based on the total stock
export const normalizedMedicines = medicines.map((medicine) => ({
  ...medicine,
  value: normalize(medicine.value, totalStock), // Normalize based on total stock
}));

// Formatter for displaying medicine quantities in a user-friendly way (e.g., in mg or units)
export const valueFormatter = (item: { value: number }) => `${item.value} mg`; // Adjust unit as needed
