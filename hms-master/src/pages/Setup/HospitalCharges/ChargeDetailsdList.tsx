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
import ApproveModal from "../../../Components/Common/ApproveModal";
import DeleteModal from "../../../Components/Common/DeleteModal";
import ErrorHandler from "../../../helpers/ErrorHandler";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { toast } from "react-toastify";

const ChargeDetailsdList = () => {
    const setupApiService: SetupApiService = new SetupApiService();
    let navigate: any = useNavigate();

    const [chargeData, setChargeData] = useState<any[]>([]);

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
   
    const chargeColumns = [
        {
            header: 'Name',
            accessorFn: (row: any) => row.chargeName,
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className=" text-primary">
                    {info.getValue()}
    
                </div>
            ),
        },
        {
            header: 'Charge Category',
            accessorFn: (row: any) => row.chargeCategory?.name || 'N/A',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.row.original.chargeCategory?.name || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Charge Type',
            accessorFn: (row: any) => row.chargeType?.chargeType || 'N/A',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.row.original.chargeType?.chargeType || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Unit',
            accessorFn: (row: any) => row.unitType?.unitType || 'N/A',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.row.original.unitType?.unitType || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Tax (%)',
            accessorKey: 'taxPercentage',
            enableColumnFilter: false,
        },
        {
            header: 'Standard Charge (₹)',
            accessorKey: 'standardCharge',
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
                    doApprove(cell.row.original.chargeId, newStatus);
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
                                            editCharges(cell.row.original);
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
                                            deleteFloor(cell.row.original.chargeId);
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
        setSelectedBedId(id);
        setStatus(status)
        setApproveModal(true);
    }

    const handleApprove = async () => {
        if (selectedBedId) {
            try {
                let url = "authStat=" + status
                await setupApiService.approveCharges(selectedBedId, url);
                toast.success('Charges has been approved Successfully', { containerId: 'TR' });
                await getAllCharges();
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

    const editCharges = (data: any) => {
        navigate('/main/editHospitalCharges', { state: { data: data } })
    }

    const deleteFloor = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteCharges(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllCharges();
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

    const getAllCharges = async () => {
        try {
            let result = await setupApiService.getAllCharges();
            setChargeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllCharges();
    }, []);

    return (
        <React.Fragment>
            <div >
                <Container fluid>
                 
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <ExportCSVModal
                                    show={isExportCSV}
                                    onCloseClick={() => setIsExportCSV(false)}
                                    data={chargeData}
                                />
                                <Row>
                                    <Col lg={12}>
                                        <Card id="ChargeDetailsdList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Charges Details List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addHospitalCharges'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Charge
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
                                                        columns={chargeColumns}
                                                        data={chargeData}
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

export default ChargeDetailsdList;
