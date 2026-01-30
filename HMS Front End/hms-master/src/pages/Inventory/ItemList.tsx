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
import InventoryApiService from "../../helpers/services/inventory/inventoryapiservice";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const ItemList = () => {
    const inventoryApiService: InventoryApiService = new InventoryApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [itemData, setItemData] = useState([]);

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await inventoryApiService.deleteAddItems(selectedId);
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
        navigate('/main/editItems', { state: { id: id } })
    }

    const getAllAddItems = async () => {
        try {
            let result = await inventoryApiService.getAllAddItems();
            console.log("getAllAddItems", result);
            setItemData(result);
        } catch (error: any) {
            console.log("getAllAddItems Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllAddItems();
    }, []);

    const itemListColumns = [
        {
            header: 'Item',
            accessorKey: 'item', enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary text-nowrap">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Category',
            accessorKey: 'itemCategory', enableColumnFilter: false
        },
        {
            header: 'Unit',
            accessorKey: 'unit', enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary text-nowrap">
                    {info.getValue()}
                </div>
            ),
        },
        // {
        //     header: 'Available Quantity',
        //     accessorKey: 'availableQuantity', enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className="text-primary text-nowrap">
        //             {info.getValue()}
        //         </div>
        //     ),
        // },
        {
            header: 'Description',
            accessorKey: 'description', enableColumnFilter: false
        },
        {
            header: "Action", enableColumnFilter: false,
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn"
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                editItem(cell.row.original.id);
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
                                deleteItem(cell.row.original.id);
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
                    data={itemData}
                />

                <Container fluid>
                    <FormHeader title="Item List"
                        pageTitle="Inventory"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Item List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="itemList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Item List</h5>
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
                                                <Link to='/main/addItems'>
                                                    <Button

                                                        color="primary"
                                                        className="btn btn-primary add-btn ms-3"

                                                    >
                                                        <i className="ri-add-fill me-1 align-bottom"></i> Add Item
                                                    </Button>
                                                </Link>

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
                                            columns={itemListColumns}
                                            data={itemData}
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

export default ItemList;
