import React, { useEffect, useState } from 'react'
import EmployeeApiService from '../../../helpers/services/employee/EmployeeApiService';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { Button, Card, CardHeader, Col, Container, Row } from 'reactstrap';
import ExportCSVModal from '../../../Components/Common/ExportCSVModal';
import TableContainer from '../../../Components/Common/TableContainer';
import { Link, useNavigate } from 'react-router-dom';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { toast } from 'react-toastify';
import ApproveModal from '../../../Components/Common/ApproveModal';
import DeleteModal from '../../../Components/Common/DeleteModal';
import Spinner from '../../../common/Spinner';

const ApproveStaffDetails = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [employeeData, setEmployeeData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    //Approve 
    const [approveModal, setApproveModal] = useState<boolean>(false);
    const [selectedBedId, setSelectedBedId] = useState('');
    const [approveOpen, setApproveOpen] = useState<boolean>(false);
    const [status, setStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const generateRandomColor = (name: any) => {
        const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

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
            accessorKey: 'roleName',
            enableColumnFilter: false,
        },
        {
            header: 'Status',
            accessorKey: 'authStat',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const status = cell.row.original.authStat;
                const handleAuthorize = () => {
                    if (!status) return;
                    const newStatus = status === "UNAUTHORIZED" ? "AUTHORIZED" : "UNAUTHORIZED";
                    doApprove(cell.row.original.employeeId, newStatus);
                };

                return (
                    <span
                        className={`badge ${status === "AUTHORIZED" ? "bg-success" : "bg-danger"}`}
                        onClick={handleAuthorize}
                        style={{ cursor: status ? "pointer" : "default" }}
                    >
                        {status === null || status === undefined ? "N/A"
                            : status === "UNAUTHORIZED" ? "Click To Authorise"
                                : "Click To UnAuthorise"}
                    </span>
                );
            },
        },

        {
            header: "Action",
            cell: (cell: any) => {
                const status = cell.row.original.authStat;

                return (
                    <ul className="list-inline hstack gap-2 mb-0">
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
                        {status === "UNAUTHORIZED" ? (
                            <>
                                <li className="list-inline-item">
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
                                </li>
                                <li className="list-inline-item" title="Delete">
                                    <Link
                                        className="remove-item-btn"
                                        data-bs-toggle="modal"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteStaff(cell.row.original.employeeId);
                                        }}
                                        to="#"
                                    >
                                        <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                    </Link>
                                </li>
                            </>
                        ) : ''}
                    </ul>
                );
            },
        }
    ];

    const getAllEmployee = async () => {
        try {
            setLoading(true);
            let result = await setupApiService.getAllEmployee();
            setEmployeeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setLoading(false);
        }
    }

    const editDetails = (id: any) => {
        navigate('/main/editEmployee', { state: { id: id } })
    }

    const viewDetails = (id: any) => {
        navigate('/main/MyProfiles', { state: { id: id, title: "tw" } })
    }

    const doApprove = (id: any, status: any) => {
        setSelectedBedId(id);
        setStatus(status)
        setApproveModal(true);
    }

    const handleApprove = async () => {
        if (selectedBedId) {
            setStatusLoading(true);
            try {
                if (status === "AUTHORIZED") {
                    await setupApiService.approveEmployee(selectedBedId);
                    toast.success('Staff has been Authorized Successfully', { containerId: 'TR' });
                } else {
                    await setupApiService.disApproveEmployee(selectedBedId);
                    toast.success('Staff has been UnAuthorized Successfully', { containerId: 'TR' });
                }

                setApproveModal(false);
                approveClose();
                await getAllEmployee();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            } finally {
                setStatusLoading(false);
            }
        }
    };

    const approveClose = () => {
        setApproveOpen(!approveOpen);
    }

    const deleteStaff = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteEmployee(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllEmployee();
                setDeleteModal(false);
                previewClose();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    useEffect(() => {
        getAllEmployee();
    }, []);

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
                                    data={employeeData}
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
                                                        data={employeeData}
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

            <ApproveModal
                show={approveModal}
                status={status}
                onApproveClick={handleApprove}
                isLoading={statusLoading}
                onCloseClick={() => setApproveModal(false)}
            />

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    );
};

export default ApproveStaffDetails