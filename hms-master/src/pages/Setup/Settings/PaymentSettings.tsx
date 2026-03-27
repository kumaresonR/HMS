import {
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
import './smsSettings.css'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import PaypalForm from "./PaymentMethodsForms/PayPalForm";
import StripeForm from "./PaymentMethodsForms/StripeForm";
import PayUForm from "./PaymentMethodsForms/PayUForm";
import CCAvenueForm from "./PaymentMethodsForms/CCAvenueForm";
import InstaMojoForm from "./PaymentMethodsForms/InstaMojoForm";
import PaystackForm from "./PaymentMethodsForms/PayStackForm";
import RazorpayForm from "./PaymentMethodsForms/RazorpayForm";
import PaytmForm from "./PaymentMethodsForms/PaytmForm";
import MidtransForm from "./PaymentMethodsForms/MidtransForm";
import PesapalForm from "./PaymentMethodsForms/PesapalForm";
import FlutterwaveForm from "./PaymentMethodsForms/FlutterWaveForm";
import PaymentMethod from "./PaymentMethodsForms/PaymentMethod";

const PaymentSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState(1);

    const toggleTab = (tab: number) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

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
                                        <Nav className="nav-pills custom-nav nav-justified" role="tablist">
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 1 })}
                                                    onClick={() => toggleTab(1)}
                                                >
                                                    PayPal
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 2 })}
                                                    onClick={() => toggleTab(2)}
                                                >
                                                    Stripe
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 3 })}
                                                    onClick={() => toggleTab(3)}
                                                >
                                                    PayU
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 4 })}
                                                    onClick={() => toggleTab(4)}
                                                >
                                                    CCAvenue
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 5 })}
                                                    onClick={() => toggleTab(5)}
                                                >
                                                    InstaMojo
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 6 })}
                                                    onClick={() => toggleTab(6)}
                                                >
                                                    Paystack
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 7 })}
                                                    onClick={() => toggleTab(7)}
                                                >
                                                    Razorpay
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 8 })}
                                                    onClick={() => toggleTab(8)}
                                                >
                                                    Paytm
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 9 })}
                                                    onClick={() => toggleTab(9)}
                                                >
                                                    Midtrans
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 10 })}
                                                    onClick={() => toggleTab(10)}
                                                >
                                                    Pesapal
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    href="#"
                                                    className={classnames({ active: activeTab === 11 })}
                                                    onClick={() => toggleTab(11)}
                                                >
                                                    Flutterwave
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </div>

                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId={1}>
                                            <PaypalForm />
                                        </TabPane>
                                        <TabPane tabId={2}>
                                            <StripeForm />
                                        </TabPane>
                                        <TabPane tabId={3}>
                                            <PayUForm />
                                        </TabPane>
                                        <TabPane tabId={4}>
                                            <CCAvenueForm />
                                        </TabPane>
                                        <TabPane tabId={5}>
                                            <InstaMojoForm />
                                        </TabPane>
                                        <TabPane tabId={6}>
                                            <PaystackForm />
                                        </TabPane>
                                        <TabPane tabId={7}>
                                            <RazorpayForm />
                                        </TabPane>
                                        <TabPane tabId={8}>
                                            <PaytmForm />
                                        </TabPane>
                                        <TabPane tabId={9}>
                                            <MidtransForm />
                                        </TabPane>
                                        <TabPane tabId={10}>
                                            <PesapalForm />
                                        </TabPane>
                                        <TabPane tabId={11}>
                                            <FlutterwaveForm />
                                        </TabPane>
                                    </TabContent>
                                    <PaymentMethod />

                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default PaymentSettings;
