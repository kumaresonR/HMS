import React, { useEffect, useState } from 'react'
import IPDApiService from '../../../helpers/services/ipd/ipd-api-service';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { Button, Card, CardHeader, Col, Container, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import { minimizePage } from '../../../slices/pageResizer/uiSlice';
import moment from 'moment';
import RoleBasedComponent from '../../../common/RolePermission/RoleBasedComponent';
import DeleteModal from '../../../Components/Common/DeleteModal';
import TableContainer from '../../../Components/Common/TableContainer';
import AddIpdCommission from './AddIpdCommission';
import { useModal } from '../../../Components/Common/ModalContext';
import EditIpdCommission from './EditIpdCommission';

const IpdCommissionDataTabe = () => {
    const iPDApiService: IPDApiService = new IPDApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { showModal } = useModal();

    const [commissionData, setCommassionData] = useState([]);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);


    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await iPDApiService.deleteCommission(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllCommission();
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

    const deleteCommission = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editIpdCommission = (id: any) => {
        navigate('/main/editIpdCommissionStock', { state: { id: id } })
    }

    const getAllCommission = async () => {
        try {
            let result = await iPDApiService.getAllCommission();
            setCommassionData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllCommission();
    }, []);

    const commissionColumns = [
        {
            header: 'Patient',
            accessorKey: 'Patient',
            enableColumnFilter: false,
            cell: ({ row }: any) => {
                const patient = row.original.patients;
                if (patient) {
                    return `${patient.firstName} ${patient.lastName} (${patient.patientId})`;
                }
                return '-';
            },
        },
        {
            header: 'Doctor',
            accessorKey: 'Doctor',
            enableColumnFilter: false,
            cell: ({ row }: any) => {
                const doctor = row.original.employeeDetails;
                if (doctor) {
                    return `${doctor.firstName} ${doctor.lastName} (${doctor.staffId})`;
                }
                return '-';
            },
        },
        {
            header: 'Date',
            accessorKey: 'dateTime',
            enableColumnFilter: false,
            cell: ({ getValue }: any) => {
                const rawDate = getValue();
                return moment(rawDate).format('DD/MM/YYYY hh:mm A');
            },
        },
        {
            header: 'Commission Category',
            accessorKey: 'commissionCategory',
            enableColumnFilter: false,
        },
        {
            header: 'Commission Amount',
            accessorKey: 'commissionAmount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            )
        },
        {
            header: "Action", enableColumnFilter: false,
            cell: (cell: any) => (
                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "ACCOUNTANT"]}>
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item">
                            <Link
                                className="edit-item-btn"
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    showModal({
                                        content: (
                                            <EditIpdCommission data={cell.row.original} refresh={getAllCommission} />
                                        ),
                                        title: "Edit IPD Commission",
                                        size: "lg",
                                    })
                                }}
                                title="Edit"
                            >
                                <i className="ri-pencil-fill align-bottom text-purple"></i>
                            </Link>
                        </li>

                        <li className="list-inline-item" title="Delete">
                            <Link
                                className="remove-item-btn" data-bs-toggle="modal"
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteCommission(cell.row.original.id);
                                }}
                                to="#"
                            >
                                <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                            </Link>
                        </li>
                    </ul>
                </RoleBasedComponent>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="IPD Commission"
                        pageTitle="IPD Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "IPD Commission",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="ipdCommission">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">IPD Commission</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "DOCTOR"]}>
                                                    <Button
                                                        onClick={() =>
                                                            showModal({
                                                                content: (
                                                                    <AddIpdCommission refresh={getAllCommission} />
                                                                ),
                                                                title: "Add IPD Commission",
                                                                size: "lg",
                                                            })
                                                        }
                                                        color="primary"
                                                        className="btn btn-primary add-btn ms-3"

                                                    >
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add IPD Commission
                                                    </Button>
                                                </RoleBasedComponent>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={commissionColumns}
                                            data={commissionData}
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

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    );
};

export default IpdCommissionDataTabe;