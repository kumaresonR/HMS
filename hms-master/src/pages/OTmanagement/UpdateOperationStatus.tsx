import moment from 'moment'
import { useState } from 'react'
import { Badge, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap'
import ErrorHandler from '../../helpers/ErrorHandler'
import OTManagementApiService from '../../helpers/services/otManagement/ot-management-api-service'
import { toast } from 'react-toastify'
const statusData = [
    {
        name: "Pending",
    },
    {
        name: "Completed",
    },
    {
        name: "Cancelled",
    }
]
const UpdateOperationStatus = (props: any) => {
    const otManagementApiService: OTManagementApiService = new OTManagementApiService();

    const [status, setStatus] = useState(props.data.status);

    const handleStatusChange = (data: any) => {
        const isConfirmed = window.confirm(`Are you sure you want to change the status to ${data}?`);
        if (isConfirmed) {
            setStatus(data);
            updateStatus(data);
        }
    }

    const updateStatus = async (data:any) => {
        try {
            let baseUrl = props.tabId === "1" ? "update-ipd-status" : "update-opd-status";
            let url = `${baseUrl}/${props.data.operationId}?status=${data}`;
            await otManagementApiService.updateStatus(url)
            toast.success('Status Has Updated Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }
    return <>
        <Container fluid>
            <Row>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Reference No </label></Col>
                        <Col xs={6}>{props?.data?.otReferenceNo}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Operation Name</label></Col>
                        <Col xs={6}>{props?.data?.operationName}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Date</label></Col>
                        <Col xs={6}>{moment(props?.data?.operationDate).format('DD/MM/YYYY hh:mm A')}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Operation Category</label></Col>
                        <Col xs={6}>{props?.data?.operationCategory}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Consultant Doctor</label></Col>
                        <Col xs={6}>{props?.data?.doctor?.firstName} {props?.data?.doctor?.lastName} ({props?.data?.doctor?.staffId})</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Assistant Consultant 1</label>	</Col>
                        <Col xs={6}>{props?.data?.assistantConsultant1}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Assistant Consultant 2</label> </Col>
                        <Col xs={6}>{props?.data?.assistantConsultant2}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Anesthetist </label></Col>
                        <Col xs={6}>{props?.data?.anesthetist}</Col>
                    </Row>
                </Col>

                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Anaethesia Type </label></Col>
                        <Col xs={6}>{props?.data?.anesthesiaType}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">OT Technician </label></Col>
                        <Col xs={6}>{props?.data?.otTechnician || props?.data?.ottechnician}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">OT Assistant </label></Col>
                        <Col xs={6}>{props?.data?.OtAssistant || props?.data?.otassistant}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Remark </label> </Col>
                        <Col xs={6}>{props?.data?.remark}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Result </label></Col>
                        <Col xs={6}>{props?.data?.result}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Status </label></Col>
                        <Col>
                            <UncontrolledDropdown className='w-100'>
                                <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                    <span style={{ textTransform: "capitalize" }}>
                                        <Badge className='py-2'>{status} <i className="mdi mdi-chevron-down ms-1"></i></Badge>
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-start">
                                    {statusData.map((item: any, idx: any) => (
                                        <DropdownItem key={idx} onClick={() => handleStatusChange(item.name)}>{item.name}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container >
    </>
}

export default UpdateOperationStatus