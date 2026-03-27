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

const IncomeGroupReport = () => {


    const incomeGroupData = [
        { incomeHead: 'Consultation', incomeId: 'I001', name: 'John Doe', date: '2024-01-01', invoiceNumber: 'INV001', amount: 200 },
        { incomeHead: 'Pharmacy', incomeId: 'I002', name: 'Jane Smith', date: '2024-02-02', invoiceNumber: 'INV002', amount: 150 },
        { incomeHead: 'Lab Tests', incomeId: 'I003', name: 'Alex Johnson', date: '2024-03-03', invoiceNumber: 'INV003', amount: 300 },
        { incomeHead: 'Surgery', incomeId: 'I004', name: 'Emily Davis', date: '2024-04-04', invoiceNumber: 'INV004', amount: 1000 },
        { incomeHead: 'Consultation', incomeId: 'I005', name: 'Michael Brown', date: '2024-05-05', invoiceNumber: 'INV005', amount: 250 },
        { incomeHead: 'Consultation', incomeId: 'I006', name: 'Sarah Wilson', date: '2024-06-06', invoiceNumber: 'INV006', amount: 300 },
        { incomeHead: 'Lab Tests', incomeId: 'I007', name: 'David Lee', date: '2024-07-07', invoiceNumber: 'INV007', amount: 400 },
        { incomeHead: 'Pharmacy', incomeId: 'I008', name: 'Anna Taylor', date: '2024-08-08', invoiceNumber: 'INV008', amount: 180 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const incomeGroupColumns = [

        {
            header: 'Income ID',
            accessorKey: 'incomeId',
            enableColumnFilter: false, cell: (info: any) => (
                <div className="text-primary">
                        {info.getValue()}
          
                </div>
            ),
        }, {
            header: 'Income Head',
            accessorKey: 'incomeHead',
            enableColumnFilter: false,
        },
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
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
                <div className=" text-primary">
                        {info.getValue()}
        
                </div>
            ),
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
                <h5 className="card-title mb-4">Income Group Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="time-duration-select"
                            >
                                Time Duration
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="time-duration-select"
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
                                htmlFor="income-head-select"
                            >
                                Search Income Head
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="income-head-select"
                            >
                                <option>Select Income Head</option>
                                <option>Consultation</option>
                                <option>Pharmacy</option>
                                <option>Lab Tests</option>
                                <option>Surgery</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={incomeGroupData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="incomeGroupReport">
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
                                        columns={incomeGroupColumns}
                                        data={incomeGroupData}
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

export default IncomeGroupReport;
