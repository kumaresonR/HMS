import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { Link, useNavigate } from "react-router-dom";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";

const StaffList = (props: any) => {
    let navigate: any = useNavigate();

    const data = props.data;

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const generateRandomColor = (name: any) => {
        const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const viewDetails = (id: any) => {
        navigate('/main/MyProfiles', { state: { id: id } })
    }

    // const editDetails = (id: any) => {
    //     navigate('/main/editEmployee', { state: { id: id } })
    // }

    const staffColumns = [
        {
            header: 'Image',
            accessorKey: 'photo',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const imageSrc = cell.getValue();
                const firstName = cell.row.original.firstName;
                return (
                    <>
                        {imageSrc ? (
                            <div className="mx-auto text-center">
                                <img
                                    src={`data:image/png;base64,${imageSrc}`}
                                    alt="Profile" className="mx-auto"
                                    style={{ borderRadius: '10%', width: '50px', height: '50px' }}
                                />
                            </div>
                        ) : (
                            <div
                                className="avatar-xxs material-shadow mx-auto d-flex justify-content-center align-items-center"
                                style={{
                                    backgroundColor: generateRandomColor(firstName),
                                    color: 'white',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '10%',
                                }}
                            >
                                {firstName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </>
                );
            },
        },

        {
            header: 'Staff Id',
            accessorKey: 'staffId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue()}
                    </span>
                </div>
            ),
        },
        {
            header: 'Name',
            accessorKey: 'firstName',
            enableColumnFilter: false,
        },
        {
            header: 'Role',
            accessorKey: 'roleDetails.roleName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue()}
                    </span>
                </div>
            ),
        },
        // {
        //     header: 'Department',
        //     accessorKey: 'department',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div>
        //             <span className="text-primary">
        //                 {info.getValue()}
        //             </span>
        //         </div>
        //     ),

        // },
        {
            header: 'Mobile Number',
            accessorKey: 'phone',
            enableColumnFilter: false,
        },
        {
            header: "Action", enableColumnFilter: false,
            cell: (cell: any) => (
                <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN"]}>
                    <ul className="list-inline hstack gap-2 mb-0">
                        {/* <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                editDetails(cell.row.original.employeeId)
                            }}
                            title="Edit"
                        >
                            <i className="ri-pencil-fill align-bottom text-purple"></i>
                        </Link>
                    </li> */}

                        <li className="list-inline-item" title="View">
                            <Link
                                className="view-item-btn"
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    viewDetails(cell.row.original.employeeId)
                                }}
                            >
                                <i className="ri-eye-fill align-bottom text-pink"></i>
                            </Link>
                        </li>
                    </ul>
                </RoleBasedComponent>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <ExportCSVModal
                                    show={isExportCSV}
                                    onCloseClick={() => setIsExportCSV(false)}
                                    data={data}
                                />
                                <Row>
                                    <Col lg={12}>
                                        <div id="staffList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Staff List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            {/* <Link to='/main/addEmployee'>
                                                                <Button

                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Staff
                                                                </Button>
                                                            </Link> */}
                                                            <Button
                                                                type="button"

                                                                className="btn btn-secondary"
                                                                onClick={() => setIsExportCSV(true)}
                                                            >
                                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                                Export
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Row>
                                            </CardHeader>

                                            <div className="card-body pt-0">
                                                <div>
                                                    <TableContainer
                                                        columns={staffColumns}
                                                        data={data}
                                                        isGlobalFilter={true}
                                                        isCustomerFilter={true}
                                                        customPageSize={5}
                                                        tableClass="table table-bordered"
                                                        theadClass="thead-light"
                                                        divClass="table-responsive"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default StaffList;
