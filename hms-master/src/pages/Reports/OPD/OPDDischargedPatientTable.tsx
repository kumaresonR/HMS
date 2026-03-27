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

const OPDDischargedPatientTable = () => {
    const opdDischargedPatientData = [
        { opdNo: 101, patientName: 'John Doe', caseId: 'C12345', gender: 'Male', phone: '1234567890', antenatal: 'No', consultant: 'Dr. Smith', appointmentDate: '2024-01-01', dischargedDate: '2024-01-05', dischargeStatus: 'Discharged', admitDays: 4 },
        { opdNo: 102, patientName: 'Jane Smith', caseId: 'C12346', gender: 'Female', phone: '0987654321', antenatal: 'Yes', consultant: 'Dr. Brown', appointmentDate: '2024-02-02', dischargedDate: '2024-02-06', dischargeStatus: 'Not Discharged', admitDays: 4 },
        { opdNo: 103, patientName: 'Alex Johnson', caseId: 'C12347', gender: 'Male', phone: '1122334455', antenatal: 'No', consultant: 'Dr. White', appointmentDate: '2024-03-03', dischargedDate: '2024-03-10', dischargeStatus: 'Discharged', admitDays: 7 },
        { opdNo: 104, patientName: 'Emily Davis', caseId: 'C12348', gender: 'Female', phone: '6677889900', antenatal: 'No', consultant: 'Dr. Lee', appointmentDate: '2024-04-04', dischargedDate: '2024-04-08', dischargeStatus: 'Pending', admitDays: 4 },
        { opdNo: 105, patientName: 'Michael Brown', caseId: 'C12349', gender: 'Male', phone: '3344556677', antenatal: 'No', consultant: 'Dr. Green', appointmentDate: '2024-05-05', dischargedDate: '2024-05-10', dischargeStatus: 'Discharged', admitDays: 5 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const opdDischargedPatientColumns = [

        {
            header: 'OPD No',
            accessorKey: 'opdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-center text-primary">
                    {info.getValue()}



                </div>
            ),
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false
        },
       
        {
            header: 'Gender',
            accessorKey: 'gender',
            enableColumnFilter: false
        },
        {
            header: 'Phone',
            accessorKey: 'phone',
            enableColumnFilter: false

        },
        {
            header: 'Antenatal',
            accessorKey: 'antenatal',
            enableColumnFilter: false
        },
        {
            header: 'Consultant',
            accessorKey: 'consultant',
            enableColumnFilter: false
        },
        {
            header: 'Appointment Date',
            accessorKey: 'appointmentDate',
            enableColumnFilter: false,

        },
        {
            header: 'Discharged Status',
            accessorKey: 'dischargeStatus',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                let badgeClass = "badge bg-secondary-subtle text-secondary";
                let displayText = "Not Specified";

                if (value === "Discharged") {
                    badgeClass = "badge bg-success-subtle text-success";
                    displayText = "Discharged";
                } else if (value === "Not Discharged") {
                    badgeClass = "badge bg-danger-subtle text-danger";
                    displayText = "Not Discharged";
                } else if (value === "Pending") {
                    badgeClass = "badge bg-warning-subtle text-warning";
                    displayText = "Pending";
                }

                return (
                    <div className="text-center">
                        <span className={badgeClass}>
                            {displayText}
                        </span>
                    </div>
                );
            },
        },

        {
            header: 'Discharge Date',
            accessorKey: 'dischargedDate',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                        {info.getValue()}
     
                </div>
            ),
        },
        {
            header: 'Total Admit Days',
            accessorKey: 'admitDays',
            enableColumnFilter: false
        },
    ];

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">OPD Discharged Patient</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-duration-input"
                            >
                                Time Duration
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="steparrow-gen-info-duration-input"
                            >
                                <option>Select Duration</option>
                                <option>30 mins</option>
                                <option>1 hour</option>
                                <option>2 hours</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-doctor-input"
                            >
                                Doctor
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="steparrow-gen-info-doctor-input"
                            >
                                <option>Select Doctor</option>
                                <option>Dr. Smith</option>
                                <option>Dr. Johnson</option>
                                <option>Dr. Lee</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-gender-input"
                            >
                                Gender
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="steparrow-gen-info-gender-input"
                            >
                                <option>Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-status-input"
                            >
                                Discharged Status
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="steparrow-gen-info-status-input"
                            >
                                <option>Select Status</option>
                                <option>Discharged</option>
                                <option>Not Discharged</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={opdDischargedPatientData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="opdDischargedPatientReport">
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
                                        columns={opdDischargedPatientColumns}
                                        data={opdDischargedPatientData}
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

export default OPDDischargedPatientTable;
