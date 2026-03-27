import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap"

import { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import StaffCardView from './StaffCardView'
import StaffListView from "./StaffListView";
import ErrorHandler from "../../helpers/ErrorHandler";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import Spinner from "../../common/Spinner";
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";
import AppointmentApiService from "../../helpers/services/appointment/appointment-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

const StaffList = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();
    const appointmentApiService: AppointmentApiService = new AppointmentApiService();

    let navigate: any = useNavigate();
    const doctorRef = useRef<any>(null);

    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [doctorOptions, setDoctorOptions] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [doctorId, setDoctorId] = useState('');
    const [role, setRole] = useState('');
    const [roleData, setRoleData] = useState<any>([]);

    const [customActiveTab, setcustomActiveTab] = useState<string>("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };

    const getAllEmployee = async () => {
        try {
            let result = await employeeApiService.getAllEmployee();
            console.log("getAllEmployee", result);
            setEmployeeData(result);
        } catch (error: any) {
            console.log("getAllEmployee Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const handleDoctorSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=&department=&searchTerm=" + query
            let result = await appointmentApiService.searchAllEmployee(url);
            console.log("search result", result);
            setDoctorOptions(result)
        } catch (error) {
            console.log("Doctor search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedDoctorId = (selectedItem: any) => {
        const doctorId = selectedItem?.[0]?.['staffId'];
        // const namePart = doctorId?.split(' (')[0]?.trim(); // "Harry Grant N"
        // const firstName = namePart?.split(/\s+/)[0];
        setDoctorId(doctorId);
    }

    const handleSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (doctorId) params.append('staffId', doctorId);
            if (role) params.append('roleId', role);
            const queryString = params.toString();
            let result = await employeeApiService.searchAllEmployeeByRoleAndName(queryString);
            setEmployeeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllRole = async () => {
        try {
            let result = await employeeApiService.getAllRole();
            console.log("getAllRole", result);
            setRoleData(result);
        } catch (error: any) {
            console.log("getAllRole Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const resetIPD = () => {
        localStorage.removeItem("staffId");
    }

    useEffect(() => {
        resetIPD();
        getAllRole();
        getAllEmployee();
    }, []);

    return <>
        <Container fluid>
            <Row>
                <Col>
                    <Card>
                        <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                            <h4 className="card-title mb-0">Staff List</h4>
                            <div className="d-flex align-items-center">
                                <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN"]}>
                                    <Link to="/main/addEmployee"> <Button color="primary" className="ms-2"> Add Staff </Button></Link>
                                </RoleBasedComponent>
                                <RoleBasedComponent allowedRoles={["ADMIN", "SUPERADMIN", "ACCOUNTANT"]}>
                                    <Link to="/main/staffAttendance"> <Button color="primary" className="ms-2"> Staff Attendance </Button></Link>
                                    <Link to="/main/payroll-list"> <Button color="primary" className="ms-2"> Payroll</Button></Link>
                                </RoleBasedComponent>
                                <Link to="/main/myLeave"> <Button color="primary" className="ms-2"> Leaves</Button></Link>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <Row>
                                {/* <Col>
                                    <input
                                        type="search"
                                        value={doctorId}
                                        placeholder="Search by Patient Id"
                                        onChange={(e: any) => setDoctorId(e.target.value)}
                                        className="form-control"
                                    />
                                </Col> */}
                                <Col>
                                    <AsyncTypeahead
                                        ref={doctorRef}
                                        filterBy={() => true}
                                        id="doctor-id-search-box"
                                        isLoading={isLoading}
                                        labelKey="fullName"
                                        minLength={1}
                                        options={doctorOptions}
                                        onSearch={handleDoctorSearch}
                                        onChange={onSelectedDoctorId}
                                        placeholder="Search by Doctor Name or Id"
                                    />
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Input type="select"
                                            id="role"
                                            value={role}
                                            onChange={e => setRole(e.target.value)}
                                        >
                                            <option value="">Select Role</option>
                                            {roleData.map((item: any, idx: any) => (
                                                <option key={idx} value={item.roleId}>{item.roleName}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col xs="auto">
                                    <Button onClick={handleSearch}>Search</Button>
                                </Col>
                            </Row>
                            {/* <div className="row d-flex justify-content-end">
                                <Col md={6}>
                                    <div className="col-sm-auto">
                                        <div className="input-group">
                                            <Input
                                                type="text"
                                                className="form-control"
                                                id="Search"
                                                placeholder="Search by Staff Id, Name, Role etc..."
                                            />
                                            <span className="input-group-text btn-primary btn">
                                                <i className="ri-search-2-line label-icon align-middle fs-16 ms-2"></i>
                                            </span>
                                        </div>
                                    </div>

                                </Col>
                            </div> */}

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
                                                Card View
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
                                                List View
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </Col>

                            </Row>
                            <TabContent
                                activeTab={customActiveTab}
                                className="text-muted"
                            >
                                <TabPane tabId="1" id="home1">
                                    <StaffCardView data={employeeData} />
                                </TabPane>
                                <TabPane tabId="2">
                                    <StaffListView data={employeeData} />
                                </TabPane>
                            </TabContent>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container >
    </>
}
export default StaffList