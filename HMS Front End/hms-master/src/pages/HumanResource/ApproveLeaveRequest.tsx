import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import ErrorHandler from '../../helpers/ErrorHandler'
import { toast } from 'react-toastify'
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService'
import StorageService from '../../helpers/storage/storage-service'

const statusData = [
    {
        type: "PENDING"
    },
    {
        type: "APPROVED"
    },
    {
        type: "DISAPPROVED"
    }
]
const ApproveLeaveRequest = (props: any) => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    const data: any = props.data;
    const [role,setRole] = useState('');

    const [status, setStatus] = useState(data.status);

    const handleStatusChange = (value: any) => {
        setStatus(value);
    };

    const updateLeaveRequest = async () => {
        try {
            let url = "?departmentHeadId=" +role +"&status=" + status
            const payload: any = {
                leaveType: data.leaveType,
                leaveFromDate: data.leaveFromDate,
                leaveToDate: data.leaveToDate,
                reason: data.reason,
                applyDate: data.applyDate,
                status: status,
            };
            await employeeApiService.approveLeaveRequest(data.leaveRequestId, url, payload);
            props.handleClose();
            toast.success('Leave Request Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setRole(user.user_id);
    }, []);

    return (
        <React.Fragment>
            <Container>
                <Row>
                    <Col>
                        <Row className='mb-3'>
                            <Col><h6>Name</h6></Col>
                            <Col>{data?.employeeDetails?.firstName} {data?.employeeDetails?.lastName} ({data?.employeeDetails?.staffId}) </Col>
                        </Row>
                        {/* <Row className='mb-3'>
                            <Col>Submitted By</Col>
                            <Col>Super Admin (9001)</Col>
                        </Row> */}
                        <Row className='mb-3'>
                            <Col>Leave</Col>
                            <Col>{moment(data?.leaveFromDate).format("DD/MM/YYYY")} {moment(data?.leaveToDate).format("DD/MM/YYYY")} </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col>Leave Days</Col>
                            <Col>{data?.leaveDays}</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row className='mb-3'>
                            <Col>Leave Type	</Col>
                            <Col>{data.leaveType}</Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col>Apply Date</Col>
                            <Col>{moment(data.applyDate).format("DD/MM/YYYY")}</Col>
                        </Row>
                       
                        <Row className='mb-3'>
                            <Col>Reason</Col>
                            <Col>{data.reason || 'NA'}</Col>
                        </Row>
                    </Col>
                    <Row className='mb-3'>
                        <Col md={3}>Status</Col>
                        <Col>
                            <Form>
                                <FormGroup className="d-flex align-items-center gap-3">
                                    {statusData.map((item, index) => (
                                        <FormGroup check key={index} className="d-flex align-items-center">
                                            <Input
                                                type="radio"
                                                name="status"
                                                value={item.type}
                                                checked={status === item.type}
                                                onChange={e => handleStatusChange(e.target.value)}
                                            />
                                            <Label check className="ms-2">
                                                {item.type}
                                            </Label>
                                        </FormGroup>
                                    ))}
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='text-end'><Button onClick={updateLeaveRequest}>Save</Button></Col>
                    </Row>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default ApproveLeaveRequest