import React, { useEffect, useState } from 'react'
import TableContainer from '../../Components/Common/TableContainer'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Row, Col, Card, CardHeader, Button, CardBody } from 'reactstrap'
import FormHeader from '../../common/FormHeader/FormHeader'
import { minimizePage } from '../../slices/pageResizer/uiSlice'
import PharmacyApiService from '../../helpers/services/pharmacy/pharmacy-api-service'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useModal } from '../../Components/Common/ModalContext'
import ErrorHandler from '../../helpers/ErrorHandler'
import { toast } from 'react-toastify'
import AddMedicineUpload from './AddMedicineUpload'
import { IoArrowBack } from 'react-icons/io5'
import axios from 'axios'

const MedicineUpload = () => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [medicineStockData, setMedicineStockData] = useState<any>([]);
    const { showModal } = useModal();
    const [selectedFile, setSelectedFile] = useState<any>();
    const [documentValidationError, setDocumentValidationError] = useState<boolean>(false);

    const medicineStockColumns = [
        {
            header: 'Medicine Name',
            accessorKey: 'name',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="">
                    {info.getValue()}
                </div>
            ),
        },
        {
            header: 'Composition',
            accessorKey: 'composition',
            enableColumnFilter: false,
        },
        {
            header: 'Medicine Company',
            accessorKey: 'manufacturer',
            enableColumnFilter: false,
        },
        {
            header: 'Price',
            accessorKey: 'price',
            enableColumnFilter: false,
        },
    ];

    const getAllMedicineStock = async () => {
        try {
            let response = await axios.get('https://ai.api.hms.com/api/medicine/list/')
            setMedicineStockData(response?.data?.medicines);
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllMedicineStock();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Upload Medicines Stock"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Upload Medicines Stock",
                    }))} />

                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <Button className="mx-2" color='dark' onClick={() =>
                                        showModal({
                                            content: (
                                                <AddMedicineUpload refresh={getAllMedicineStock} />
                                            ),
                                            title: "Upload Medicine",
                                            size: "lg",
                                        })
                                    }>
                                        <FontAwesomeIcon icon={faUpload} />Import Medicines
                                    </Button>
                                    <Link to="/main/medicine-stock" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                </div>
                                <hr />
                            </CardHeader>
                            <CardBody>
                                <TableContainer
                                    columns={medicineStockColumns}
                                    data={medicineStockData}
                                    isGlobalFilter={true}
                                    isCustomerFilter={true}
                                    customPageSize={5}
                                    tableClass="table table-bordered"
                                    theadClass="thead-light"
                                    divClass="table-responsive"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default MedicineUpload