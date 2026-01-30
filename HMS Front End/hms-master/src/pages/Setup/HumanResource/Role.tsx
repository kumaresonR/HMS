import React, { useEffect, useState } from "react";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, CardHeader, Button } from "reactstrap";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import ErrorHandler from "../../../helpers/ErrorHandler";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";

const Role = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [leaveTypeData, setLeaveTypeData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const leaveTypeColumns = [
        {
            header: 'Role Name',
            accessorKey: 'roleName',
            enableColumnFilter: false,
        },
        {
            header: 'Description',
            accessorKey: 'description',
            enableColumnFilter: false,
        },

        {
            header: "Action",
            cell: (cell: any) => {
                const status = cell.row.original.authStat;
                return (
                    <ul className="list-inline hstack gap-2 mb-0">
                        <>
                            <li className="list-inline-item">
                                <Link
                                    className="edit-item-btn"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        editRole(cell.row.original);
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
                                        deleteRole(cell.row.original.roleId);
                                    }}
                                    to="#"
                                >
                                    <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                </Link>
                            </li>
                        </>
                    </ul>
                );
            },
        }
    ];

    const editRole = (data: any) => {
        navigate('/main/editRole', { state: { data: data } })
    }

    const deleteRole = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await setupApiService.deleteRole(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllRole();
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

    const getAllRole = async () => {
        try {
            let result = await setupApiService.getAllRole();
            setLeaveTypeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllRole();
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
                                    data={leaveTypeData}
                                />

                                <Row>
                                    <Col lg={12}>
                                        <Card id="roleList">
                                            <CardHeader className="border-0">
                                                <Row className="g-4 align-items-center">
                                                    <div className="col-sm">
                                                        <div>
                                                            <h5 className="card-title mb-0">Role List</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <Link to='/main/addRole'>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="btn btn-primary add-btn me-3"
                                                                >
                                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add New Role
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
                                                        columns={leaveTypeColumns}
                                                        data={leaveTypeData}
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

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />

        </React.Fragment>
    );
};

export default Role