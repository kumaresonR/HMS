import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import EditVital from "./EditVital";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import { toast } from "react-toastify";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import DeleteModal from "../../../../../Components/Common/DeleteModal";
import moment from "moment";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";

const VitalDataTable = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [hoveredTd, setHoveredTd] = useState<{ rowIdx: number; col: string } | null>(null);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [vitalId, setVitalId] = useState('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const handleClose = () => {
        setOpenEditModal(!openEditModal);
    }

    const edit = (id: any, data: any) => {
        setVitalId(id)
        handleClose()
    }

    const processVitalsData = () => {
        const groupedData: any = {};

        (props?.data?.vitals || []).forEach((vital: any) => {
            const dateKey = new Date(vital.date).toLocaleDateString();

            if (!groupedData[dateKey]) {
                groupedData[dateKey] = { date: dateKey, vitals: [] };
            }

            groupedData[dateKey].vitals.push({
                vitalsId: vital.vitalsId,
                ipdId: vital.ipdId,
                vitalName: vital.vitalName,
                vitalValue: vital.vitalValue,
            });
        });

        return Object.values(groupedData);
    };

    const data = processVitalsData();

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                if (props.title === "ipd") {
                    await iPDApiService.deleteVital(selectedId);
                } else {
                    await opdApiService.deleteVital(selectedId);
                }
                toast.success('Vital Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                props.refresh();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteVital = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    return <>
        <Col>
            <div className="table-responsive">
                <Table hover className="table-centered align-middle  mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Date</th>
                            <th>Height (1 - 200 Centimeters)</th>
                            <th>Weight (0 - 150 Kilograms)</th>
                            <th>Pulse (70 - 100 Beats per)</th>
                            <th>Temperature (95.8 - 99.3 Fahrenheit )</th>
                            <th>BP (90/60 - 140/90 mmHg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data?.length > 0 ? (
                            data?.map((item: any, rowIdx: number) => (
                                <tr key={rowIdx}>
                                    <td> {moment(item.date).format('DD/MM/YYYY')}</td>
                                    {['Height (1 - 200 Centimeters)', 'Weight (0 - 150 Kilograms)', 'Pulse (70 - 100 Beats per)', 'Temperature (95.8 - 99.3 Fahrenheit )', 'BP (90/60 - 140/90 mmHg)'].map((col) => (
                                        <td
                                            key={col}
                                            onMouseEnter={() => setHoveredTd({ rowIdx, col })}
                                            onMouseLeave={() => setHoveredTd(null)}
                                        >
                                            {/* Find the relevant vital data for each column */}
                                            {item?.vitals?.map((vital: any, idx: any) =>
                                                vital.vitalName === col ? (
                                                    <>
                                                        {vital.vitalValue || '-'}
                                                        {hoveredTd?.rowIdx === rowIdx && hoveredTd.col === col && vital.vitalValue && (
                                                            <div key={idx}>
                                                                <FontAwesomeIcon
                                                                    icon={faPenToSquare}
                                                                    className="mx-1 text-primary"
                                                                    onClick={() => edit(vital.vitalsId, col)}
                                                                />
                                                                <FontAwesomeIcon icon={faTrashCan} className="mx-1 text-danger"
                                                                    onClick={() => deleteVital(vital.vitalsId)} />
                                                            </div>
                                                        )}
                                                        <br />
                                                    </>
                                                ) : null
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center text-muted">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Col>
        <Modal isOpen={openEditModal} toggle={handleClose}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle modal-title">
                Edit Vital
            </ModalHeader>

            <ModalBody>
                <EditVital title={props.title} id={vitalId} refresh={props.refresh} data={props.data} handleClose={handleClose} />
            </ModalBody>
        </Modal>

        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDelete}
            onCloseClick={() => setDeleteModal(false)}
        />
    </>
}
export default VitalDataTable