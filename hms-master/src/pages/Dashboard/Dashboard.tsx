import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap"
import StorageService from "../../helpers/storage/storage-service";
import Widgets from "./Widgets";
import DashBoardGreetingCard from "./DashBoardGreetingCard";
import { MonthlyIncomeChart } from './MonthlyIncomeChart'
import HospitalScheduleOverview from "./HospitalSheduledOverView";
import IncomeExpenseChart from './IncomeExpenseChart';
import PatientScheduledAppointments from './PatientScheduledAppointments';
import PatientDetails from './PatientDetails';
import RoleBasedComponent from "../../common/RolePermission/RoleBasedComponent";

const Dashboard = () => {
    const [user, setUser] = useState('');
    const [gender, setGender] = useState('');
    const [rightColumn, setRightColumn] = useState<boolean>(false);
    const dataColors = '["#008FFB", "#FF4560"]';

    const toggleRightColumn = () => {
        setRightColumn(!rightColumn);
    };

    useEffect(() => {
        const userData = StorageService.getUserDataFromSessionStorage();
        setUser(userData?.name || '');
        setGender(userData?.gender || '');
    }, []);
    return <>
        <Container fluid>
            <Row>
                <Col>
                    <div className="h-100">
                        <Row>
                            <DashBoardGreetingCard userName={user} gender={gender} />
                        </Row>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "ACCOUNTANT"]}>
                            <Row>
                                <Widgets />
                            </Row>
                        </RoleBasedComponent>
                        <Row>
                            <Col xl={8}>
                                <PatientScheduledAppointments />
                            </Col>

                            <Col xl={4}>
                                <HospitalScheduleOverview />
                            </Col>
                        </Row>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR"]}>
                            <Row>
                                <Col xl={12}>
                                    <PatientDetails />
                                </Col>
                            </Row>
                        </RoleBasedComponent>
                        <RoleBasedComponent allowedRoles={["SUPERADMIN", "ADMIN", "ACCOUNTANT"]}>
                            <Row>
                                <Col xl={8}>
                                    <IncomeExpenseChart dataColors='["--vz-danger", "--vz-primary", "--vz-success"]' />
                                </Col>
                                <Col xl={4}>
                                    <MonthlyIncomeChart chartId="monthly-income-chart" />
                                </Col>
                            </Row>
                        </RoleBasedComponent>
                    </div>
                </Col>
            </Row>
        </Container>
    </>
}
export default Dashboard