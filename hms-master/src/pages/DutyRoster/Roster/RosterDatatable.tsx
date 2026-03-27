import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, CardHeader, Button } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import DeleteModal from '../../../Components/Common/DeleteModal';
import ExportCSVModal from '../../../Components/Common/ExportCSVModal';
import ErrorHandler from '../../../helpers/ErrorHandler';
import FinanceApiService from '../../../helpers/services/finance/finance-api-service';
import { minimizePage } from '../../../slices/pageResizer/uiSlice';
import TableContainer from '../../../Components/Common/TableContainer';

const RosterDatatable = () => {
  const financeApiService: FinanceApiService = new FinanceApiService();

  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [rosterData, setRosterData] = useState([]);
  
  //delete 
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState('');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  // Delete Data
  const handleDelete = async () => {
    if (selectedId) {
      try {
        await financeApiService.deleteExpenses(selectedId);
        toast.success('Record Deleted Successfully', { containerId: 'TR' });
        await getAllExpenses();
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

  const deleteExpence = (id: any) => {
    setSelectedId(id);
    setDeleteModal(true);
  }

  const editExpence = (id: any) => {
    navigate('/main/editExpence', { state: { id: id } })
  }

  const getAllExpenses = async () => {
    try {
      let result = await financeApiService.getAllExpenses();
      console.log("getAllExpenses", result);
      setRosterData(result);
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    getAllExpenses();
  }, []);

  const rosterColumns = [
    {
      header: 'Shift Name',
      accessorKey: 'name',
      enableColumnFilter: false,

    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
      enableColumnFilter: false,
      cell: (info: any) => (
        <div>
          {info.getValue()}
        </div>
      ),
    },
    {
      header: 'End Date',
      accessorKey: 'endDate',
      enableColumnFilter: false,
      cell: (info: any) => (
        <div>
          {info.getValue()}
        </div>
      ),
    },
    {
      header: 'Shift Start',
      accessorKey: 'shiftHour',
      enableColumnFilter: false,

    },
    {
      header: 'Shift End',
      accessorKey: 'shiftHour',
      enableColumnFilter: false,

    },
    {
      header: 'Shift Hour',
      accessorKey: 'shiftHour',
      enableColumnFilter: false,

    },
    {
      header: 'Roster Days',
      accessorKey: 'shiftHour',
      enableColumnFilter: false,

    },
    {
      header: 'Action',
      enableColumnFilter: false,
      cell: (cell: any) => (
        <ul className="list-inline hstack gap-2 mb-0">
          <li className="list-inline-item">
            <Link
              className="edit-item-btn"
              onClick={(e) => {
                e.preventDefault();
                editExpence(cell.row.original.expenseId);
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
                deleteExpence(cell.row.original.expenseId);
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


  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader
            title="Roster List"
            pageTitle="Roster List"
            onMinimize={() => dispatch(minimizePage({
              route: location.pathname,
              pageName: "Roster List",
            }))} />
          <Row>
            <Col lg={12}>
              <Card id="RosterList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">Roster List</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        
                        <Link to='/main/addExpense'>
                          <Button
                            color="primary"
                            className="btn btn-primary add-btn ms-3"
                          >
                            <i className="ri-add-fill me-1 align-bottom"></i> Add Roster
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Row>
                </CardHeader>

                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={rosterColumns}
                      data={rosterData}
                      isGlobalFilter={true}
                      isCustomerFilter={true}
                      customPageSize={5}
                      tableClass="table table-bordered"
                      theadClass="thead-light"
                      divClass="table-responsive"
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
    </React.Fragment>
  );
};

export default RosterDatatable