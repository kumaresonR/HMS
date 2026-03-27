import React, { useState } from "react";

import {
    Card,
    CardBody,
    Col,
    Container,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
} from "reactstrap";
import classnames from "classnames";
 
import GeneralSettings from '../Settings/GeneralSettings';
import AttendanceSetting from '../Settings/AttendanceSetting';
import NotificationSettings from '../Settings/NotificationSettings';
import SystemNotificationSettings from '../Settings/SystemNotificationSettings';
import SMSSetting from '../Settings/SMSSetting';
import EmailSettingForm from '../Settings/EmailSettings';
import PaymentSettings from '../Settings/PaymentSettings';
import FrontCMSSetting from '../Settings/FrontCMSSetting';
import PrefixSetting from '../Settings/PrefixSetting';
import RolesMain from '../Settings/RolesPermission/RolesMain';
import BackupHistory from '../Settings/BackupHistory';
import LanguageList from '../Settings/LanguageList';
import UsersMain from '../Settings/Users/UsersMain';
import CaptchaList from '../Settings/CaptchaSettings';
import Modules from '../Settings/Modules/ModulesMain';
import SystemUpdate from '../Settings/SystemUpdate';
import FormHeader from "../../../common/FormHeader/FormHeader";

const SettingsMain = () => {
    const [activeVerticalTab, setactiveVerticalTab] = useState(1);
    const [passedverticalSteps, setPassedverticalSteps] = useState([1]);

    function toggleVerticalTab(tab: any) {
        if (activeVerticalTab !== tab) {
            const modifiedSteps = [...passedverticalSteps, tab];
            setactiveVerticalTab(tab);
            setPassedverticalSteps(modifiedSteps);
        }
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Form submitted!");
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Setup" pageTitle="General Settings" />

                    <Col xl={12}>
                        <form className="vertical-navs-step form-steps" onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={3}>
                                    <Card>
                                        <CardBody>
                                            <Nav className="flex-column custom-nav nav-pills">
                                                {[
                                                    { id: 1, label: "General Setting" },
                                                    { id: 2, label: "Attendance Setting" },
                                                    { id: 3, label: "Notification Setting" },
                                                    { id: 4, label: "System Notification " },
                                                    { id: 5, label: "SMS Setting" },
                                                    { id: 6, label: "Email Setting" },
                                                    { id: 7, label: "Payment Setting" },
                                                    { id: 8, label: "Front CMS Setting" },
                                                    { id: 9, label: "Prefix Setting" },
                                                    { id: 10, label: "Roles Permission" },
                                                    { id: 11, label: "Backup/Restore" },
                                                    { id: 12, label: "Languages" },
                                                    { id: 13, label: "Users" },
                                                    { id: 14, label: "Captcha Settings" },
                                                    { id: 15, label: "Modules" },
                                                    { id: 16, label: "System Update" },
                                                ].map((tab) => (
                                                    <NavItem key={tab.id}>
                                                        <NavLink
                                                            href="#"
                                                            className={classnames({
                                                                active: activeVerticalTab === tab.id
                                                            })}
                                                            onClick={() => toggleVerticalTab(tab.id)}
                                                        >
                                                            {tab.label}
                                                        </NavLink>
                                                    </NavItem>
                                                ))}
                                            </Nav>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col xl={9}>
                                    <div className="">
                                        <TabContent activeTab={activeVerticalTab}>
                                            <TabPane tabId={1}>
                                                <GeneralSettings />
                                            </TabPane>
                                            <TabPane tabId={2}>
                                                <AttendanceSetting />
                                            </TabPane>
                                            <TabPane tabId={3}>
                                                <NotificationSettings />
                                            </TabPane>
                                            <TabPane tabId={4}>
                                                <SystemNotificationSettings />
                                            </TabPane>
                                            <TabPane tabId={5}>
                                                <SMSSetting />
                                            </TabPane>
                                            <TabPane tabId={6}>
                                                <EmailSettingForm />
                                            </TabPane>
                                            <TabPane tabId={7}>
                                                <PaymentSettings />
                                            </TabPane>
                                            <TabPane tabId={8}>
                                                <FrontCMSSetting />
                                            </TabPane>
                                            <TabPane tabId={9}>
                                                <PrefixSetting />
                                            </TabPane>
                                            <TabPane tabId={10}>
                                                <RolesMain />
                                            </TabPane>
                                            <TabPane tabId={11}>
                                                <BackupHistory />
                                            </TabPane>
                                            <TabPane tabId={12}>
                                                <LanguageList />
                                            </TabPane>
                                            <TabPane tabId={13}>
                                                <UsersMain />
                                            </TabPane>
                                            <TabPane tabId={14}>
                                                <CaptchaList />
                                            </TabPane>
                                            <TabPane tabId={15}>
                                                <Modules />
                                            </TabPane>
                                            <TabPane tabId={16}>
                                                <SystemUpdate />
                                            </TabPane>

                                        </TabContent>
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default SettingsMain;
