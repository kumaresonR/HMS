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

import PaidVsBalance from './PaidVsBalance'
const AllTransactionReport = () => {
    const allTransactionData = [
        { transactionId: 'T001', date: '2024-01-01', patientName: 'John Doe', reference: 'R001', category: 'Consultation', collectedBy: 'Dr. Smith', paymentType: 'Cash', paymentMode: 'Pending', amount: 200 },
        { transactionId: 'T002', date: '2024-02-02', patientName: 'Jane Smith', reference: 'R002', category: 'Consultation', collectedBy: 'Dr. Brown', paymentType: 'Credit Card', paymentMode: 'Pending', amount: 300 },
        { transactionId: 'T003', date: '2024-03-03', patientName: 'Alex Johnson', reference: 'R003', category: 'Surgery', collectedBy: 'Dr. White', paymentType: 'Insurance', paymentMode: 'Paid', amount: 1500 },
        { transactionId: 'T004', date: '2024-04-04', patientName: 'Emily Davis', reference: 'R004', category: 'Consultation', collectedBy: 'Dr. Lee', paymentType: 'Cash', paymentMode: 'Paid', amount: 250 },
        { transactionId: 'T005', date: '2024-05-05', patientName: 'Michael Brown', reference: 'R005', category: 'Laboratory', collectedBy: 'Dr. Green', paymentType: 'Debit Card', paymentMode: 'Pending', amount: 100 },
        { transactionId: 'T006', date: '2024-06-06', patientName: 'Sophia Wilson', reference: 'R006', category: 'Consultation', collectedBy: 'Dr. Kim', paymentType: 'Cash', paymentMode: 'Paid', amount: 200 },
        { transactionId: 'T007', date: '2024-07-07', patientName: 'Daniel Johnson', reference: 'R007', category: 'Radiology', collectedBy: 'Dr. Brown', paymentType: 'Credit Card', paymentMode: 'Paid', amount: 500 },
        { transactionId: 'T008', date: '2024-08-08', patientName: 'Olivia Martinez', reference: 'R008', category: 'Physiotherapy', collectedBy: 'Dr. Smith', paymentType: 'Insurance', paymentMode: 'Pending', amount: 800 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const allTransactionColumns = [
        {
            header: 'Transaction ID',
            accessorKey: 'transactionId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="  text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,

        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,

        },
        {
            header: 'Reference',
            accessorKey: 'reference',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="  text-primary">
                    {info.getValue()}

                </div>
            ),

        },
        {
            header: 'Category',
            accessorKey: 'category',
            enableColumnFilter: false,

        },
        {
            header: 'Collected By',
            accessorKey: 'collectedBy',
            enableColumnFilter: false,

        },
        {
            header: 'Payment Type',
            accessorKey: 'paymentType',
            enableColumnFilter: false,

        },
        {
            header: 'Payment Mode',
            accessorKey: 'paymentMode',

            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                let badgeClass = "badge bg-warning-subtle text-warning";
                let displayText = "Pending";

                if (value === "Paid") {
                    badgeClass = "badge bg-success-subtle text-success";
                    displayText = "Paid";
                } else if (value === "Not Paid") {
                    badgeClass = "badge bg-danger-subtle text-danger";
                    displayText = "Not Paid";
                }




                return (
                    <div className=" ">
                        <span className={badgeClass}>
                            {displayText}
                        </span>
                    </div>
                );
            },
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
    ];


    return (
        <React.Fragment>
            <div>

                <Row>
                    <Col lg={7}>
                        <h5 className="card-title mb-4">All Transaction Report</h5>
                        <Row>
                            <Col sm={12}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="time-duration-select">
                                        Time Duration
                                    </Label>
                                    <Input type="select" className="form-control" id="time-duration-select">
                                        <option>Select Duration</option>
                                        <option>30 mins</option>
                                        <option>1 hour</option>
                                        <option>2 hours</option>
                                    </Input>
                                </div>
                            </Col>
                            <Col sm={12}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="collected-by-select">
                                        Collected By
                                    </Label>
                                    <Input type="select" className="form-control" id="collected-by-select">
                                        <option>Select Collected By</option>
                                        <option>Dr. Smith</option>
                                        <option>Dr. Johnson</option>
                                        <option>Dr. Lee</option>
                                        <option>Dr. Brown</option>
                                    </Input>
                                </div>
                            </Col>
                            <Col sm={12}>
                                <div className="mb-3">
                                    <Label className="form-label" htmlFor="head-select">
                                        Select Head
                                    </Label>
                                    <Input type="select" className="form-control" id="head-select">
                                        <option>Select Head</option>
                                        <option>Head A</option>
                                        <option>Head B</option>
                                        <option>Head C</option>
                                    </Input>
                                </div>
                            </Col>

                        </Row>
                    </Col>
                    <Col lg={5}  >
                        <PaidVsBalance />
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={allTransactionData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="allTransactionReport">
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
                                        columns={allTransactionColumns}
                                        data={allTransactionData}
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

export default AllTransactionReport;
