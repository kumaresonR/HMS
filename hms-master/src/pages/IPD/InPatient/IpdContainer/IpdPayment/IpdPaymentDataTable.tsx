import { useEffect, useState } from "react";
import { Col, Container, Label, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap"
import EditIpdPayment from "./EditIpdPayment";
import PrintTable from "../../../../../Components/Common/PrintTable";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import moment from "moment";
import { Link } from "react-router-dom";

const IpdPaymentDataTable = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState(props.data);
    const paymentData = data?.ipdPayments || data?.opdPayments || [];
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [editId, setEditId] = useState('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    function handleClose() {
        setOpenAddModal(!openAddModal);
    }

    const handleEdit = (id: any) => {
        setEditId(id);
        handleClose()
    }

    const handlePrintClick = (item: any) => {
        setSelectedItem(item);
    };

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                if (props.title === "ipd") {
                    await iPDApiService.deletePayment(selectedId);
                } else {
                    await opdApiService.deletePayment(selectedId);
                }
                toast.success('Payment Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deletePayment = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Col>
            <div className="d-none d-print-block">
                <Container fluid>
                    <Row>
                        <Col className="d-grid">
                            <Label>{props.title === "ipd" ? `IPD ID: ${data.admissions?.ipdId}` : `OPD ID: ${data.admissions?.opdId}`}</Label>
                            <Label>Name: {data.patient?.firstName} {data.patient?.lastName} ({data.patient?.patientId})</Label>
                            <Label>Blood Group: {data.patient?.bloodType || 'NA'}</Label>
                        </Col>
                        <Col className="d-grid">
                            <Label>Date: {moment(data.appointmentDate).format('DD/MM/YYYY hh:mm A')}</Label>
                            <Label>Consultant Doctor: {data?.admissions?.doctor?.firstName} {data?.admissions?.doctor?.lastName} ({data?.admissions?.doctor?.staffId})</Label>
                            <Label>Age: {data.patient?.age}</Label>
                        </Col>
                    </Row>
                </Container>
                <hr />
            </div>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle  mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Transaction ID	</th>
                            <th>Date</th>
                            <th>Note</th>
                            <th>Payment Mode</th>
                            <th>Paid Amount (₹)</th>
                            <th className="hide-print">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentData?.map((item: any, idx: any) => (
                            <tr key={idx}>
                                <td>
                                    {item.transactionId}
                                </td>
                                <td>{moment(item.date).format('DD/MM/YYYY')}</td>
                                <td>{item.note}</td>
                                <td>{item.paymentMode}</td>
                                <td className="text-primary">{item.amount}</td>
                                <td className="hide-print">
                                    <span>
                                        <ul className="list-inline hstack gap-2 mb-0">
                                            <li className="list-inline-item">
                                                <Link
                                                    className="edit-item-btn" data-bs-toggle="modal" onClick={() => handleEdit(item.ipdPaymentId || item.opdChargeId)}
                                                    to="#"

                                                    title="Edit"
                                                >
                                                    <i className="ri-pencil-fill align-bottom text-purple"></i>
                                                </Link>
                                            </li>

                                            <li className="list-inline-item" title="Delete">
                                                <Link
                                                    className="remove-item-btn" title="Delete" data-bs-toggle="modal" onClick={() => deletePayment(item.ipdPaymentId || item.opdChargeId)}

                                                    to="#"
                                                >
                                                    <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                                                </Link>
                                            </li>
                                            {/* <li className="list-inline-item" title="View">
                                                <Link
                                                    className="view-item-btn" 
                                                    to="#" data-bs-toggle="modal" onClick={() => handlePrintClick(item)}  title="Print">
                                              
                                                    <FontAwesomeIcon icon={faPrint} />
                                                </Link>
                                            </li> */}
                                        </ul>

                                        {/* <Button data-bs-toggle="modal" onClick={() => handlePrintClick(item)}
                                            className="btn btn-sm btn-soft-dark edit-list mx-1" title="Print">
                                            <FontAwesomeIcon icon={faPrint} />
                                        </Button>
                                        <Button data-bs-toggle="modal" onClick={() => handleEdit(item.ipdPaymentId || item.opdChargeId)}
                                            className="btn btn-sm btn-soft-info edit-list mx-1" title="Edit">
                                            <i className="ri-pencil-line"></i>
                                        </Button>
                                        <Button title="Delete" data-bs-toggle="modal" onClick={() => deletePayment(item.ipdPaymentId || item.opdChargeId)}
                                            className="btn btn-sm btn-soft-danger remove-list mx-1">
                                            <i className="ri-delete-bin-5-line"></i>
                                        </Button> */}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        <tr className="table-light">
                            <td colSpan={4}></td>
                            <td colSpan={2}><b>Total : ₹
                                {paymentData.reduce((total: any, item: any) => total + item.amount, 0).toFixed(2)}</b></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Col>

        {selectedItem && <PrintTable item={selectedItem} onClose={() => setSelectedItem(null)} />}

        <Modal isOpen={openAddModal} toggle={handleClose}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                Edit Payment
            </ModalHeader>

            <ModalBody>
                <EditIpdPayment title={props.title} refresh={props.refresh} data={data} id={editId} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default IpdPaymentDataTable