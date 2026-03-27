import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { Button, Card, CardHeader, Col, Container, Row, Table } from "reactstrap"
import ErrorHandler from "../../helpers/ErrorHandler"
import { toast } from "react-toastify"
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service"
import DeleteModal from "../../Components/Common/DeleteModal"
import moment from "moment"
import { Link, useLocation } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import TableContainer from "../../Components/Common/TableContainer"
import FormHeader from "../../common/FormHeader/FormHeader"
import { minimizePage } from "../../slices/pageResizer/uiSlice"
import { useDispatch } from "react-redux"

const BadStockDataTable = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    
    const [badStockData, setBadStockData] = useState<any>([]);

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const badStockColumns = [
        {
            header: 'Outward Date',
            accessorKey: 'outwardDate',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {moment(info.getValue()).format("DD/MM/YYYY")}
                </div>
            ),
        },
        {
            header: 'Name',
            accessorFn: (row: any) => row.name || 'N/A',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Category',
            accessorKey: 'category',
            enableColumnFilter: false,

        },
        {
            header: 'Batch No',
            accessorKey: 'batchNo',
            enableColumnFilter: false,

        },
        {
            header: 'Expiry Date',
            accessorKey: 'expiryDate',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div>
                    {moment(info.getValue()).format("MM/YYYY")}
                </div>
            ),
        },
        {
            header: 'Quantity',
            accessorKey: 'qty',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Action',
            cell: (cell: any) => (
                <ul className="list-inline hstack gap-2 mb-0">
                    <li className="list-inline-item">
                        <Link
                            className="edit-item-btn text-danger"
                            onClick={(e) => {
                                e.preventDefault();
                                deleteBadStock(cell.row.original.id);
                            }}
                            to="#"
                            title="Delete"
                        >
                            <FontAwesomeIcon icon={faTrash} />
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
                await pharmacyApiService.deleteBadStock(selectedId);
                toast.success('Bad Stock Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteBadStock = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }


    const getAllBadStock = async () => {
        try {
            let result = await pharmacyApiService.getAllBadStock();
            setBadStockData(result);
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllBadStock();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Bad Stock Medicine"
                    pageTitle="Pharmacy"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Bad Stock Medicine",
                    }))} />
                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <Row>
                                <Col lg={12}>
                                    <Card id="medicineData">
                                        <CardHeader className="border-0">
                                            <Row className="g-4 align-items-center">
                                                <div className="col-sm">
                                                    <div>
                                                        <h5 className="card-title mb-0">Bad Stock Medicine List</h5>
                                                    </div>
                                                </div>
                                                <div className="col-sm-auto">
                                                    <div>
                                                        <Link to="/main/medicine-stock" className="ms-3">
                                                            <Button color="light" className="bg-gradient backBtn">
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
                                                    columns={badStockColumns}
                                                    data={badStockData}
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
                        </Card>
                    </Col>
                </Row>
            </Container>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment>
    )
}

export default BadStockDataTable