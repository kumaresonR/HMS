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

const PatientBillReport = () => {
    const patientBillData = [
        { opdNo: 101, ipdNo: 201, billNo: 'B12345', paymentMode: 'Credit Card', paymentDate: '2024-01-10', paymentAmount: 2000 },
        { opdNo: 102, ipdNo: 202, billNo: 'B12346', paymentMode: 'Cash', paymentDate: '2024-02-11', paymentAmount: 1500 },
        { opdNo: 103, ipdNo: 203, billNo: 'B12347', paymentMode: 'Debit Card', paymentDate: '2024-03-12', paymentAmount: 2500 },
        { opdNo: 104, ipdNo: 204, billNo: 'B12348', paymentMode: 'UPI', paymentDate: '2024-04-13', paymentAmount: 1800 },
        { opdNo: 105, ipdNo: 205, billNo: 'B12349', paymentMode: 'Net Banking', paymentDate: '2024-05-14', paymentAmount: 2200 },
        { opdNo: 106, ipdNo: 206, billNo: 'B12350', paymentMode: 'Credit Card', paymentDate: '2024-06-15', paymentAmount: 1700 },
        { opdNo: 107, ipdNo: 207, billNo: 'B12351', paymentMode: 'Cash', paymentDate: '2024-07-16', paymentAmount: 1300 },
        { opdNo: 108, ipdNo: 208, billNo: 'B12352', paymentMode: 'Debit Card', paymentDate: '2024-08-17', paymentAmount: 1900 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);
    const [caseId, setCaseId] = useState('');

    const patientBillColumns = [
        {
            header: 'OPD No',
            accessorKey: 'opdNo',
            enableColumnFilter: false, cell: (info: any) => (
                <div className=" text-primary">
                        {info.getValue()}
                    
                </div>
            ),
        },
        {
            header: 'IPD No',
            accessorKey: 'ipdNo',
            enableColumnFilter: false, cell: (info: any) => (
                <div className="text-primary">
                        {info.getValue()}
                 
                </div>
            ),
        },
        {
            header: 'Bill No',
            accessorKey: 'billNo',
            enableColumnFilter: false, cell: (info: any) => (
                <div className="text-primary">
                        {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Payment Mode',
            accessorKey: 'paymentMode',
            enableColumnFilter: false,
          
        },
        {
            header: 'Payment Date',
            accessorKey: 'paymentDate',
            enableColumnFilter: false,
          
        },
        {
            header: 'Payment Amount',
            accessorKey: 'paymentAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-center">
                    <span className="text-primary">
                        {info.getValue()}
                    </span>
                </div>
            ),
        },
    ];


    const handleSearch = () => {
        console.log("Search for Case ID:", caseId);
    };

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Patient Bill Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="case-id-input"
                            >
                                Case ID
                            </Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="case-id-input"
                                value={caseId}
                                onChange={(e) => setCaseId(e.target.value)}
                                placeholder="Enter Case ID"
                            />
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={patientBillData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="patientBillReport">
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
                                        columns={patientBillColumns}
                                        data={patientBillData}
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

export default PatientBillReport;
