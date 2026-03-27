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
import ApproveModal from "../../../Components/Common/ApproveModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import ErrorHandler from "../../../helpers/ErrorHandler";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { toast } from "react-toastify";

const SpecialistList = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [specialistData, setSpecialistData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //Approve 
    const [approveModal, setApproveModal] = useState<boolean>(false);
    const [selectedSpecialistId, setSelectedSpecialistId] = useState('');
    const [approveOpen, setApproveOpen] = useState<boolean>(false);
    const [status, setStatus] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Updated specialist columns
    const specialistColumns = [
        {
            header: 'Specialist Name',
            accessorKey: 'name',
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
                    doApprove(cell.row.original.specialistId, newStatus);
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
                                            editSpecialist(cell.row.original)
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
                                            deleteSpecialist(cell.row.original.specialistId);
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
        setSelectedSpecialistId(id);
        setStatus(status);
        setApproveModal(true);
    }

    const handleApprove = async () => {
        if (selectedSpecialistId) {
            setStatusLoading(true);
            try {
                if (status === "AUTHORIZED") {
                    await setupApiService.approveSpecialist(selectedSpecialistId);
                    toast.success('Record has been Authorized Successfully', { containerId: 'TR' });
                } else {
                    await setupApiService.disApproveSpecialist(selectedSpecialistId);
                    toast.success('Record has been approved UnAuthorized Successfully', { containerId: 'TR' });
                }
                await getAllSpecialist();
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

    const editSpecialist = (data: any) => {
        navigate('/main/editSpecialist', { state: { data: data } })
    }

    const deleteSpecialist = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteSpecialist(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllSpecialist();
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

    const getAllSpecialist = async () => {
        try {
            let result = await setupApiService.getAllSpecialist();
            setSpecialistData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllSpecialist();
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
                                    data={specialistData}
                                />
                                <Row>
                                    <Col lg={12}>
                                        <Card id="specialistList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Specialist List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addSpecialist'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Specialist
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
                                                        columns={specialistColumns}
                                                        data={specialistData}
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
                isLoading={statusLoading}
            />

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    );
};

export default SpecialistList;
