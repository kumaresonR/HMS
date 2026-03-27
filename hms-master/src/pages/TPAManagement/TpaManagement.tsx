import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormHeader from "../../common/FormHeader/FormHeader";
import TpaApiService from "../../helpers/services/tpa/tpa-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";
import classnames from "classnames";
import ViewTpaForIpdPatient from "./ViewTpaForIpdPatient";
import ViewTpaForOpdPatient from "./ViewTpaForOpdPatient";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const TpaManagement = () => {
    const tpaApiService: TpaApiService = new TpaApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    let navigate: any = useNavigate();

    const [tpaData, setTpaData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const [customActiveTab, setcustomActiveTab] = useState<string>("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await tpaApiService.deleteTpa(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllTpa();
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

    const deleteTpa = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editTPA = (id: any) => {
        navigate('/main/editTpa', { state: { id: id } })
    }

    const getAllTpa = async () => {
        try {
            let result = await tpaApiService.getAllTpa();
            setTpaData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllTpa();
    }, []);

    const tpaColumns = [
        {
            header: 'Name',
            accessorKey: 'tpaName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Code',
            accessorKey: 'code',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Customer Care No',
            accessorKey: 'contactNo',
            enableColumnFilter: false,

        },
        {
            header: 'Address',
            accessorKey: 'address',
            enableColumnFilter: false,

        },
        {
            header: 'Contact Person Name',
            accessorKey: 'contactPersonName',
            enableColumnFilter: false,

        },
        {
            header: 'Contact Person Phone',
            accessorKey: 'contactPersonPhone',
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
                <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN", "ACCOUNTANT"]}>
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item">
                            <Link
                                className="edit-item-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    editTPA(cell.row.original.id);
                                }}
                                to="#"
                                title="Edit"
                            >
                                <i className="ri-pencil-fill align-bottom text-purple"></i>
                            </Link>
                        </li>
                    </ul>
                </RoleBasedComponent>
            ),
        },
    ];


    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={tpaData}
                />

                <Container fluid>
                    <FormHeader title="TPA Management"
                        pageTitle="Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "TPA Management",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="tpaList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center justify-content-end">
                                        <div className="col-sm-auto">
                                            <div>
                                                <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN", "ACCOUNTANT"]}>
                                                    <Link to='/main/addTpa'>
                                                        <Button

                                                            color="primary"
                                                            className="btn btn-primary add-btn me-3"
                                                        >
                                                            <i className="ri-add-fill me-1 align-bottom"></i>  Add TPA
                                                        </Button>
                                                    </Link>
                                                </RoleBasedComponent>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <Row>

                                    </Row>
                                    <Col>
                                        <Nav tabs className="nav nav-tabs nav-tabs-custom nav-success mb-3">
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customActiveTab === "1",
                                                    })}
                                                    onClick={() => {
                                                        toggleCustom("1");
                                                    }}
                                                >
                                                    TPA Management
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customActiveTab === "2",
                                                    })}
                                                    onClick={() => {
                                                        toggleCustom("2");
                                                    }}
                                                >
                                                    IPD Patient
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customActiveTab === "3",
                                                    })}
                                                    onClick={() => {
                                                        toggleCustom("3");
                                                    }}
                                                >
                                                    OPD Patient
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Col>

                                    <TabContent
                                        activeTab={customActiveTab}
                                        className="text-muted"
                                    >
                                        <TabPane tabId="1" id="home1">
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
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <ViewTpaForIpdPatient />
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <ViewTpaForOpdPatient />
                                        </TabPane>
                                    </TabContent>
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

export default TpaManagement;
