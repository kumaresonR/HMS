import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, InputGroup, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import FormHeader from '../../common/FormHeader/FormHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import AddIssueBlood from './AddIssueBlood'
import BloodIssueDataTable from './BloodIssueDataTable'
import { bloodIssueData } from '../../common/data/FakeData'
import { IoArrowBack } from 'react-icons/io5'
import { Link, useLocation } from 'react-router-dom'
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent'
import { useDispatch } from 'react-redux'
import { minimizePage } from '../../slices/pageResizer/uiSlice'

const BloodIssueDetails = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [getIssueBlood, setAddIssueBlood] = useState<boolean>(false);
    const [refreshData, setRefreshData] = useState<boolean>(false);

    function handleColse() {
        setAddIssueBlood(!getIssueBlood);
        setRefreshData(!refreshData);
    }

    const addIssueBloodData = () => {
        handleColse()
    }
    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Blood Issue Details"
                    pageTitle="Blood Issue Details"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Blood Issue Details",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <RoleBasedComponent allowedRoles={["PATHOLOGIST", "SUPERADMIN", "ADMIN"]}>
                                        <Button
                                            color="primary"
                                            className="btn btn-primary add-btn ms-3" onClick={() => addIssueBloodData()}>
                                            <FontAwesomeIcon icon={faPlus} className='me-2' /> Issue Blood
                                        </Button>
                                    </RoleBasedComponent>
                                    <Link to="/main/blood-bank-status" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <BloodIssueDataTable data={bloodIssueData} refresh={refreshData} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={getIssueBlood} toggle={handleColse}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable>
                <ModalHeader toggle={handleColse} className="p-3 bg-info-subtle model-container text-white">
                    Add Blood Issue
                </ModalHeader>
                <ModalBody>
                    <AddIssueBlood handleClose={handleColse} />
                </ModalBody>
            </Modal>
        </React.Fragment >
    )
}

export default BloodIssueDetails