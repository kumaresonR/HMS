import { faMoneyBill, faBars, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Col, Input, Modal, ModalBody, ModalHeader, Table } from 'reactstrap'
import RadiologyPayments from '../Radiology/RadiologyPayments'
import PreviewRadiologyBillDetails from '../Radiology/PreviewRadiologyBillDetails'
import EditRadiologyBill from '../Radiology/EditRadiologyBill'
import PrintComponent from '../../Components/Common/PrintComponent'
import moment from 'moment'
import { toast } from 'react-toastify'
import ErrorHandler from '../../helpers/ErrorHandler'
import BillingApiService from '../../helpers/services/billing/billing-api-service'
import DeleteModal from '../../Components/Common/DeleteModal'
import EditPathologyBill from './EditPathologyBill'
import { RiAddCircleFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent'

const PathologyCommonTable = (props: any) => {
    const billingApiService: BillingApiService = new BillingApiService();

    const [editModel, setEditModel] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [searchText, setSearchText] = useState("");

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const preview = (data: any) => {
        setPreviewData(data);
        previewClose();
    }

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
        if (props.refresh) {
            props.refresh();
        }
    }

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
        if (props.refresh) {
            props.refresh();
        }
    }

    const addPayment = (data: any) => {
        setPreviewData(data);
        addPaymentClose();
    }

    const addPaymentClose = () => {
        setAddPaymentOpen(!addPaymentOpen);
        if (props.refresh) {
            props.refresh();
        }
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                if (props.title === "radiology") {
                    await billingApiService.deleteRadiologyBill(selectedId);
                    toast.success('Radiology Bill Deleted Successfully', { containerId: 'TR' });
                } else {
                    await billingApiService.deletePathologyBill(selectedId);
                    toast.success('Pathology Bill Deleted Successfully', { containerId: 'TR' });
                }
                setDeleteModal(false);
                previewClose();
                if (props.refresh) {
                    props.refresh();
                }
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteBill = (id: any) => {
        setSelectedId(id.billId);
        setDeleteModal(true);
    }

    const filteredData = props?.data?.filter((data: any) => {
        const billIdMatch = data?.billId?.toString().toLowerCase().includes(searchText.toLowerCase());
        const patientNameMatch = data?.patientDetails?.firstName?.toLowerCase().includes(searchText.toLowerCase());
        return billIdMatch || patientNameMatch;
    });

    return (
        <React.Fragment>
            {/* <input
                type="text"
                placeholder="Search by Bill No or Patient Name..."
                className="form-control mb-2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            /> */}
            <div className="table-responsive">
                <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Bill No</th>
                            {/* <th>OPD/IPD ID</th> */}
                            <th>Reporting Date</th>
                            <th>Patient Name</th>
                            <th>Reference Doctor </th>
                            <th>Previous Report Value</th>
                            <th>Discount(%)</th>
                            <th>Amount(₹)</th>
                            <th>Paid Amount(₹)</th>
                            <th>Balance Amount(₹)</th>
                            {props.title !== "Billing" && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.length > 0 ? (
                            filteredData?.map((data: any, idx: any) => (
                                <tr key={idx}>
                                    <td className='text-primary'>{data.billId} </td>
                                    {/* <td className='text-primary'>{data.caseId}</td> */}
                                    <td>{moment(data.dateTime).format("DD/MM/YYYY hh:mm A")}</td>
                                    <td className='text-primary'>{data?.patientDetails?.firstName} ({data.patientId}) </td>
                                    <td className='text-primary no-wrap'>{data.doctorName} </td>
                                    <td className='text-primary'>{data.previousReportValue || 'NA'}</td>
                                    <td>{data.discount}</td>
                                    <td>{data.netAmount}</td>
                                    <td>{data.paymentAmount}</td>
                                    <td className='text-danger'>{data.balanceAmount}</td>
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","RADIOLOGIST", "PATHOLOGIST"]}>
                                        {props.title !== "Billing" && (
                                            <td>
                                                <span>

                                                    <ul className="list-inline hstack gap-2 mb-0">

                                                        <li className="list-inline-item">
                                                            <Link
                                                                className="add-item-btn" data-bs-toggle="modal" onClick={() => addPayment(data)}
                                                                to="#"

                                                                title="Add/View payments">
                                                                <RiAddCircleFill size={12} color="text-primary" />
                                                            </Link>
                                                        </li>

                                                        <li className="list-inline-item" title="View">
                                                            <Link
                                                                className="view-item-btn"
                                                                to="#" data-bs-toggle="modal" onClick={() => preview(data)}
                                                            >
                                                                <i className="ri-eye-fill align-bottom text-pink"></i>
                                                            </Link>
                                                        </li>

                                                    </ul>
                                                    {/* <Button data-bs-toggle="modal" onClick={() => addPayment(data)}
                                                className="btn btn-sm btn-soft-warning edit-list mx-1" title="Add/View payments">
                                                <FontAwesomeIcon icon={faMoneyBill} />
                                            </Button>
                                            <Button data-bs-toggle="modal" onClick={() => preview(data)}
                                                className="btn btn-sm btn-soft-warning edit-list mx-1" title="View">
                                                <FontAwesomeIcon icon={faBars} />
                                            </Button> */}
                                                </span>
                                            </td>
                                        )}
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
                    Bill Details
                    <div className='d-flex align-items-center'>
                        <PrintComponent contentId="prescriptionContent" />
                        {/* <FontAwesomeIcon icon={faPenToSquare} className="mx-1 text-primary pointer" onClick={() => edit()} /> */}
                        <FontAwesomeIcon icon={faTrashCan} className="mx-1 text-danger pointer" onClick={() => deleteBill(previewData)} />
                    </div>
                </ModalHeader>
                <ModalBody id="prescriptionContent">
                    <PreviewRadiologyBillDetails title={props.title} data={previewData} handleClose={previewClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Edit Bill Details
                </ModalHeader>
                <ModalBody>
                    {props.title === 'radiology' ? (
                        <EditRadiologyBill
                            data={previewData}
                            handleClose={handleEditClose}
                        />
                    ) : (
                        <EditPathologyBill
                            data={previewData}
                            handleClose={handleEditClose}
                        />
                    )}
                </ModalBody>
            </Modal>

            <Modal isOpen={addPaymentOpen} toggle={addPaymentClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={addPaymentClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Payments
                </ModalHeader>
                <ModalBody>
                    <RadiologyPayments title={props.title} data={previewData} handleClose={addPaymentClose} />
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

export default PathologyCommonTable