import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import ErrorHandler from '../../helpers/ErrorHandler';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';
import StorageService from '../../helpers/storage/storage-service';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import { useDispatch } from 'react-redux';

const AddLeave = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [employeeId, setEmployeeId] = useState("")
    const [leaveType, setLeaveType] = useState('');
    const [leaveTypeValidationError, setLeaveTypeValidationError] = useState(false);
    const [leaveFromDate, setLeaveFromDate] = useState('');
    const [leaveFromDateValidationError, setLeaveFromDateValidationError] = useState(false);
    const [leaveToDate, setLeaveToDate] = useState('');
    const [leaveToDateValidationError, setLeaveToDateValidationError] = useState(false);
    const [roleData, setRoleData] = useState<any>([]);
    const [reason, setReason] = useState('');
    const [applyDate, setApplyDate] = useState('');
    const [applyDateValidationError, setApplyDateValidationError] = useState(false);
    const [leaveData, setLeaveData] = useState<any>([]);
    const data = {
        leaveType, leaveFromDate, leaveToDate, reason, applyDate
    }

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
            await employeeApiService.applyLeaveRequest(employeeId, payload);
            navigate('/main/myLeave');
            toast.success('Leave Request Added Successfully', { containerId: 'TR' });
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

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setEmployeeId(user.user_id);
        if (user.user_id) {
            getAllLeave(user.user_id);
        }
    }, []);

    useEffect(() => {
        if (location?.state) {
            setLeaveType(location?.state?.leaveType);
            setLeaveFromDate(location?.state?.leaveFromDate);
            setLeaveToDate(location?.state?.leaveToDate);
            setReason(location?.state?.reason);
            setApplyDate(location?.state?.applyDate);
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Add Leave"
                    pageTitle="Leave Management"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Add Leave",
                        data
                    }))} />
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
                                                    <option value="LOP">LOP</option>
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

export default AddLeave 