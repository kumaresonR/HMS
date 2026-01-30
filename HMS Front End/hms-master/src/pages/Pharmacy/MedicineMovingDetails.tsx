import React, { useEffect, useState } from "react";
import TableContainer from "../../Components/Common/TableContainer";
import ErrorHandler from "../../helpers/ErrorHandler";
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { IoArrowBack } from "react-icons/io5";
import MedicinePurchase from "./MedicinePurchase";
import { useDispatch } from "react-redux";
import FormHeader from "../../common/FormHeader/FormHeader";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const MedicineMovingDetails = () => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    const dispatch = useDispatch();
    const location = useLocation();

    const [medicineData, setmedicineData] = useState([]);
    // const [getMedicinePurchase, setMedicinePurchase] = useState<boolean>(false);
    // const [selectedData, setSelectedData] = useState<any>();
    // const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // ✅ New state to track dropdown selection
    const [selectedOption, setSelectedOption] = useState<string>("fastMovingMedicine");

    // ✅ Fetch data based on selected option
    const fetchMedicineData = async () => {
        try {
            let response;
            switch (selectedOption) {
                case "fastMovingMedicine":
                    response = await pharmacyApiService.getFastMovingMedicines();
                    break;
                case "lowMovingMedicine":
                    response = await pharmacyApiService.getLowMovingMedicines();
                    break;
                case "notSaleMedicine":
                    response = await pharmacyApiService.getNotSaleMedicines();
                    break;
                default:
                    response = [];
            }
            setmedicineData(response || []);
        } catch (error) {
            console.log("Error:" + error)
        }
    };

    // ✅ Trigger fetch whenever dropdown changes
    useEffect(() => {
        fetchMedicineData();
    }, [selectedOption]);

    // ✅ Your column setup remains untouched
    const MedicineColumns = [
        {
            header: 'Medicine Name',
            accessorKey: 'medicineName',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div className="text-primary">
                        {value ? value : 'N/A'}
                    </div>
                );
            },
        },

        {
            header: 'Medicine Category',
            accessorKey: 'medicineCategory',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div>
                        {value ? value : 'N/A'}
                    </div>
                );
            },
        },
        {
            header: 'Quantity Sold',
            accessorKey: 'totalQuantity',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div>
                        {value ? value : 'N/A'}
                    </div>
                );
            },
        }
    ];
    return (
        <Container fluid>
            <Row>
                <Col>
                    <FormHeader title="Medicine Report" />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={4}>
                    {/* ✅ Dropdown UI */}
                    <select
                        className="form-select"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        <option value="fastMovingMedicine">Fast Moving Medicine</option>
                        <option value="lowMovingMedicine">Low Moving Medicine</option>
                        <option value="notSaleMedicine">Not Sale Medicine</option>
                    </select>
                </Col>
            </Row>

            {/* ✅ Table Rendering */}
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <h5 className="mb-0">List of Medicines</h5>
                        </CardHeader>
                        <CardBody>
                            <TableContainer
                                columns={MedicineColumns}
                                data={medicineData}
                                isGlobalFilter={true}
                                // isAddOptions={false}
                                customPageSize={10}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MedicineMovingDetails;
