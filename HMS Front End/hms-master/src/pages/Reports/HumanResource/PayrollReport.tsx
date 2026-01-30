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
import YearlyPayrollGraph from './YearlyPayrollGraph'

const PayrollReport = () => {
    const payrollData = [
        { name: 'Dr. John Doe', role: 'Doctor', designation: 'Surgeon', month: 'January', year: '2024', paymentDate: '2024-01-05', payslip: 'Yes', basicSalary: 10000, earning: 3000, deduction: 1000, grossSalary: 12000, tax: 500, netSalary: 11500 },
        { name: 'Nurse Jane Smith', role: 'Nurse', designation: 'ICU Nurse', month: 'February', year: '2024', paymentDate: '2024-02-06', payslip: 'Yes', basicSalary: 5000, earning: 1000, deduction: 400, grossSalary: 6000, tax: 200, netSalary: 5800 },
        { name: 'Dr. Alex Johnson', role: 'Doctor', designation: 'Pediatrician', month: 'March', year: '2024', paymentDate: '2024-03-10', payslip: 'Yes', basicSalary: 12000, earning: 3500, deduction: 1200, grossSalary: 15000, tax: 700, netSalary: 14300 },
        { name: 'Emily Davis', role: 'Technician', designation: 'Radiology Technician', month: 'April', year: '2024', paymentDate: '2024-04-08', payslip: 'Yes', basicSalary: 4000, earning: 800, deduction: 300, grossSalary: 4600, tax: 150, netSalary: 4450 },
        { name: 'Michael Brown', role: 'Administrator', designation: 'Hospital Administrator', month: 'May', year: '2024', paymentDate: '2024-05-10', payslip: 'Yes', basicSalary: 6000, earning: 1200, deduction: 500, grossSalary: 7200, tax: 300, netSalary: 6900 },
    ];
    
    const [isExportCSV, setIsExportCSV] = useState(false);

    const payrollColumns = [
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Role',
            accessorKey: 'role',
            enableColumnFilter: false,
        },
        {
            header: 'Designation',
            accessorKey: 'designation',
            enableColumnFilter: false,
           
        },
        {
            header: 'Month',
            accessorKey: 'month',
            enableColumnFilter: false,
            
        },
        {
            header: 'Year',
            accessorKey: 'year',
            enableColumnFilter: false,
            
        },
        {
            header: 'Payment Date',
            accessorKey: 'paymentDate',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary text-nowrap">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Payslip',
            accessorKey: 'payslip',
            enableColumnFilter: false,
            
        },
        {
            header: 'Basic Salary',
            accessorKey: 'basicSalary',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-purple">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Earning',
            accessorKey: 'earning',
            enableColumnFilter: false,
           
        },
        {
            header: 'Deduction',
            accessorKey: 'deduction',
            enableColumnFilter: false,
            
        },
        {
            header: 'Gross Salary',
            accessorKey: 'grossSalary',
            enableColumnFilter: false,
           
        },
        {
            header: 'Tax',
            accessorKey: 'tax',
            enableColumnFilter: false,
           
        },
        {
            header: 'Net Salary',
            accessorKey: 'netSalary',
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

                <Row>
                    <Col lg={7}>
                        <div className="mb-3">
                            <Label
                                className="form-label"
                                htmlFor="duration-input"
                            >
                                Time Duration
                            </Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="duration-input"
                            >
                                <option>Select Duration</option>
                                <option>30 mins</option>
                                <option>1 hour</option>
                                <option>2 hours</option>
                            </Input>
                        </div>
                    </Col>
                    <Col lg={5}>
                        <h6>Yearly Payroll Report</h6>
                        <YearlyPayrollGraph /></Col>
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

                            <div className="card-body pt-0">
                                <div>
                                    <TableContainer
                                        columns={payrollColumns}
                                        data={payrollData}
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

export default PayrollReport;
