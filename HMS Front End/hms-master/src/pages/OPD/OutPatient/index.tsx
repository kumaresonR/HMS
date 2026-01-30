import { Button, Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap"
import PatientViewDataTable from "./PatientViewDataTable";
import OpdViewDataTable from "./OpdViewDatatable";
import { useState } from "react";
import classnames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import OpdDischargedPatient from "./OpdDischargedPatient";
import RoleBasedComponent from "../../../common/RolePermission/RoleBasedComponent";
import { useDispatch } from "react-redux";
import FormHeader from "../../../common/FormHeader/FormHeader";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";
import OpdCommissionDataTable from "../../Commission/OPD-Commission/OpdCommissionDataTable";

const OutPatient = () => {
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [customActiveTab, setcustomActiveTab] = useState<string>("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const createPatient = () => {
        navigate('/main/add-opd-patient')
    }

    return <>
        <Container fluid>
            <FormHeader title="Out Patient Management"
                pageTitle="OPD"
                onMinimize={() => dispatch(minimizePage({
                    route: location.pathname,
                    pageName: "OPD",
                }))} />
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col>
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
                                                OPD View
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
                                                Patient View
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
                                                Move To IPD
                                            </NavLink>
                                        </NavItem>
                                        {/* <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                    active: customActiveTab === "4",
                                                })}
                                                onClick={() => {
                                                    toggleCustom("4");
                                                }}
                                            >
                                                OPD Commission
                                            </NavLink>
                                        </NavItem> */}
                                    </Nav>
                                </Col>
                                <RoleBasedComponent allowedRoles={["SUPERADMIN","RECEPTIONIST", "DOCTOR","NURSE"]}>
                                    <Col xs="auto">
                                        <Button onClick={() => createPatient()} color="primary">
                                            <i className="ri-add-circle-line" />  Add Admission
                                        </Button>
                                    </Col>
                                </RoleBasedComponent>
                            </Row>

                            <TabContent
                                activeTab={customActiveTab}
                                className="text-muted"
                            >
                                <TabPane tabId="1" id="home1">
                                    <OpdViewDataTable />
                                </TabPane>
                                <TabPane tabId="2">
                                    <PatientViewDataTable />
                                </TabPane>
                                <TabPane tabId="3">
                                    <OpdDischargedPatient />
                                </TabPane>
                                {/* <TabPane tabId="4">
                                    <OpdCommissionDataTable />
                                </TabPane> */}
                            </TabContent>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>
}
export default OutPatient