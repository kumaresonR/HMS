
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Form,
    Input,
    Label,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane, FormGroup,
    Button
} from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import classnames from "classnames";
import './smsSettings.css'
 
// import ClickatellForm from './smsSettingsForms/ClickatellForm'
// import SmsGatewayTable from './SmsGatewayTable'; // Assuming you have a new component for SMS settings

import React, { useState, ChangeEvent, FormEvent } from 'react';
import ClickatellForm from "./smsSettingsForms/ClickatellForm";
import TwilioSmsForm from "./smsSettingsForms/TwiloForm";
import Msg91Form from "./smsSettingsForms/Msg91Form";
import TextLocalForm from "./smsSettingsForms/TextLocalForm";
// import TextLocalForm from "./smsSettingsForms/TextLocalForm";
import SmsCountryForm from "./smsSettingsForms/SmsCountryForm";
import MobireachForm from "./smsSettingsForms/MobireachForm";
import NexmoForm from "./smsSettingsForms/NexmoForm";
import BulkSmsForm from "./smsSettingsForms/BulkSmsForm";
import AfricasTalkingForm from "./smsSettingsForms/AfricasTalkingForm";
import CustomSmsForm from "./smsSettingsForms/CustomSmsForm";
import EmailSettingForm from "./smsSettingsForms/EmailSettingForm";



interface FormData {
    username: string;
    password: string;
    apiKey: string;
    status: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    apiKey?: string;
    status?: string;
}





const SMSSetting: React.FC = () => {



    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        apiKey: '',
        status: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.apiKey) newErrors.apiKey = 'API Key is required';
        if (!formData.status) newErrors.status = 'Status is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form from refreshing the page
        if (validateForm()) {
            console.log('Form data:', formData);
            alert('Form submitted successfully!');
            // Add your submission logic here, such as an API call
        }
    };


    const [activeTab, setActiveTab] = useState(1);

    function toggleTab(tab: number) {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    return (
        <React.Fragment>

            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col xl={12} className="p-0">
                        <Card>
                            <CardHeader>
                                <h5 className="mb-0">Payment Settings</h5>
                            </CardHeader>
                            <CardBody>
                                <Form className="form-steps">
                                    <div className="step-arrow-nav mb-4">
                                        <Nav
                                            className="nav-pills custom-nav nav-justified"
                                            role="tablist">
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 1,
                                                    })}
                                                    onClick={() => toggleTab(1)}

                                                >
                                                    Clickatell SMS
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"

                                                    onClick={() => toggleTab(2)}
                                                    className={classnames({
                                                        active: activeTab === 2,
                                                    })}

                                                >
                                                    Twilio SMS
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 3,
                                                    })}

                                                    onClick={() => toggleTab(3)}
                                                >
                                                    MSG91
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 4,
                                                    })}
                                                    onClick={() => toggleTab(4)}

                                                >
                                                    Text Local
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 5,
                                                    })}
                                                    onClick={() => toggleTab(5)}

                                                >
                                                    SMS Country
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 6,
                                                    })}
                                                    onClick={() => toggleTab(6)}

                                                >
                                                    Bulk SMS
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 7,
                                                    })}
                                                    onClick={() => toggleTab(7)}

                                                >
                                                    Mobireach
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 8,
                                                    })}

                                                    onClick={() => toggleTab(8)}
                                                >
                                                    Nexmo
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 9,
                                                    })}
                                                    onClick={() => toggleTab(9)}

                                                >

                                                    AfricasTalking
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({
                                                        active: activeTab === 10,
                                                    })}

                                                    onClick={() => toggleTab(10)}
                                                >
                                                    Custom SMS
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </div>

                                    <TabContent activeTab={activeTab}>

                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={1}>
                                                <ClickatellForm />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={2}>
                                                <TwilioSmsForm />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={3}>
                                                <Msg91Form />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={4}>
                                                <TextLocalForm />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={5}>
                                                <SmsCountryForm />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={6}>
                                                <MobireachForm />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={7}>
                                                <NexmoForm />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={8}>
                                                <BulkSmsForm />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={9}>
                                                <AfricasTalkingForm />
                                            </TabPane>
                                        </TabContent>
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId={10}>
                                                <EmailSettingForm />
                                            </TabPane>
                                        </TabContent>


                                    </TabContent>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </React.Fragment>
    );
};

export default SMSSetting;
