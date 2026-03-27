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
import { toast } from "react-toastify";
import FrontOfficeApiService from "../../helpers/services/front-office/front-office-api-service";
import DeleteModal from "../../Components/Common/DeleteModal";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const PhoneCallLogList = () => {
    const frontOfficeApiService: FrontOfficeApiService = new FrontOfficeApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    const [phoneCallLogData, setPhoneCallLogData] = useState([]);
    const [isExportCSV, setIsExportCSV] = useState(false);
    let navigate: any = useNavigate();

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const phoneCallLogColumns = [
        {
            header: 'Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Phone',
            accessorKey: 'contact',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Next Follow Up Date',
            accessorKey: 'follow_up_date',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Description',
            accessorKey: 'description',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Call Type',
            accessorKey: 'call_type',
            enableColumnFilter: false,
            cell: (info: any) => <span>{info.getValue() || 'N/A'}</span>,
        },
        {
            header: 'Call Duration',
            accessorKey: 'call_duration',
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
                </ul>
            ),
        },
    ];

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await frontOfficeApiService.deletePhoneCall(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllPhoneCall();
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
        navigate('/main/editCallLog', { state: { data: id } })
    }

    const getAllPhoneCall = async () => {
        try {
            let result = await frontOfficeApiService.getAllPhoneCall();
            console.log("getAllPhoneCall", result);
            setPhoneCallLogData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllPhoneCall();
    }, []);

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={phoneCallLogData}
                />

                <Container fluid>
                    <FormHeader
                        title="Phone Call Log List"
                        pageTitle="Front Office"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Phone Call Log List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Phone Call Log List</h5>
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
                                                <Link to="/main/addCallLog">
                                                    <Button color="primary" className="btn btn-primary add-btn ms-2">
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add Call Logs
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
                                            columns={phoneCallLogColumns}
                                            data={phoneCallLogData}
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

export default PhoneCallLogList;
