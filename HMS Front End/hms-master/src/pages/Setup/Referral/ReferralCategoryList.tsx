import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Button,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

import { Link, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import ApproveModal from "../../../Components/Common/ApproveModal";
import DeleteModal from "../../../Components/Common/DeleteModal";

const ReferralCategoryList = () => {
    const setupApiService: SetupApiService = new SetupApiService();
    let navigate: any = useNavigate();

    const [categoryData, setCategoryData] = useState([]);


    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //Approve 
    const [approveModal, setApproveModal] = useState<boolean>(false);
    const [selectedCommissionId, setSelectedCommissionId] = useState('');
    const [approveOpen, setApproveOpen] = useState<boolean>(false);
    const [status, setStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const referralCategoryColumns = [
        {
            header: 'Referral Category Name',
            accessorKey: 'name',
            enableColumnFilter: false,
        },

        // {
        //     header: 'Version',
        //     accessorKey: 'modNo',
        //     enableColumnFilter: false,
        // },
        // {
        //     header: 'Status',
        //     accessorKey: 'status',
        //     enableColumnFilter: false,
        // },
        {
            header: 'Status',
            accessorKey: 'authStat',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const status = cell.row.original.authStat;

                const handleAuthorize = () => {
                    const newStatus = status === "UnAuthorized" ? "Authorized" : "UnAuthorized";
                    doApprove(cell.row.original.categoryId, newStatus);
                };

                return (
                    <span
                        className={`badge ${status === "Authorized" ? "bg-success" : "bg-danger"}`}
                        onClick={handleAuthorize}
                        style={{ cursor: "pointer" }}
                    >
                        {status === "UnAuthorized" ? "Click To Authorise" : "Click To UnAuthorise"}
                    </span>
                );
            },
        },
        // {
        //     header: "Action",
        //     cell: (cell: any) => {
        //         const status = cell.row.original.status;
        //         return (
        //             <ul className="list-inline hstack gap-2 mb-0">
        //                 {status === "Pending" ? (
        //                     <>
        //                         <li className="list-inline-item">
        //                             <Link
        //                                 className="edit-item-btn"
        //                                 to="#"
        //                                 onClick={(e) => {
        //                                     e.preventDefault();
        //                                     editReferral(cell.row.original);
        //                                 }}
        //                                 title="Edit"
        //                             >
        //                                 <i className="ri-pencil-fill align-bottom text-purple"></i>
        //                             </Link>
        //                         </li>

        //                         <li className="list-inline-item" title="Delete">
        //                             <Link
        //                                 className="remove-item-btn"
        //                                 data-bs-toggle="modal"
        //                                 onClick={(e) => {
        //                                     e.preventDefault();
        //                                     deleteCategory(cell.row.original.categoryId);
        //                                 }}
        //                                 to="#"
        //                             >
        //                                 <i className="ri-delete-bin-fill align-bottom text-danger"></i>
        //                             </Link>
        //                         </li>
        //                     </>
        //                 ) : 'Nill'}
        //             </ul>
        //         );
        //     },
        // },

        {
            header: "Action",
            cell: (cell: any) => {
                const status = cell.row.original.authStat;

                return (
                    <ul className="list-inline hstack gap-2 mb-0">
                        {status === "UnAuthorized" ? (
                            <>
                                <li className="list-inline-item">
                                    <Link
                                        className="edit-item-btn"
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            editReferral(cell.row.original);
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
                                            deleteCategory(cell.row.original.categoryId);
                                        }}
                                        to="#"
                                    >
                                        <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                    </Link>
                                </li>
                            </>
                        ) : 'Nill'}
                    </ul>
                );
            },
        }
    ];

    const doApprove = (id: any, status: any) => {
        setSelectedCommissionId(id);
        setStatus(status);
        setApproveModal(true);
    }

    const handleApprove = async () => {
        if (selectedCommissionId) {
            setStatusLoading(true);
            try {
                let url = "authStat=" + status
                await setupApiService.approveReferralCategory(selectedCommissionId, url);
                toast.success('Record has been approved Successfully', { containerId: 'TR' });
                await getAllReferralCategory();
                setApproveModal(false);
                approveClose();
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

    const editReferral = (data: any) => {
        navigate('/main/editReferralCategory', { state: { data: data } })
    }

    const deleteCategory = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteReferralCategory(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllReferralCategory();
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

    const getAllReferralCategory = async () => {
        try {
            let result = await setupApiService.getAllReferralCategory();
            setCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllReferralCategory();
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
                                    data={categoryData}
                                />
                                <Row>
                                    <Col lg={12}>
                                        <Card id="referralCategoryList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Referral Category List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addReferralCategory'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Referral Category
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                type="button"
                                                                size="sm"
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
                                                        columns={referralCategoryColumns}
                                                        data={categoryData}
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
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <ApproveModal
                    show={approveModal}
                    status={status}
                    onApproveClick={handleApprove}
                    onCloseClick={() => setApproveModal(false)}
                    isLoading={statusLoading}
                />

                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDelete}
                    onCloseClick={() => setDeleteModal(false)}
                />
            </div>
        </React.Fragment>
    );
};

export default ReferralCategoryList;
