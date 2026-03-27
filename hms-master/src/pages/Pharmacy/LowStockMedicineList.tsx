import React, { useEffect, useState } from "react"
import TableContainer from "../../Components/Common/TableContainer";
import ErrorHandler from "../../helpers/ErrorHandler";
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Button, Card, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { IoArrowBack } from "react-icons/io5";
import MedicinePurchase from "./MedicinePurchase";
import { useDispatch } from "react-redux";
import FormHeader from "../../common/FormHeader/FormHeader";
import { minimizePage } from "../../slices/pageResizer/uiSlice";

const LowStockMedicineList = () => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const dispatch = useDispatch();
    const location = useLocation();

    const [medicineData, setmedicineData] = useState([]);
    const [getMedicinePurchase, setMedicinePurchase] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<any>();

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    const MedicineColumns = [
        {
            header: 'Medicine Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div className="text-primary">
                        {value ? value : 'N/A'}
                    </div>
                );
            },
        },
        {
            header: 'Medicine Company',
            accessorKey: 'companyDetails',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div>
                        <a href={value.companyLink} target="_blank" className="text-primary text-decoration-underline">{value.companyName}</a>
                    </div>
                );
            },
        },
        // {
        //     header: 'Medicine Composition',
        //     accessorKey: 'composition',
        //     enableColumnFilter: false,
        //     cell: (info: any) => {
        //         const value = info.getValue();
        //         return (
        //             <div>
        //                 {value ? value : 'N/A'}
        //             </div>
        //         );
        //     },
        // },
        {
            header: 'Medicine Category',
            accessorKey: 'category',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div>
                        {value ? value : 'N/A'}
                    </div>
                );
            },
        },
        {
            header: 'Sale Price (₹)',
            accessorKey: 'salePrice',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div>
                        {value ? value : 'N/A'}
                    </div>
                );
            },
        },
        {
            header: 'Tax (%)',
            accessorKey: 'tax',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div>
                        {value ? value : 'N/A'}
                    </div>
                );
            },
        },
        {
            header: 'Available Qty',
            accessorKey: 'boxPacking',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.getValue();
                return (
                    <div>
                        {value ? value : 'N/A'}
                    </div>
                );
            },
        },
        {
            header: 'Action',
            enableColumnFilter: false,
            cell: (info: any) => {
                const value = info.row.original;
                return (
                    <div>
                        <Badge color="success" className="pointer" onClick={() => orderNow(value)}>Order Now</Badge>
                    </div>
                );
            },
        },
    ];

    const getAllLowStockMedicine = async () => {
        try {
            let result = await pharmacyApiService.getAllLowStockMedicine();
            setmedicineData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const orderNow = (data: any) => {
        setSelectedData(data);
        handleColse()
    }

    const handleColse = () => {
        setMedicinePurchase(!getMedicinePurchase);
        getAllLowStockMedicine()
    }

    useEffect(() => {
        getAllLowStockMedicine();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Low Stock Medicine"
                    pageTitle="Pharmacy"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Low Stock Medicine",
                    }))} />

                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <ExportCSVModal
                                show={isExportCSV}
                                onCloseClick={() => setIsExportCSV(false)}
                                data={medicineData}
                            />

                            <Row>
                                <Col lg={12}>
                                    <Card id="medicineData">
                                        <CardHeader className="border-0">
                                            <Row className="g-4 align-items-center">
                                                <div className="col-sm">
                                                    <div>
                                                        <h5 className="card-title mb-0">Low Stock Medicine List</h5>
                                                    </div>
                                                </div>
                                                <div className="col-sm-auto">
                                                    <div>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            className="btn btn-secondary"
                                                            onClick={() => setIsExportCSV(true)}
                                                        >
                                                            <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                            Export
                                                        </Button>

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
                                                    columns={MedicineColumns}
                                                    data={medicineData}
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

            <Modal isOpen={getMedicinePurchase} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle modal-title">
                    Add Medicine Purchase List
                </ModalHeader>
                <ModalBody>
                    <MedicinePurchase restockData={selectedData} handleClose={handleColse} />
                </ModalBody>
            </Modal>

        </React.Fragment>
    );
};

export default LowStockMedicineList