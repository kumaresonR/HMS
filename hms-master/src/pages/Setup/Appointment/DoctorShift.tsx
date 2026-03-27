import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Button,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import { Link } from "react-router-dom";
import FormHeader from "../../../common/FormHeader/FormHeader";

const DoctorShift = () => {
    // Dummy doctor shift data
    const doctorData = [
        { id: 1, doctorName: 'Dr. John Doe', morning: true, evening: false },
        { id: 2, doctorName: 'Dr. Jane Smith', morning: false, evening: true },
        { id: 3, doctorName: 'Dr. James Brown', morning: true, evening: true },
        { id: 4, doctorName: 'Dr. Emily White', morning: false, evening: false },
        { id: 5, doctorName: 'Dr. Daniel Green', morning: true, evening: false },
        { id: 6, doctorName: 'Dr. Sophia King', morning: true, evening: true },
        { id: 7, doctorName: 'Dr. Liam Turner', morning: false, evening: true },
        { id: 8, doctorName: 'Dr. Mia Scott', morning: true, evening: false },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated doctor shift columns
    const doctorColumns = [
        {
            header: '#',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Doctor Name',
            accessorKey: 'doctorName',
            enableColumnFilter: false,
        },
        {
            header: 'Morning Shift',
            accessorKey: 'morning',
            cell: (cell: any) => (
                <input type="checkbox" checked={cell.getValue()} onChange={() => {}} />
            ),
            enableColumnFilter: false,
        },
        {
            header: 'Evening Shift',
            accessorKey: 'evening',
            cell: (cell: any) => (
                <input type="checkbox" checked={cell.getValue()} onChange={() => {}} />
            ),
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => (
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
            ),
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
                                    data={doctorData}
                                />

                                <Row>
                                    <Col lg={12}>
                                        <Card id="doctorShift">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Doctor Shift</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addDoctorShift'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Shift
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
                                                        columns={doctorColumns}
                                                        data={doctorData}
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

export default DoctorShift;
