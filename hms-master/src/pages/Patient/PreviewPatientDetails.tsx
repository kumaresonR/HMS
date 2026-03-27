import moment from "moment";
import { useState } from "react";
import { Col, Container, Row, Table } from "reactstrap";
import CalculateAge from "../../Components/Common/CalculateAge";

const PreviewPatientDetails = (props: any) => {
    const [data, setData] = useState(props.data);

    return <>
        <Container fluid>
            <Row>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Patient Name </label></Col>
                        <Col xs={6}>{data?.patient?.firstName} {data?.patient?.lastName} ({data?.patient?.patientId})</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Guardian Name</label></Col>
                        <Col xs={6}>{data?.patient?.emergencyContacts[0]?.contactName || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Gender</label></Col>
                        <Col xs={6}>{data?.patient?.gender}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Marital Status</label></Col>
                        <Col xs={6}>{data.admissions?.maritalStatus || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Phone</label></Col>
                        <Col xs={6}>{data?.patient?.contactNumber || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Email</label></Col>
                        <Col xs={6}>{data?.patient?.email || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Address</label> </Col>
                        <Col xs={6}>{data.admissions?.address || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Age </label></Col>
                        <Col xs={6}><CalculateAge dateOfBirth={data?.patient?.dateOfBirth} /></Col>
                    </Row>
                </Col>

                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Blood Group	</label></Col>
                        <Col xs={6}>{data.patient?.bloodType || 'NA'}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Symptoms</label></Col>
                        <Col xs={6}>{data.admissions?.symptomsDescription}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Known Allergies	</label></Col>
                        <Col xs={6}>{data.admissions?.knownAllergies}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Admission Date </label> </Col>
                        <Col xs={6}>{moment(data.admissions?.admissionDate).format('DD/MM/YYYY, hh:mm A')}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Case </label></Col>
                        <Col xs={6}>{data.admissions?.caseId}</Col>
                    </Row>
                </Col>

                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Old Patient</label></Col>
                        <Col xs={6}>{data.admissions?.oldPatient  ? "Yes" : "No"}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Casualty</label></Col>
                        <Col xs={6}>{data.admissions?.casualty ? "Yes" : "No"}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Referece</label> </Col>
                        <Col xs={6}>{data.admissions?.reference}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">TPA </label></Col>
                        <Col xs={6}>{data?.patient?.insuranceProviders?.providerName || "NA"}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">TPA ID</label></Col>
                        <Col xs={6}>{data?.patient?.insuranceProviders?.policyNumber || "NA"}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Bed Group</label></Col>
                        <Col xs={6}>{data.bedGroup?.bedGroupName}</Col>
                    </Row>
                </Col>
                
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Bed Number</label></Col>
                        <Col xs={6}>{data.bedGroup?.rooms?.roomNumber}</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Consultant Doctor</label></Col>
                        <Col xs={6}>{data.admissions?.doctor?.firstName} {data.admissions?.doctor?.lastName} ({data.admissions?.doctor?.staffId})</Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col xs={6}><label className="fw-bold">Previous Medical Issue</label> </Col>
                        <Col xs={6}>{data.admissions?.previousMedicalIssue || "NA"}</Col>
                    </Row>
                </Col>
                <Col md={12} className="my-3">
                    <h5>Emergency Contacts:</h5>

                    {data?.patient?.emergencyContacts && data?.patient?.emergencyContacts.length > 0 ? (
                        <div className="table-responsive">
                            <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Relationship</th>
                                        <th>Contact Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.patient?.emergencyContacts.map((contact: any, idx: any) => (
                                        <tr key={idx}>
                                            <td>{contact.contactName}</td>
                                            <td>{contact.relationShip}</td>
                                            <td>{contact.contactNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <p>No emergency contacts available.</p>
                    )}
                </Col>
            </Row>
        </Container >
    </>
}
export default PreviewPatientDetails