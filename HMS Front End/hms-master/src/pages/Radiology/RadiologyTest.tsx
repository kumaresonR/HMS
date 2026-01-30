import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import FormHeader from '../../common/FormHeader/FormHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons'
import PathologyTestTable from '../Pathology/PathologyTestTable'
import AddRadiologyTestDetails from './AddRadiologyTestDetails'
import BillingApiService from '../../helpers/services/billing/billing-api-service'
import { IoArrowBack } from 'react-icons/io5'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent'
import { minimizePage } from '../../slices/pageResizer/uiSlice'
import { useDispatch } from 'react-redux'

const RadiologyTest = () => {
    const billingApiService: BillingApiService = new BillingApiService();

    const dispatch = useDispatch();
    const location = useLocation();
    const [radiologyTestData, setRadiologyTestData] = useState<any>([]);
    const [addRadiologyTest, setAddRadiologyTest] = useState<boolean>(false);

    const addRadiologyTestData = () => {
        handleRadiologyTestClose()
    }

    const handleRadiologyTestClose = () => {
        setAddRadiologyTest(!addRadiologyTest);
        getAllRadiologyTest()
    }

    const getAllRadiologyTest = async () => {
        try {
            let url = "all"
            let result = await billingApiService.getRadiologyTest(url);
            setRadiologyTestData(result);
        } catch (error: any) {
            console.log(error);
        }
    }

    const refresh = () => {
        getAllRadiologyTest();
    }

    useEffect(() => {
        getAllRadiologyTest();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Radiology Test"
                    pageTitle="Radiology"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Radiology Test",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","RADIOLOGIST"]}>
                                        <Button
                                            // size="sm"
                                            color="primary"
                                            className="btn btn-primary ms-3" onClick={() => addRadiologyTestData()}>
                                            <FontAwesomeIcon icon={faPlus} /> Radiology Test
                                        </Button>
                                    </RoleBasedComponent>
                                    <Link to="/main/radiology-datatable" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>


                                </div>
                            </CardHeader>
                            <CardBody>
                                <PathologyTestTable refresh={refresh} testCategory="Radilology Test" data={radiologyTestData} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={addRadiologyTest} toggle={handleRadiologyTestClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handleRadiologyTestClose} className="p-3 bg-info-subtle modal-title">
                    Add Test Details
                </ModalHeader>
                <ModalBody>
                    <AddRadiologyTestDetails handleClose={handleRadiologyTestClose} />
                </ModalBody>
            </Modal>
        </React.Fragment >
    )
}

export default RadiologyTest