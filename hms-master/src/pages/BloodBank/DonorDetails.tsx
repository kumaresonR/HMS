import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import FormHeader from '../../common/FormHeader/FormHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faFilePdf, faPenToSquare, faPlus, faPlusCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import AddDonorDetails from './AddDonorDetails'
import ErrorHandler from '../../helpers/ErrorHandler'
import BloodBankApiService from '../../helpers/services/bloodBank/BloodBankApiService'
import EditDonorDetails from './EditDonorDetails'
import PrintComponent from '../../Components/Common/PrintComponent'
import PreviewDonorDetails from './PreviewDonorDetails'
import { toast } from 'react-toastify'
import DeleteModal from '../../Components/Common/DeleteModal'
import { IoArrowBack } from 'react-icons/io5'
import { Link, useLocation } from 'react-router-dom'
import AddBagStock from './AddBagStock'
import { RiAddCircleFill } from 'react-icons/ri'
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent'
import { useDispatch } from 'react-redux'
import { minimizePage } from '../../slices/pageResizer/uiSlice'

const DonorDetails = () => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();
    const dispatch = useDispatch();
    const location = useLocation();

    const [bloodDonorData, setBloodDonorData] = useState<any>([]);
    const [addDonorDetails, setAddDonorDetails] = useState<boolean>(false);
    const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [donorId, setDonorId] = useState('');
    const [addBagDetails, setAddBagDetails] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    function handleClose() {
        setOpenPreviewModal(!openPreviewModal);
    }

    const preview = (id: any) => {
        setDonorId(id);
        handleClose()
    }

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setOpenEditModal(!openEditModal);
        getAllDonorData()
    }

    const handleAddDonorDetailsClose = () => {
        setAddDonorDetails(!addDonorDetails);
        getAllDonorData()
    }

    const addBloodDonorData = () => {
        handleAddDonorDetailsClose()
    }

    const bagModal = (id: any) => {
        setDonorId(id);
        handleBagColse();
    };

    const handleBagColse = () => {
        setAddBagDetails(!addBagDetails);
    }

    const getAllDonorData = async (pageNumber = 1) => {
        try {
            let url = "all";
            let result = await bloodBankApiService.getAllDonor(url);
            console.log("getAllDonorData", result);
            setBloodDonorData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await bloodBankApiService.deleteDonor(selectedId);
                toast.success('Donor Deleted Successfully', { containerId: 'TR' });
                await getAllDonorData();
                getAllDonorData();
                handleClose();
                setDeleteModal(false);
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const deleteDonor = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    useEffect(() => {
        getAllDonorData();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Donor Details"
                    pageTitle="Donor Details"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Donor Details",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN", "PATHOLOGIST"]}>
                                        <Button
                                            color="primary"
                                            className="btn btn-primary add-btn " onClick={() => addBloodDonorData()}>
                                            <FontAwesomeIcon icon={faPlus} className='me-2' />Add Blood Donor
                                        </Button>
                                    </RoleBasedComponent>
                                    <Link to="/main/blood-bank-status" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Donor Name</th>
                                                <th>Date of Birth</th>
                                                <th>Blood Group</th>
                                                <th>Gender</th>
                                                <th>Contact No</th>
                                                <th>Father Name</th>
                                                <th>Address</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bloodDonorData?.map((data: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td>{data.donorName || 'NA'} </td>
                                                    <td>{data.dateOfBirth || 'NA'}</td>
                                                    <td>{data.bloodGroup || 'NA'}</td>
                                                    <td>{data.gender || 'NA'} </td>
                                                    <td>{data.contactNo || 'NA'} </td>
                                                    <td>{data.fatherName || 'NA'}</td>
                                                    <td>{data.address || 'NA'}</td>
                                                    <td>
                                                        <span>

                                                            <ul className="list-inline hstack gap-2 mb-0">
                                                                <li className="list-inline-item" title="Preview">
                                                                    <Link
                                                                        className="view-item-btn"
                                                                        to="#" onClick={() => preview(data.donorId)}
                                                                    >
                                                                        <i className="ri-eye-fill align-bottom text-pink"></i>
                                                                    </Link>
                                                                </li>
                                                                <RoleBasedComponent allowedRoles={["SUPERADMIN", "PATHOLOGIST"]}>
                                                                    <li className="list-inline-item" title="Add Bag Stock">
                                                                        <Link
                                                                            className="view-item-btn"
                                                                            to="#" onClick={() => bagModal(data.donorId)}
                                                                        >
                                                                            <RiAddCircleFill size={12} color="text-primary" />
                                                                        </Link>
                                                                    </li>
                                                                </RoleBasedComponent>
                                                            </ul>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={addDonorDetails} toggle={handleAddDonorDetailsClose}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleAddDonorDetailsClose} className="p-3 bg-info-subtle modal-title">
                    Add Donor Details
                </ModalHeader>
                <ModalBody>
                    <AddDonorDetails handleClose={handleAddDonorDetailsClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={openPreviewModal} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle model-header-container modal-title">
                    Donor Details
                    <RoleBasedComponent allowedRoles={["SUPERADMIN", "PATHOLOGIST"]}>
                        <div className='d-flex'>
                            <PrintComponent contentId="prescriptionContent" />
                            <Button className="btn btn-sm btn-soft-secondary edit-list mx-1" title="Edit" onClick={() => edit()}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </Button>
                            <Button className="btn btn-sm btn-soft-danger edit-list mx-1" title="Delete" onClick={() => deleteDonor(donorId)}>
                                <FontAwesomeIcon icon={faTrashCan} />
                            </Button>
                        </div>
                    </RoleBasedComponent>
                </ModalHeader>
                <ModalBody>
                    <div id="prescriptionContent">
                        <PreviewDonorDetails id={donorId} handleClose={handleClose} />
                    </div>
                </ModalBody>
            </Modal>

            <Modal isOpen={openEditModal} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered size='lg' scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                    Edit Donor Details
                </ModalHeader>

                <ModalBody>
                    <EditDonorDetails id={donorId} handleClose={handleEditClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={addBagDetails} toggle={handleBagColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable>
                <ModalHeader toggle={handleBagColse} className="p-3 bg-info-subtle model-container text-white">
                    Bag Stock Details
                </ModalHeader>
                <ModalBody>
                    <AddBagStock id={donorId} handleClose={handleBagColse} />
                </ModalBody>
            </Modal>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment >
    )
}

export default DonorDetails