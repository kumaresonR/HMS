import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, InputGroup, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import classnames from "classnames";
import BloodBankDatatable from './BloodBankDatatable';
import BloodBankApiService from '../../helpers/services/bloodBank/BloodBankApiService';
import ErrorHandler from '../../helpers/ErrorHandler';
import RoleBasedComponent from '../../common/RolePermission/RoleBasedComponent';

const BloodBankStatus = () => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();

    let navigate: any = useNavigate();

    const [bloodDonorData, setBloodDonorData] = useState<any>([]);
    const [componentData, setComponentData] = useState<any>([]);

    const getBloodIssueDetails = () => {
        navigate('/main/blood-issue-details')
    }


    const getComponentIssue = () => {
        navigate('/main/component-issue-details')
    }

    const [customverticalTab, setcustomverticalTab] = useState<string>("1");
    const customtoggleVertical = (tab: any) => {
        if (customverticalTab !== tab) {
            setcustomverticalTab(tab);
        }
    };

    const getDonorDetails = () => {
        navigate('/main/blood-bank-donor-details')

    }

    const refresh = () => {
        getAllDonorData();
        getAllComponents();
    }

    const getAllDonorData = async () => {
        try {
            let url = "all";
            let result = await bloodBankApiService.getAllBloodDonor(url);
            console.log("getAllDonorData", result);
            setBloodDonorData(result);
        } catch (error: any) {
            console.log("getAllDonorData Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const getAllComponents = async () => {
        try {
            let result = await bloodBankApiService.getAllComponents();
            console.log("getAllComponents", result);
            setComponentData(result);
        } catch (error: any) {
            console.log("getAllComponents Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllDonorData();
        getAllComponents();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center pb-0  d-flex justify-content-between">
                                <div className="d-flex w-100 align-items-center justify-content-between">
                                    <h3 className="box-title titlefix">Blood Bank Status</h3>
                                    <div className="ms-auto">
                                        <RoleBasedComponent allowedRoles={["RECEPTIONIST", "SUPERADMIN","ADMIN", "PATHOLOGIST","DOCTOR","ACCOUNTANT"]}>
                                            <Button

                                                color="primary"
                                                className="btn btn-primary mx-2" onClick={() => getDonorDetails()}>
                                                <FontAwesomeIcon icon={faBars} /> Donor Details
                                            </Button>
                                        
                                            <Button
                                                color="primary"
                                                className="btn btn-primary ms-2" onClick={() => getBloodIssueDetails()}>
                                                <FontAwesomeIcon icon={faBars} /> Blood Issue Details
                                            </Button>
                                            <Button
                                                color="primary"
                                                className="btn btn-primary ms-2" onClick={() => getComponentIssue()}>
                                                <FontAwesomeIcon icon={faBars} /> Component Issue
                                            </Button>
                                        </RoleBasedComponent>
                                    </div>
                                </div>
                            </CardHeader>
                            <hr />
                            <CardBody>
                                <Row>
                                    <Col>
                                        <Nav pills className="nav nav-pills justify-content- flex-wrap ms-3">
                                            {["1", "2", "3", "4", "5", "6", "7", "8"].map((tabId) => (
                                                <NavItem key={tabId}>
                                                    <NavLink
                                                        style={{ cursor: "pointer", marginRight: "50px" }}
                                                        className={classnames({
                                                            "mb-2": true,
                                                            "bg-primary text-white": customverticalTab === tabId,
                                                            "bg-light text-dark": customverticalTab !== tabId,
                                                        })}
                                                        onClick={() => customtoggleVertical(tabId)}
                                                        id={`custom-v-pills-tab-${tabId}`}
                                                    >
                                                        <i className="ri-4-line d-block fs-10 mb-1"></i>
                                                        {tabId === "1" && "B+"}
                                                        {tabId === "2" && "A+"}
                                                        {tabId === "3" && "AB-"}
                                                        {tabId === "4" && "AB+"}
                                                        {tabId === "5" && "O-"}
                                                        {tabId === "6" && "A-"}
                                                        {tabId === "7" && "B-"}
                                                        {tabId === "8" && "O+"}
                                                    </NavLink>
                                                </NavItem>
                                            ))}
                                        </Nav>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md>
                                        <TabContent activeTab={customverticalTab} className="text-muted mt-3 mt-lg-0">
                                            {["1", "2", "3", "4", "5", "6", "7", "8"].map((tabId) => {
                                                const bloodGroupMap: any = {
                                                    "1": "B+",
                                                    "2": "A+",
                                                    "3": "AB-",
                                                    "4": "AB+",
                                                    "5": "O-",
                                                    "6": "A-",
                                                    "7": "B-",
                                                    "8": "O+",
                                                };

                                                // Filter the data based on the selected blood group
                                                const filteredData = componentData.filter(
                                                    (item: any) => item.bloodGroup === bloodGroupMap[tabId]
                                                );

                                                const filteredBloodData = bloodDonorData.filter(
                                                    (item: any) => item?.donorDetails?.bloodGroup === bloodGroupMap[tabId]
                                                );

                                                return (
                                                    <TabPane tabId={tabId} id={`custom-v-pills-tab-${tabId}`} key={tabId}>
                                                        <BloodBankDatatable data={filteredBloodData} refresh={refresh} componentData={filteredData} />
                                                    </TabPane>
                                                );
                                            })}
                                        </TabContent>
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment >
    )
}
export default BloodBankStatus