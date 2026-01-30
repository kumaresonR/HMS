import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import FormHeader from '../../common/FormHeader/FormHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import AddTestDetails from './AddTestDetails'
import PathologyTestTable from './PathologyTestTable'
import BillingApiService from '../../helpers/services/billing/billing-api-service'
import { IoArrowBack } from 'react-icons/io5'
import { Link, useLocation } from 'react-router-dom'
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent'
import { minimizePage } from '../../slices/pageResizer/uiSlice'
import { useDispatch } from 'react-redux'

const PathologyTest = () => {
    const billingApiService: BillingApiService = new BillingApiService();
    const dispatch = useDispatch();
    const location = useLocation();
    
    const [pathologyTestData, setPathologyTestData] = useState<any>([]);
    const [addPathologyTest, setAddPathologyTest] = useState<boolean>(false);

    const handlePathologyTestClose = () => {
        setAddPathologyTest(!addPathologyTest);
        getAllPathologyTest()
    }

    const addPathologyTestData = () => {
        handlePathologyTestClose()
    }

    const getAllPathologyTest = async () => {
        try {
            let url = "all"
            let result = await billingApiService.getPathologyTest(url);
            console.log("getAllPathologyTest", result);
            setPathologyTestData(result);
        } catch (error: any) {
            console.log("getAllPathologyTest Error");
            console.log(error);
        }
    }

    const refresh = () => {
        getAllPathologyTest();
    }

    useEffect(() => {
        getAllPathologyTest();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Pathology Test"
                    pageTitle="Pathology"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Pathology Test",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN","PATHOLOGIST"]}>
                                        <Button
                                            color="primary"
                                            className="btn btn-primary add-btn ms-3" onClick={() => addPathologyTestData()}>
                                            <FontAwesomeIcon icon={faPlus} className='me-2' />Add Pathology Test
                                        </Button>

                                    </RoleBasedComponent>
                                    <Link to="/main/pathology-datatable" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <PathologyTestTable refresh={refresh} testCategory="Pathology Test" data={pathologyTestData} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={addPathologyTest} toggle={handlePathologyTestClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handlePathologyTestClose} className="p-3 bg-info-subtle modal-title">
                    Add Test Details
                </ModalHeader>
                <ModalBody>
                    <AddTestDetails handleClose={handlePathologyTestClose} />
                </ModalBody>
            </Modal>
        </React.Fragment >
    )
}

export default PathologyTest