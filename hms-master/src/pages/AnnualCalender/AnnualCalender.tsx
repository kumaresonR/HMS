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
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import AnualCalenderApiService from "../../helpers/services/annualCalendar/annual-calendar-api-service";
import DeleteModal from "../../Components/Common/DeleteModal";
import moment from "moment";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const AnnualCalendar = () => {
    const anualCalenderApiService: AnualCalenderApiService = new AnualCalenderApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    
    let navigate: any = useNavigate();

    const [anualCalenderData, setAnualCalenderData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await anualCalenderApiService.deleteAnualCalender(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllAnualCalender();
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

    const deleteAnualCalender = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editAnualCalender = (id: any) => {
        navigate('/main/editAnualCalender', { state: { id: id } })
    }

    const getAllAnualCalender = async () => {
        try {
            let result = await anualCalenderApiService.getAllAnualCalender();
            setAnualCalenderData(result || []);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllAnualCalender();
    }, []);

    const annualCalendarColumns = [
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: (info: any) => {
                const row = info.row.original;
                return (
                    <div>
                        {row.type === "Vacation"
                            ? `${moment(row.fromDate).format('DD/MM/YYYY')} to ${moment(row.toDate).format('DD/MM/YYYY')}`
                            : moment(row.date).format('DD/MM/YYYY')}
                    </div>
                );
            },
        },
        {
            header: 'Type',
            accessorKey: 'type',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Description',
            accessorKey: 'description',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        // {
        //     header: 'Created By',
        //     accessorKey: 'createdBy',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className="text-primary text-nowrap">
        //             {info.getValue()}
        //         </div>
        //     ),
        // },
        // {
        //     header: 'Front Site',
        //     accessorKey: 'frontSite',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div>
        //             {info.getValue()}
        //         </div>
        //     ),
        // },
        {
            header: 'Action',
            accessorKey: 'action',
            enableColumnFilter: false,
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                editAnualCalender(cell.row.original.id);
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
                                deleteAnualCalender(cell.row.original.id);
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
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={anualCalenderData}
                />

                <Container fluid>
                    <FormHeader title="Annual Calendar"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Annual Calendar",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="annualCalendar">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Annual Calendar</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div className="col-sm-auto">
                                                <div>
                                                    <Link to='/main/addCalender'>
                                                        <Button

                                                            color="primary"
                                                            className="btn btn-primary add-btn me-3"
                                                        >
                                                            <i className="ri-add-fill me-1 align-bottom"></i> Add Calender
                                                        </Button>
                                                    </Link>
                                                    <button type="button" className="btn btn-primary" onClick={() => setIsExportCSV(true)}>
                                                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                        Export
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={annualCalendarColumns}
                                            data={anualCalenderData}
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

export default AnnualCalendar;
