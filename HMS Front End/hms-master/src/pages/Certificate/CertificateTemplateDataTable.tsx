import React, { useEffect, useState } from 'react'
import TableContainer from '../../Components/Common/TableContainer';
import ErrorHandler from '../../helpers/ErrorHandler';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Modal, ModalHeader, ModalBody, CardHeader, Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import CertificateApiService from '../../helpers/services/certificate/certificate-api-service';
import FormHeader from '../../common/FormHeader/FormHeader';
import ViewCertificateTemplate from './ViewCertificateTemplate';
import { toast } from 'react-toastify';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import DeleteModal from '../../Components/Common/DeleteModal';
import { IoArrowBack } from 'react-icons/io5';

const CertificateTemplateDataTable = () => {
  const certificateApiService: CertificateApiService = new CertificateApiService();
  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);

  const [tpaData, setTpaData] = useState([]);
  const [selectedData, setSelectedData] = useState<any>();

  const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

  //delete 
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState('');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const tpaColumns = [
    {
      header: 'Certificate Template Name',
      enableColumnFilter: false,
      accessorKey: 'CertificateTemplateName'
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
          <li className="list-inline-item">
            <Link
              className="edit-item-btn"
              onClick={(e) => {
                e.preventDefault();
                editTemplate(cell.row.original.CertificateTemplateId);
              }}
              to="#"
              title="Edit"
            >
              <i className="ri-pencil-fill align-bottom text-purple"></i>
            </Link>
          </li>
          <li className="list-inline-item" title="Delete">
            <Link
              className="remove-item-btn"
              data-bs-toggle="modal"
              onClick={(e) => {
                e.preventDefault();
                deleteTemplate(cell.row.original.CertificateTemplateId);
              }}
              to="#"
            >
              <i className="ri-delete-bin-fill align-bottom text-danger"></i>
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

  const editTemplate = (id: any) => {
    navigate('/main/editCertificateTemplate', { state: { id: id } })
  }

  const addCertificate = () => {
    navigate('/main/createCertificateTemplate')
  }

  const getAllCertificateTemplate = async () => {
    try {
      let result = await certificateApiService.getAllCertificateTemplate();
      setTpaData(result.ResponseBody);
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  const deleteTemplate = (id: any) => {
    setSelectedId(id);
    setDeleteModal(true);
  }

  // Delete Data
  const handleDelete = async () => {
    if (selectedId) {
      try {
        await certificateApiService.deleteCertificateTemplate(selectedId);
        toast.success('Record Deleted Successfully', { containerId: 'TR' });
        await getAllCertificateTemplate();
        setDeleteModal(false);
        previewClose();
        return;
      } catch (error: any) {
        return ErrorHandler(error)
      }
    }
  };

  const previewClose = () => {
    setPreviewOpen(!previewOpen);
  }

  useEffect(() => {
    getAllCertificateTemplate();
  }, []);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Certificate Template List"
            pageTitle="Certificate"
            onMinimize={() => dispatch(minimizePage({
              route: location.pathname,
              pageName: "Certificate Template List",
            }))} />
          <Row className="d-flex justify-content-center">
            <Col xl={12} className="p-0">
              <Card>
                <CardHeader className=" d-flex justify-content-between align-items-center">
                  <h4 className="card-title mb-0">Certificate Template List</h4>
                  <div className='text-end'>
                    <Button
                      color="primary"
                      onClick={() => navigate('/main/certificate')}
                      className="btn btn-primary add-btn mx-2"
                    >
                      <IoArrowBack /> Back
                    </Button>
                    <Button onClick={addCertificate}>  Certificate Template </Button>

                  </div>
                </CardHeader>
                <CardBody>
                  <Row>
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
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={openPreviewModal} toggle={handleColse}
        backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
      >
        <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
          View Details
        </ModalHeader>
        <ModalBody>
          <ViewCertificateTemplate data={selectedData} handleClose={handleColse} />
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

export default CertificateTemplateDataTable