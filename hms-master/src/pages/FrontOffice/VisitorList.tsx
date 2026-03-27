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
import FrontOfficeApiService from "../../helpers/services/front-office/front-office-api-service";
import DeleteModal from "../../Components/Common/DeleteModal";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const VisitorList = () => {
    const frontOfficeApiService: FrontOfficeApiService = new FrontOfficeApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    const [visitorsData, setVisitorsData] = useState([]);
    const [isExportCSV, setIsExportCSV] = useState(false);
    let navigate: any = useNavigate();

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const visitorsColumns = [
        {
            header: 'Purpose',
            accessorKey: 'purpose', enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className=" text-primary">
                        {info.getValue()}
                    </span>
                </div>
            ),
        },
        {
            header: 'Name',
            accessorKey: 'name', enableColumnFilter: false,
        },
        {
            header: 'Contact',
            accessorKey: 'contact', enableColumnFilter: false,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
        },
        {
            header: 'Visit To',
            accessorKey: 'visit_to', enableColumnFilter: false,
        },
        {
            header: 'IPD/OPD/Staff', enableColumnFilter: false,
            accessorKey: 'ipd_opd_staff',
        },
        {
            header: 'Id Card',
            accessorKey: 'id_card', enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    <span className=" text-primary">
                        {info.getValue()}
                    </span>
                </div>
            ),
        },

        {
            header: 'In Time',
            accessorKey: 'in_time', enableColumnFilter: false,
        },
        {
            header: 'Out Time',
            accessorKey: 'out_time', enableColumnFilter: false,
        },

        {
            header: 'Number Of Person',
            accessorKey: 'no_of_people',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Note',
            accessorKey: 'note',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
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
                                editPhoneCall(cell.row.original);
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
                                deletePhoneCall(cell.row.original.id);
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

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await frontOfficeApiService.deleteVisitors(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllVisitors();
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

    const deletePhoneCall = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editPhoneCall = (id: any) => {
        navigate('/main/editVisitor', { state: { data: id } })
    }

    const getAllVisitors = async () => {
        try {
            let result = await frontOfficeApiService.getAllVisitors();
            console.log("getAllVisitors", result);
            setVisitorsData(result);
        } catch (error: any) {
            console.log("getAllVisitors Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllVisitors();
    }, []);

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={visitorsData}
                />

                <Container fluid>
                    <FormHeader title="Visitors List"
                        pageTitle="Front Office"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Visitors List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="visitorsList">

                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Visitors List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                                <Link to="/main/addVisitor">
                                                    <Button color="primary" className="btn btn-primary add-btn ms-2">
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add Visitor
                                                    </Button>
                                                </Link>
                                                <Link to="/main/phoneCallLogs">
                                                    <Button color="primary" className="btn btn-primary add-btn ms-2">
                                                        <i className=" ri-list-check me-1 align-bottom"></i> Phone Call Log
                                                    </Button>
                                                </Link>
                                                <Link to="/main/complaintList">
                                                    <Button color="primary" className="btn btn-primary add-btn ms-2">
                                                        <i className=" ri-list-check me-1 align-bottom"></i>Complain
                                                    </Button>
                                                </Link>
                                                <Link to="/main/ambulance" className="text-end">
                                                    <Button
                                                        color="primary"
                                                        className="btn btn-primary add-btn ms-3"
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
                                            columns={visitorsColumns}
                                            data={visitorsData}
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

export default VisitorList;
