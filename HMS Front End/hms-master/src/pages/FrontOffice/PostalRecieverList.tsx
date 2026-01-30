import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormHeader from "../../common/FormHeader/FormHeader";
import { IoArrowBack } from "react-icons/io5";
import ErrorHandler from "../../helpers/ErrorHandler";
import PostalApiService from "../../helpers/services/front-office/front-office-api-service";
import DeleteModal from "../../Components/Common/DeleteModal";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const PostalReceiverList: React.FC = () => {
  const postalApiService = new PostalApiService();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [receiversData, setReceiversData] = useState<any[]>([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const columns = [
    { header: 'To Title', accessorKey: 'to_title', enableColumnFilter: false },
    { header: 'Reference No', accessorKey: 'reference_no', enableColumnFilter: false },
    { header: 'From Title', accessorKey: 'from_title', enableColumnFilter: false },
    { header: 'Date', accessorKey: 'date', enableColumnFilter: false },
    {
      header: 'Action', enableColumnFilter: false,
      cell: (cell: any) => (
        <ul className="list-inline hstack gap-2 mb-0">
          <li className="list-inline-item">
            <Link
              className="edit-item-btn"
              onClick={e => { e.preventDefault(); editReceiver(cell.row.original); }}
              to="#" title="Edit"
            >
              <i className="ri-pencil-fill align-bottom text-purple"></i>
            </Link>
          </li>
          <li className="list-inline-item" title="Delete">
            <Link
              className="remove-item-btn"
              onClick={e => { e.preventDefault(); deleteReceiver(cell.row.original.id); }}
              to="#"
            >
              <i className="ri-delete-bin-fill align-bottom text-danger"></i>
            </Link>
          </li>
        </ul>
      )
    }
  ];

  const getAllReceivers = async () => {
    // try {
    //   const result = await postalApiService.getAllReceivers();
    //   setReceiversData(result );
    // } catch (error: any) {
    //   ErrorHandler(error);
    // }
  };
  

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      // await postalApiService.deleteReceiver(selectedId);
      toast.success('Record Deleted Successfully', { containerId: 'TR' });
      await getAllReceivers();
      setDeleteModal(false);
    } catch (error: any) {
      ErrorHandler(error);
    }
  };

  const deleteReceiver = (id: string) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const editReceiver = (receiver: any) => {
    navigate('/main/editReceiver', { state: { data: receiver } });
  };

  useEffect(() => {
    getAllReceivers();
  }, []);

  return (
    <>
      <ExportCSVModal show={isExportCSV} onCloseClick={() => setIsExportCSV(false)} data={receiversData} />
      <Container fluid>
        <FormHeader
          title="Postal Receivers"
          pageTitle="Front Office"
          onMinimize={() => dispatch(minimizePage({ route: location.pathname, pageName: 'Postal Receivers' }))}
        />
        <Row>
          <Col lg={12}>
            <Card id="postalReceiverList">
              <CardHeader className="border-0">
                <Row className="g-4 align-items-center">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Postal Receivers</h5>
                  </div>
                  <div className="col-sm-auto">
                    <Button color="primary" onClick={() => setIsExportCSV(true)}>
                      <i className="ri-file-download-line align-bottom me-1"></i> Export
                    </Button>
                    <Link to="/main/addReceiver">
                      <Button color="primary" className="ms-2">
                        <i className="ri-add-fill me-1 align-bottom"></i> Add Receiver
                      </Button>
                    </Link>
                    <Button color="secondary" className="ms-2" onClick={() => navigate(-1)}>
                      <IoArrowBack /> Back
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <div className="card-body pt-0">
                <TableContainer
                  columns={columns}
                  data={receiversData}
                  isGlobalFilter={true}
                  customPageSize={10}
                  tableClass="table table-bordered"
                  theadClass="thead-light"
                  divClass="table-responsive"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      <DeleteModal show={deleteModal} onDeleteClick={handleDelete} onCloseClick={() => setDeleteModal(false)} />
    </>
  );
};

export default PostalReceiverList;
