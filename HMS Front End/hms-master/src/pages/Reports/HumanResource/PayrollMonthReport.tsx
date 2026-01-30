import React, { useState } from "react";
import {
    Card,
    CardHeader,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import 'react-toastify/dist/ReactToastify.css';

const PayrollReport = () => {
    const payrollData = [
        { id: 1, employeeName: 'John Doe', role: 'Software Engineer', month: 'January', year: '2024', salary: 6000 },
        { id: 2, employeeName: 'Jane Smith', role: 'Product Manager', month: 'February', year: '2024', salary: 8000 },
        { id: 3, employeeName: 'Alex Johnson', role: 'UI/UX Designer', month: 'March', year: '2024', salary: 5500 },
        { id: 4, employeeName: 'Emily Davis', role: 'HR Manager', month: 'April', year: '2024', salary: 7000 },
        { id: 5, employeeName: 'Michael Brown', role: 'Data Analyst', month: 'May', year: '2024', salary: 6500 },
        { id: 6, employeeName: 'Sarah Wilson', role: 'Marketing Specialist', month: 'June', year: '2024', salary: 5000 },
        { id: 7, employeeName: 'David Lee', role: 'DevOps Engineer', month: 'July', year: '2024', salary: 7500 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Payroll Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="payroll-role-input">Role</Label>
                            <Input type="select" className="form-control" id="payroll-role-input">
                                <option>Select Role</option>
                                <option>Software Engineer</option>
                                <option>Product Manager</option>
                                <option>UI/UX Designer</option>
                                <option>HR Manager</option>
                                <option>Data Analyst</option>
                                <option>Marketing Specialist</option>
                                <option>DevOps Engineer</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="payroll-month-input">Month</Label>
                            <Input type="select" className="form-control" id="payroll-month-input">
                                <option>Select Month</option>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>October</option>
                                <option>November</option>
                                <option>December</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="payroll-year-input">Year</Label>
                            <Input type="select" className="form-control" id="payroll-year-input">
                                <option>Select Year</option>
                                <option>2023</option>
                                <option>2024</option>
                                <option>2025</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={payrollData}
                />
                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="payrollReport">
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
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default PayrollReport;
