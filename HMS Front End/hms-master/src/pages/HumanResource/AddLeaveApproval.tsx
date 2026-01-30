import React, { useState,  useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody, } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';

const AddLeaveApproval = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    let navigate: any = useNavigate();

    const [employeeId, setEmployeeId] = useState("1")
    const [leaveType, setLeaveType] = useState('');
    const [leaveTypeValidationError, setLeaveTypeValidationError] = useState(false);
    const [leaveFromDate, setLeaveFromDate] = useState('');
    const [leaveFromDateValidationError, setLeaveFromDateValidationError] = useState(false);
    const [leaveToDate, setLeaveToDate] = useState('');
    const [leaveToDateValidationError, setLeaveToDateValidationError] = useState(false);
    const [reason, setReason] = useState('');
    const [applyDate, setApplyDate] = useState('');
    const [applyDateValidationError, setApplyDateValidationError] = useState(false);
    const [role, setRole] = useState('');
    const [roleData, setRoleData] = useState<any>([]);
    const [roleValidationError, setRoleValidationError] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);
    const [employee, setEmployee] = useState('');
    const [employeeValidationError, setEmployeeValidationError] = useState(false);
    const [leaveData, setLeaveData] = useState<any>([]);

    const handleRoleChange = (value: any) => {
        setRole(value);
        setRoleValidationError(false);
        handleEmployeeSearch(value);
    };

    const handleEmployeeChange = (value: any) => {
        setEmployee(value);
        getAllLeave(value);
        setEmployeeValidationError(false);
    };

    const handleApplyDateChange = (value: any) => {
        setApplyDate(value);
        setApplyDateValidationError(false);
    }

    const handleLeaveTypeChange = (value: any) => {
        setLeaveType(value);
        setLeaveTypeValidationError(false);
    }

    const handleFromDateChange = (value: any) => {
        setLeaveFromDate(value);
        setLeaveFromDateValidationError(false);
    }

    const handleToDateChange = (value: any) => {
        setLeaveToDate(value);
        setLeaveToDateValidationError(false);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            applyLeaveRequest();
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!role) {
            setRoleValidationError(true);
            isFormValid = false;
        }

        if (!employee) {
            setEmployeeValidationError(true);
            isFormValid = false;
        }

        if (!leaveType) {
            setLeaveTypeValidationError(true);
            isFormValid = false;
        }

        if (!leaveFromDate) {
            setLeaveFromDateValidationError(true);
            isFormValid = false;
        }

        if (!leaveToDate) {
            setLeaveToDateValidationError(true);
            isFormValid = false;
        }

        if (!applyDate) {
            setApplyDateValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const applyLeaveRequest = async () => {
        try {
            const payload: any = {
                leaveType: leaveType,
                leaveFromDate: leaveFromDate,
                leaveToDate: leaveToDate,
                reason: reason,
                applyDate: applyDate,
            };
            await employeeApiService.applyLeaveRequest(employee, payload);
            navigate('/main/leaveApproval');
            toast.success('Leave Request Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllRole = async () => {
        try {
            let result = await employeeApiService.getAllRole();
            setRoleData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllLeave = async (id: any) => {
        try {
            let result = await employeeApiService.getAllLeaveByEmployeeId(id);
            setLeaveData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const handleEmployeeSearch = async (value: any) => {
        try {
            let url = "role=" + value
            let result = await employeeApiService.searchAllEmployee(url);
            console.log("search result", result);
            setEmployeeData(result)
        } catch (error) {
            console.log("Doctor search Error");
        }
    }

    useEffect(() => {
        getAllRole();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Add Leave Request" pageTitle="Leave Management" />
                <Card>
                    <CardBody>
                        <div className="text-end mb-3">
                            <Button
                                color="primary"
                                onClick={() => navigate(-1)}
                                className="btn btn-primary add-btn ms-3"
                            >
                                <IoArrowBack /> Back
                            </Button>
                        </div>
                        <Row className="d-flex justify-content-center">
                            <Col xl={12}>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="role">Role</Label>
                                                <Input type="select"
                                                    id="role"
                                                    value={role}
                                                    onChange={e => handleRoleChange(e.target.value)}
                                                    invalid={!!roleValidationError}
                                                >
                                                    <option value="">Select Role</option>
                                                    {roleData.map((item: any, idx: any) => (
                                                        <option key={idx} value={item.roleName}>{item.roleName}</option>
                                                    ))}
                                                </Input>
                                                {roleValidationError && <div className="invalid-feedback">Role Required</div>}
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="Name">Name</Label>
                                                <Input type="select"
                                                    id="Name"
                                                    value={employee}
                                                    onChange={e => handleEmployeeChange(e.target.value)}
                                                    invalid={!!employeeValidationError}
                                                >
                                                    <option value="">Select Name</option>
                                                    {employeeData.map((item: any, idx: any) => (
                                                        <option key={idx} value={item.employeeId}>{item.fullName}</option>
                                                    ))}
                                                </Input>
                                                {employeeValidationError && <div className="invalid-feedback">Name Required</div>}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="applyDate">Apply Date</Label>
                                                <Input
                                                    type="date"
                                                    id="applyDate"
                                                    value={applyDate}
                                                    onChange={e => handleApplyDateChange(e.target.value)}
                                                    invalid={!!applyDateValidationError}
                                                />
                                                {applyDateValidationError && (
                                                    <div className="invalid-feedback">Apply Date Required</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="leaveType">Leave Type</Label>
                                                <Input
                                                    type="select"
                                                    id="leaveType"
                                                    value={leaveType}
                                                    onChange={e => handleLeaveTypeChange(e.target.value)}
                                                    invalid={!!leaveTypeValidationError}
                                                >
                                                    <option value="">Select Leave Type</option>
                                                    {leaveData?.map((item: any, idx: any) => (
                                                        <option key={idx} value={item}>{item}</option>
                                                    ))}
                                                </Input>
                                                {leaveTypeValidationError && (
                                                    <div className="invalid-feedback">Leave Type Required</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="startDate">Leave From Date</Label>
                                                <Input
                                                    type="date"
                                                    id="startDate"
                                                    value={leaveFromDate}
                                                    onChange={e => handleFromDateChange(e.target.value)}
                                                    invalid={!!leaveFromDateValidationError}
                                                />
                                                {leaveFromDateValidationError && (
                                                    <div className="invalid-feedback">Leave From Date Required</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="endDate">Leave To Date</Label>
                                                <Input
                                                    type="date"
                                                    id="endDate"
                                                    value={leaveToDate}
                                                    onChange={e => handleToDateChange(e.target.value)}
                                                    invalid={!!leaveToDateValidationError}
                                                />
                                                {leaveToDateValidationError && (
                                                    <div className="invalid-feedback">Leave To Date Required</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label for="reason">Reason</Label>
                                                <Input
                                                    type="textarea"
                                                    id="reason"
                                                    value={reason}
                                                    onChange={e => setReason(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>

                                    </Row>

                                    <Button color="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default AddLeaveApproval;