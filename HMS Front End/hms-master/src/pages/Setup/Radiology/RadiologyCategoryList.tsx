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
import FormHeader from "../../../common/FormHeader/FormHeader";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import ApproveModal from "../../../Components/Common/ApproveModal";
import DeleteModal from "../../../Components/Common/DeleteModal";

const RadiologyCategoryList = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [radiologyData, setRadiologyData] = useState([]);

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

    const radiologyColumns = [
        {
            header: 'Category Name',
            accessorKey: 'categoryName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),

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
                        {status === "UNAUTHORIZED" ? (
                            <>
                                <li className="list-inline-item">
                                    <Link
                                        className="edit-item-btn"
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            editCategory(cell.row.original)
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


    const doApprove = (id: any, status: any) => {
        setSelectedCategoryId(id);
        setStatus(status);
        setApproveModal(true);
    }

    const handleApprove = async () => {
        if (selectedCategoryId) {
            setStatusLoading(true);
            try {
                if (status === "AUTHORIZED") {
                    await setupApiService.approveRaiologyCategory(selectedCategoryId);
                    toast.success('Record has been approved Successfully', { containerId: 'TR' });
                } else {
                    await setupApiService.disApproveRaiologyCategory(selectedCategoryId);
                    toast.success('Record has been approved UnAuthorized Successfully', { containerId: 'TR' });
                }
                await getAllRaiologyCategory();
                setApproveModal(false);
                approveClose();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const approveClose = () => {
        setApproveOpen(!approveOpen);
    }

    const editCategory = (data: any) => {
        navigate('/main/editRadiologyCategory', { state: { data: data } })
    }

    const deleteCategory = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteRaiologyCategory(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllRaiologyCategory();
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

    const getAllRaiologyCategory = async () => {
        try {
            let result = await setupApiService.getAllRaiologyCategory();
            setRadiologyData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllRaiologyCategory();
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
                                    data={radiologyData}
                                />

                                <Row>
                                    <Col lg={12}>
                                        <Card id="radiologyCategoryList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Radiology Category List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addRadiologyCategory'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Category
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
                                                        columns={radiologyColumns}
                                                        data={radiologyData}
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

export default RadiologyCategoryList;
