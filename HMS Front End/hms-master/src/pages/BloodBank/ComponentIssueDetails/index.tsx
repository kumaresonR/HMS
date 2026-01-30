import { faPlus, faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, CardHeader, Button, CardBody, Table, Modal, ModalHeader, InputGroup, Input, FormGroup, Label, ModalBody } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import AddIssueComponent from "../AddIssueComponent";
import ComponentIssueDetailDataTable from "./ComponentIssueDetailDataTable";
import { IoArrowBack } from "react-icons/io5";
import RoleBasedComponent from "../../../common/RolePermission/RoleBasedComponent";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const ComponentIssueDetails = () => {
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [componentIssueDetails, setComponentIssueDetails] = useState<boolean>(false);
    const [refreshData, setRefreshData] = useState<boolean>(false);

    function handleClose() {
        setComponentIssueDetails(!componentIssueDetails);
        setRefreshData(!refreshData);
    }

    const addComponentIssueDetails = () => {
        handleClose()
    }

    const getComponents = () => {
        navigate('/main/component-list')
    }

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="Components Issue Details"
                    pageTitle="Components Issue Details"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Components Issue Details",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <RoleBasedComponent allowedRoles={["SUPERADMIN", "PATHOLOGIST"]}>
                                        <Button
                                            color="primary"
                                            className="btn btn-primary add-btn ms-3"
                                            onClick={() => addComponentIssueDetails()}>
                                            <FontAwesomeIcon icon={faPlus} className="me-2" /> Issue Component
                                        </Button>
                                    </RoleBasedComponent>
                                    <Button
                                        color="success"
                                        className="btn btn-primary add-btn ms-3"
                                        onClick={() => getComponents()}>
                                        <FontAwesomeIcon icon={faBars} className="me-2" /> Components
                                    </Button>


                                    <Link to="/main/blood-bank-status" className="ms-3">
                                        <Button color="light" className="bg-gradient backBtn">
                                            <IoArrowBack />
                                        </Button>
                                    </Link>


                                </div>
                            </CardHeader>
                            <CardBody>
                                <ComponentIssueDetailDataTable refresh={refreshData} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Modal isOpen={componentIssueDetails} toggle={handleClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable>
                <ModalHeader toggle={handleClose} className="p-3 bg-info-subtle model-container text-white">
                    Add Issue Component Details
                </ModalHeader>
                <ModalBody>
                    <AddIssueComponent handleClose={handleClose} />
                </ModalBody>
            </Modal>
        </React.Fragment >
    )
}

export default ComponentIssueDetails