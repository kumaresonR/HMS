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
import DeleteModal from "../../../Components/Common/DeleteModal";
import ApproveModal from "../../../Components/Common/ApproveModal";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import RoleBasedComponent from "../../../common/RolePermission/RoleBasedComponent";

const BedList = () => {
    const setupApiService: SetupApiService = new SetupApiService();
    let navigate: any = useNavigate();

    const [bedData, setBedData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //Approve 
    const [approveModal, setApproveModal] = useState<boolean>(false);
    const [selectedBedId, setSelectedBedId] = useState('');
    const [approveOpen, setApproveOpen] = useState<boolean>(false);
    const [status, setStatus] = useState('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const bedColumns = [
        {
            header: 'Bed Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Bed Type',
            accessorKey: 'bedType.name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}

                </div>
            ),
        },
        {
            header: 'Bed Group',
            accessorKey: 'bedGroup.name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Used',
            accessorKey: 'notAvailable',
            enableColumnFilter: false,
            cell: (info: any) => {
                const isActive = info.getValue();

                return (
                    <div>
                        <input
                            type="checkbox"
                            checked={isActive === false}
                        // disabled={true}
                        />
                    </div>
                );
            },
        },

        {
            header: 'Status',
            accessorKey: 'authStat',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const status = cell.row.original.authStat;

                const handleAuthorize = () => {
                    const newStatus = status === "UnAuthorized" ? "Authorized" : "UnAuthorized";
                    doApprove(cell.row.original.bedDetailsId, newStatus);
                };

                return (
                    <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN","ACCOUNTANT"]}>
                        <span
                            className={`badge ${status === "Authorized" ? "bg-success" : "bg-danger"}`}
                            onClick={handleAuthorize}
                            style={{ cursor: "pointer" }}
                        >
                            {status === "UnAuthorized" ? "Click To Authorise" : "Click To UnAuthorise"}
                        </span>
                    </RoleBasedComponent>
                );
            },
        },
        {
            header: "Action",
            cell: (cell: any) => {
                const status = cell.row.original.authStat;

                return (
                    <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN","ACCOUNTANT"]}>
                        <ul className="list-inline hstack gap-2 mb-0">
                            {status === "UnAuthorized" ? (
                                <>
                                    <li className="list-inline-item">
                                        <Link
                                            className="edit-item-btn"
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                editFlore(cell.row.original);
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
                                                deleteFloor(cell.row.original.bedDetailsId);
                                            }}
                                            to="#"
                                        >
                                            <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                        </Link>
                                    </li>
                                </>
                            ) : 'Nill'}
                        </ul>
                    </RoleBasedComponent>
                );
            },
        }
    ];

    const doApprove = (id: any, status: any) => {
        setSelectedBedId(id);
        setStatus(status)
        setApproveModal(true);
    }

    const handleApprove = async () => {
        if (selectedBedId) {
            try {
                let url = "authStat=" + status
                await setupApiService.approveBed(selectedBedId, url);
                toast.success('Bed has been approved Successfully', { containerId: 'TR' });
                await getAllBed();
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

    const editFlore = (data: any) => {
        navigate('/main/editBed', { state: { data: data } })
    }

    const deleteFloor = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteBed(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllBed();
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

    const getAllBed = async () => {
        try {
            let result = await setupApiService.getAllBed();
            setBedData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllBed();
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
                                data={bedData}
                            />

                            <Row>
                                <Col lg={12}>
                                    <Card id="bedList">
                                        <CardHeader className="border-0">
                                            <Row className="g-4 align-items-center">
                                                <div className="col-sm">
                                                    <div>
                                                        <h5 className="card-title mb-0">Bed List</h5>
                                                    </div>
                                                </div>
                                                <div className="col-sm-auto">
                                                    <div>
                                                        <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN","ACCOUNTANT"]}>
                                                            <Link to='/main/addBed'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Bed
                                                                </Button>
                                                            </Link>
                                                        </RoleBasedComponent>
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
                                                    columns={bedColumns}
                                                    data={bedData}
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
            />

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    );
};

export default BedList;
