import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledDropdown } from "reactstrap"
import { billingData } from "../../../common/data/billingData";
import { useNavigate } from "react-router-dom";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Barcode from 'react-barcode';
import QRCode from "react-qr-code";
import classnames from "classnames";
import { IpdData } from "../../../common/data/IpdData";
import ChargesDetailDataTable from "../../IPD/InPatient/IpdContainer/Charges/ChargesDetailDataTable";
import BloodIssueDataTable from "../../BloodBank/BloodIssueDataTable";
import PharmacyDataTable from "../../Pharmacy/PharmacyDataTable";
import PathologyCommonTable from "../../Pathology/PathologyCommonTable";
import { bloodIssueData, pathologyData, pharmacyData, radiologyData } from "../../../common/data/FakeData";

import profileImg from '../../../assets/images/myProfile.jpg'
const BillingThroughCaseId = () => {
    let navigate: any = useNavigate();

    const [caseId, setCase] = useState('122');
    const [customActiveTab, setcustomActiveTab] = useState<string>("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };


    const goTo = (path: any) => {
        navigate(path);
    }

    const goToBillSummary = () => {
        navigate('/main/bill-summary')
    }
    return <>

        <Row>
            <Col>

                <Card>
                    <CardBody>
                        <h4>OPD/IPD Billing Through Case Id  </h4>
                        <Row>
                            <Col md={6}>
                                <FormGroup className="d-flex">
                                    <label className="text-start m-2 text-nowrap">Case ID :</label>
                                    <Input
                                        id="case"
                                        name="case"
                                        type="text"
                                        value={caseId}
                                        onChange={e => setCase(e.target.value)}
                                    />
                                    <Button className="mx-2" color="primary">Search</Button>
                                </FormGroup>
                            </Col>
                            <Col className="text-end">
                                <UncontrolledDropdown>
                                    <DropdownToggle
                                        href="#"
                                        className="btn btn-soft-secondary btn-sm"
                                        tag="button"
                                    >
                                        <FontAwesomeIcon icon={faBars} />
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                        {billingData.map((item: any, idx: any) => (
                                            <DropdownItem key={idx} onClick={() => goTo(item.path)}>
                                                <i className="me-2 text-muted"> {item.icon}</i> {item.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md="auto">
                                <img src={profileImg} alt="User" width={150} style={{ borderRadius: "5px" }} />
                            </Col>

                            <Col>
                                <Row>
                                    <Col>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">Case Id</Label>
                                            <Label className="col">303</Label>
                                        </div>
                                        <div className="d-flex justify-content-between v">
                                            <Label className="col">Name</Label>
                                            <Label className="col">Vaisali Sharma (1124)</Label>
                                        </div>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">Gender</Label>
                                            <Label className="col">Female</Label>
                                        </div>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">Phone</Label>
                                            <Label className="col">8890768756</Label>
                                        </div>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">OPD No</Label>
                                            <Label className="col">303</Label>
                                        </div>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">Barcode</Label>
                                            <Col>
                                                <Barcode value="303" height={30} />
                                            </Col>
                                        </div>
                                    </Col>
                                    <Col xs="auto" className="border-start d-none d-lg-block"></Col>
                                    <Col>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">Appointment Date</Label>
                                            <Label className="col">303</Label>
                                        </div>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">Guardian Name</Label>
                                            <Label className="col">Vinay Sharma</Label>
                                        </div>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">Age</Label>
                                            <Label className="col">23</Label>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <Label className="col">Credit Limit</Label>
                                            <Label className="col">56,756,879,321</Label>
                                        </div>
                                        <div className="d-flex justify-content-between  mb-2">
                                            <Label className="col">QR Code</Label>
                                            <Col>
                                                <QRCode value={caseId} size={50} />
                                            </Col>
                                        </div>
                                        <div className="text-end">
                                            <Button onClick={goToBillSummary} color="primary">Bill Summary</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <Row>
                            <Col sm={12}>
                                <Row className="d-flex justify-content-between align-items-center">
                                    <Col lg={8}>
                                        <Nav tabs className="nav nav-tabs border-bottom-0 nav-tabs-custom nav-success mb-3">
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
                                                    OPD
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
                                                    IPD
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
                                                    Pharmacy
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customActiveTab === "4",
                                                    })}
                                                    onClick={() => {
                                                        toggleCustom("4");
                                                    }}
                                                >
                                                    Pathology
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customActiveTab === "5",
                                                    })}
                                                    onClick={() => {
                                                        toggleCustom("5");
                                                    }}
                                                >
                                                    Radiology
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customActiveTab === "6",
                                                    })}
                                                    onClick={() => {
                                                        toggleCustom("6");
                                                    }}
                                                >
                                                    Blood Bank
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    style={{ cursor: "pointer" }}
                                                    className={classnames({
                                                        active: customActiveTab === "7",
                                                    })}
                                                    onClick={() => {
                                                        toggleCustom("7");
                                                    }}
                                                >
                                                    Ambulance
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Col>
                                    <Col className="text-end">

                                        {/* <button className="btn btn-primary me-2">Add Payment</button>
                                            <button className="btn btn-primary me-2">View Payment</button> */}
                                        <button className="btn btn-primary me-2">Generate Bill</button>
                                        {/* <button className="btn btn-secondary me-2">Button 2</button> */}
                                        {/* <button className="btn btn-success">Button 3</button> */}
                                    </Col>
                                </Row>
                            </Col>

                            <Col sm={12}>
                                <TabContent
                                    activeTab={customActiveTab}
                                    className="text-muted"
                                >
                                    <TabPane tabId="1" id="home1">
                                        <ChargesDetailDataTable data={IpdData} />
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <ChargesDetailDataTable data={IpdData} />
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <PharmacyDataTable data={pharmacyData} />
                                    </TabPane>
                                    <TabPane tabId="4">
                                        <PathologyCommonTable data={pathologyData} />
                                    </TabPane>
                                    <TabPane tabId="5">
                                        <PathologyCommonTable data={radiologyData} />
                                    </TabPane>
                                    <TabPane tabId="6">
                                        <BloodIssueDataTable data={bloodIssueData} />
                                    </TabPane>
                                </TabContent>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>
            </Col>
        </Row>

    </>
}
export default BillingThroughCaseId