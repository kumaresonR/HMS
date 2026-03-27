import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

import { Link, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import ApproveModal from "../../../Components/Common/ApproveModal";
import DeleteModal from "../../../Components/Common/DeleteModal";

const ItemSupplierList = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [supplierData, setSupplierData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //Approve 
    const [approveModal, setApproveModal] = useState<boolean>(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [approveOpen, setApproveOpen] = useState<boolean>(false);
    const [status, setStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const itemSupplierColumns = [
        {
            header: 'Item Supplier',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => {
                const rowData = info.row.original;
                return (
                    <div>
                        <div><strong className="text-primary">{rowData.name}</strong></div>
                        <div><strong><FontAwesomeIcon icon={faPhone} /></strong> {rowData.phone} </div>
                        <div><strong><FontAwesomeIcon icon={faEnvelope} /></strong> {rowData.email} </div>
                    </div>
                );
            },
        },
        {
            header: 'Contact Person',
            accessorKey: 'contactPersonName',
            enableColumnFilter: false,
            cell: (info: any) => {
                const rowData = info.row.original;
                return (
                    <div>
                        <div><strong className="text-primary">{rowData.contactPersonName}</strong></div>
                        <div><strong><FontAwesomeIcon icon={faPhone} /></strong> {rowData.contactPersonPhone} </div>
                        <div><strong><FontAwesomeIcon icon={faEnvelope} /></strong> {rowData.contactPersonEmail} </div>
                    </div>
                );
            },
        },
        {
            header: 'Address',
            accessorKey: 'address',
            enableColumnFilter: false,
        },
        // {
        //     header: 'Version',
        //     accessorKey: 'modNo',
        //     enableColumnFilter: false,
        // },
        {
            header: 'Status',
            accessorKey: 'authStat',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const status = cell.row.original.authStat;
                const handleAuthorize = () => {
                    if (!status) return;
                    const newStatus = status === "UNAUTHORIZED" ? "AUTHORIZED" : "UNAUTHORIZED";
                    doApprove(cell.row.original.id, newStatus);
                };

                return (
                    <span
                        className={`badge ${status === "APPROVED" ? "bg-success" : "bg-danger"}`}
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
                        {status === "UNAUTHORIZED" ? (
                            <>
                                <li className="list-inline-item">
                                    <Link
                                        className="edit-item-btn"
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            editDetails(cell.row.original)
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
                                            deleteCategory(cell.row.original.id);
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

    const getAllItemSupplier = async () => {
        try {
            let result = await setupApiService.getAllItemSupplierTw();
            setSupplierData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const editDetails = (id: any) => {
        navigate('/main/editItemSupplier', { state: { data: id } })
    }


    const doApprove = (id: any, status: any) => {
        setSelectedCategoryId(id);
        setStatus(status)
        setApproveModal(true);
    }

    const handleApprove = async () => {
        if (selectedCategoryId) {
            setStatusLoading(true);
            try {
                if (status === "AUTHORIZED") {
                    await setupApiService.approveItemSupplier(selectedCategoryId);
                    toast.success('Supplier has been Authorized Successfully', { containerId: 'TR' });
                } else {
                    await setupApiService.disApproveItemSupplier(selectedCategoryId);
                    toast.success('Supplier has been UnAuthorized Successfully', { containerId: 'TR' });
                }
                await getAllItemSupplier();
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

    const deleteCategory = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteItemSupplier(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllItemSupplier();
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
        getAllItemSupplier();
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
                                    data={supplierData}
                                />

                                <Row>
                                    <Col lg={12}>
                                        <Card id="itemSupplierList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Item Supplier List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addItemSupplier'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Item Supplier
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
                                                        columns={itemSupplierColumns}
                                                        data={supplierData}
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

export default ItemSupplierList;
