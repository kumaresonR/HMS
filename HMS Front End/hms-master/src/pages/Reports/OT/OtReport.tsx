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

const OTReport = () => {
    const otReportData = [
        { date: '2024-01-01', referenceNo: 'REF001', opdNo: 101, ipdNo: 201, consultantDoctor: 'Dr. Smith', assistantConsultant1: 'Dr. Green', operationName: 'Appendectomy', operationCategory: 'General Surgery', result: 'Successful' },
        { date: '2024-01-02', referenceNo: 'REF002', opdNo: 102, ipdNo: 202, consultantDoctor: 'Dr. Brown', assistantConsultant1: 'Dr. White', operationName: 'Cholecystectomy', operationCategory: 'General Surgery', result: 'Successful' },
        { date: '2024-01-03', referenceNo: 'REF003', opdNo: 103, ipdNo: 203, consultantDoctor: 'Dr. Johnson', assistantConsultant1: 'Dr. Lee', operationName: 'Hernia Repair', operationCategory: 'General Surgery', result: 'Unsuccessful' },
        { date: '2024-01-04', referenceNo: 'REF004', opdNo: 104, ipdNo: 204, consultantDoctor: 'Dr. Green', assistantConsultant1: 'Dr. Black', operationName: 'Cataract Surgery', operationCategory: 'Ophthalmology', result: 'Successful' },
        { date: '2024-01-05', referenceNo: 'REF005', opdNo: 105, ipdNo: 205, consultantDoctor: 'Dr. White', assistantConsultant1: 'Dr. Brown', operationName: 'Angioplasty', operationCategory: 'Cardiology', result: 'Successful' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const otReportColumns = [
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="  text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Reference No',
            accessorKey: 'referenceNo',
            enableColumnFilter: false,

        },
        {
            header: 'OPD No',
            accessorKey: 'opdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'IPD No',
            accessorKey: 'ipdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Consultant Doctor',
            accessorKey: 'consultantDoctor',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Assistant Consultant1',
            accessorKey: 'assistantConsultant1',
            enableColumnFilter: false,

        },
        {
            header: 'Operation Name',
            accessorKey: 'operationName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Operation Category',
            accessorKey: 'operationCategory',
            enableColumnFilter: false,

        },

        {
            header: 'Result',
            accessorKey: 'result',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                let badgeClass = "badge bg-warning-subtle text-warning";
                let displayText = "Pending";

                if (value === "Successful") {
                    badgeClass = "badge bg-success-subtle text-success";
                    displayText = "Successful";
                } else if (value === "UnSuccessful") {
                    badgeClass = "badge bg-danger-subtle text-danger";
                    displayText = "UnSuccessful";
                }  
                return (
                    <div>
                        <span className={badgeClass}>
                            {displayText}
                        </span>
                    </div>
                );
            },
        },
         
    ];


    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">OT Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="time-duration-input">Time Duration</Label>
                            <Input type="select" className="form-control" id="time-duration-input">
                                <option>Select Duration</option>
                                <option>30 mins</option>
                                <option>1 hour</option>
                                <option>2 hours</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="consultant-doctor-input">Consultant Doctor</Label>
                            <Input type="select" className="form-control" id="consultant-doctor-input">
                                <option>Select Doctor</option>
                                <option>Dr. Smith</option>
                                <option>Dr. Johnson</option>
                                <option>Dr. Lee</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="operation-category-input">Operation Category</Label>
                            <Input type="select" className="form-control" id="operation-category-input">
                                <option>Select Category</option>
                                <option>General Surgery</option>
                                <option>Ophthalmology</option>
                                <option>Cardiology</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="operation-name-input">Operation Name</Label>
                            <Input type="select" className="form-control" id="operation-name-input">
                                <option>Select Operation</option>
                                <option>Appendectomy</option>
                                <option>Cholecystectomy</option>
                                <option>Hernia Repair</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={otReportData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="otReport">
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
                                <TableContainer
                                    columns={otReportColumns}
                                    data={otReportData}
                                    isGlobalFilter={true}
                                    isCustomerFilter={true}
                                    customPageSize={5}
                                    tableClass="table table-bordered"
                                    theadClass="thead-light"
                                    divClass="table-responsive"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default OTReport;
