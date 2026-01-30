import React, { useEffect, useState } from 'react'
import { Badge, Card, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import TableContainer from '../../Components/Common/TableContainer';
import ErrorHandler from '../../helpers/ErrorHandler';
import OTManagementApiService from '../../helpers/services/otManagement/ot-management-api-service';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import FormHeader from '../../common/FormHeader/FormHeader';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import classnames from "classnames";
import moment from 'moment';
import PrintComponent from '../../Components/Common/PrintComponent';
import PreviewOperation from '../IPD/InPatient/IpdContainer/Operation/PreviewOperation';
import { faCalendarAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flatpickr from "react-flatpickr";
import EditScheduledOperation from './EditScheduledOperation';
import UpdateOperationStatus from './UpdateOperationStatus';

const statusData = [
    {
        name: "Pending",
    },
    {
        name: "Completed",
    },
    {
        name: "Cancelled",
    }
]
const ViewScheduledOperations = () => {
    const otManagementApiService: OTManagementApiService = new OTManagementApiService();
    const dispatch = useDispatch();
    const location = useLocation();

    const [data, setData] = useState([]);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [status, setStatus] = useState("Pending");
    const [customActiveTab, setcustomActiveTab] = useState<string>("1");
    const [previewModelOpen, setPreviewModelOpen] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState('');
    const [editModelOpen, setEditModelOpen] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState('');

    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const preview = (data: any) => {
        setPreviewData(data);
        handlePreviewClose();
    }

    const handlePreviewClose = () => {
        setPreviewModelOpen(!previewModelOpen);
        if(previewModelOpen=== true){
            getAllOperation();
        }
    }

    const edit = (data: any) => {
        setSelectedData(data);
        handleEditModelClose();
    }

    const handleEditModelClose = () => {
        setEditModelOpen(!editModelOpen);
        if(editModelOpen=== true){
            getAllOperation();
        }
    }

    const getAllOperation = async () => {
        try {
            let baseUrl = customActiveTab === "1" ? "ipd-list" : "opd-list";
            let url = `${baseUrl}?date=${date}&status=${status}`;
            let result = await otManagementApiService.getAllOperation(url)
            setData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllOperation();
    }, [status, date, customActiveTab]);

    const operationColumns = [
        {
            header: 'Patient ID',
            accessorKey: 'patientId',
            enableColumnFilter: false,
        },
        {
            header : 'Patient Name',
            accessorKey:'firstName',
            enableColumnFilter: false,
        },
        {
            header: 'Doctor',
            accessorKey: 'doctor.firstName',
            enableColumnFilter: false,
            cell: ({ row }: any) => `${row.original.doctor.firstName} (${row.original.doctor.staffId})`
        },
        {
            header: 'OPD ID',
            accessorKey: 'opdId',
            enableColumnFilter: false,

        },
        {
            header: 'Operation Category',
            accessorKey: 'operationCategory',
            enableColumnFilter: false,

        },
        {
            header: 'Operation Name',
            accessorKey: 'operationName',
            enableColumnFilter: false,

        },
        {
            header: 'Operation Date',
            accessorKey: 'operationDate',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div >
                    {moment(info.getValue()).format("DD/MM/YYYY hh:mm A")}
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            enableColumnFilter: false,
            cell: (info: any) => {
                const status = info.getValue();
                const badgeColor =
                    status === "Completed" ? "success" :
                        status === "Cancelled" ? "danger" :
                            "primary";

                return (
                    <div className="text-primary">
                        <Badge color={badgeColor}>{status}</Badge>
                    </div>
                );
            },
        },
        {
            header: 'Action',
            enableColumnFilter: false,
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item" title="View">
                        <Link
                            className="view-item-btn"
                            to="#" data-bs-toggle="modal" onClick={() => preview(cell.row.original)}
                        >
                            <i className="ri-eye-fill align-bottom text-pink"></i>
                        </Link>
                    </li>
                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                edit(cell.row.original);
                            }}
                            to="#"
                            title="Edit"
                        >
                            <i className="ri-pencil-fill align-bottom text-purple"></i>
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
                    <FormHeader title="OT Management"
                        pageTitle="View Operations"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "OT Management",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="tpaList">
                                <div className="card-body">
                                    <Col>
                                        <Nav tabs className="nav nav-tabs nav-tabs-custom nav-success mb-3 d-flex justify-content-between align-items-center">
                                            <div className="d-flex">
                                                <NavItem>
                                                    <NavLink
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({ active: customActiveTab === "1" })}
                                                        onClick={() => toggleCustom("1")}
                                                    >
                                                        IPD
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        style={{ cursor: "pointer" }}
                                                        className={classnames({ active: customActiveTab === "2" })}
                                                        onClick={() => toggleCustom("2")}
                                                    >
                                                        OPD
                                                    </NavLink>
                                                </NavItem>
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <UncontrolledDropdown className='w-100'>
                                                    <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                                        <span className="text-primary" style={{ textTransform: "capitalize" }}>
                                                            <FontAwesomeIcon icon={faFilter} /> Filter By: {status} <i className="mdi mdi-chevron-down ms-1"></i>
                                                        </span>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-start">
                                                        {statusData.map((item: any, idx: any) => (
                                                            <DropdownItem key={idx} onClick={() => setStatus(item.name)}>{item.name}</DropdownItem>
                                                        ))}
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                                    </span>
                                                    <Flatpickr
                                                        className="form-control"
                                                        value={date}
                                                        onChange={(selectedDates) => {
                                                            setDate(moment(selectedDates[0]).format("YYYY-MM-DD"));
                                                        }}
                                                        options={{ dateFormat: "Y-m-d" }}
                                                    />
                                                </div>
                                            </div>

                                        </Nav>
                                    </Col>

                                    <TabContent
                                        activeTab={customActiveTab}
                                        className="text-muted"
                                    >
                                        <TabPane tabId="1" id="home1">
                                            <div>
                                                <TableContainer
                                                    columns={operationColumns}
                                                    data={data}
                                                    isGlobalFilter={true}
                                                    isCustomerFilter={true}
                                                    customPageSize={5}
                                                    tableClass="table table-bordered"
                                                    theadClass="thead-light"
                                                    divClass="table-responsive"
                                                />
                                            </div>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <div>
                                                <TableContainer
                                                    columns={operationColumns}
                                                    data={data}
                                                    isGlobalFilter={true}
                                                    isCustomerFilter={true}
                                                    customPageSize={5}
                                                    tableClass="table table-bordered"
                                                    theadClass="thead-light"
                                                    divClass="table-responsive"
                                                />
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal isOpen={previewModelOpen} toggle={handlePreviewClose}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handlePreviewClose} className="p-3 bg-info-subtle model-header-container modal-title">
                    Operation Details
                </ModalHeader>

                <ModalBody>
                    <UpdateOperationStatus data={previewData} tabId={customActiveTab} handleClose={handlePreviewClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editModelOpen} toggle={handleEditModelClose}
                backdrop={'static'} id="edit-model" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleEditModelClose} className="p-3 bg-info-subtle model-header-container modal-title">
                    Edit Operation Details
                </ModalHeader>

                <ModalBody>
                    <EditScheduledOperation data={selectedData} tabId={customActiveTab} handleClose={handleEditModelClose} />
                </ModalBody>
            </Modal>

        </React.Fragment>
    );
};

export default ViewScheduledOperations