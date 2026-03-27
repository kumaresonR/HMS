import React, { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap"
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import PaidBalanceChart from './PaidBalanceChart'

const OPDBalanceTable = () => {
    const opdBalanceData = [
        { opdNo: 101, patientName: 'John Doe', caseId: 'C12345', age: 30, gender: 'Male', mobile: '1234567890', antenatal: 'No', discharged: 'Yes', netAmount: 500, paidAmount: 300, balanceAmount: 200 },
        { opdNo: 102, patientName: 'Jane Smith', caseId: 'C12346', age: 25, gender: 'Female', mobile: '0987654321', antenatal: 'Yes', discharged: 'No', netAmount: 700, paidAmount: 400, balanceAmount: 300 },
        { opdNo: 103, patientName: 'Alex Johnson', caseId: 'C12347', age: 45, gender: 'Male', mobile: '1122334455', antenatal: 'No', discharged: 'Yes', netAmount: 1000, paidAmount: 900, balanceAmount: 100 },
        { opdNo: 104, patientName: 'Emily Davis', caseId: 'C12348', age: 35, gender: 'Female', mobile: '6677889900', antenatal: 'No', discharged: 'Yes', netAmount: 600, paidAmount: 500, balanceAmount: 100 },
        { opdNo: 105, patientName: 'Michael Brown', caseId: 'C12349', age: 50, gender: 'Male', mobile: '3344556677', antenatal: 'No', discharged: 'Yes', netAmount: 800, paidAmount: 600, balanceAmount: 200 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);
    const opdBalanceColumns = [
        {
            header: 'OPD No',
            accessorKey: 'opdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="  text-primary">
                        {info.getValue()}
              
                </div>
            ),
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="  text-primary">
                        {info.getValue()}
                  
                </div>
            ),
           
        },
        {
            header: 'Age',
            accessorKey: 'age',
            enableColumnFilter: false
        },
        {
            header: 'Gender',
            accessorKey: 'gender',
            enableColumnFilter: false
        },
        {
            header: 'Mobile Number',
            accessorKey: 'mobile',
            enableColumnFilter: false
        },
        {
            header: 'Antenatal',
            accessorKey: 'antenatal',
            enableColumnFilter: false
        },
        {
            header: 'Discharged',
            accessorKey: 'discharged',
            enableColumnFilter: false
        },
        {
            header: 'Net Amount',
            accessorKey: 'netAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="  text-primary">
                        {info.getValue()}
                 
                </div>
            ),
        },
        {
            header: 'Paid Amount',
            accessorKey: 'paidAmount',
            enableColumnFilter: false,
           
        },
        {
            header: 'Balance Amount',
            accessorKey: 'balanceAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="  text-danger">
                        {info.getValue()}
                 
                </div>
            ),
        },
    ];


    return (
        <React.Fragment>
            <div >


                <Row>

                    <Col lg={7}>
                        <div className="mb-4">
                            <h5 className="card-title mb-0">OPD Balance Report</h5>
                        </div>
                        <Row>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="steparrow-time-duration">
                                        Time Duration
                                    </Label>
                                    <Input type="select" className="form-control" id="steparrow-time-duration">
                                        <option>Select Time Duration</option>
                                        <option>1 month</option>
                                        <option>3 months</option>
                                        <option>6 months</option>
                                        <option>1 year</option>
                                    </Input>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="steparrow-from-age">
                                        From Age
                                    </Label>
                                    <Input type="select" className="form-control" id="steparrow-from-age">
                                        <option>Select From Age</option>
                                        {Array.from({ length: 100 }, (_, i) => i + 1).map((age) => (
                                            <option key={age} value={age}>
                                                {age}
                                            </option>
                                        ))}
                                    </Input>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="steparrow-to-age">
                                        To Age
                                    </Label>
                                    <Input type="select" className="form-control" id="steparrow-to-age">
                                        <option>Select To Age</option>
                                        {Array.from({ length: 100 }, (_, i) => i + 1).map((age) => (
                                            <option key={age} value={age}>
                                                {age}
                                            </option>
                                        ))}
                                    </Input>
                                </div>
                            </Col>

                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="steparrow-gender">
                                        Gender
                                    </Label>
                                    <Input type="select" className="form-control" id="steparrow-gender">
                                        <option>Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </Input>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="steparrow-discharged">
                                        Discharged
                                    </Label>
                                    <Input type="select" className="form-control" id="steparrow-discharged">
                                        <option>Select Discharged</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </Input>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="steparrow-miscellaneous">
                                        Miscellaneous
                                    </Label>
                                    <Input type="select" className="form-control" id="steparrow-miscellaneous">
                                        <option>Select Miscellaneous</option>
                                        <option>Option 1</option>
                                        <option>Option 2</option>
                                        <option>Option 3</option>
                                    </Input>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* <Col lg={5} className="border-Card"> */}
                    <Col lg={5} >
                        <PaidBalanceChart />
                    </Col>
                </Row>

                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={opdBalanceData}
                />


                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="opdBalanceReport">
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
                                        columns={opdBalanceColumns}
                                        data={opdBalanceData}
                                        isGlobalFilter={true}
                                        isCustomerFilter={true}
                                        customPageSize={5}
                                        tableClass="table-centered align-middle table-nowrap mb-0 table table-hover"
                                        theadClass="bg-light text-"
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

export default OPDBalanceTable;
