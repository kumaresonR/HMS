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
import FinanceApiService from "../../helpers/services/finance/finance-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import moment from "moment";
import { toast } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const Expense = () => {
    const financeApiService: FinanceApiService = new FinanceApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [expenseData, setExpenseData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

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
            setExpenseData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllExpenses();
    }, []);

    const expenseColumns = [
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,

        },
        {
            header: 'Invoice Number',
            accessorKey: 'invoiceNumber',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className="text-primary">
                        {info.getValue()
                            ? moment(info.getValue()).format('DD/MM/YYYY')
                            : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Description',
            accessorKey: 'description',
            enableColumnFilter: false,

        },
        {
            header: 'Expense Head',
            accessorKey: 'expenseHead',
            enableColumnFilter: false,

        },
        {
            header: 'Amount (₹)',
            accessorKey: 'amount',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
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
                    {/* <li className="list-inline-item" title="View">
                        <Link
                            className="view-item-btn"
                            to="#"
                        >
                            <i className="ri-eye-fill align-bottom text-pink"></i>
                        </Link>
                    </li> */}
                </ul>
            ),
        },
    ];


    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={expenseData}
                />

                <Container fluid>
                    <FormHeader
                        title="Expense List"
                        pageTitle="Finance"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Expense List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="Expense">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Expense List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <Button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    color="primary"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </Button>
                                                <Link to='/main/addExpense'>
                                                    <Button

                                                        color="primary"
                                                        className="btn btn-primary add-btn ms-3"

                                                    >
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add Expense
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={expenseColumns}
                                            data={expenseData}
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

export default Expense;
