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

const TPAReport = () => {
    const tpaReportData = [
        { checkupIpdNo: 201, caseId: 'C12351', Symptoms: 'Headache', tpaName: 'TPA One', patientName: 'Alice Williams', appointmentDate: '2024-01-01', doctor: 'Dr. Smith', chargeName: 'Consultation', chargeCategory: 'General', chargeType: 'Standard', standardCharge: 500, appliedCharge: 500, tpaCharge: 450, tax: 50, amount: 500 },
        { checkupIpdNo: 202, caseId: 'C12352', Symptoms: 'Fever', tpaName: 'TPA Two', patientName: 'Bob Johnson', appointmentDate: '2024-01-02', doctor: 'Dr. Brown', chargeName: 'Examination', chargeCategory: 'Laboratory', chargeType: 'Applied', standardCharge: 300, appliedCharge: 300, tpaCharge: 250, tax: 30, amount: 300 },
        { checkupIpdNo: 203, caseId: 'C12353', Symptoms: 'Cough', tpaName: 'TPA Three', patientName: 'Charlie Smith', appointmentDate: '2024-01-03', doctor: 'Dr. White', chargeName: 'Consultation', chargeCategory: 'General', chargeType: 'Standard', standardCharge: 600, appliedCharge: 600, tpaCharge: 550, tax: 50, amount: 600 },
        { checkupIpdNo: 204, caseId: 'C12354', Symptoms: 'Cold', tpaName: 'TPA Four', patientName: 'Diana Ross', appointmentDate: '2024-01-04', doctor: 'Dr. Lee', chargeName: 'Checkup', chargeCategory: 'Special', chargeType: 'Applied', standardCharge: 400, appliedCharge: 400, tpaCharge: 350, tax: 40, amount: 400 },
        { checkupIpdNo: 205, caseId: 'C12355', Symptoms: 'Stomach Pain', tpaName: 'TPA Five', patientName: 'Eva Green', appointmentDate: '2024-01-05', doctor: 'Dr. Green', chargeName: 'Consultation', chargeCategory: 'General', chargeType: 'Standard', standardCharge: 450, appliedCharge: 450, tpaCharge: 400, tax: 45, amount: 450 },
    ];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const tpaReportColumns = [
        {
            header: 'Checkup/IPD No',
            accessorKey: 'checkupIpdNo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Symptoms',
            accessorKey: 'Symptoms',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'TPA Name',
            accessorKey: 'tpaName',
            enableColumnFilter: false,

        },
        {
            header: 'Patient Name',
            accessorKey: 'patientName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Appointment Date',
            accessorKey: 'appointmentDate',
            enableColumnFilter: false,

        },
        {
            header: 'Doctor',
            accessorKey: 'doctor',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-nowrap">
                    {info.getValue()}

                </div>
            ),

        },
        {
            header: 'Charge Name',
            accessorKey: 'chargeName',
            enableColumnFilter: false,

        },
        {
            header: 'Charge Category',
            accessorKey: 'chargeCategory',
            enableColumnFilter: false,

        },
        {
            header: 'Charge Type',
            accessorKey: 'chargeType',
            enableColumnFilter: false,

        },
        {
            header: 'Standard Charge',
            accessorKey: 'standardCharge',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),

        },
        {
            header: 'Applied Charge',
            accessorKey: 'appliedCharge',
            enableColumnFilter: false,

        },
        {
            header: 'TPA Charge',
            accessorKey: 'tpaCharge',
            enableColumnFilter: false,

        },
        {
            header: 'Tax',
            accessorKey: 'tax',
            enableColumnFilter: false,

        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}

                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <h5 className="card-title mb-4">TPA Report</h5>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="time-duration-input">
                                Time Duration
                            </Label>
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
                            <Label className="form-label" htmlFor="doctor-input">
                                Doctor
                            </Label>
                            <Input type="select" className="form-control" id="doctor-input">
                                <option>Select Doctor</option>
                                <option>Dr. Smith</option>
                                <option>Dr. Johnson</option>
                                <option>Dr. Lee</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="tpa-input">
                                TPA
                            </Label>
                            <Input type="select" className="form-control" id="tpa-input">
                                <option>Select TPA</option>
                                <option>TPA One</option>
                                <option>TPA Two</option>
                                <option>TPA Three</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="case-id-input">
                                Case ID
                            </Label>
                            <Input type="text" className="form-control" id="case-id-input" />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="charge-category-input">
                                Charge Category
                            </Label>
                            <Input type="select" className="form-control" id="charge-category-input">
                                <option>Select Charge Category</option>
                                <option>General</option>
                                <option>Laboratory</option>
                                <option>Special</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="mb-3">
                            <Label className="form-label" htmlFor="charge-input">
                                Charge
                            </Label>
                            <Input type="select" className="form-control" id="charge-input">
                                <option>Select Charge</option>
                                <option>Consultation</option>
                                <option>Examination</option>
                                <option>Checkup</option>
                            </Input>
                        </div>
                    </Col>
                </Row>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={tpaReportData}
                />

                <Row>
                    <Col lg={12} className="px-0">
                        <Card id="tpaReport">
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
                                        columns={tpaReportColumns}
                                        data={tpaReportData}
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

export default TPAReport;
