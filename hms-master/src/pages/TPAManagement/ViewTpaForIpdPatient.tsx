import TableContainer from "../../Components/Common/TableContainer"
import { useEffect, useState } from "react";
import ErrorHandler from "../../helpers/ErrorHandler";
import TpaApiService from "../../helpers/services/tpa/tpa-api-service";
import moment from "moment";
import { Link } from "react-router-dom";
import PreviewTpa from "./PreviewTpa";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const ViewTpaForIpdPatient = () => {
  const tpaApiService: TpaApiService = new TpaApiService();

  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);

  const [tpaData, setTpaData] = useState([]);
  const [selectedData, setSelectedData] = useState<any>();

  const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

  const tpaColumns = [
    {
        header: 'Patient Name',
        enableColumnFilter: false,
        accessorFn: (row:any) => {
            const patient = row.patientDetails;
            return patient?.firstName && patient?.lastName
                ? `${patient.firstName} ${patient.lastName} (${patient.patientId})`
                : 'N/A';
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
        accessorFn: (row:any) => row.admissionDate || '',
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
        accessorFn: (row:any) => {
            const tpaDetails = row.tpaDetails;
            return tpaDetails?.tpaName ? tpaDetails.tpaName : 'N/A';
        },
        cell: (info: any) => {
            const tpaDetails = info.row.original.tpaDetails;
            return (
                <div className="text-primary">
                    {tpaDetails?.tpaName ? `${tpaDetails.tpaName}` : 'N/A'}
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
                        title="Edit"
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
      let result = await tpaApiService.getAllTpaForIpd();
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

export default ViewTpaForIpdPatient