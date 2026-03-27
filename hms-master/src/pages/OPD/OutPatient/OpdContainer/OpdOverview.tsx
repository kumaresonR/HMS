import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faBedPulse, faClipboardList, faDroplet, faFlask, faHospital, faMicroscope, faMortarPestle, faTrash, faTruckMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Progress, Row } from "reactstrap";
import ConsultantDoctor from "../../../IPD/InPatient/IpdContainer/ConsultantDoctor";
import TimeLine from "../../../IPD/InPatient/IpdContainer/TimeLine/TimeLine";
import MedicationDataTable from "../../../IPD/InPatient/IpdContainer/Medication/MedicationDataTable";
import LabInvestigationDataTable from "../../../IPD/InPatient/IpdContainer/LabInvestigation/LabInvestigationDataTable";
import OperationDataTable from "../../../IPD/InPatient/IpdContainer/Operation/OperationDataTable";
import ChargesDataTable from "../../../IPD/InPatient/IpdContainer/Charges/ChargesDataTable";
import IpdPaymentDataTable from "../../../IPD/InPatient/IpdContainer/IpdPayment/IpdPaymentDataTable";
import EditCheckupDetail from "./Visits/EditCheckupDetail";
import PatientDischarge from "../../../IPD/InPatient/PatientDischarge";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import OPDApiService from "../../../../helpers/services/opd/opd-api-service";
import ErrorHandler from "../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import myProfile from '../../../../assets/images/profileDummy.png'
import moment from "moment";
import RoleBasedComponent from "../../../../common/RolePermission/RoleBasedComponent";
import CalculateAge from "../../../../Components/Common/CalculateAge";
import OpdDischarge from "./OpdDischarge";
const OpdOverview = (props: any) => {
    const opdApiService: OPDApiService = new OPDApiService();
    let navigate: any = useNavigate();

    const [data, setData] = useState<any>(props.data || {});
    console.log("Overview Data : ", props.data);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [dischargeModel, setDischargeModel] = useState<boolean>(false);
    const [dischareId, setDischareId] = useState('');
    const [billingData, setBillingData] = useState<any>({});

    //delete 
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState('');

    const edit = () => {
        handleEditClose();
    }

    const handleEditClose = () => {
        setEditModel(!editModel);
    }

    const discharge = (id: any) => {
        setDischareId(id);
        handleDischargeClose();
    }

    const handleDischargeClose = () => {
        setDischargeModel(!dischargeModel);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await opdApiService.deleteOPD(selectedId);
                toast.success('OPD Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                navigate('/main/OPD');
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteOpdPatient = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const totalNetAmount = (props?.data?.opdCharges || []).reduce(
        (sum: any, charge: any) => sum + charge.netAmount,
        0
    );

    // Calculate totalPaymentAmount
    const totalPaymentAmount = (props?.data?.opdPayments || []).reduce(
        (sum: any, payment: any) => sum + payment.amount,
        0
    );

    // Calculate percentageToPaid
    const percentageToPaid = totalNetAmount
        ? ((totalPaymentAmount / totalNetAmount) * 100).toFixed(2)
        : 0;

    const getBillingById = async () => {
        try {
            let data = await opdApiService.getBillingById(props.data?.admissions?.opdId);
            setBillingData(data);
            console.log('getBillingById data', data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getBillingById();
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
                                        <br />
                                        <div className="d-flex justify-content-evenly flex-wrap mt-2">
                                            <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR"]}>
                                                <Link to="#" data-bs-toggle="modal" onClick={() => edit()}
                                                    className="btn btn-sm  edit-list mx-1" title="Edit">
                                                    <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                                                </Link>
                                                <Link to="#" data-bs-toggle="modal" onClick={() => deleteOpdPatient(data.admissions?.admissionId)}
                                                    className="btn btn-sm text-danger edit-list mx-1" title="Delete">
                                                    <FontAwesomeIcon icon={faTrash} size="lg" />
                                                </Link>
                                            </RoleBasedComponent>
                                            <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "RECEPTIONIST"]}>
                                                {data.admissions?.dischargeDate === null && (
                                                    <Link to="#" data-bs-toggle="modal" onClick={() => discharge(data.admissions?.admissionId)}
                                                        className="btn btn-sm text-success edit-list mx-1" title="Patient Checkout">
                                                        <FontAwesomeIcon icon={faHospital} size="lg" />
                                                    </Link>
                                                )}
                                            </RoleBasedComponent>
                                        </div>
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
                                            <h6 className="col-5 d-flex align-items-center">Barcode</h6>
                                            <div className="col-7 barcode">
                                                <Barcode value={data?.admissions?.opdId || ''} height={20} />
                                            </div>
                                        </div>
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
                                        <Row className="mb-4">
                                            <Col>
                                                <div className="d-flex justify-content-between">
                                                    <h5>OPD Payment/Billing</h5>
                                                    <FontAwesomeIcon icon={faBedPulse} />
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <p>{percentageToPaid} %</p>
                                                    <p>₹ {totalPaymentAmount}/₹ {totalNetAmount}</p>
                                                </div>
                                                <Progress value={percentageToPaid} color="primary" className="progress animated-progress custom-progress progress-p" > </Progress>
                                            </Col>
                                            <Col>
                                                <div className="d-flex justify-content-between">
                                                    <h5>Pharmacy Payment/Billing</h5>
                                                    <FontAwesomeIcon icon={faMortarPestle} />
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <p>{billingData?.pharmacyBilling?.percentageToPaid} %</p>
                                                    <p>₹ {billingData?.pharmacyBilling?.totalPaymentAmount} / ₹ {billingData?.pharmacyBilling?.totalNetAmount}</p>
                                                </div>
                                                <Progress value={billingData?.pharmacyBilling?.percentageToPaid} color="primary" className="progress animated-progress custom-progress progress-p" > </Progress>
                                            </Col>
                                        </Row>


                                        <Row className="mb-4">
                                            <Col>
                                                <div className="d-flex justify-content-between">
                                                    <h5>Pathology Payment/Billing</h5>
                                                    <FontAwesomeIcon icon={faFlask} />
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <p>{billingData?.pathologyBilling?.percentageToPaid} %</p>
                                                    <p>₹ {billingData?.pathologyBilling?.totalPaymentAmount} / ₹ {billingData?.pathologyBilling?.totalNetAmount}</p>
                                                </div>
                                                <Progress value={billingData?.pathologyBilling?.percentageToPaid} color="primary" className="progress animated-progress custom-progress progress-p" > </Progress>
                                            </Col>
                                            <Col>
                                                <div className="d-flex justify-content-between">
                                                    <h5>Radiology Payment/Billing</h5>
                                                    <FontAwesomeIcon icon={faMicroscope} />
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <p>{billingData?.radiologyBilling?.percentageToPaid} %</p>
                                                    <p>₹ {billingData?.radiologyBilling?.totalPaymentAmount} / ₹ {billingData?.radiologyBilling?.totalNetAmount}</p>
                                                </div>
                                                <Progress value={billingData?.radiologyBilling?.percentageToPaid} color="primary" className="progress animated-progress custom-progress progress-p" > </Progress>
                                            </Col>
                                        </Row>
                                        <Row className="mb-4">
                                            <Col>
                                                <div className="d-flex justify-content-between">
                                                    <h5>Blood Bank Payment/Billing</h5>
                                                    <FontAwesomeIcon icon={faDroplet} />
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <p>{billingData?.bloodBankBilling?.percentageToPaid} %</p>
                                                    <p>₹ {billingData?.bloodBankBilling?.totalPaymentAmount} / ₹ {billingData?.bloodBankBilling?.totalNetAmount}</p>
                                                </div>
                                                <Progress value={billingData?.bloodBankBilling?.percentageToPaid} color="primary" className="progress animated-progress custom-progress progress-p" > </Progress>
                                            </Col>

                                            <Col>
                                                <div className="d-flex justify-content-between">
                                                    <h5>Ambulance Payment/Billing</h5>
                                                    <FontAwesomeIcon icon={faTruckMedical} />
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <p>{billingData?.ambulanceBilling?.percentageToPaid} %</p>
                                                    <p>₹ {billingData?.ambulanceBilling?.totalPaymentAmount} / ₹ {billingData?.ambulanceBilling?.totalNetAmount}</p>
                                                </div>
                                                <Progress value={billingData?.ambulanceBilling?.percentageToPaid} color="primary" className="progress animated-progress custom-progress progress-p" ></Progress>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
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
                                                <div className="row">
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
                                                {data.admissions?.knownAllergies ? (
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
                                                {data.prescriptions && data.prescriptions.length > 0 ? (
                                                    data.prescriptions.map((item: any, idx: any) => (
                                                        <li key={idx} className="mb-3">
                                                            {item.findingCategory && item.findingDescription ? (
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
                                                {data.admissions?.symptomsTitle && data.admissions?.symptomsDescription ? (
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
                                        <Row className="mb-4">
                                            <h5>Medication</h5>
                                            <Col style={{ maxHeight: "20rem", overflow: "auto" }}>
                                                <MedicationDataTable data={data} />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5>Lab Investigation</h5>
                                            <LabInvestigationDataTable data={data.prescriptions} patientData={data} />
                                        </Row>

                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5>Operations</h5>
                                            <OperationDataTable data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5>Charges</h5>
                                            <ChargesDataTable data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5>Payment</h5>
                                            <IpdPaymentDataTable data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>


                            </Col>

                        </Row>
                        <hr />

                    </Col>

                </Row>
            </Container >


            <Modal isOpen={dischargeModel} toggle={handleDischargeClose}
                backdrop={'static'} id="staticBackdrop" centered size="lg" scrollable
            >
                <ModalHeader toggle={handleDischargeClose} className="p-3 bg-info-subtle modal-title">
                    Patient Checkout
                </ModalHeader>
                <ModalBody>
                    <OpdDischarge id={dischareId} title="opd" handleClose={handleDischargeClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                    Edit Visit Details
                </ModalHeader>
                <ModalBody>
                    <EditCheckupDetail data={props.data} refresh={props.refresh} handleClose={handleEditClose} />
                </ModalBody>
            </Modal>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />
        </React.Fragment >
    )
}
export default OpdOverview