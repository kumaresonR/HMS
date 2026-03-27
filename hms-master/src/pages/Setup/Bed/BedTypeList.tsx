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
import DeleteModal from "../../../Components/Common/DeleteModal";
import ApproveModal from "../../../Components/Common/ApproveModal";

const BedTypeList = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [bedTypeData, setBedTypeData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //Approve 
    const [approveModal, setApproveModal] = useState<boolean>(false);
    const [selectedBedTypeId, setSelectedBedTypeId] = useState('');
    const [approveOpen, setApproveOpen] = useState<boolean>(false);
    const [status, setStatus] = useState('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const bedTypeColumns = [
        {
            header: 'Bed Type',
            accessorKey: 'name',
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
                    const newStatus = status === "UnAuthorized" ? "Authorized" : "UnAuthorized";
                    doApprove(cell.row.original.bedTypeId, newStatus);
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
                                            editBedType(cell.row.original);
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
                                            deleteBedType(cell.row.original.bedTypeId);
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

    const doApprove = (id: any,status:any) => {
        setSelectedBedTypeId(id);
        setStatus(status);
        setApproveModal(true);
    }

    const handleApprove = async () => {
        if (selectedBedTypeId) {
            try {
                let url = "authStat=" + status
                await setupApiService.approveBedType(selectedBedTypeId, url);
                toast.success('Record has been approved Successfully', { containerId: 'TR' });
                await getAllBedType();
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

    const editBedType = (data: any) => {
        navigate('/main/editBedType', { state: { data: data } })
    }

    const deleteBedType = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteBedType(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllBedType();
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

    const getAllBedType = async () => {
        try {
            let result = await setupApiService.getAllBedType();
            setBedTypeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllBedType();
    }, []);

    return (
        <React.Fragment>

            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <ExportCSVModal
                                show={isExportCSV}
                                onCloseClick={() => setIsExportCSV(false)}
                                data={bedTypeData}
                            />

                            <Row>
                                <Col lg={12}>
                                    <Card id="bedTypeList">
                                        <CardHeader className="border-0">
                                            <Row className="g-4 align-items-center">
                                                <div className="col-sm">
                                                    <div>
                                                        <h5 className="card-title mb-0">Bed Type List</h5>
                                                    </div>
                                                </div>

                                                <div className="col-sm-auto">
                                                    <div>
                                                        <Link to='/main/addBedType'>
                                                            <Button
                                                                size="sm"
                                                                color="primary"
                                                                className="btn btn-primary add-btn me-3"
                                                            >
                                                                <i className="ri-add-fill me-1 align-bottom"></i> Add New Bed Type
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
                                                    columns={bedTypeColumns}
                                                    data={bedTypeData}
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
                status = {status}
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

export default BedTypeList;
