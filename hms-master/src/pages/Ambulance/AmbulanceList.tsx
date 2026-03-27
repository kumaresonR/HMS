import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
} from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormHeader from "../../common/FormHeader/FormHeader";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import TableContainer from "../../Components/Common/TableContainer";
import { IoArrowBack } from "react-icons/io5";
import AmbulanceApiService from "../../helpers/services/ambulance/ambulance-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import moment from "moment";
import DeleteModal from "../../Components/Common/DeleteModal";
import EditAmbulance from "./EditAmbulance";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const AmbulanceList = () => {
    const ambulanceApiService: AmbulanceApiService = new AmbulanceApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();

    const [ambulanceData, setAmbulanceData] = useState([]);
    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);
    const [editModelOpen, setEditModelOpen] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const getAllAmbulanceList = async () => {
        try {
            let result = await ambulanceApiService.getAllAmbulanceList("all");
            setAmbulanceData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await ambulanceApiService.deleteAmbulance(selectedId);
                toast.success('Ambulance Details Deleted Successfully', { containerId: 'TR' });
                await getAllAmbulanceList();
                setDeleteModal(false);
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const deleteComponent = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editAmbulanceDetails = (id: any) => {
        setSelectedId(id);
        editModelClose();
    }

    const editModelClose = () => {
        setEditModelOpen(!editModelOpen);
        getAllAmbulanceList();
    }

    useEffect(() => {
        getAllAmbulanceList();
    }, []);

    const ambulanceColumns = [
        {
            header: 'Vehicle Number',
            accessorKey: 'vehicleNumber', enableColumnFilter: false
        },
        {
            header: 'Vehicle Model',
            accessorKey: 'vehicleModel', enableColumnFilter: false
        },
        {
            header: 'Year Made',
            accessorKey: 'yearMade',
            enableColumnFilter: false,
            cell: (cell: any) => {
                const formattedDate = moment(cell.getValue()).format('YYYY');
                return formattedDate;
            }
        },
        {
            header: 'Driver Name',
            accessorKey: 'driverName', enableColumnFilter: false
        },
        {
            header: 'Driver License',
            accessorKey: 'driverLicense', enableColumnFilter: false
        },
        {
            header: 'Driver Contact',
            accessorKey: 'driverContact', enableColumnFilter: false
        },
        {
            header: 'Note',
            accessorKey: 'note', enableColumnFilter: false
        },
        {
            header: 'Vehicle Type',
            accessorKey: 'vehicleType', enableColumnFilter: false
        },
        {
            header: "Action",
            cell: (cell: any) => (
                <div className="d-flex gap-2">
                    <Button onClick={() => editAmbulanceDetails(cell.row.original.vehicleId)}
                        className="btn btn-sm btn-soft-info edit-list" title="Edit">
                        <i className="ri-pencil-line text-light"></i>
                    </Button>
                    <Button title="Delete" data-bs-toggle="modal" onClick={() => deleteComponent(cell.row.original.vehicleId)}
                        className="btn btn-sm btn-soft-danger remove-list">
                        <i className="ri-delete-bin-5-line text-light"></i>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={ambulanceData}
                />

                <Container fluid>
                    <FormHeader
                        title="Ambulance List"
                        pageTitle="Transportation Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Ambulance List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="ambulanceList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Ambulance List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                                <Button color="primary" className="btn btn-primary add-btn ms-2" onClick={() => navigate('/main/addAmbulance')}>
                                                    <i className="ri-add-fill me-1 align-bottom"></i> Add Ambulance
                                                </Button>

                                                <Button onClick={() => navigate('/main/ambulance')}
                                                    color="primary"
                                                    className="btn btn-primary  ms-3 add-btn"
                                                >
                                                    <IoArrowBack /> Back
                                                </Button>
                                            </div>
                                        </div>
                                    </Row>

                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={ambulanceColumns}
                                            data={ambulanceData}
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

            <Modal isOpen={editModelOpen} toggle={editModelClose} size="xl"
                backdrop={'static'} id="staticBackdrop" centered scrollable
            >
                <ModalHeader toggle={editModelClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Sample Collection
                </ModalHeader>
                <ModalBody>
                    <EditAmbulance id={selectedId} handleClose={editModelClose} />
                </ModalBody>
            </Modal>

        </React.Fragment>
    );
};

export default AmbulanceList;
