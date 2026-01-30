import moment from 'moment';
import React from 'react'
import { Col, Row } from 'reactstrap';

const PreviewLeaveReques = (props: any) => {
    const data: any = props.data;

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Row className='mb-3'>
                        <Col><h6>Name</h6></Col>
                        <Col>
                            {data?.employeeDetails?.firstName && data?.employeeDetails?.lastName && data?.employeeDetails?.staffId
                                ? `${data.employeeDetails.firstName} ${data.employeeDetails.lastName} (${data.employeeDetails.staffId})`
                                : data?.employeeName}
                        </Col>
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
                        <Col>{data?.leaveDays || data?.duration}</Col>
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
            </Row>
        </React.Fragment>
    )
}

export default PreviewLeaveReques