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
import FrontOfficeApiService from "../../helpers/services/front-office/front-office-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const ComplainList = () => {
    const frontOfficeApiService: FrontOfficeApiService = new FrontOfficeApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    const [complainData, setComplainData] = useState([]);
    const [isExportCSV, setIsExportCSV] = useState(false);
    let navigate: any = useNavigate();

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const complainColumns = [
        {
            header: 'Complain',
            accessorKey: 'complaint', enableColumnFilter: false,
        },
        {
            header: 'Source',
            accessorKey: 'source', enableColumnFilter: false,
        },
        {
            header: 'Name',
            accessorKey: 'name', enableColumnFilter: false,
        },
        {
            header: 'Phone',
            accessorKey: 'contact', enableColumnFilter: false,
        },
        {
            header: 'Date',
            accessorKey: 'date', enableColumnFilter: false,
        },
        {
            header: 'Description',
            accessorKey: 'description', enableColumnFilter: false,
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
                                editComplain(cell.row.original);
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
                                deleteComplain(cell.row.original.id);
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

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await frontOfficeApiService.deleteComplain(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllComplain();
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

    const deleteComplain = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editComplain = (id: any) => {
        navigate('/main/editComplain', { state: { data: id } })
    }

    const getAllComplain = async () => {
        try {
            let result = await frontOfficeApiService.getAllComplain();
            console.log("getAllComplain", result);
            setComplainData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllComplain();
    }, []);

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={complainData}
                />

                <Container fluid>
                    <FormHeader
                        title="Complain List"
                        pageTitle="Front Office"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Complain List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="complainList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Complain List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                                <Link to="/main/addComplain">
                                                    <Button color="primary" className="btn btn-primary add-btn ms-2">
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add Complain
                                                    </Button>
                                                </Link>
                                                <Link to="/main/visitorList" className="text-end">
                                                    <Button
                                                        color="primary"
                                                        className="btn btn-primary add-btn ms-2"
                                                    >
                                                        <IoArrowBack /> Back
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={complainColumns}
                                            data={complainData}
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

export default ComplainList;
