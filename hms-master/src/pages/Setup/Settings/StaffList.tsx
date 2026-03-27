import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    Input,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
 
import { Link } from "react-router-dom";
import FormHeader from "../../../common/FormHeader/FormHeader";

// Define a type for the staff data
interface StaffData {
    id: number;
    name: string;
    email: string;
    role: string;
    designation: string;
    department: string;
    phone: string;
}

const StaffList = () => {
    // Dummy staff data
    const staffData: StaffData[] = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Manager', designation: 'Operations Manager', department: 'Operations', phone: '123-456-7890' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Developer', designation: 'Frontend Developer', department: 'IT', phone: '123-456-7891' },
        { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Designer', designation: 'UI/UX Designer', department: 'Design', phone: '123-456-7892' },
        { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', role: 'Analyst', designation: 'Data Analyst', department: 'Analytics', phone: '123-456-7893' },
        { id: 5, name: 'Charlie Black', email: 'charlie.black@example.com', role: 'HR', designation: 'HR Manager', department: 'Human Resources', phone: '123-456-7894' },
        { id: 6, name: 'Eve White', email: 'eve.white@example.com', role: 'Tester', designation: 'QA Tester', department: 'Quality Assurance', phone: '123-456-7895' },
        { id: 7, name: 'David Green', email: 'david.green@example.com', role: 'Admin', designation: 'System Administrator', department: 'IT', phone: '123-456-7896' },
        { id: 8, name: 'Grace Blue', email: 'grace.blue@example.com', role: 'Support', designation: 'Customer Support', department: 'Support', phone: '123-456-7897' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated staff columns
    const staffColumns = [
        {
            header: 'Staff ID',
            accessorKey: 'id',
            enableColumnFilter: false,
        },
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
        },
        {
            header: 'Email',
            accessorKey: 'email',
            enableColumnFilter: false,
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
            header: 'Department',
            accessorKey: 'department',
            enableColumnFilter: false,
        },
        {
            header: 'Phone',
            accessorKey: 'phone',
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => {
             

                function handleCompanyClick(companyData: any) {
                    throw new Error("Function not implemented.");
                }

                function onClickDelete(companyData: any) {
                    throw new Error("Function not implemented.");
                }

              return (
                <ul className="list-inline hstack gap-2 mb-0">
                 
                  <li className="list-inline-item" title="Edit">
                    <Link className="edit-item-btn" to="#"
                      onClick={() => { const companyData = cell.row.original; handleCompanyClick(companyData); }}
                    >
                      <i className="ri-pencil-fill align-bottom text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item" title="Delete">
                    <Link
                      className="remove-item-btn"
                      onClick={() => { const companyData = cell.row.original; onClickDelete(companyData); }}
                      to="#"
                    >
                      <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                    </Link>
                  </li>
                </ul>
              );
            },
          },
    ];

    // Handler for delete action
    const handleDelete = (id: number) => {
        // Implement delete logic here
        console.log(`Deleted staff entry with id: ${id}`);
    };

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={staffData}
                />

                <Container fluid>
                    <FormHeader title="Staff List" pageTitle="Staff Management" />
                    <Row>
                        <Col lg={12}>
                            <Card id="staffList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Staff List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" className="btn btn-secondary" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={staffColumns}
                                            data={staffData}
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
                </Container>
            </div>
        </React.Fragment>
    );
};

export default StaffList;
