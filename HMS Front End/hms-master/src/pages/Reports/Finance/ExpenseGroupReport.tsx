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

const ExpenseGroupReport = () => {

    const expenseData = [
        { expenseHead: 'Medical Supplies', expenseId: 'H101', name: 'Dr. John Smith', date: '2024-01-10', invoiceNumber: 'INV001', amount: 1200 },
        { expenseHead: 'Surgical Equipment', expenseId: 'H103', name: 'Dr. Alex Wilson', date: '2024-01-15', invoiceNumber: 'INV003', amount: 1500 },
        { expenseHead: 'Ambulance Fuel', expenseId: 'H104', name: 'John Miller', date: '2024-01-18', invoiceNumber: 'INV004', amount: 500 },
        { expenseHead: 'Patient Medication', expenseId: 'H102', name: 'Nurse Jane Doe', date: '2024-01-12', invoiceNumber: 'INV002', amount: 300 },
        { expenseHead: 'Consultation Fees', expenseId: 'H105', name: 'Dr. Emily Davis', date: '2024-01-20', invoiceNumber: 'INV005', amount: 700 },
        { expenseHead: 'Maintenance & Utilities', expenseId: 'H106', name: 'Michael Brown', date: '2024-01-22', invoiceNumber: 'INV006', amount: 900 },
        { expenseHead: 'Lab Equipment', expenseId: 'H107', name: 'Dr. Sarah Taylor', date: '2024-01-25', invoiceNumber: 'INV007', amount: 2000 },
        { expenseHead: 'Hospital Staff Wages', expenseId: 'H108', name: 'Anna Johnson', date: '2024-01-30', invoiceNumber: 'INV008', amount: 10000 },
    ];


    const [isExportCSV, setIsExportCSV] = useState(false);

    const expenseColumns = [
        {
            header: 'Expense Head',
            accessorKey: 'expenseHead',
            enableColumnFilter: false,

        },
        {
            header: 'Expense ID',
            accessorKey: 'expenseId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,

        },
        {
            header: 'Invoice Number',
            accessorKey: 'invoiceNumber',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}

                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Expense Group Report</h5>
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
                                <option>Last 30 Days</option>
                                <option>Last 60 Days</option>
                                <option>Last 90 Days</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="search-expense-head-input"
                            >
                                Search Expense Head
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="search-expense-head-input"
                            >
                                <option>Select Expense Head</option>
                                <option>Office Supplies</option>
                                <option>Travel Expenses</option>
                                <option>Marketing</option>
                                <option>Utilities</option>
                                <option>Consulting Fees</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={expenseData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="expenseGroupReport">
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
                                        columns={expenseColumns}
                                        data={expenseData}
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

export default ExpenseGroupReport;
