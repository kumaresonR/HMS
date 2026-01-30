import { useLocation } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Label, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap"
import VisitPatientView from "../../OPD/OutPatient/OpdContainer/Visits/VisitPatientView";
import classnames from "classnames";
import Charges from "../../IPD/InPatient/IpdContainer/Charges";
import IpdPayment from "../../IPD/InPatient/IpdContainer/IpdPayment";
import Visits from "../../OPD/OutPatient/OpdContainer/Visits";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital } from "@fortawesome/free-solid-svg-icons";
import PatientDischarge from "../../IPD/InPatient/PatientDischarge";

const PatientProfile = () => {
    const { state } = useLocation();
    const [dischargeModel, setDischargeModel] = useState<boolean>(false);

    const data = state?.data;

    const [showNavTabs, setShowNavTabs] = useState(false);
    const [ipdData, setIpdData] = useState(null);

    const handleIpdClick = (ipdInfo: any) => {
        setShowNavTabs(true);
        setIpdData(ipdInfo); 
    };

    const [customActiveTab, setcustomActiveTab] = useState<string>("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const discharge = () => {
        handleDischargeClose();
    }

    const handleDischargeClose = () => {
        setDischargeModel(!dischargeModel);
    }

    return <>
        <Container fluid>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col className="text-center" md="auto">
                                    <img src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png" alt="user" height={100} width={100} />
                                    <h6 className="my-2">{data.name}</h6>
                                    <Button data-bs-toggle="modal" onClick={() => discharge()}
                                        className="btn btn-sm btn-soft-success edit-list mx-1" title="Discharge">
                                        <FontAwesomeIcon icon={faHospital} size="lg" />
                                    </Button>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Patient Id</h6>
                                            <Label className="text-muted">{data.patientId}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Marital Status</h6>
                                            <Label className="text-muted">{data.maritalStatus}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Email</h6>
                                            <Label className="text-muted">{data.email}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Age</h6>
                                            <Label className="text-muted">{data.age}</Label>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Gender</h6>
                                            <Label className="text-muted">{data.gender}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Phone</h6>
                                            <Label className="text-muted">{data.phone}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Address</h6>
                                            <Label className="text-muted">{data.address}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Guardian Name</h6>
                                            <Label className="text-muted">{data.guardianName}</Label>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>OPD No</h6>
                                            <Label className="text-muted">{data.opdNo}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Blood Group</h6>
                                            <Label className="text-muted">{data.bloodGroup}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Consultant Doctor</h6>
                                            <Label className="text-muted">{data.consultantDoctor}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Case</h6>
                                            <Label className="text-muted">{data.caseId}</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Discharged</h6>
                                            <Label className="text-muted">Yes</Label>
                                        </Col>
                                        <Col lg={3} className="border-start py-2 border-bottom">
                                            <h6>Discharged</h6>
                                            <Label className="text-muted">11/09/2024 11:12 AM</Label>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {!showNavTabs && (
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <VisitPatientView data={data} title="Billing" handleIpdClick={handleIpdClick} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}

            {showNavTabs && (
                <Row>
                    <Card>
                        <Col className="py-3">
                            <Nav tabs className="nav nav-tabs nav-tabs-custom nav-success mb-3">
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: customActiveTab === "1",
                                        })}
                                        onClick={() => {
                                            toggleCustom("1");
                                        }}
                                    >
                                        Visits
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: customActiveTab === "2",
                                        })}
                                        onClick={() => {
                                            toggleCustom("2");
                                        }}
                                    >
                                        Charges
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            active: customActiveTab === "3",
                                        })}
                                        onClick={() => {
                                            toggleCustom("3");
                                        }}
                                    >
                                        Payment
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                        <CardBody>
                            <TabContent
                                activeTab={customActiveTab}
                                className="text-muted"
                            >
                                <TabPane tabId="1" id="home1">
                                    <Visits data={ipdData} />
                                </TabPane>
                                <TabPane tabId="2">
                                    <Charges data={ipdData} />
                                </TabPane>
                                <TabPane tabId="3">
                                    <IpdPayment data={ipdData} />
                                </TabPane>
                            </TabContent>
                        </CardBody>
                    </Card>
                </Row>
            )}
        </Container>

        <Modal isOpen={dischargeModel} toggle={handleDischargeClose}
            backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
        >
            <ModalHeader toggle={handleDischargeClose} className="p-3 bg-info-subtle modal-title">
                Patient Discharge
            </ModalHeader>
            <ModalBody>
                <PatientDischarge handleClose={handleDischargeClose} />
            </ModalBody>
        </Modal>
    </>
}
export default PatientProfile