import { useEffect, useState } from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import PreviewAntenatal from "./PreviewAntenatal";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBucket, faPenFancy, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import EditAntenatal from "./EditAntenatal";
import PrintComponent from "../../../../../Components/Common/PrintComponent";
import moment from "moment";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import { toast } from "react-toastify";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import DeleteModal from "../../../../../Components/Common/DeleteModal";

const AntenatalDataTable = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();

    const [data, setData] = useState(props.data);
    const [openAnteenatalModal, setOpenAnteenatalModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>({});

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    function handleClose() {
        setOpenAnteenatalModal(!openAnteenatalModal);
    }

    const preview = (item: any) => {
        setSelectedItem(item);
        handleClose()
    }

    const edit = (item: any) => {
        setSelectedItem(item);
        handleEditClose();
    }

    const handleEditClose = () => {
        setOpenEditModal(!openEditModal);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await iPDApiService.deleteAntenatal(selectedId);
                toast.success('Antenatal Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                handleClose();
                props.refresh()
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteAntenatal = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle  mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>OPD/IPD No</th>
                            <th>Date</th>
                            <th>Next Visit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.antenatalFindings?.map((item: any, idx: any) => (
                            <tr key={idx}>
                                <td className="text-primary"> {item.ipdId}</td>
                                <td className="text-nowrap">{moment(item.date).format('DD/MM/YYYY hh:mm A')}</td>
                                <td className="text-nowrap">{moment(item.nextVisit).format('DD/MM/YYYY hh:mm A')}</td>
                                <td>
                                    <Button onClick={() => preview(item)}
                                        title="Preview" color="primary"
                                        className="btn btn-sm btn-soft-info edit-list">
                                        <FontAwesomeIcon icon={faBars} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Col>

        <Modal isOpen={openAnteenatalModal} toggle={handleClose}
            backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
        >
            <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle model-header-container modal-title">
                <h5 className="modal-title" >Antenatal Finding</h5>
                <PrintComponent contentId="prescriptionContent" />
            </ModalHeader>
            <ModalBody>
                <Col className="text-end">
                    {/* <FontAwesomeIcon icon={faFilePdf} size="xl" className="mx-1" /> */}
                    <FontAwesomeIcon icon={faPenToSquare} size="xl" className="mx-1 text-primary" onClick={() => edit(selectedItem)} />
                    <FontAwesomeIcon icon={faTrashCan} size="xl" className="mx-1 text-danger" onClick={() => deleteAntenatal(selectedItem.antenatalId)} />
                </Col>
                <div id="prescriptionContent">
                    <PreviewAntenatal patientData={data} data={selectedItem} handleClose={handleClose} />
                </div>
            </ModalBody>
        </Modal>

        <Modal isOpen={openEditModal} toggle={handleEditClose}
            backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
        >
            <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                Edit Antenatal Finding
            </ModalHeader>

            <ModalBody>
                <EditAntenatal refresh={props.refresh} ipdId={data.admissions?.ipdId} data={selectedItem} handleClose={handleEditClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default AntenatalDataTable