import React, { useEffect, useState } from 'react'
import PharmacyApiService from '../../helpers/services/pharmacy/pharmacy-api-service';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import AddMedicine from './AddMedicine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPenToSquare, faPlus, faTrashCan, faUpload } from '@fortawesome/free-solid-svg-icons';
import EditMedicine from './EditMedicine';
import PreviewMedicineDetails from './PreviewMedicineDetails';
import { IoArrowBack } from 'react-icons/io5';
import DeleteModal from '../../Components/Common/DeleteModal';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import AddBadStock from './AddBadStock';
import TableContainer from '../../Components/Common/TableContainer';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import { useDispatch } from 'react-redux';

const MedicinesStock = (props: any) => {

    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [medicineStockData, setMedicineStockData] = useState<any>([]);

    const [addMedicineModel, setAddMedicineModel] = useState<boolean>(false);
    const [addBadStockOpen, setAddBadStockOpen] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<any>('');
    const [medicineId, setMedicineId] = useState('');
    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const medicineStockColumns = [
        {
            header: 'Medicine Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Medicine Company',
            accessorFn: (row: any) => row.companyDetails?.companyName || 'N/A',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Medicine Category',
            accessorKey: 'category',
            enableColumnFilter: false,

        },
        {
            header: 'Batch No',
            accessorKey: 'batchNo',
            enableColumnFilter: false,

        },
        {
            header: 'Expiry Date',
            accessorKey: 'expiryDate',
            enableColumnFilter: false,

        },
        {
            header: 'Available Qty',
            accessorKey: 'boxPacking',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Sold Qty',
            accessorKey: 'medicineDetails',
            enableColumnFilter: false,
            cell: ({ row }: any) => {
                const charges = row.original.medicineDetails;
                if (charges) {
                    return `${charges.totalQuantity}` || 'N/A';
                }
                return '-';
            },
        }

    ];

    const getAllMedicineStock = async () => {
        try {
            let url = "all"
            let result = await pharmacyApiService.getAllMedicineStock(url);
            console.log("getAllMedicineStock", result);
            setMedicineStockData(result);
        } catch (error: any) {
            console.log("getAllMedicineStock Error");
            console.log(error);
        }
    }

    const handleMedicineColse = () => {
        setAddMedicineModel(!addMedicineModel);
        getAllMedicineStock()
    }

    const addBadStockClose = () => {
        setAddBadStockOpen(!addBadStockOpen);
    }

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
    }

    const GetPurchase = () => {
        navigate('/main/purchase-list')
    }

    const goToLowStockMedicine = () => {
        navigate('/main/low-stock-medicine')
    }

    const goToBadStockMedicine = () => {
        navigate('/main/bad-stock-medicine')
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await pharmacyApiService.deleteMedicineStock(selectedId);
                toast.success('Medicine Stock Details Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                previewClose();
                getAllMedicineStock();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteMedicineStock = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    useEffect(() => {
        getAllMedicineStock();
    }, []);


    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Medicines Stock"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Medicines Stock",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <Button color='success' className="mx-2   active" onClick={() => navigate('/main/medicineMovingDetails')}>
                                        <span className="icon-off"> <FontAwesomeIcon icon={faBars} className='me-2' />Medicine Movement Details</span>
                                    </Button>
                                    <Button color='success' className="mx-2   active" onClick={() => navigate('/main/medicineMovingCompanyDetails')}>
                                        <span className="icon-off"> <FontAwesomeIcon icon={faBars} className='me-2' />Medicine Supplier Movement</span>
                                    </Button>
                                    <Button color='dark' className="mx-2   active" onClick={() => goToBadStockMedicine()}>
                                        <span className="icon-off">  <FontAwesomeIcon icon={faBars} className='me-2' /> Bad Stock Medicines</span>
                                    </Button>
                                    <Button color='danger' className="mx-2   active" onClick={() => goToLowStockMedicine()}>
                                        <span className="icon-off">  <FontAwesomeIcon icon={faBars} className='me-2' /> Low Stock Medicines</span>
                                    </Button>
                                    {/* <RoleBasedComponent allowedRoles={["PHARMACIST"]}>
                                        <Button color='primary' className="mx-2   active" onClick={() => addMedicines()}>

                                            <span className="icon-off">  <FontAwesomeIcon icon={faPlus} /> Add Medicines</span>
                                        </Button>
                                    </RoleBasedComponent> */}
                                    <Button color='success' className="mx-2   active" onClick={() => GetPurchase()}>
                                        <span className="icon-off"> <FontAwesomeIcon icon={faBars} className='me-2' />Purchase</span>
                                    </Button>

                                    {/* <Button className="mx-2" onClick={() => addMedicines()}>
                                        <FontAwesomeIcon icon={faPlus} /> Add Medicines
                                    </Button> */}
                                    {/* <Button className="" color='success' onClick={() => GetPurchase()}>
                                        <FontAwesomeIcon icon={faBars} /> Purchase
                                    </Button> */}


                                    {/* <button className="btn btn-soft-danger  mx-2" onClick={() => handleDeleteSelected()} disabled={selectedRows.length === 0}> Delete Selected </button> */}

                                    <Link to="/main/pharmacy-datatable" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                </div>
                                <hr />
                            </CardHeader>
                            <CardBody>
                                <TableContainer
                                    columns={medicineStockColumns}
                                    data={medicineStockData}
                                    isGlobalFilter={true}
                                    isCustomerFilter={true}
                                    customPageSize={5}
                                    tableClass="table table-bordered"
                                    theadClass="thead-light"
                                    divClass="table-responsive"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal isOpen={addMedicineModel} toggle={handleMedicineColse}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handleMedicineColse} className="p-3 bg-info-subtle modal-title">
                    Add Medicine Details
                </ModalHeader>
                <ModalBody>
                    <AddMedicine handleMedicineColse={handleMedicineColse} />
                </ModalBody>
            </Modal>

            <Modal isOpen={addBadStockOpen} toggle={addBadStockClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={addBadStockClose} className="p-3 bg-info-subtle modal-title">
                    Add Bad Stock
                </ModalHeader>
                <ModalBody>
                    <AddBadStock id={medicineId} handleClose={addBadStockClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={previewOpen} toggle={previewClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={previewClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    <h5 className="modal-title" >Medicine Details</h5>
                    <div className='d-flex'>
                        <FontAwesomeIcon icon={faPenToSquare} className="mx-1 text-primary pointer" onClick={() => edit()} />
                        <FontAwesomeIcon icon={faTrashCan} className="mx-1 text-danger pointer" onClick={() => deleteMedicineStock(selectedData.addMedicineId)} />
                    </div>
                </ModalHeader>
                <ModalBody>
                    <PreviewMedicineDetails data={selectedData} handleClose={previewClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered size='xl' scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                    Edit Medicine Details
                </ModalHeader>
                <ModalBody>
                    <EditMedicine id={selectedData.addMedicineId} handleClose={handleEditClose} />
                </ModalBody>
            </Modal>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />

        </React.Fragment>
    )
}

export default MedicinesStock