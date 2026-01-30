import React, { useEffect, useState } from 'react'
import { Button, Card, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import TableContainer from '../../Components/Common/TableContainer';
import moment from 'moment';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FormHeader from '../../common/FormHeader/FormHeader';
import ExportCSVModal from '../../Components/Common/ExportCSVModal';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';
import { toast } from 'react-toastify';
import ErrorHandler from '../../helpers/ErrorHandler';
import DeleteModal from '../../Components/Common/DeleteModal';
import PreviewLeaveReques from './PreviewLeaveReques';
import Spinner from '../../common/Spinner';
import StorageService from '../../helpers/storage/storage-service';
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const MyLeave = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [leaveData, setLeaveData] = useState<any>([]);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [selectedLeaveData, setSelectedLeaveData] = useState<any>('');
    const [loading, setLoading] = useState(false);
    const [employeeId, setEmployeeId] = useState("")
    const [department, setDepartment] = useState('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await employeeApiService.deleteLeaveRequest(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllLeaveRequest(employeeId);
                setDeleteModal(false);
                previewClose();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    const edit = (data: any) => {
        setSelectedLeaveData(data);
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
    }

    const deleteLeaveRequest = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const getAllLeaveRequest = async (employeeId: any) => {
        try {
            setLoading(true);
            let url = "employee?employeeId=" + employeeId;
            let result = await employeeApiService.getAllLeaveRequest(url);
            console.log("getAllLeaveRequest", result);
            setLeaveData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setEmployeeId(user.user_id);
        setDepartment(user.department_id);
        if (user.user_id) {
            getAllLeaveRequest(user.user_id);
        }
    }, []);

    // const updatedLeaveData = leaveData.map((item: any) => {
    //     const start: any = new Date(item.leaveFromDate);
    //     const end: any = new Date(item.leaveToDate);
    //     const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    //     return { ...item, days };
    // });

    const [isExportCSV, setIsExportCSV] = useState(false);

    const leaveColumns = [
        {
            header: "Staff",
            accessorKey: "employeeName",
            enableColumnFilter: false,
            // cell: ({ row }: any) => {
            //     const { firstName, staffId } = row.original.employeeDetails;
            //     return `${firstName} (${staffId})`;
            // },
        },

        {
            header: "Leave Type",
            accessorKey: "leaveType",
            enableColumnFilter: false,
            cell: (info: any) => (
                <span className="text-pink">{info.getValue()}</span>
            ),
        },
        {
            header: "Leave Date",
            accessorKey: "startDate",
            enableColumnFilter: false,
            cell: (info: any) => {
                const row = info.row.original;
                const startDate = moment(row.leaveFromDate).format("DD/MM/YYYY");
                const endDate = moment(row.leaveToDate).format("DD/MM/YYYY");
                return (
                    <span className="text-primary">
                        {startDate} - {endDate}
                    </span>
                );
            },
        },
        {
            header: "Days",
            accessorKey: "duration",
            enableColumnFilter: false,
            cell: (info: any) => (
                <span className="text-purple">{info.getValue()}</span>
            ),
        },
        {
            header: "Apply Date",
            accessorKey: "applyDate",
            enableColumnFilter: false,
            cell: (info: any) => {
                const applyDate = moment(info.getValue()).format("DD/MM/YYYY");
                return <span>{applyDate}</span>;
            },
        },
        {
            header: "Status",
            accessorKey: "status",
            enableColumnFilter: false,
            cell: (info: any) => {
                const status = info.getValue();
                return (
                    <span
                        className={
                            status === "APPROVED"
                                ? "badge bg-success-subtle text-success"
                                : status === "DISAPPROVED"
                                    ? "badge bg-danger-subtle text-danger"
                                    : "badge bg-warning-subtle text-warning"
                        }
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            header: "Action",
            accessorKey: "action",
            enableColumnFilter: false,
            cell: (info: any) => {
                const row = info.row.original;
                return (
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item" title="View">
                            <Link className="view-item-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    edit(row);
                                }} to="#">
                                <i className="ri-eye-fill align-bottom text-pink"></i>
                            </Link>
                        </li>
                        {row.status === "PENDING" && (
                            <li className="list-inline-item" title="Delete">
                                <Link
                                    className="remove-item-btn"
                                    data-bs-toggle="modal"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        deleteLeaveRequest(row.leaveRequestId);
                                    }}
                                    to="#"
                                >
                                    <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                </Link>
                            </li>
                        )}
                    </ul>
                );
            },
        }

    ];

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={leaveData}
                />

                <Container fluid>
                    <FormHeader title="My Leaves"
                        pageTitle="Human Resource"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "My Leaves",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="leaveApprovalList">

                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center justify-content-between">
                                        <div className="col-sm-auto">
                                            <h5 className="card-title mb-0">My Leaves</h5>
                                        </div>
                                        <div className="col-sm-auto">
                                            <Link to="/main/addLeave" className='mx-2'>
                                                <Button color="primary">Add Leave</Button>
                                            </Link>
                                            {/* {department && ( */}
                                            <Link to="/main/leaveApproval" className='mx-2'>
                                                <Button color="primary">Approve Leave Request</Button>
                                            </Link>
                                            {/* <Link to="/main/LeaveSummaryDataTable" className='mx-2'>
                                                <Button color="primary">Download Leave Request</Button>
                                            </Link> */}
                                            {/* )} */}
                                            <Button
                                                color="primary"
                                                onClick={() => navigate(-1)}
                                                className="btn btn-primary add-btn mx-2"
                                            >
                                                <IoArrowBack /> Back
                                            </Button>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={leaveColumns}
                                            data={leaveData}
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

            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered size='lg' scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                    View Details
                </ModalHeader>
                <ModalBody>
                    <PreviewLeaveReques data={selectedLeaveData} handleClose={handleEditClose} />
                </ModalBody>
            </Modal>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    );
}

export default MyLeave