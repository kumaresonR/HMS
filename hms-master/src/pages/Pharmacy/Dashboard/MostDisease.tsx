import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Progress } from 'reactstrap';
import './progressBar.css';
import DashboardApiService from '../../../helpers/services/dashboard/dashboard-api-service';

const medicines = [
  { name: "Paracetamol", usage: 80 },
  { name: "Ibuprofen", usage: 65 },
  { name: "Aspirin", usage: 50 },
  { name: "Antibiotics", usage: 90 },
  { name: "Antacids", usage: 70 },
  { name: "Cough Syrup", usage: 60 },
  { name: "Vitamin C", usage: 75 },
  { name: "Painkillers", usage: 85 },
  { name: "Insulin", usage: 45 },
  { name: "Multivitamins", usage: 55 },
];

const MedicinePopularity = () => {
  const dashboardApiService: DashboardApiService = new DashboardApiService();

  const [data,setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const medicinesPerPage = 5;

  // Calculate medicine details to display
  const totalPages = Math.ceil(medicines.length / medicinesPerPage);
  const indexOfLastMedicine = currentPage * medicinesPerPage;
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage;
  const currentMedicines = medicines.slice(indexOfFirstMedicine, indexOfLastMedicine);

  // Function to handle page change
  const paginate = (pageNumber: any) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getAllData = async () => {
    try {
      let data = await dashboardApiService.getAllCommonMedicines();
      setData(data);
      console.log("data", data)
    } catch (error: any) {
      console.log("getAllData Error");
      console.log(error);
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div className="container">
      <Card className="card">
        <CardHeader className="border-0 align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Commonly Used Medicines</h4>
        </CardHeader>
        <CardBody>
          {currentMedicines.map((medicine, index) => (
            <div key={index} className="mb-4">
              <div className="d-flex justify-content-between">
                <span>{medicine.name}</span>
                <span>{medicine.usage}%</span>
              </div>
              <Progress
                value={medicine.usage}
                color={getProgressColor(medicine.usage)}
                className="animated-progress custom-progress"
              />
            </div>
          ))}

          {/* Pagination Section */}
          <div className="align-items-center mt-4 d-flex justify-content-between">
            <div className="text-muted">
              Showing <span className="fw-semibold">{currentMedicines.length}</span> of{" "}
              <span className="fw-semibold">{medicines.length}</span> Results
            </div>
            <ul className="pagination pagination-separated pagination-sm mb-0">
              <li className="page-item" onClick={() => paginate(currentPage - 1)}>
                <button className="page-link" disabled={currentPage === 1}>←</button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className="page-item" onClick={() => paginate(currentPage + 1)}>
                <button className="page-link" disabled={currentPage === totalPages}>→</button>
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Function to set progress bar color
const getProgressColor = (usage: any) => {
  if (usage <= 20) return "primary";
  if (usage <= 40) return "success";
  if (usage <= 60) return "info";
  if (usage <= 80) return "warning";
  return "danger";
};

export default MedicinePopularity;
