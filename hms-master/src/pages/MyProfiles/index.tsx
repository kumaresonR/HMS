import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import classnames from "classnames";

import Profile from "./ProfileInformation";
import Payroll from "./PayRollInfo"
import Leaves from "./Leaves";
import StaffAttendance from "./StaffAttendanceInfo";
import StaffDetails from './StaffDetails'
import FormHeader from "../../common/FormHeader/FormHeader";

import './myProfile.css'
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import ErrorHandler from "../../helpers/ErrorHandler";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import MyDocuments from "./MyDocuments";
import AddStaffTimeLine from "./StaffTimeLine/AddStaffTimeLine";
import SetupApiService from "../../helpers/services/setup/setup-api-service";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
const MyProfiles = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();
    const setupApiService: SetupApiService = new SetupApiService();
    const dispatch = useDispatch();
    const location = useLocation();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const storedId = localStorage.getItem("staffId");
    const id = state?.id || storedId;

    const title = state?.title
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState(1);
    const [steps, setSteps] = useState([1]);
    const [payrollData, setPayrollData] = useState<any>();

    function toggleTab(tab: any) {
        if (activeTab !== tab) {
            const updatedSteps = [...steps, tab];
            setActiveTab(tab);
            setSteps(updatedSteps);
        }
    }

    const [data, setData] = useState<any>('');

    const getEmployeeById = async () => {
        try {
            setLoading(true);
            if (title === "tw") {
                let result = await setupApiService.getEmployeeById(id);
                console.log("getAllPayroll", result);
                setData(result);
            } else {
                let result = await employeeApiService.getEmployeeById(id);
                console.log("getAllPayroll", result);
                setData(result);
            }
        } catch (error: any) {
            return ErrorHandler(error)
        } finally {
            setLoading(false);
        }
    }

    const getPayrollSummaryByEmployeeId = async () => {
        try {
            let result = await employeeApiService.getPayrollSummaryByEmployeeId(id);
            console.log("getAllPayroll", result);
            setPayrollData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (id) {
            localStorage.setItem("staffId", id);
            getEmployeeById();
            getPayrollSummaryByEmployeeId();
        }
    }, [id]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="My Profile"
                        pageTitle="Profile Overview"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "My Profile",
                        }))} />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardBody className="myProfileMainContainer">
                                    <div className="text-end">
                                        <Button
                                            color="primary"
                                            onClick={() => navigate(-1)}
                                            className="btn btn-primary add-btn mx-2"
                                        >
                                            <IoArrowBack /> Back
                                        </Button>
                                    </div>
                                    <StaffDetails data={data} />
                                    <Form className="form-steps profileBottomContent">

                                        <div className="step-arrow-nav mb-4">
                                            <Nav
                                                className="nav-pills custom-nav nav-justified"
                                                role="tablist"
                                            >
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="profile-tab"
                                                        className={classnames({
                                                            active: activeTab === 1,
                                                            done: activeTab <= 1,
                                                        })}
                                                        onClick={() => {
                                                            toggleTab(1);
                                                        }}
                                                    >
                                                        Profile
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="payroll-tab"
                                                        className={classnames({
                                                            active: activeTab === 2,
                                                            done: activeTab <= 2,
                                                        })}
                                                        onClick={() => {
                                                            toggleTab(2);
                                                        }}
                                                    >
                                                        Payroll
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="leaves-tab"
                                                        className={classnames({
                                                            active: activeTab === 3,
                                                            done: activeTab <= 3,
                                                        })}
                                                        onClick={() => {
                                                            toggleTab(3);
                                                        }}
                                                    >
                                                        Leaves
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="attendance-tab"
                                                        className={classnames({
                                                            active: activeTab === 4,
                                                            done: activeTab <= 4,
                                                        })}
                                                        onClick={() => {
                                                            toggleTab(4);
                                                        }}
                                                    >
                                                        Staff Attendance
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        href="#"
                                                        id="documents-tab"
                                                        className={classnames({
                                                            active: activeTab === 5,
                                                            done: activeTab <= 5,
                                                        })}
                                                        onClick={() => {
                                                            toggleTab(5);
                                                        }}
                                                    >
                                                        Documents
                                                    </NavLink>
                                                </NavItem>
                                                {title !== "tw" && (
                                                    <NavItem>
                                                        <NavLink
                                                            href="#"
                                                            id="timeline-tab"
                                                            className={classnames({
                                                                active: activeTab === 6,
                                                                done: activeTab <= 6,
                                                            })}
                                                            onClick={() => {
                                                                toggleTab(6);
                                                            }}
                                                        >
                                                            Timeline
                                                        </NavLink>
                                                    </NavItem>
                                                )}
                                            </Nav>
                                        </div>

                                        <TabContent activeTab={activeTab}>
                                            <TabPane id="profile-tab-content" tabId={1}>
                                                <Profile data={data} />
                                            </TabPane>

                                            <TabPane id="payroll-tab-content" tabId={2}>
                                                <Payroll data={data} payrollData={payrollData} />
                                            </TabPane>

                                            <TabPane id="leaves-tab-content" tabId={3}>
                                                <Leaves data={data} />
                                            </TabPane>

                                            <TabPane id="attendance-tab-content" tabId={4}>
                                                <StaffAttendance data={data} />
                                            </TabPane>

                                            <TabPane id="documents-tab-content" tabId={5}>
                                                <MyDocuments data={data} />
                                            </TabPane>

                                            <TabPane id="timeline-tab-content" tabId={6}>
                                                <AddStaffTimeLine data={data} refresh={getEmployeeById} />
                                            </TabPane>
                                        </TabContent>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default MyProfiles;
