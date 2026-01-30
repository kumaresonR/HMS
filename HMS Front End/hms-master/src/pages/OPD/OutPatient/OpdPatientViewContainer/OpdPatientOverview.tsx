import React, { useEffect, useState } from "react";
import { Badge, Card, CardBody, Col, Container, ModalBody, Row } from "reactstrap";
import ConsultantDoctor from "../../../IPD/InPatient/IpdContainer/ConsultantDoctor";
import TimeLine from "../../../IPD/InPatient/IpdContainer/TimeLine/TimeLine";
import VisitDataTable from "../OpdContainer/Visits/VisitDatatable";
import LabInvestigationDataTable from "../../../IPD/InPatient/IpdContainer/LabInvestigation/LabInvestigationDataTable";
import MedicalHistoryChart from "./MedicalHistoryChart";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import moment from "moment";
import OPDApiService from "../../../../helpers/services/opd/opd-api-service";
import CalculateAge from "../../../../Components/Common/CalculateAge";
import myProfile from '../../../../assets/images/profileDummy.png'

const OpdPatientOverview = (props: any) => {
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState<any>(props.data || {});
    console.log("props", props.data)
    const [medicalHistory, setMedicalHistory] = useState<any>({});

    const getMedicineHistoryById = async () => {
        try {
            let data = await opdApiService.getMedicineHistoryById(props.data?.admissions?.patientId);
            setMedicalHistory(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMedicineHistoryById();
    }, []);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col lg={12} className="border-end">
                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between flex-wrap">
                                    <h4>{data?.patient?.firstName} {data?.patient?.lastName} ({data?.patient?.patientId})</h4>
                                </div>
                                <Row className="py-2">
                                    <Col md="auto">
                                        <img src={myProfile} alt="user" width={200} className="rounded" />
                                    </Col>
                                    <Col>
                                        <Row>
                                            <div className="d-flex justify-content-between mb-1">
                                                <h6 className="col-5">Gender</h6>
                                                <p className="col-7">{data?.patient?.gender}</p>
                                            </div>
                                            <div className="d-flex justify-content-between mb-1">
                                                <h6 className="col-5">Age</h6>
                                                <p className="col-7">
                                                    <CalculateAge dateOfBirth={data?.patient?.dateOfBirth} />
                                                </p>
                                            </div>


                                            <div className="d-flex justify-content-between mb-1">
                                                <h6 className="col-5">Guardian Name</h6>
                                                <p className="col-7">{data?.patient?.gaudianName || 'NA'} </p>
                                            </div>
                                            <div className="d-flex justify-content-between mb-1">
                                                <h6 className="col-5">Phone</h6>
                                                <p className="col-7">{data?.patient?.contactNumber}</p>
                                            </div>
                                            <div className="d-flex justify-content-between mb-1">
                                                <h6 className="col-5 d-flex align-items-center">Barcode</h6>
                                                <div className="col-7 barcode">
                                                    <Barcode value={data?.admissions?.opdId || ''} height={20} />
                                                </div>
                                            </div>
                                        </Row>

                                    </Col>
                                    <Col >

                                        <div className="d-flex justify-content-between mb-1">
                                            <h6 className="col-5">TPA</h6>
                                            <p className="col-7">{data?.patient?.insuranceProviders?.providerName || "NA"}</p>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <h6 className="col-5">TPA ID</h6>
                                            <p className="col-7">{data?.patient?.insuranceProviders?.policyNumber || "NA"}</p>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <h6 className="col-5">TPA Validity</h6>
                                            <p className="col-7">{data?.patient?.insuranceValidity || "NA"}</p>
                                        </div>

                                        {data?.patient?.emergencyContacts?.map((item: any, idx: any) => (
                                            <div className="row d-flex justify-content-between mb-1" key={idx}>
                                                <h6 className="col-5 text-start">Guardian Name</h6>
                                                <p className="col-7 px-0 ">{item.contactName} ({item.relationShip}) - {item.contactNumber}</p>
                                            </div>
                                        ))}

                                        <div className="d-flex justify-content-between mb-1">
                                            <h6 className="col-5 d-flex align-items-center">QR Code</h6>
                                            <div className="col-7" >
                                                <QRCode value={data?.admissions?.caseId || ''} size={35} />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                        <Row>
                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            {/* <div className="row">
                                                <h6 className="col-6"><b>Case Id</b></h6>
                                                <p className="col-6 text-end">{data?.admissions?.caseId}</p>
                                            </div> */}

                                            <div className="row">
                                                <h6 className="col-6"><b>OPD No</b></h6>
                                                <p className="col-6 text-end">{data?.admissions?.opdId}</p>
                                            </div>
                                        </Row>

                                        <Row>
                                            {/* <h5><b>Current Vitals</b></h5> */}

                                            {/* <div className="d-flex justify-content-between"> */}
                                            {data?.vitals?.map((item: any, idx: any) => (
                                                <div className="row" key={idx}>
                                                    <div className="col-4"><b>{item.vitalName} :</b>  {item.vitalValue}  </div>
                                                    <div className="col-4 text-center">
                                                        {/* <p><Badge color="success">Normal</Badge></p> */}
                                                    </div>
                                                    <div className="col-4 text-end"><p>{moment(item.date).format('DD/MM/YYYY hh:mm A')}</p></div>
                                                </div>
                                            ))}

                                        </Row>
                                        <hr />
                                        <Row>
                                            <h5><b> Known Allergies</b></h5>
                                            <ul className="ms-4">
                                                {data?.admissions?.knownAllergies ? (
                                                    <li>
                                                        <p>{data.admissions.knownAllergies}</p>
                                                    </li>
                                                ) : (
                                                    <li>
                                                        <p>No known allergies available.</p>
                                                    </li>
                                                )}
                                            </ul>
                                        </Row>
                                        <Row>
                                            <h5><b>Finding</b></h5>
                                            <ul className="ms-4">
                                                {data?.prescriptions && data?.prescriptions?.length > 0 ? (
                                                    data?.prescriptions?.map((item: any, idx: any) => (
                                                        <li key={idx} className="mb-3">
                                                            {item?.findingCategory && item?.findingDescription ? (
                                                                <>
                                                                    <h6>{item.findingCategory}</h6>
                                                                    <span>
                                                                        <h5><b>{item.finding}</b></h5> {item.findingDescription}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <p>No details available for this prescription.</p>
                                                            )}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="mb-3">
                                                        <p>No prescriptions available.</p>
                                                    </li>
                                                )}
                                            </ul>
                                        </Row>
                                        <Row>
                                            <h5><b>Symptoms</b></h5>
                                            <ul className="ms-4">
                                                {data?.admissions?.symptomsTitle && data?.admissions?.symptomsDescription ? (
                                                    <li className="mb-3">
                                                        <div>
                                                            <h6>{data.admissions.symptomsTitle}</h6>
                                                            <p>{data.admissions.symptomsDescription}</p>
                                                        </div>
                                                    </li>
                                                ) : (
                                                    <li className="mb-3">
                                                        <div>
                                                            <p>No symptoms data available.</p>
                                                        </div>
                                                    </li>
                                                )}
                                            </ul>

                                            <hr />
                                        </Row>

                                        {data?.admissions?.doctor?.firstName &&
                                            <Row>
                                                <ConsultantDoctor data={data} />
                                                <hr />
                                            </Row>
                                        }

                                        <Row>
                                            <h5><b>Timeline</b></h5>
                                            <TimeLine data={data} />
                                        </Row>

                                    </CardBody>
                                </Card>
                            </Col>

                            <Col lg={6}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col>
                                                <h5>Medical History</h5>
                                                <MedicalHistoryChart data={medicalHistory} />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5>Visit Details</h5>
                                            <VisitDataTable data={data} visitData={props?.visitData} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5>Lab Investigation</h5>
                                            <LabInvestigationDataTable data={data?.prescriptions} patientData={data} />
                                        </Row>

                                    </CardBody>
                                </Card>
                            </Col>

                        </Row>
                        <hr />

                    </Col>

                </Row>
            </Container >
          
        </React.Fragment>
    )
}
export default OpdPatientOverview