
import React, { useState } from "react"
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import EditPharmacyBill from "./EditPharmacyBill"
import PreviewPharmacyBillDetails from "./PreviewPharmacyBillDetails"
import PharmacyInvoice from "./PharmacyInvoice"
import PrintComponent from "../../Components/Common/PrintComponent"
import moment from "moment"
import ErrorHandler from "../../helpers/ErrorHandler"
import { toast } from "react-toastify"
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service"
import DeleteModal from "../../Components/Common/DeleteModal"
import { RiAddCircleFill } from "react-icons/ri"
import { Link } from "react-router-dom"
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent"

const PharmacyDataTable = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const [editModel, setEditModel] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [prescriptionNo, setPrescriptionNo] = useState('');
    const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [searchQuery, setSearchQuery] = useState("");

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const preview = (data: any) => {
        setPreviewData(data);
        previewClose();
    }

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
        props.refresh();
    }

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
    }

    const addPayment = (data: any) => {
        setPreviewData(data);
        addPaymentClose();
    }

    const addPaymentClose = () => {
        setAddPaymentOpen(!addPaymentOpen);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await pharmacyApiService.deletePharmacyBill(selectedId);
                toast.success('Pharmacy Bill Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const deletePharmacyBill = (id: any) => {
        setSelectedId(id.billId);
        setDeleteModal(true);
    }

    const filteredData = props?.data?.filter((data: any) => {
        const searchLower = searchQuery.toLowerCase();

        return (
            data?.billId?.toString().toLowerCase().includes(searchLower) ||
            data?.ipdOrOpdId?.toString().toLowerCase().includes(searchLower) ||
            data?.patientDetails?.firstName?.toLowerCase().includes(searchLower) ||
            moment(data.dateTime).format("DD-MM-YYYY").includes(searchLower)
        );
    });

    return (
        <React.Fragment>
            {/* <input
                type="text"
                className="form-control mb-2"
                placeholder="Search by Bill No, IPD/OPD ID, Patient Name, or Date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
            <div className="table-responsive">
                <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Bill No</th>
                            <th>IPD/OPD ID</th>
                            <th>Date</th>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Discount (%)</th>
                            <th>Net Amount (₹)</th>
                            <th>Paid Amount (₹)</th>
                            {/* <th>Refund Amount (₹)</th> */}
                            <th>Balance Amount (₹)</th>
                            <RoleBasedComponent allowedRoles={["SUPERADMIN","PHARMACIST"]}>
                                <th>Action</th>
                            </RoleBasedComponent>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData && filteredData?.length > 0 ? (
                            filteredData.map((data: any, idx: any) => (
                                <tr key={idx}>
                                    <td className="text-primary">{data.billId} </td>
                                    <td>{data.ipdOrOpdId || 'NA'}</td>
                                    <td className="text-nowrap">{moment(data.dateTime).format('DD-MM-YYYY  h:ss A')}</td>
                                    <td>{data.patientDetails?.firstName} ({data.patientId})</td>
                                    <td className="text-primary text-nowrap">{data.doctorName} </td>
                                    <td>{data.discount}</td>
                                    <td>{data.netAmount}</td>
                                    <td className="text-primary">{data.paymentAmount} </td>
                                    {/* <td>{data.refundAmount}</td> */}
                                    <td className="text-danger">{data.balanceAmount}</td>
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","PHARMACIST"]}>
                                        <td>
                                            <span>
                                                <li className="list-inline-item" title="View">
                                                    <Link
                                                        className="view-item-btn" onClick={() => preview(data)}
                                                        to="#"
                                                    >
                                                        <i className="ri-eye-fill align-bottom text-pink"></i>
                                                    </Link>
                                                </li>
                                                <li className="list-inline-item">
                                                    <Link
                                                        className="add-item-btn" data-bs-toggle="modal" onClick={() => addPayment(data)}
                                                        to="#"

                                                        title="Add Payment"
                                                    >
                                                        <RiAddCircleFill size={12} color="text-primary" />
                                                    </Link>
                                                </li>
                                            </span>
                                        </td>
                                    </RoleBasedComponent>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center text-muted">
                                    No Record Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Modal isOpen={previewOpen} toggle={previewClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={previewClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Payments Details

                </ModalHeader>
                <ModalBody >
                    <PreviewPharmacyBillDetails data={previewData} handleClose={previewClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Edit Bill Details
                </ModalHeader>
                <ModalBody>
                    <EditPharmacyBill data={previewData} handleClose={handleEditClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={addPaymentOpen} toggle={addPaymentClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={addPaymentClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Pharmacy Bill
                    <span>
                        <PrintComponent contentId="bill" />
                        {/* <FontAwesomeIcon icon={faPenToSquare} className="me-1 text-primary pointer" onClick={() => edit()} /> */}
                        <FontAwesomeIcon icon={faTrashCan} className="mx-1 text-danger pointer" onClick={() => deletePharmacyBill(previewData)} />
                    </span>
                </ModalHeader>
                <ModalBody id="bill">
                    <PharmacyInvoice data={previewData} handleClose={addPaymentClose} />
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

export default PharmacyDataTable