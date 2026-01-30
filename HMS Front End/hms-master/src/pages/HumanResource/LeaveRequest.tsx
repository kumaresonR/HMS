import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom'; 
import FormHeader from '../../common/FormHeader/FormHeader';

const LeaveRequest: React.FC = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        employeeName: '', 
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [errors, setErrors] = useState({
        employeeName: '',
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Validate form and set errors if any
    const validateForm = (): boolean => {
        const { employeeName, leaveType, startDate, endDate, reason } = formData;
        let valid = true;
        const newErrors = { employeeName: '', leaveType: '', startDate: '', endDate: '', reason: '' };

        if (!employeeName) {
            newErrors.employeeName = 'Employee Name is required';
            valid = false;
        }

        if (!leaveType) {
            newErrors.leaveType = 'Leave Type is required';
            valid = false;
        }

        if (!startDate) {
            newErrors.startDate = 'Start Date is required';
            valid = false;
        }

        if (!endDate) {
            newErrors.endDate = 'End Date is required';
            valid = false;
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            newErrors.startDate = 'Start Date cannot be later than End Date';
            valid = false;
        }

        if (!reason) {
            newErrors.reason = 'Reason is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const dataToSend = {
                employeeName: formData.employeeName,
                leaveType: formData.leaveType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
            };

            console.log('Sending form data:', dataToSend);

            try {
                const response = await fetch('http://localhost:8087/api/leave-requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend),
                });

                if (!response.ok) {
                    const responseText = await response.text();
                    console.error('Error details:', responseText);
                    throw new Error(responseText);
                }

                const result = await response.json();
                console.log('Leave Request Submitted :', result);
                alert('Leave Request Submitted!');
                navigate('/main/staffList'); // Redirects to /staffList

            } catch (error) {
                console.error('Error submitting leave request:', error);
                alert('Error submitting leave request: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
        } else {
            alert('Please fill out all fields correctly.');
        }
    };

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Apply Leave" pageTitle="Leave" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <div className="form-group mb-2">
                                                    <label htmlFor="employeeName">User Name</label>
                                                    <small className="req"> *</small>
                                                    <input
                                                        id="employeeName"
                                                        name="employeeName"
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.employeeName} onChange={handleChange}
                                                    />
                                                    {errors.employeeName && <small className="text-danger">{errors.employeeName}</small>}
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <div className="form-group mb-2">
                                                    <label htmlFor="leaveType">Leave Type</label>
                                                    <small className="req"> *</small>
                                                    <input
                                                        id="leaveType"
                                                        name="leaveType"
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.leaveType} onChange={handleChange}
                                                    />
                                                    {errors.leaveType && <small className="text-danger">{errors.leaveType}</small>}
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <div className="form-group mb-2">
                                                    <label htmlFor="startDate">Start Date</label>
                                                    <small className="req"> *</small>
                                                    <input
                                                        id="startDate"
                                                        name="startDate"
                                                        type="date"
                                                        className="form-control"
                                                        value={formData.startDate} onChange={handleChange}
                                                    />
                                                    {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <div className="form-group mb-2">
                                                    <label htmlFor="endDate">End Date</label>
                                                    <small className="req"> *</small>
                                                    <input
                                                        id="endDate"
                                                        name="endDate"
                                                        type="date"
                                                        className="form-control"
                                                        value={formData.endDate} onChange={handleChange}
                                                    />
                                                    {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <div className="form-group mb-2">
                                                    <label htmlFor="reason">Reason</label>
                                                    <small className="req"> *</small>
                                                    <input
                                                        id="reason"
                                                        name="reason"
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.reason} onChange={handleChange}
                                                    />
                                                    {errors.reason && <small className="text-danger">{errors.reason}</small>}
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-4">
                                                    <Button color="primary" type="submit">Apply Leave </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default LeaveRequest;
