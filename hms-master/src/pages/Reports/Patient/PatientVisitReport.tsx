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

const PatientVisitReport = () => {
    const patientVisitData = [
        { opdNo: 101, caseId: 'C12345', date: '2024-01-01', opdCheckupId: 'OPD001', doctorName: 'Dr. Smith', symptoms: 'Fever, Cough', findings: 'Mild fever, Cough' },
        { opdNo: 102, caseId: 'C12346', date: '2024-02-02', opdCheckupId: 'OPD002', doctorName: 'Dr. Brown', symptoms: 'Headache', findings: 'Tension headache' },
        { opdNo: 103, caseId: 'C12347', date: '2024-03-03', opdCheckupId: 'OPD003', doctorName: 'Dr. White', symptoms: 'Nausea', findings: 'Gastritis' },
        { opdNo: 104, caseId: 'C12348', date: '2024-04-04', opdCheckupId: 'OPD004', doctorName: 'Dr. Lee', symptoms: 'Back Pain', findings: 'Muscle strain' },
        { opdNo: 105, caseId: 'C12349', date: '2024-05-05', opdCheckupId: 'OPD005', doctorName: 'Dr. Green', symptoms: 'Allergy', findings: 'Skin rash' },
        { opdNo: 106, caseId: 'C12350', date: '2024-06-06', opdCheckupId: 'OPD006', doctorName: 'Dr. Black', symptoms: 'Chest Pain', findings: 'Heartburn' },
        { opdNo: 107, caseId: 'C12351', date: '2024-07-07', opdCheckupId: 'OPD007', doctorName: 'Dr. Gray', symptoms: 'Shortness of breath', findings: 'Possible asthma' },
        { opdNo: 108, caseId: 'C12352', date: '2024-08-08', opdCheckupId: 'OPD008', doctorName: 'Dr. White', symptoms: 'Fatigue', findings: 'Anemia' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const patientVisitColumns = [
        {
            header: 'OPD No',
            accessorKey: 'opdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
       
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'OPD Checkup ID',
            accessorKey: 'opdCheckupId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Doctor Name',
            accessorKey: 'doctorName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Symptoms',
            accessorKey: 'symptoms',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-pink">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Findings',
            accessorKey: 'findings',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-danger">
                    {info.getValue()}
                </div>
            ),
        },
    ];


    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Patient Visit Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="patient-visit-duration-input"
                            >
                                Time Duration
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="patient-visit-duration-input"
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
                    data={patientVisitData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="patientVisitReport">
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
                                        columns={patientVisitColumns}
                                        data={patientVisitData}
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

export default PatientVisitReport;
