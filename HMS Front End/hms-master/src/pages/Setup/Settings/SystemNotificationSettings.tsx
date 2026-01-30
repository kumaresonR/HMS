import React, { useState } from 'react';
import {
    Table,
    Input,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
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
    subject: string;
    options: NotificationOptions;
    staffMessage: string;
    patientMessage: string;
};

const SystemNotificationSettings: React.FC = () => {
    // Initial notification settings with check status for each option
    const [notifications, setNotifications] = useState<NotificationSetting[]>([
        {
            event: 'Appointment Created',
            subject: 'New Appointment Created',
            options: { Email: true, SMS: true, MobileApp: true },
            staffMessage: 'Appointment has been created for Patient: {{patient_name}} ({{patient_id}}). Appointment Date: {{appointment_date}} With Doctor Name: {{doctor_name}}.',
            patientMessage: 'Dear {{patient_name}} ({{patient_id}}) your appointment has been created with Doctor: {{doctor_name}}.'
        },
        {
            event: 'Appointment Approved',
            subject: 'Appointment Status',
            options: { Email: true, SMS: true, MobileApp: true },
            staffMessage: 'Patient: {{patient_name}} ({{patient_id}}) appointment status is {{appointment_status}} with Doctor: {{doctor_name}} Date: {{appointment_date}}.',
            patientMessage: 'Dear {{patient_name}} ({{patient_id}}) your appointment status is {{appointment_status}} Date: {{appointment_date}} with Doctor.'
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
                <h5 className="mb-0">System Notification Setting</h5>
            </CardHeader>
            <CardBody>
                <Table responsive bordered className="table-cell-padding">
                    <thead className="table-light">
                        <tr>
                            <th>Event</th>
                            <th>Subject</th>
                            <th>Option (checkbox)</th>
                            <th>Staff Message</th>
                            <th>Patient Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification, index) => (
                            <tr key={index}>
                                <td>{notification.event}</td>
                                <td>{notification.subject}</td>
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
                                <td>{notification.staffMessage}</td>
                                <td>{notification.patientMessage}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Row>
                    <Col col={12} className='text-end'>
                        <Button color="primary" >Save</Button></Col>

                </Row>
            </CardBody>
        </Card>
    );
};

export default SystemNotificationSettings;
