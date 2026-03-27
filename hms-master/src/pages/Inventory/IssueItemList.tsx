import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    ModalBody,
    Modal,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormHeader from "../../common/FormHeader/FormHeader";
import { IoArrowBack } from "react-icons/io5";
import InventoryApiService from "../../helpers/services/inventory/inventoryapiservice";
import { toast } from "react-toastify";
import ErrorHandler from "../../helpers/ErrorHandler";
import moment from "moment";
import DeleteModal from "../../Components/Common/DeleteModal";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const IssueItemList = () => {
    const inventoryApiService: InventoryApiService = new InventoryApiService();

    const dispatch = useDispatch();
    const location = useLocation();
    
    const [issueData, setIssueData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const [editModal, setEditModal] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<any>('');

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await inventoryApiService.deleteIssueItems(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllAddItems();
                setDeleteModal(false);
                previewClose();
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const previewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    const deleteIssueItem = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editItem = (item: any) => {
        setSelectedItem(item);
        editClose();
    }

    const editClose = () => {
        setEditOpen(!editOpen);
    }

    const handleReturn = async () => {
        if (selectedItem) {
            try {
                let payload: any = {
                    itemCategory: selectedItem.itemCategory,
                    item: selectedItem.item,
                    quantity: selectedItem.quantity
                }
                await inventoryApiService.editIssueItems(selectedItem.id, payload);
                toast.success('Item Return Successfully', { containerId: 'TR' });
                await getAllAddItems();
                editClose();
                return;
            } catch (error: any) {
                return ErrorHandler(error)
            }
        }
    };

    const getAllAddItems = async () => {
        try {
            let result = await inventoryApiService.getAllIssueItems();
            console.log("getAllAddItems", result);
            setIssueData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllAddItems();
    }, []);

    const issueItemColumns = [
        {
            header: 'Item',
            accessorKey: 'item',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary text-nowrap">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Item Category',
            accessorKey: 'itemCategory',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-nowrap">{info.getValue()}</div>
            ),
        },
        {
            header: 'Issue - Return',
            accessorKey: 'issueReturn',
            enableColumnFilter: false,
            cell: (info: any) => {
                const row = info.row.original;
                const issueDate = moment(row.issueDate).format('DD/MM/YYYY');
                const returnDate = moment(row.returnDate).format('DD/MM/YYYY');
                return (
                    <div className="text-nowrap">
                        {`${issueDate} - ${returnDate}`}
                    </div>
                );
            },
        },
        {
            header: 'Issue To',
            accessorKey: 'issueTo',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>{info.getValue()}</div>
            ),
        },
        {
            header: 'Issued By',
            accessorKey: 'issuedBy',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-nowrap ">{info.getValue()}</div>
            ),
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary text-nowrap">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Note',
            accessorKey: 'note',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>{info.getValue()}</div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            enableColumnFilter: false,
            cell: (info: any) => {
                const statusValue = info.getValue();
                let statusClass = '';

                if (statusValue === 'Returned') {
                    statusClass = 'text-success text-nowrap';
                } else if (statusValue === 'Click to Return') {
                    statusClass = 'text-danger text-nowrap';
                } else {
                    statusClass = 'text-primary text-nowrap';
                }

                return statusValue === 'Returned' ? (
                    <span className={statusClass}>{statusValue}</span>
                ) : (
                    <Link
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            editItem(info.row.original);
                        }}
                        className={statusClass}
                    >
                        {statusValue}
                    </Link>
                );
            },
        },

        {
            header: 'Action',
            accessorKey: 'action',
            enableColumnFilter: false,
            cell: (cell: any) => (
                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "ACCOUNTANT"]}>
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item" title="Delete">
                            <Link
                                className="remove-item-btn" data-bs-toggle="modal"
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteIssueItem(cell.row.original.id);
                                }}
                                to="#"
                            >
                                <i className="ri-delete-bin-fill align-bottom text-danger"></i>
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
                    data={issueData}
                />

                <Container fluid>
                    <FormHeader
                        title="Issue Item List"
                        pageTitle="Inventory Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Issue Item List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="issueItemList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Issue Item List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn btn-primary"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </Button>
                                                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "ACCOUNTANT"]}>
                                                    <Link to='/main/addIssueItem'>
                                                        <Button

                                                            color="primary"
                                                            className="btn btn-primary add-btn ms-3"

                                                        >
                                                            <i className="ri-add-fill me-1 align-bottom"></i> Add Issue Item
                                                        </Button>
                                                    </Link>
                                                </RoleBasedComponent>
                                                <Link to="/main/inventory" className="text-end">
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
                                            columns={issueItemColumns}
                                            data={issueData}
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

            <Modal fade={true} isOpen={editOpen} toggle={editClose} centered={true}>
                <ModalBody className="py-3 px-5">
                    <div className="mt-2 text-center">
                        <i className="ri-delete-bin-line display-5 text-danger"></i>
                        <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                            <h4 className="text-muted mx-4 mb-0">Are You Sure To Return This Item !</h4>
                        </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                        <button
                            type="button"
                            className="btn w-sm btn-light material-shadow-none"
                            data-bs-dismiss="modal"
                            onClick={editClose}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn w-sm btn-danger material-shadow-none"
                            id="delete-record"
                            onClick={handleReturn}
                        >
                            Yes, Return It!
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default IssueItemList;
