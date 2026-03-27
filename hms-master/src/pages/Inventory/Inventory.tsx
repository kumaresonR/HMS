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
import InventoryApiService from "../../helpers/services/inventory/inventoryapiservice";
import ErrorHandler from "../../helpers/ErrorHandler";
import DeleteModal from "../../Components/Common/DeleteModal";
import { toast } from "react-toastify";
import moment from "moment";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const Inventory = () => {
    const inventoryApiService: InventoryApiService = new InventoryApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [itemStockData, setItemStockData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);


    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await inventoryApiService.deleteAddItemStock(selectedId);
                toast.success('Record Deleted Successfully', { containerId: 'TR' });
                await getAllAddItems();
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

    const deleteItem = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const editItem = (id: any) => {
        navigate('/main/editItemStock', { state: { id: id } })
    }

    const getAllAddItems = async () => {
        try {
            let result = await inventoryApiService.getAllAddItemStock();
            setItemStockData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllAddItems();
    }, []);

    const itemStockColumns = [
        {
            header: 'Name',
            accessorKey: 'item',
            enableColumnFilter: false,

        },
        {
            header: 'Category',
            accessorKey: 'itemCategory',
            enableColumnFilter: false, cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            )

        },
        {
            header: 'Supplier',
            accessorKey: 'supplier',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary text-nowrap">
                    {info.getValue()}
                </div>
            )
        },
        {
            header: 'Store',
            accessorKey: 'store',
            enableColumnFilter: false,

        },
        {
            header: 'Date',
            accessorKey: 'date',
            enableColumnFilter: false,
            cell: ({ getValue }: any) => {
                const rawDate = getValue();
                return moment(rawDate).format('DD/MM/YYYY');
            },
        },
        {
            header: 'Description',
            accessorKey: 'description',
            enableColumnFilter: false,
        },
        {
            header: 'Total Quantity',
            accessorKey: 'quantity',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            )
        },
        {
            header: 'Purchase Price',
            accessorKey: 'purchasePrice',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            )
        },
        {
            header: "Action", enableColumnFilter: false,
            cell: (cell: any) => (
                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "ACCOUNTANT"]}>
                    <ul className="list-inline hstack gap-2 mb-0">
                        <li className="list-inline-item">
                            <Link
                                className="edit-item-btn"
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    editItem(cell.row.original);
                                }}
                                title="Edit"
                            >
                                <i className="ri-pencil-fill align-bottom text-purple"></i>
                            </Link>
                        </li>

                        <li className="list-inline-item" title="Delete">
                            <Link
                                className="remove-item-btn" data-bs-toggle="modal"
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteItem(cell.row.original.itemStockId);
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
                    data={itemStockData}
                />

                <Container fluid>
                    <FormHeader title="Item Stock List"
                        pageTitle="Inventory Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Item Stock List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="itemStockList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Item Stock List</h5>
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
                                                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "ACCOUNTANT"]}>
                                                    <Link to='/main/addItemStock'>
                                                        <Button

                                                            color="primary"
                                                            className="btn btn-primary add-btn ms-3"

                                                        >
                                                            <i className="ri-add-fill me-1 align-bottom"></i> Add Item Stock
                                                        </Button>
                                                    </Link>
                                                </RoleBasedComponent>
                                                <Link to='/main/issueItemList'>
                                                    <Button

                                                        color="primary"
                                                        className="btn btn-primary add-btn ms-3"

                                                    >
                                                        Issue  Item
                                                    </Button>
                                                </Link>
                                                <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "ACCOUNTANT"]}>
                                                    <Link to='/main/itemList'>
                                                        <Button

                                                            color="primary"
                                                            className="btn btn-primary add-btn ms-3"

                                                        >
                                                            Item
                                                        </Button>
                                                    </Link>
                                                </RoleBasedComponent>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={itemStockColumns}
                                            data={itemStockData}
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

export default Inventory;
