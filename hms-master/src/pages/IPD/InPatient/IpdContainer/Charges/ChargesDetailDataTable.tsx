import { Col, Container, Label, Modal, Row, Table } from "reactstrap";
import EditCharges from "./EditCharges";
import { useEffect, useState } from "react";
import PrintTable from "../../../../../Components/Common/PrintTable";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import { toast } from "react-toastify";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import moment from "moment";
import { Link } from "react-router-dom";

const ChargesDetailDataTable = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState(props.data);
    const chargesData = data?.opdCharges || data?.ipdCharges || [];
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [id, setId] = useState<any>(null);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const handleEdit = (id: any) => {
        setId(id);
        handleClose();
    }
    const handleClose = () => {
        setOpenAddModal(!openAddModal);
    }

    const handlePrintClick = (item: any) => {
        setSelectedItem(item);
    };

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                if (props.title === "ipd") {
                    await iPDApiService.deleteCharges(selectedId);
                } else {
                    await opdApiService.deleteCharges(selectedId);
                }
                toast.success('Charges Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteCharges = (id: any) => {
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
                <Table hover className="table-centered table-nowrap align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Date</th>
                            <th className="hide-print">Charge Name / Charge Note</th>
                            <th className="hide-print">Charge Type</th>
                            <th>Charge Category</th>
                            <th>Qty</th>
                            <th>Standard Charge</th>
                            <th>Applied Charge </th>
                            <th>TPA Charge</th>
                            <th>Discount</th>
                            <th>Tax</th>
                            <th>Amount (₹)</th>
                            <th className="hide-print">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chargesData.map((item: any, idx: any) => (
                            <tr key={idx}>
                                <td>{moment(item.date).format('DD/MM/YYYY hh:mm A')}</td>
                                <td className="text-primary">{item.combinedCharges?.chargeName} / {item.chargeNote}</td>
                                <td className="text-primary">{item.combinedCharges?.chargeType?.chargeType || 'NA'}</td>
                                <td>{item.combinedCharges?.chargeCategory?.name || 'NA'}</td>
                                <td>{item.qty}</td>
                                <td>{item.standardCharge || 0}</td>
                                <td>{item.appliedCharge || 0} </td>
                                <td>{item.tpaCharge || 0}</td>
                                <td>{item.discountAmount || 0} ({item.discountPercentage}%)</td>
                                <td>{item.taxAmount || 0}</td>
                                <td className="text-primary">{item.netAmount}</td>
                                <td className="hide-print">
                                    <span>
                                        {/* <Link to="#" title="Print" data-bs-toggle="modal"  onClick={() => handlePrintClick(item)}
                                            className="btn btn-sm btn-soft-secondary remove-list mx-1">
                                            <FontAwesomeIcon icon={faPrint} />
                                        </Link> */}
                                        <Link to="#" data-bs-toggle="modal" onClick={() => handleEdit(item.ipdChargeId || item.opdChargeId)}
                                            className="btn btn-sm btn-soft-info edit-list mx-1" title="Edit">
                                            <i className="ri-pencil-line"></i>
                                        </Link>
                                        <Link to="#" title="Delete" data-bs-toggle="modal" onClick={() => deleteCharges(item.ipdChargeId || item.opdChargeId)}
                                            className="btn btn-sm btn-soft-danger remove-list mx-1">
                                            <i className="ri-delete-bin-5-line"></i>
                                        </Link>
                                    </span>
                                </td>
                            </tr>
                        ))}
                        <tr className="table-light">
                            <td className="text-end pe-5" colSpan={12}>
                                <b>Total : ₹
                                    {chargesData.reduce((total: any, item: any) => total + item.netAmount, 0).toFixed(2)}</b>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </Col>
        {selectedItem && <PrintTable item={selectedItem} onClose={() => setSelectedItem(null)} />}

        <Modal isOpen={openAddModal} toggle={handleClose}
            backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
        >
            <EditCharges title={props.title} refresh={props.refresh}  data={props.data} id={id} handleClose={handleClose} />
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default ChargesDetailDataTable