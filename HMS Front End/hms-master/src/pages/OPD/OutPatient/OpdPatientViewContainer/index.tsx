import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Container, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import OpdPatientOverview from "./OpdPatientOverview";
import LabInvestigation from "../../../IPD/InPatient/IpdContainer/LabInvestigation";
import OpdTreatmentHistory from "../OpdContainer/OpdTreatmentHistory";
import AddTimeLine from "../../../IPD/InPatient/IpdContainer/TimeLine/AddTimeLine";
import Vital from "../../../IPD/InPatient/IpdContainer/Vital";
import VisitPatientView from "../OpdContainer/Visits/VisitPatientView";
import OPDApiService from "../../../../helpers/services/opd/opd-api-service";
import { IoArrowBack } from "react-icons/io5";
import RoleBasedComponent from "../../../../common/RolePermission/RoleBasedComponent";
import FormHeader from "../../../../common/FormHeader/FormHeader";
import { minimizePage } from "../../../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import ErrorHandler from "../../../../helpers/ErrorHandler";

const OpdPatientViewContainer = () => {
    const opdApiService: OPDApiService = new OPDApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { state } = useLocation();

    const [data, setData] = useState<any>();
    const [visitsData, setVisitsData] = useState<any>();

    const [loading, setLoading] = useState<boolean>(true);

    const storedId = localStorage.getItem("opdPatientId");
    const id = state?.data || storedId || location?.state?.id;

    // Light Nav
    const [lightNavTab, setlightNavTab] = useState<string>("1");
    const lightNavToggle = (tab: any) => {
        if (lightNavTab !== tab) {
            setlightNavTab(tab);
            localStorage.setItem('activeTab', tab);
        }
    };

    const getAllVisits = async (patientId: any) => {
        try {
            const visits = await opdApiService.getAllVisitsByPatientId(patientId);
            setVisitsData(visits);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    };

    const getAllOpd = async () => {
        try {
            let opdData = await opdApiService.getOPDById(id);
            setData(opdData);
            if (opdData.admissions?.patientId) {
                await getAllVisits(opdData.admissions.patientId);
            }
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        getAllOpd();
        localStorage.setItem('activeTab', lightNavTab);
    }
    useEffect(() => {
        if (id) {
            localStorage.setItem("opdPatientId", id);
            getAllOpd();
        }
    }, [id]);

    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            setlightNavTab(savedTab);
        } else {
            setlightNavTab("1");
        }
    }, []);

    useEffect(() => {
        if (data) {
            console.log("Updated data:", data);
        }
    }, [data]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="OPD Patient Overview"
                    pageTitle="OPD"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "OPD Patient Overview",
                        data: { id }
                    }))} />
            </Container>
            <div className="text-end">
                <Button
                    color="primary"
                    onClick={() => navigate(-1)}
                    className="btn btn-primary add-btn ms-3"
                >
                    <IoArrowBack /> Back
                </Button>
            </div>
            <Card>
                <CardBody>
                    <Nav pills className="nav mb-0 nav-pills nav-custom nav-custom-light">
                        <NavItem>
                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: lightNavTab === "1", })} onClick={() => { lightNavToggle("1"); }} >
                                Overview
                            </NavLink>
                        </NavItem>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", 'NURSE']}>
                            <NavItem>
                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: lightNavTab === "2", })} onClick={() => { lightNavToggle("2"); }} >
                                    Visits
                                </NavLink>
                            </NavItem>
                        </RoleBasedComponent>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE", "RADIOLOGIST", "PATHOLOGIST"]}>
                            <NavItem>
                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: lightNavTab === "3", })} onClick={() => { lightNavToggle("3"); }} >
                                    Lab Investigation
                                </NavLink>
                            </NavItem>
                        </RoleBasedComponent>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", 'NURSE']}>
                            <NavItem>
                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: lightNavTab === "4", })} onClick={() => { lightNavToggle("4"); }} >
                                    Treatment History
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: lightNavTab === "5", })} onClick={() => { lightNavToggle("5"); }} >
                                    Timeline
                                </NavLink>
                            </NavItem>
                        </RoleBasedComponent>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "NURSE", "RECEPTIONIST"]}>
                            <NavItem>
                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: lightNavTab === "6", })} onClick={() => { lightNavToggle("6"); }} >
                                    Vitals
                                </NavLink>
                            </NavItem>
                        </RoleBasedComponent>
                    </Nav>
                </CardBody>
            </Card>
            {/* <Card>
                <CardBody> */}
            {
                loading ? (
                    <div>Loading...</div>
                ) : (
                    <TabContent activeTab={lightNavTab} className="text-muted">
                        <TabPane tabId="1" id="nav-light-home">
                            <OpdPatientOverview data={data} visitData={visitsData} refresh={refresh} />
                        </TabPane>
                        <TabPane tabId="2" id="nav-light-home">
                            <VisitPatientView data={data} visitData={visitsData} refresh={refresh} />
                        </TabPane>
                        <TabPane tabId="3" id="nav-light-home">
                            <LabInvestigation data={data} refresh={refresh} />
                        </TabPane>
                        <TabPane tabId="4" id="nav-light-home">
                            <OpdTreatmentHistory data={data} refresh={refresh} />
                        </TabPane>
                        <TabPane tabId="5" id="nav-light-home">
                            <AddTimeLine data={data} refresh={refresh} />
                        </TabPane>
                        <TabPane tabId="6" id="nav-light-home">
                            <Vital data={data} refresh={refresh} />
                        </TabPane>
                    </TabContent>
                )
            }
            {/* </CardBody>
            </Card> */}
        </React.Fragment >
    )
}

export default OpdPatientViewContainer