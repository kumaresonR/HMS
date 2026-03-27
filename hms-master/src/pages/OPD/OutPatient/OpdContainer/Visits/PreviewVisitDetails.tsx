import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "reactstrap"
import CalculateAge from "../../../../../Components/Common/CalculateAge";

const PreviewVisitDetails = (props: any) => {
    const [data, setData] = useState(props.data);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Container fluid>
            <Row>
                <Table >
                    <tbody>
                        <tr>
                            <td>OPD No</td>
                            <td>{data.admissions?.ipdId || data.opdId || data.admissions?.opdId}</td>
                        </tr>
                        <tr>
                            <td>Old Patient</td>
                            <td>{data.admissions?.oldPatient ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td>Patient Name</td>
                            <td className="text-primary">{data?.patient?.firstName} {data?.patient?.lastName} ({data?.patient?.patientId})</td>
                        </tr>
                        <tr>
                            <td>Guardian Name</td>
                            <td>{data?.patient?.emergencyContacts[0]?.contactName || 'NA'}</td>
                        </tr>
                        <tr>
                            <td>Gender</td>
                            <td>{data?.patient?.gender}</td>
                        </tr>
                        {/* <tr>
                            <td>Marital Status</td>
                            <td>{data.admissions?.maritalStatus || 'NA'}</td>
                        </tr> */}
                        <tr>
                            <td>Phone</td>
                            <td className="text-primary">{data?.patient?.contactNumber || 'NA'}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>{data?.patient?.email || 'NA'}</td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>{data.patient?.address || 'NA'}</td>
                        </tr>
                        <tr>
                            <td>Age</td>
                            <td><CalculateAge dateOfBirth={data?.patient?.dateOfBirth} /></td>
                        </tr>
                        <tr>
                            <td>Blood Group</td>
                            <td className="text-danger">{data.patient?.bloodType || 'NA'}</td>
                        </tr>
                        <tr>
                            <td>Known Allergies</td>
                            <td>{data.admissions?.anyKnownAllergies || data.admissions?.knownAllergies || data?.anyKnownAllergies || 'NA'}</td>
                        </tr>
                        <tr>
                            <td>Appointment Date</td>
                            <td className="text-primary">{moment(data.admissions?.appointmentDate).format('DD/MM/YYYY, hh:mm A')}</td>
                        </tr>
                        <tr>
                            <td>Case</td>
                            <td>{data.admissions?.caseId || data?.caseId}</td>
                        </tr>
                        <tr>
                            <td>Casualty</td>
                            <td>{data.admissions?.casualty ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td>Reference</td>
                            <td>{data.admissions?.reference || data.reference || 'NA'}</td>
                        </tr>
                        <tr>
                            <td>TPA</td>
                            <td>{data?.patient?.insuranceProviders?.providerName || "NA"}</td>
                        </tr>
                        <tr>
                            <td>Consultant Doctor</td>

                            <td>
                                {data.admissions?.doctor
                                    ? `${data?.admissions?.doctor?.firstName} ${data?.admissions?.doctor?.lastName} (${data?.admissions?.doctor?.staffId})`
                                    : `${data?.doctor?.firstName} ${data?.doctor?.lastName} (${data?.doctor?.staffId})`
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>Note</td>
                            <td>{data.admissions?.note || data.note || 'NA'}</td>
                        </tr>
                        <tr>
                            <td>Symptoms</td>
                            <td className="text-primary">{data.admissions?.symptomsDescription || data?.symptomsDescription || 'NA'}</td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
        </Container >
    </>
}
export default PreviewVisitDetails