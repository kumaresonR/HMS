import moment from "moment";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import ErrorHandler from "../../helpers/ErrorHandler";
import TpaApiService from "../../helpers/services/tpa/tpa-api-service";
import PreviewTpa from "./PreviewTpa";
import TableContainer from "../../Components/Common/TableContainer";

const ViewTpaForOpdPatient = () => {
    const tpaApiService: TpaApiService = new TpaApiService();

    const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);

    const [tpaData, setTpaData] = useState([]);
    const [selectedData, setSelectedData] = useState<any>();

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const tpaColumns = [
        {
            header: 'Patient Name',
            enableColumnFilter: false,
            accessorFn: (row: any) => {
                if (!row.patientDetails) return 'N/A';
                return `${row?.patientDetails?.firstName || ''} ${row?.patientDetails?.lastName || ''} (${row?.patientDetails?.patientId || ''})`;
            },
            cell: (info: any) => {
                const patient = info.row.original.patientDetails;
                return (
                    <div className="text-primary">
                        {patient?.firstName && patient?.lastName
                            ? `${patient.firstName} ${patient.lastName} (${patient.patientId})`
                            : 'N/A'}
                    </div>
                );
            },
        },
        {
            header: 'Admission Date',
            enableColumnFilter: false,
            accessorFn: (row: any) => row.admissionDate || '',
            cell: (info: any) => (
                <div>
                    {info.getValue()
                        ? moment(info.getValue()).format('DD/MM/YYYY, h:mm A')
                        : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Tpa Name',
            enableColumnFilter: false,
            accessorFn: (row: any) => {
                const tpaDetails = row?.patientDetails?.insuranceProviders;
                return tpaDetails?.providerName || 'N/A';
            },
            cell: (info: any) => {
                const tpaDetails = info.row.original.patientDetails?.insuranceProviders;
                return (
                    <div className="text-primary">
                        {tpaDetails?.providerName ? tpaDetails.providerName : 'N/A'}
                    </div>
                );
            },
        },
        {
            header: 'Action',
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                previewDetails(cell.row.original);
                            }}
                            to="#"
                            title="View"
                        >
                            <i className="ri-eye-fill align-bottom text-pink"></i>
                        </Link>
                    </li>
                </ul>
            ),
        },
    ];

    const previewDetails = (data: any) => {
        setSelectedData(data);
        handleColse();
    }

    const handleColse = () => {
        setOpenPreviewModal(!openPreviewModal);
    }

    const getAllTpa = async () => {
        try {
            let result = await tpaApiService.getAllTpaForOpd();
            setTpaData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllTpa();
    }, []);

    return (
        <div>
            <div className="text-end mb-3">
                <button type="button" className="btn btn-primary" onClick={() => setIsExportCSV(true)}>
                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                    Export
                </button>
            </div>
            <div>
                <TableContainer
                    columns={tpaColumns}
                    data={tpaData}
                    isGlobalFilter={true}
                    isCustomerFilter={true}
                    customPageSize={5}
                    tableClass="table table-bordered"
                    theadClass="thead-light"
                    divClass="table-responsive"
                />
            </div>

            <Modal isOpen={openPreviewModal} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    View Details
                </ModalHeader>
                <ModalBody>
                    <PreviewTpa data={selectedData} handleClose={handleColse} />
                </ModalBody>
            </Modal>
        </div>
    )
}

export default ViewTpaForOpdPatient