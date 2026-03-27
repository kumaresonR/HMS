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

const ReferralReport = () => {
    const referralReportData = [
        { payee: 'John Doe', patientName: 'Alex Johnson', date: '2024-01-10', billNo: 'B12345', commissionPercentage: 10, billAmount: 1000, commissionAmount: 100 },
        { payee: 'Jane Smith', patientName: 'Emily Davis', date: '2024-02-11', billNo: 'B12346', commissionPercentage: 8, billAmount: 1200, commissionAmount: 96 },
        { payee: 'Michael Brown', patientName: 'John Doe', date: '2024-03-12', billNo: 'B12347', commissionPercentage: 12, billAmount: 1500, commissionAmount: 180 },
        { payee: 'Emily Davis', patientName: 'Michael Brown', date: '2024-04-13', billNo: 'B12348', commissionPercentage: 5, billAmount: 2000, commissionAmount: 100 },
        { payee: 'Alex Johnson', patientName: 'Jane Smith', date: '2024-05-14', billNo: 'B12349', commissionPercentage: 7, billAmount: 1100, commissionAmount: 77 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const referralReportColumns = [{
        header: 'Date',
        accessorKey: 'date',
        enableColumnFilter: false,
        
    },
    {
        header: 'Payee',
        accessorKey: 'payee',
        enableColumnFilter: false,
    },
    {
        header: 'Patient Name',
        accessorKey: 'patientName',
        enableColumnFilter: false,
    },

    {
        header: 'Bill No',
        accessorKey: 'billNo',
        enableColumnFilter: false,
        cell: (info: any) => (
            <div className="text-primary">
                    {info.getValue()}
                 
            </div>
        ),
    },
    {
        header: 'Commission Percentage (%)',
        accessorKey: 'commissionPercentage',
        enableColumnFilter: false
    },
    {
        header: 'Bill Amount',
        accessorKey: 'billAmount',
        enableColumnFilter: false,
       
    },
    {
        header: 'Commission Amount',
        accessorKey: 'commissionAmount',
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
                <h5 className="card-title mb-4">Referral Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="referral-gen-info-date-input"
                            >
                                Date
                            </Label>
                            <Input
                                type="date"
                                className="form-control"
                                id="referral-gen-info-date-input"
                            />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="referral-gen-info-payee-input"
                            >
                                Payee
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="referral-gen-info-payee-input"
                            >
                                <option>Select Payee</option>
                                <option>John Doe</option>
                                <option>Jane Smith</option>
                                <option>Michael Brown</option>
                                <option>Emily Davis</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="referral-gen-info-patient-type-input"
                            >
                                Patient Type
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="referral-gen-info-patient-type-input"
                            >
                                <option>Select Patient Type</option>
                                <option>Inpatient</option>
                                <option>Outpatient</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="referral-gen-info-patient-input"
                            >
                                Patient
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="referral-gen-info-patient-input"
                            >
                                <option>Select Patient</option>
                                <option>John Doe</option>
                                <option>Emily Davis</option>
                                <option>Michael Brown</option>
                                <option>Alex Johnson</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={referralReportData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="referralReport">
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
                                        columns={referralReportColumns}
                                        data={referralReportData}
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

export default ReferralReport;
