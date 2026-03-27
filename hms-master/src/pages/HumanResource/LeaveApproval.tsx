import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardHeader, Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import FormHeader from "../../common/FormHeader/FormHeader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import moment from "moment";
import ErrorHandler from "../../helpers/ErrorHandler";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import ApproveLeaveRequest from "./ApproveLeaveRequest";
import StorageService from "../../helpers/storage/storage-service";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const LeaveApproval = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    
    const [leaveData, setLeaveData] = useState<any>([]);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [selectedLeaveData, setSelectedLeaveData] = useState<any>('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('');

    const edit = (data: any) => {
        setSelectedLeaveData(data);
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
        getAllLeaveRequest(role);
    }

    const getAllLeaveRequest = async (role: any) => {
        try {
            setLoading(true);
            let url = "all?approverId=" + role;
            let result = await employeeApiService.getAllLeaveRequest(url);
            setLeaveData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setRole(user.user_id);
        if (user.user_id) {
            getAllLeaveRequest(user.user_id);
        }
    }, []);

    // const updatedLeaveData = leaveData.map((item: any) => {
    //     const start: Date = new Date(item.leaveFromDate);
    //     const end: Date = new Date(item.leaveToDate);
    //     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    //         return { ...item, days: 0 };
    //     }
    //     const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    //     return { ...item, days };
    // });

    // console.log(updatedLeaveData);


    const [isExportCSV, setIsExportCSV] = useState(false);

    const leaveColumns = [
        {
            header: "Staff",
            accessorKey: "employeeDetails",
            enableColumnFilter: false,
            cell: ({ row }: any) => {
                const { firstName, staffId } = row.original.employeeDetails;
                return `${firstName} (${staffId})`;
            },
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
            accessorKey: "leaveDays",
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
                                }}
                                to="#">
                                <i className="ri-eye-fill align-bottom text-pink"></i>
                            </Link>
                        </li>
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
                    <FormHeader
                        title="Approve Leave Request"
                        pageTitle="Human Resource"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Approve Leave Request",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="leaveApprovalList">

                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center justify-content-between">
                                        <div className="col-sm-auto">
                                            <h5 className="card-title mb-0">Approve Leave Request</h5>
                                        </div>
                                        <div className="col-sm-auto">
                                            {/* <Link to="/main/add-leave-approval">
                                                <Button color="primary">Add Leave Approval</Button>
                                            </Link> */}
                                            <Button
                                                color="primary"
                                                onClick={() => navigate(-1)}
                                                className="btn btn-primary add-btn ms-3"
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
                    Edit Details
                </ModalHeader>
                <ModalBody>
                    <ApproveLeaveRequest data={selectedLeaveData} handleClose={handleEditClose} />
                </ModalBody>
            </Modal>

        </React.Fragment>
    );
};

export default LeaveApproval;
