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

const ProcessingTransactionReport = () => {
    const processingTransactionData = [
        { patientName: 'John Doe', date: '2024-01-05', caseReferenceNo: 'C12345', opdNo: 101, ipdNo: 'IPD101', pharmacyBillNo: 'PB001', pathologyBillNo: 'PBL001', radiologyBillNo: 'RBL001', bloodDonorCycleNo: 'BDC001', bloodIssueNo: 'BI001', ambulanceCallNo: 'AC001', appointmentNo: 'AP001', amount: 150.00, paymentMode: 'Credit Card', note: 'Follow-up scheduled' },
        { patientName: 'Jane Smith', date: '2024-02-06', caseReferenceNo: 'C12346', opdNo: 102, ipdNo: 'IPD102', pharmacyBillNo: 'PB002', pathologyBillNo: 'PBL002', radiologyBillNo: 'RBL002', bloodDonorCycleNo: 'BDC002', bloodIssueNo: 'BI002', ambulanceCallNo: 'AC002', appointmentNo: 'AP002', amount: 200.00, paymentMode: 'Cash', note: 'Discharged with medications' },
        { patientName: 'Alex Johnson', date: '2024-03-10', caseReferenceNo: 'C12347', opdNo: 103, ipdNo: 'IPD103', pharmacyBillNo: 'PB003', pathologyBillNo: 'PBL003', radiologyBillNo: 'RBL003', bloodDonorCycleNo: 'BDC003', bloodIssueNo: 'BI003', ambulanceCallNo: 'AC003', appointmentNo: 'AP003', amount: 250.00, paymentMode: 'Insurance', note: 'No complications' },
        { patientName: 'Emily Davis', date: '2024-04-08', caseReferenceNo: 'C12348', opdNo: 104, ipdNo: 'IPD104', pharmacyBillNo: 'PB004', pathologyBillNo: 'PBL004', radiologyBillNo: 'RBL004', bloodDonorCycleNo: 'BDC004', bloodIssueNo: 'BI004', ambulanceCallNo: 'AC004', appointmentNo: 'AP004', amount: 180.00, paymentMode: 'Debit Card', note: 'Follow-up in two weeks' },
        { patientName: 'Michael Brown', date: '2024-05-10', caseReferenceNo: 'C12349', opdNo: 105, ipdNo: 'IPD105', pharmacyBillNo: 'PB005', pathologyBillNo: 'PBL005', radiologyBillNo: 'RBL005', bloodDonorCycleNo: 'BDC005', bloodIssueNo: 'BI005', ambulanceCallNo: 'AC005', appointmentNo: 'AP005', amount: 320.00, paymentMode: 'Cash', note: 'Surgery completed successfully' },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);
    const [caseId, setCaseId] = useState('');

    const processingTransactionColumns = [
        {
            header: 'Date', accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
            
        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
           
        },
        {
            header: 'Case Reference No',
            accessorKey: 'caseReferenceNo',
            enableColumnFilter: false,
           
        },
        {
            header: 'OPD No',
            accessorKey: 'opdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'IPD No',
            accessorKey: 'ipdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Pharmacy Bill No',
            accessorKey: 'pharmacyBillNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Pathology Bill No',
            accessorKey: 'pathologyBillNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Radiology Bill No',
            accessorKey: 'radiologyBillNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Blood Donor Cycle No',
            accessorKey: 'bloodDonorCycleNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Blood Issue No',
            accessorKey: 'bloodIssueNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Ambulance Call No',
            accessorKey: 'ambulanceCallNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Appointment No',
            accessorKey: 'appointmentNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-center">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            enableColumnFilter: false,
            
        },
        {
            header: 'Payment Mode',
            accessorKey: 'paymentMode',
            enableColumnFilter: false,
           
        },
        {
            header: 'Note',
            accessorKey: 'note',
            enableColumnFilter: false,
            
        },
    ];


    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">Processing Transaction Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="case-id-input">
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
                    data={processingTransactionData}
                />
                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="processingTransactionReport">
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
                                        columns={processingTransactionColumns}
                                        data={processingTransactionData}
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

export default ProcessingTransactionReport;
