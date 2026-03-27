import React, { useState } from "react";
import {
    Card,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const PatientLoginCredential = () => {
    const patientData = [
        { patientId: 1, patientName: 'John Doe', username: 'johndoe', password: 'password123' },
        { patientId: 2, patientName: 'Jane Smith', username: 'janesmith', password: 'password456' },
        { patientId: 3, patientName: 'Alex Johnson', username: 'alexjohnson', password: 'password789' },
        { patientId: 4, patientName: 'Emily Davis', username: 'emilydavis', password: 'password101' },
        { patientId: 5, patientName: 'Michael Brown', username: 'michaelbrown', password: 'password202' },
        { patientId: 6, patientName: 'Sarah Wilson', username: 'sarahwilson', password: 'password303' },
        { patientId: 7, patientName: 'David Taylor', username: 'davidtaylor', password: 'password404' },
        { patientId: 8, patientName: 'Sophia Clark', username: 'sophiaclark', password: 'password505' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const patientColumns = [
        {
            header: 'Patient ID',
            accessorKey: 'patientId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-indigo">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Username',
            accessorKey: 'username',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-pink">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Password',
            accessorKey: 'password',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-success">
                    {info.getValue()}
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Patient Login Credentials</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="time-duration-input"
                            >
                                Time Duration
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="time-duration-input"
                            >
                                <option>Select Duration</option>
                                <option>30 mins</option>
                                <option>1 hour</option>
                                <option>2 hours</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={patientData}
                />
                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="patientLoginCredentialReport">

                            <CardHeader className="border-0">
                                <Row className="g-4 align-items-center">
                                    <div className="col-sm">

                                    </div>
                                    <div className="col-sm-auto">
                                        <div>
                                            <button type="button" className="btn btn-primary" onClick={() => setIsExportCSV(true)}>
                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-sm-auto">

                                        <div className="input-group">

                                            <Input
                                                type="text"
                                                className="form-control"
                                                id="Search"
                                                placeholder="Search..."
                                            />
                                            <span className="input-group-text searchBtn">
                                                <i className="ri-search-2-line label-icon align-middle fs-16 ms-2"></i>
                                            </span>
                                        </div>


                                    </div>
                                </Row>
                            </CardHeader>

                            <div className="card-body pt-0">
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
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default PatientLoginCredential;
