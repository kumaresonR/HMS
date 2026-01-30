import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

import { Link } from "react-router-dom";

const SpecialistList = () => {
    // Dummy specialist data
    const specialistData = [
        { id: 1, specialistName: 'Dr. John Doe', specialty: 'Cardiology', phone: '7896541230', experience: '10 Years', clinicAddress: '482 Kingsway, Brooklyn West, CA', status: 'Active', action: 'View' },
        { id: 2, specialistName: 'Dr. Jane Smith', specialty: 'Dermatology', phone: '7891234567', experience: '12 Years', clinicAddress: '789 Main St, Springfield, IL', status: 'Active', action: 'View' },
        { id: 3, specialistName: 'Dr. James Brown', specialty: 'Neurology', phone: '7894561230', experience: '15 Years', clinicAddress: '123 Park Ave, New York, NY', status: 'Inactive', action: 'View' },
        { id: 4, specialistName: 'Dr. Emily White', specialty: 'Pediatrics', phone: '1237894560', experience: '8 Years', clinicAddress: '456 Elm St, Los Angeles, CA', status: 'Active', action: 'View' },
        { id: 5, specialistName: 'Dr. Daniel Green', specialty: 'Orthopedics', phone: '4567891230', experience: '20 Years', clinicAddress: '789 Oak St, Houston, TX', status: 'Inactive', action: 'View' },
        { id: 6, specialistName: 'Dr. Sophia King', specialty: 'Ophthalmology', phone: '1597534568', experience: '5 Years', clinicAddress: '321 Maple St, Miami, FL', status: 'Active', action: 'View' },
        { id: 7, specialistName: 'Dr. Liam Turner', specialty: 'General Medicine', phone: '9638527410', experience: '18 Years', clinicAddress: '654 Pine St, San Francisco, CA', status: 'Inactive', action: 'View' },
        { id: 8, specialistName: 'Dr. Mia Scott', specialty: 'Dentistry', phone: '8529637412', experience: '7 Years', clinicAddress: '987 Cedar St, Seattle, WA', status: 'Active', action: 'View' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated specialist columns
    const specialistColumns = [
        {
            header: '#',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Specialist Name',
            accessorKey: 'specialistName',
            enableColumnFilter: false,
        },
        {
            header: 'Specialty',
            accessorKey: 'specialty',
            enableColumnFilter: false,
        },
        {
            header: 'Phone',
            accessorKey: 'phone',
            enableColumnFilter: false,
        },
        {
            header: 'Experience',
            accessorKey: 'experience',
            enableColumnFilter: false,
        },
        {
            header: 'Clinic Address',
            accessorKey: 'clinicAddress',
            enableColumnFilter: false,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => {
                return (
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item" title="Edit">
                            <Link className="edit-item-btn" to="#">
                                <i className="ri-pencil-fill align-bottom text-muted"></i>
                            </Link>
                        </li>
                        <li className="list-inline-item" title="Delete">
                            <Link className="remove-item-btn" to="#">
                                <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                            </Link>
                        </li>
                    </ul>
                );
            },
        },
    ];

    return (
        <React.Fragment>
            <div>
                <Container fluid>

                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <ExportCSVModal
                                    show={isExportCSV}
                                    onCloseClick={() => setIsExportCSV(false)}
                                    data={specialistData}
                                />
                                <Row>
                                    <Col lg={12}>
                                        <Card id="specialistList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Specialist List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addSpecialist'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Specialist
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                className="btn btn-secondary"
                                                                onClick={() => setIsExportCSV(true)}
                                                            >
                                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                                Export
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Row>
                                            </CardHeader>
                                            <div className="card-body pt-0">
                                                <div>
                                                    <TableContainer
                                                        columns={specialistColumns}
                                                        data={specialistData}
                                                        isGlobalFilter={true}
                                                        isCustomerFilter={true}
                                                        customPageSize={5}
                                                        tableClass="table table-bordered"
                                                        theadClass="thead-light"
                                                        divClass="table-responsive"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default SpecialistList;
