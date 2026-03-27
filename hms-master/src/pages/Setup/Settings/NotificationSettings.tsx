import React, { useState } from 'react';
import {
    Table, Input, Button, Card,
    CardBody,
    CardHeader,
    Row,
    Col,
} from 'reactstrap';
import './settings.css'; // Import your CSS file here

// Define types for notification options and notification settings
type NotificationOptions = {
    Email: boolean;
    SMS: boolean;
    MobileApp: boolean;
};

type NotificationSetting = {
    event: string;
    options: NotificationOptions;
    templateId: string;
    sampleMessage: string;
};

const NotificationSettings: React.FC = () => {
    // Initial notification settings with check status for each option
    const [notifications, setNotifications] = useState<NotificationSetting[]>([
        {
            event: 'OPD Patient Registration',
            options: { Email: false, SMS: false, MobileApp: false },
            templateId: 'OPD-01',
            sampleMessage: 'Dear {patient_name}, your OPD Registration is successful.'
        },
        {
            event: 'IPD Patient Registration',
            options: { Email: false, SMS: false, MobileApp: false },
            templateId: 'IPD-01',
            sampleMessage: 'Dear {patient_name}, your IPD Registration is successful.'
        },
        {
            event: 'IPD Patient Discharge',
            options: { Email: false, SMS: false, MobileApp: false },
            templateId: 'IPD-02',
            sampleMessage: 'IPD Patient {patient_name} is now discharged.'
        },
        {
            event: 'Login Credential',
            options: { Email: false, SMS: false, MobileApp: false },
            templateId: 'LOG-01',
            sampleMessage: 'Hello {display_name}, your login details are as follows.'
        },
        {
            event: 'Appointment Approved',
            options: { Email: false, SMS: false, MobileApp: false },
            templateId: 'APP-01',
            sampleMessage: 'Dear {patient_name}, your appointment is confirmed.'
        }
    ]);

    // Toggle checkbox state for a specific option in a specific notification
    const handleCheckboxChange = (index: number, option: keyof NotificationOptions) => {
        setNotifications((prevNotifications) => {
            const updatedNotifications = [...prevNotifications];
            updatedNotifications[index] = {
                ...updatedNotifications[index],
                options: {
                    ...updatedNotifications[index].options,
                    [option]: !updatedNotifications[index].options[option]
                }
            };
            return updatedNotifications;
        });
    };

    return (


        <Card>
            <CardHeader>
                <h5 className="mb-0"> Notification Setting</h5>

            </CardHeader>


            <CardBody>

                <h4></h4>

                <Table bordered responsive className="table-cell-padding">
                    <thead className="table-light">
                        <tr>
                            <th>Event</th>
                            <th>Option</th>
                            <th>Template Id</th>
                            <th>Sample Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification, index) => (
                            <tr key={index}>
                                <td>{notification.event}</td>
                                <td>
                                    <div className="d-flex align-items-center justify-content-start">
                                        <Input
                                            type="checkbox"
                                            checked={notification.options.Email}
                                            onChange={() => handleCheckboxChange(index, 'Email')}
                                            className=" me-2"
                                        /> Email
                                        <Input
                                            type="checkbox"
                                            checked={notification.options.SMS}
                                            onChange={() => handleCheckboxChange(index, 'SMS')}
                                            className="ms-3 me-2"
                                        /> SMS
                                        <Input
                                            type="checkbox"
                                            checked={notification.options.MobileApp}
                                            onChange={() => handleCheckboxChange(index, 'MobileApp')}
                                            className="ms-3 me-2"
                                        /> Mobile App
                                    </div>
                                </td>
                                <td>{notification.templateId}</td>
                                <td>{notification.sampleMessage}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Row>
                    <Col col={12} className='text-end'>                     <Button color="primary" >Save</Button></Col>

                </Row>


            </CardBody>
        </Card>
    );
};

export default NotificationSettings;
