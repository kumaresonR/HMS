import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Input,
    Label,
    CardBody,
} from "reactstrap";
import TableContainer from "../../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";


// Define a type for the Patient data
interface PatientData {
    id: number;
    name: string;
    isActive: boolean;
}

const Patient = () => {
    // Dummy Patient data
    const [patientData, setPatientData] = useState<PatientData[]>([
        { id: 1, name: 'John Doe', isActive: true },
        { id: 2, name: 'Jane Smith', isActive: true },
        { id: 3, name: 'Michael Johnson', isActive: false },
    ]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated Patient columns
    const patientColumns = [
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => {
                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const isChecked = e.target.checked;
                    const confirmChange = window.confirm(
                        `Are you sure you want to ${isChecked ? "enable" : "disable"} this option?`
                    );
                    if (!confirmChange) {
                        e.target.checked = !isChecked; // revert the checkbox state if not confirmed
                    } else {
                        // Proceed with the update logic if confirmed
                        console.log(`Checkbox ${isChecked ? "enabled" : "disabled"}`);
                        // Place any additional logic here, such as updating the backend or state
                    }
                };

                return (
                    <div className="form-check form-switch form-check-right mb-2">
                        <Input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckRightDisabled"
                            defaultChecked
                            onChange={handleChange}
                        />
                    </div>
                );
            },
        }

    ];

    // Handler for toggle switch
    const handleToggle = (id: number) => {
        const updatedData = patientData.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
        );
        setPatientData(updatedData); // Update state with the new data
        console.log(`Toggled Patient entry with id: ${id}`);
        console.log(updatedData);
    };

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={patientData}
                />

                <Container fluid>

                    <Row>
                        <Col lg={12}>
                            <Card id="patients">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Patient Settings</h5>
                                            </div>
                                        </div>

                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" className="btn btn-secondary" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                {/* <CardBody> */}


                                    <div>
                                        <TableContainer
                                            columns={patientColumns}
                                            data={patientData}
                                            isGlobalFilter={true}
                                            isCustomerFilter={true}
                                            customPageSize={5}
                                            tableClass="table table-bordered"
                                            theadClass="thead-light"
                                            divClass="table-responsive"
                                        />
                                    </div>
                                {/* </CardBody> */}
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Patient;
