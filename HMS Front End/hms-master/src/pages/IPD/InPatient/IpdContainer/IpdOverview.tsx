import { faBedPulse, faClipboardList, faDroplet, faFlask, faHospital, faIdCard, faMicroscope, faMortarPestle, faPenToSquare, faTrash, faTruckMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalHeader, Progress, Row, Table } from "reactstrap"
import CreditLimitChart from "./CreditLimitChart";
import OperationDataTable from "./Operation/OperationDataTable";
import IpdBedHistory from "./IpdBedHistory";
import ChargesDataTable from "./Charges/ChargesDataTable";
import IpdTreatmentHistory from "./TreatmentHistory/IpdTreatmentHistory";
import ConsultantDoctor from "./ConsultantDoctor";
import PrescriptionDataTable from "./Prescription/PrescriptionDataTable";
import ConsultantRegisterDataTable from "./ConsultantRegister/ConsultantRegisterDataTable";
import LabInvestigationDataTable from "./LabInvestigation/LabInvestigationDataTable";
import NurseNote from "./NurseNote/NurseNote";
import TimeLine from "./TimeLine/TimeLine";
import IpdPaymentDataTable from "./IpdPayment/IpdPaymentDataTable";
import EditIpdPatient from "../EditIpdPatient";
import PatientDischarge from "../PatientDischarge";
import PreviewPatientDetails from "../../../Patient/PreviewPatientDetails";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import moment from "moment";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import ErrorHandler from "../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../helpers/services/ipd/ipd-api-service";
import { Link, useNavigate } from "react-router-dom";
import myProfile from '../../../../assets/images/profileDummy.png'
import RoleBasedComponent from "../../../../common/RolePermission/RoleBasedComponent";
import CalculateAge from "../../../../Components/Common/CalculateAge";
const IpdOverview = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    let navigate: any = useNavigate();

    const [data, setData] = useState<any>(props.data || {});
    console.log("Overview Data : ", props.data);
    const [editModel, setEditModel] = useState<boolean>(false);
    const [dischargeModel, setDischargeModel] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
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

    const preview = () => {
        handlePreviewClose();
    }

    const handlePreviewClose = () => {
        setPreviewOpen(!previewOpen);
    }

    // Delete Data
    const handleDelete = async () => {
        if (selectedId) {
            try {
                await iPDApiService.deleteIPD(selectedId);
                toast.success('IPD Deleted Successfully', { containerId: 'TR' });
                setDeleteModal(false);
                navigate('/main/inPatient-datatable');
                return;
            } catch (error: any) {
                console.log("handleDelete Error")
                return ErrorHandler(error)
            }
        }
    };

    const deleteIpdPatient = (id: any) => {
        setSelectedId(id);
        setDeleteModal(true);
    }

    const totalAmount = (data?.ipdPayments || []).reduce((total: any, item: any) => total + item.amount, 0);
    console.log("totalAmount", totalAmount)
    const creditLimit = data?.admissions?.creditLimit;
    const balanceCreditLimit = creditLimit - totalAmount;
    console.log("balance", balanceCreditLimit);

    const totalNetAmount = (props?.data?.ipdCharges || []).reduce(
        (sum: any, charge: any) => sum + charge.netAmount,
        0
    );

    // Calculate totalPaymentAmount
    const totalPaymentAmount = (props?.data?.ipdPayments || []).reduce(
        (sum: any, payment: any) => sum + payment.amount,
        0
    );

    // Calculate percentageToPaid
    const percentageToPaid = totalNetAmount
        ? ((totalPaymentAmount / totalNetAmount) * 100).toFixed(2)
        : 0;

    const getBillingById = async () => {
        try {
            let data = await iPDApiService.getBillingById(props.data?.admissions?.ipdId);
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
                                            <Link to="#" data-bs-toggle="modal" onClick={() => preview()}
                                                className="btn btn-sm btn-soft-warning edit-list mx-1" title="View">
                                                <FontAwesomeIcon icon={faIdCard} size="lg" />
                                            </Link>
                                            <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR"]}>
                                                <Link to="#" data-bs-toggle="modal" onClick={() => edit()}
                                                    className="btn btn-sm btn-soft-secondary edit-list mx-1" title="Edit">
                                                    <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                                                </Link>
                                            </RoleBasedComponent>
                                            <RoleBasedComponent allowedRoles={["SUPERADMIN","DOCTOR", "RECEPTIONIST"]}>
                                                {data.admissions?.dischargeDate === null && (
                                                    <Link to="#" data-bs-toggle="modal" onClick={() => discharge(data.admissions?.admissionId)}
                                                        className="btn btn-sm btn-soft-success edit-list mx-1" title="Discharge">
                                                        <FontAwesomeIcon icon={faHospital} size="lg" />
                                                    </Link>
                                                )}
                                                <Link to="#" onClick={() => deleteIpdPatient(data.admissions?.admissionId)}
                                                    className="btn btn-sm btn-soft-danger edit-list mx-1" title="Delete">
                                                    <FontAwesomeIcon icon={faTrash} size="lg" />
                                                </Link>
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
                                                <p className="col-7"><CalculateAge dateOfBirth={data?.patient?.dateOfBirth} /></p>
                                            </div>
                                            
                                            {data?.patient?.emergencyContacts.map((item: any, idx: any) => (
                                                <div className="row d-flex justify-content-between mb-1" key={idx}>
                                                    <h6 className="col-5 text-start">Guardian Name</h6>
                                                    <p className="col-7 px-0 ">{item.contactName} ({item.relationShip}) - {item.contactNumber}</p>
                                                </div>
                                            ))}

                                            {/* <div className="d-flex justify-content-between mb-1">
                                                <h6 className="col-5">Guardian Name</h6>
                                                <p className="col-7">{data?.patient?.gaudianName || 'NA'} </p>
                                            </div> */}
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

                                        <div className="d-flex justify-content-between mb-1">
                                            <h6 className="col-5 d-flex align-items-center">Barcode</h6>
                                            <div className="col-7 barcode">
                                                <Barcode value={data.admissions?.ipdId || ''} height={20} />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <h6 className="col-5 d-flex align-items-center">QR Code</h6>
                                            <div className="col-7" >
                                                <QRCode value={data.admissions?.caseId || ""} size={35} />
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
                                                    <h5>IPD Payment/Billing</h5>
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
                                        {/* <Row>
                                            <h6 className="col-6">Case Id</h6>
                                            <p className="col-6">{data?.admissions?.caseId}</p>
                                        </Row> */}
                                        <Row>
                                            <h6 className="col-6">IPD No</h6>
                                            <p className="col-6">{data?.admissions?.ipdId}</p>
                                        </Row>
                                        <Row>
                                            <h6 className="col-6">Admission Date</h6>
                                            <p className="col-6">
                                                {moment(data?.admissions?.admissionDate).format('DD/MM/YYYY, hh:mm A')}
                                            </p>
                                        </Row>
                                        <Row>
                                            <h6 className="col-6">Bed</h6>
                                            <p className="col-6">{data?.bedGroup?.bedGroupName} ({data?.bedGroup?.rooms?.roomNumber})</p>
                                        </Row>

                                        <CreditLimitChart dataColors='["#f40000","#4caf50"]' creditLimit={creditLimit} usedCreditLimit={totalAmount} balanceCreditLimit={balanceCreditLimit} />
                                        <Row>
                                            <h5><b> Known Allergies</b></h5>
                                            <ul className="ms-4">
                                                {data?.admissions?.knownAllergies ? (
                                                    <li>
                                                        <p>{data?.admissions?.knownAllergies}</p>
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
                                            <h5><b>Nurse Notes </b></h5>
                                            <NurseNote refresh={props.refresh} data={data} />
                                            <hr />
                                        </Row>
                                        <Row>
                                            <h5><b>Timeline</b></h5>
                                            <TimeLine title={props.title} refresh={props.refresh} data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>

                            </Col>
                            <Col lg={6}>
                                {/* <Card>
                                    <CardBody>

                                        <h5><b>Medication</b></h5>
                                        <Col style={{ maxHeight: "20rem", overflow: "auto" }}>
                                            <MedicationDataTable refresh={props.refresh} data={data} />
                                        </Col>
                                    </CardBody>
                                </Card> */}



                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5><b>Prescription</b></h5>
                                            <PrescriptionDataTable title={props.title} refresh={props.refresh} data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5><b>Consultant Register </b></h5>
                                            <ConsultantRegisterDataTable refresh={props.refresh} data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5><b>Lab Investigation</b></h5>
                                            <LabInvestigationDataTable refresh={props.refresh} patientData={data} data={data.prescriptions} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5><b>Operations</b></h5>
                                            <OperationDataTable title={props.title} refresh={props.refresh} data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5><b>Charges</b></h5>
                                            <ChargesDataTable refresh={props.refresh} data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <h5><b>Payment</b></h5>
                                            <IpdPaymentDataTable title={props.title} refresh={props.refresh} data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>
                                        <Row className="mb-4">
                                            <IpdTreatmentHistory title={props.title} refresh={props.refresh} data={data} />
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardBody>

                                        <Row className="mb-4">
                                            <IpdBedHistory title={props.title} refresh={props.refresh} data={data} />
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
                    Patient Discharge
                </ModalHeader>
                <ModalBody>
                    <PatientDischarge id={dischareId} handleClose={handleDischargeClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={editModel} toggle={handleEditClose}
                backdrop={'static'} id="staticBackdrop" centered fullscreen scrollable
            >
                <ModalHeader toggle={handleEditClose} className="p-3 bg-info-subtle modal-title">
                    Edit Profile
                </ModalHeader>
                <ModalBody>
                    <EditIpdPatient refresh={props.refresh} data={data} handleClose={handleEditClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={previewOpen} toggle={handlePreviewClose}
                backdrop={'static'} id="staticBackdrop" centered size="xl" scrollable
            >
                <ModalHeader toggle={handlePreviewClose} className="p-3 bg-info-subtle modal-title">
                    Patient Details
                </ModalHeader>
                <ModalBody>
                    <PreviewPatientDetails data={data} handleClose={handlePreviewClose} />
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

export default IpdOverview