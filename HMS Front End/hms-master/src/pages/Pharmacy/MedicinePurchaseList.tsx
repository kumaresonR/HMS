import React, { useEffect, useState } from 'react'
import PharmacyApiService from '../../helpers/services/pharmacy/pharmacy-api-service';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faPrint, faTrashCan, faUpload } from '@fortawesome/free-solid-svg-icons';
import MedicinePurchase from './MedicinePurchase';
import PreviewPurchaseDetails from './PreviewPurchaseDetails';
import moment from 'moment';
import { toast } from 'react-toastify';
import ErrorHandler from '../../helpers/ErrorHandler';
import DeleteModal from '../../Components/Common/DeleteModal';
import { IoArrowBack } from 'react-icons/io5';
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent';
import { IoIosShareAlt } from 'react-icons/io';
import Paginator from '../../common/pagenator/pagenator';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const MedicinePurchaseList = () => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [purchaseMedicines, setPurchaseMedicines] = useState<any>([]);
    const [getMedicinePurchase, setMedicinePurchase] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState<any>('');
    const [filteredData, setFilteredData] = useState(purchaseMedicines);

    // search 
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    //pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const handleNext = () => setCurrentPage((prev) => prev + 1);
    const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(0);
    };

    const getPurchaseMedicine = () => {
        handleColse()
    }
    const handleColse = () => {
        setMedicinePurchase(!getMedicinePurchase);
        getAllPurchaseMedicine(currentPage, pageSize)
    }

    const preview = (data: any) => {
        setPreviewData(data);
        previewClose();
    }

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
        getAllPurchaseMedicine(currentPage, pageSize);
    }

    const getAllPurchaseMedicine = async (page: number, size: number) => {
        try {
            let url = `?page=${page}&size=${size}`;
            let result = await pharmacyApiService.getAllPurchaseMedicine(url);
            setPurchaseMedicines(result);
            if (result && result.length) {
                const totalPatients = result.length;
                setTotalPages(Math.ceil(totalPatients / size));
            }
            return result || [];
        } catch (error: any) {
            console.log(error);
            return [];
        }
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await pharmacyApiService.deletePurchase(selectedId);
                toast.success('Medicine Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                previewClose();
                getAllPurchaseMedicine(currentPage, pageSize);
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deletePurchase = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const moveToStock = async (id: any) => {
        try {
            await pharmacyApiService.moveToMedicineStock(id);
            toast.success('Medicine has been moved Successfully', { containerId: 'TR' });
            navigate('/main/medicine-stock');
            return;
        } catch (error: any) {
            return ErrorHandler(error)
        }
    };

    useEffect(() => {
        const loadPages = async () => {
            const currentPageData = await getAllPurchaseMedicine(currentPage, pageSize);
            setPurchaseMedicines(currentPageData);
        };

        loadPages();
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredData(purchaseMedicines);
            return;
        }

        const filteredResults = purchaseMedicines.filter((item: any) => {
            // Extract supplier name safely
            const supplierName = item.supplierId?.split("supplierName=")?.[1]?.split(",")?.[0]?.trim() || "NA";

            return (
                item.purchaseBillId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.status.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplierName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        setFilteredData(filteredResults);
    }, [searchTerm, purchaseMedicines]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Medicine Purchase List"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Medicine Purchase List",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","PHARMACIST"]}>
                                        <Button className="mx-2" color='primary' onClick={() => getPurchaseMedicine()}>
                                            <FontAwesomeIcon icon={faPlus} /> Purchase Medicine
                                        </Button>
                                    </RoleBasedComponent>
                                    {/* <Button className="mx-2" color='dark' onClick={() => navigate('/main/mediceUpload')}>
                                        <FontAwesomeIcon icon={faUpload} />Import Medicines
                                    </Button> */}
                                    <Link to="/main/medicine-stock" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <input
                                    type="text"
                                    placeholder="Search by Purchase No, Supplier Name, Status"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="form-control mb-3"
                                />
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Pharmacy Purchase No</th>
                                                <th>Purchase Date</th>
                                                <th>Bill No</th>
                                                <th>Supplier Name</th>
                                                <th>Total(₹)</th>
                                                <th>Tax(₹)</th>
                                                <th>Discount(₹)</th>
                                                <th>Net Amount(₹)</th>
                                                <th>Status</th>
                                                <RoleBasedComponent allowedRoles={["SUPERADMIN","PHARMACIST"]}>
                                                    <th>Action</th>
                                                </RoleBasedComponent>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData?.map((data: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td className='text-primary' >{data.purchaseBillId} </td>
                                                    <td>{moment(data.purchaseDate).format('DD/MM/YYYY hh:mm A')}</td>
                                                    <td className='text-primary' >{data.billNo}</td>
                                                    <td  >{data.supplierId.split("supplierName=")?.[1]?.split(",")?.[0]?.trim() || "NA"}</td>
                                                    <td>{data.totalAmount} </td>
                                                    <td>{data.tax}</td>
                                                    <td>{data.discount}</td>
                                                    <td className='text-primary' >{data.netAmount} </td>
                                                    <td >
                                                        <Badge color={data.status === "PENDING" ? "warning" : "success"}>
                                                            {data.status}
                                                        </Badge>
                                                    </td>
                                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","PHARMACIST"]}>
                                                        <td>
                                                            <ul className="list-inline hstack gap-2 mb-0">
                                                                <li className="list-inline-item" title="View">
                                                                    <Link
                                                                        className="view-item-btn" data-bs-toggle="modal" onClick={() => preview(data)}
                                                                        to="#"
                                                                    >
                                                                        <i className="ri-eye-fill align-bottom text-pink"></i>
                                                                    </Link>
                                                                </li>
                                                                {data.status === "PENDING" && (
                                                                    <li className="list-inline-item" title="Move To Medicines Stock">
                                                                        <Link
                                                                            className="view-item-btn"
                                                                            to="#"
                                                                            data-bs-toggle="modal"
                                                                            onClick={() => moveToStock(data.purchaseBillId)}
                                                                        >
                                                                            <IoIosShareAlt className="text-purple" />
                                                                        </Link>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </td>
                                                    </RoleBasedComponent>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                                <Paginator
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    pageSize={pageSize}
                                    handlePageSizeChange={handlePageSizeChange}
                                    handlePrevious={handlePrevious}
                                    handleNext={handleNext}
                                    disableNext={purchaseMedicines?.length === 0 || purchaseMedicines?.length < pageSize}
                                />
                                <div className="my-5">
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={getMedicinePurchase} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    Add Medicine Purchase List
                </ModalHeader>
                <ModalBody>
                    <MedicinePurchase handleClose={handleColse} />
                </ModalBody>
            </Modal>

            <Modal isOpen={previewOpen} toggle={previewClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={previewClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    <h5 className="modal-title" >Medicine Details</h5>
                    <div className='d-flex'>
                        {/* <PrintComponent contentId="prescriptionContent" /> */}
                        <FontAwesomeIcon icon={faTrashCan} onClick={() => deletePurchase(previewData.purchaseBillId)} className="mx-1 text-danger pointer" />
                    </div>
                </ModalHeader>
                <ModalBody id="prescriptionContent">
                    <PreviewPurchaseDetails data={previewData} handleClose={previewClose} />
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

export default MedicinePurchaseList
