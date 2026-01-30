import React, { useEffect, useState } from "react"
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap"
import user from "../../../assets/images/users/no_image.png";
import { isOldPatient } from "../../../common/data/FakeData";
import IPDApiService from "../../../helpers/services/ipd/ipd-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import AppointmentApiService from "../../../helpers/services/appointment/appointment-api-service";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import CalculateAge from "../../../Components/Common/CalculateAge";

const EditIpdPatient = (props: any) => {
    const ipdApiService: IPDApiService = new IPDApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [data, setData] = useState<any>(props.data);
    const [symptomsType, setSymptomsType] = useState<any>('');
    const [symptomsTitle, setSymptomsTitle] = useState<any>('');
    const [symptomsDescription, setSymptomsDescription] = useState('');

    const [note, setNote] = useState('');
    const [previousMedicalIssue, setPreviousMedicalIssue] = useState('');
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 16);
    const [admissionDate, setAdmissionDate] = useState('');
    const [admissionDateValidationError, setAdmissionDateValidationError] = useState(false);
    const [Case, setCase] = useState('');
    const [consultantDoctor, setConsultDoctor] = useState('');
    const [consultantDoctorValidationError, setConsultantDoctorValidationError] = useState(false);
    const [oldPatient, setOldPatient] = useState(false);
    const [cardLimit, setCardLimit] = useState(20000);
    const [cardLimitValidationError, setCardLimitValidationError] = useState(false);
    const [casualty, setCasualty] = useState(false);
    const [bedGroup, setBedGroup] = useState('');
    const [bedGroupNumber, setBedGroupNumber] = useState('');
    const [bedGroupNumberValidationError, setBedGroupNumberValidationError] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<any>([]);
    const [reference, setReference] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [insuranceId, setInsuranceId] = useState('');
    const [insuranceData, setInsuranceData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [bedGroupData, setBedGroupData] = useState<any>([]);
    const [IsAntenatal, setIsAntenatal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<any[]>([]);
    const [roomData, setRoomData] = useState<any[]>([]);

    const handleAdmissionDateChange = (value: any) => {
        setAdmissionDate(value);
        setAdmissionDateValidationError(false);
    }

    const handleCardLimitChange = (value: any) => {
        setCardLimit(value);
        setCardLimitValidationError(false);
    }

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            console.log("search result", result);
            setOptions(result)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedDoctorId = (selectedItem: any) => {
        const doctorId = selectedItem?.[0]?.['employeeId'];
        setConsultDoctor(doctorId);
        setConsultantDoctorValidationError(false);
    }


    const handleBedGroupChange = (value: any) => {
        setBedGroup(value);
        getAllRommByBedGroupId(value);
        // const selectedBedGroup = bedGroupData.find((group: any) => group.bedGroupName === value);
        // setAvailableRooms(selectedBedGroup ? selectedBedGroup.rooms.filter((room: any) => room.status === 'Available') : []);
    }

    // const handleBedGroupChange = (value: string) => {
    //     console.log("Selected Bed Group Value:", value);
    //     console.log("Initialized Bed Group Data:", bedGroupData);

    //     if (!bedGroupData || bedGroupData.length === 0) {
    //         console.warn("Bed group data is not available yet.");
    //         return;
    //     }

    //     setBedGroup(value);
    //     const selectedBedGroup = bedGroupData.find((group: any) => group.bedGroupName === value);

    //     if (selectedBedGroup) {
    //         const available = selectedBedGroup.rooms?.filter(
    //             (room: any) => room.status === 'Available' || room.status === 'Availabel'
    //         ) || [];
    //         setAvailableRooms(available);
    //         console.log("Available rooms:", available);
    //     } else {
    //         console.warn(`No matching bed group found for: ${value}`);
    //         setAvailableRooms([]);
    //     }
    // };

    const handleBedGroupNumberChange = (value: any) => {
        setBedGroupNumber(value);
        setBedGroupNumberValidationError(false);
    }

    const getAllBedGroupData = async () => {
        try {
            let result = await setupApiService.getAllMasterBedGroup();
            console.log("getAllBedGroupData", result);
            setBedGroupData(result);
        } catch (error: any) {
            console.log("getAllBedGroupData Error");
            console.log(error);
        }
    }

    const getAllRommByBedGroupId = async (id: any) => {
        try {
            let result = await setupApiService.getAllRommByBedGroupId(id);
            console.log("getAllRommByBedGroupId", result);
            setRoomData(result || []);
        } catch (error: any) {
            console.log("getAllRommByBedGroupId Error");
            console.log(error);
        }
    }

    const setIpdData = (data: any) => {
        setSelectedPatientId(data.admissions?.patientId || data?.patientId);
        setSymptomsType(data.admissions?.symptomsType || data?.symptomsType);
        setSymptomsTitle(data.admissions?.symptomsTitle || data?.symptomsTitle);
        setSymptomsDescription(data.admissions?.symptomsDescription || data?.symptomsDescription);
        setNote(data.admissions?.note || data?.note);
        setPreviousMedicalIssue(data.admissions?.previousMedicalIssue || data?.previousMedicalIssue);
        if (props.title !== "moveToIPD") {
            setAdmissionDate(data.admissions?.admissionDate || data?.appointmentDate);
        }
        setCasualty(data.admissions?.casualty || data?.casualty);
        setOldPatient(data.admissions?.oldPatient || data?.oldPatient);
        setCardLimit(data.admissions?.creditLimit || 2000);
        setReference(data.admissions?.reference || data?.reference);
        if (data.admissions?.doctorId || data?.doctorId) {
            onSelectedDoctorId(data.admissions?.doctorId || data?.doctorId);
        }
        const bedGroupName = data.bedDetails?.bedGroup?.bedGroupId;
        setBedGroup(bedGroupName || '');

        if (bedGroupName && bedGroupData.length > 0) {
            handleBedGroupChange(bedGroupName);
        }

        setBedGroupNumber(data.bedDetails?.bedDetailsId || '');
        setIsAntenatal(data.admissions?.antenatal || data?.antenatal);
        if (data.admissions?.doctor || data?.doctor) {
            const doctor = {
                employeeId: data.admissions?.doctorId || data?.doctorId || '',
                fullName: data.admissions?.doctor
                    ? `${data.admissions.doctor.firstName} ${data.admissions.doctor.lastName}`
                    : `${data.doctor?.firstName || ''} ${data.doctor?.lastName || ''}`,
            };
            setOptions([doctor]);
            setSelectedDoctor([doctor]);
            setConsultDoctor(data.admissions?.doctorId || data?.doctorId || '');
        } else {
            setSelectedDoctor([]);
            setConsultDoctor('');
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!admissionDate) {
            setAdmissionDateValidationError(true);
            isFormValid = false;
        }

        if (!cardLimit) {
            setCardLimitValidationError(true);
            isFormValid = false;
        }

        if (!consultantDoctor) {
            setConsultantDoctorValidationError(true);
            isFormValid = false;
        }

        if (!bedGroupNumber) {
            setBedGroupNumberValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    }
    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateAppointment();
        }
    };

    const doCreateAppointment = async () => {
        try {
            let payload: any = {
                patientId: selectedPatientId,
                doctorId: consultantDoctor,
                admissionDate: admissionDate,
                roomId: bedGroupNumber,
                symptomsType: symptomsType || 'NA',
                symptomsTitle: symptomsTitle || 'NA',
                symptomsDescription: symptomsDescription || 'NA',
                note: note || 'NA',
                tpa: insuranceId || null,
                reference: reference || 'NA',
                previousMedicalIssue: previousMedicalIssue || 'NA',
                casualty: casualty,
                oldPatient: oldPatient,
                antenatal: IsAntenatal,
                creditLimit: cardLimit
            }
            if (props.title === "moveToIPD") {
                await ipdApiService.createIPD(payload);
            } else {
                await ipdApiService.editIPD(data.admissions?.admissionId, payload);
            }
            toast.success('Admission Updated Successfully', { containerId: 'TR' });
            props.handleClose();
            if (props.refresh) {
                props.refresh();
            }
        } catch (error: any) {
            console.log("Admission Updated Failed", error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllBedGroupData();
    }, []);

    useEffect(() => {
        if (bedGroupData && bedGroupData.length > 0) {
            setIpdData(data);
        }
    }, [bedGroupData]);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody className="card-body">
                                <Row>
                                    <Col >
                                        <Form onSubmit={handleSubmit}>
                                            <Row>
                                                <Col lg={12}>
                                                    <Col>
                                                        <Row>
                                                            <Col>

                                                                <Col xs="auto">
                                                                    <img className="profile-user-img img-responsive" width={100} alt="User profile picture"
                                                                        src={user} />
                                                                </Col>   <h4 className="text-primary my-2 mb-3">{data?.patient?.firstName} {data?.patient?.lastName} ({data?.patient?.patientId})</h4>

                                                                <table className="noBorderTable w-100">
                                                                    <tbody>
                                                                        <tr>
                                                                            <th>Gender</th>
                                                                            <td>{data?.patient?.gender || "NA"}</td>
                                                                            <th>Blood Group</th>
                                                                            <td>{data?.patient?.bloodType || "NA"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Marital Status</th>
                                                                            <td>{data?.patient?.maritalStatus || "NA"}</td>
                                                                            <th>Age</th>
                                                                            <td><CalculateAge dateOfBirth={data?.patient?.dateOfBirth} /></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Phone</th>
                                                                            <td className="text-primary">{data?.patient?.contactNumber || "NA"}</td>
                                                                            <th>Email</th>
                                                                            <td className="text-primary">{data?.patient?.email || "NA"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Address</th>
                                                                            <td>{data?.admissions?.address || "NA"}</td>
                                                                            <th>Any Known Allergies</th>
                                                                            <td>{data?.admissions?.knownAllergies || "NA"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Remarks</th>
                                                                            <td>{data?.admissions?.remarks || "NA"}</td>
                                                                            <th>TPA</th>
                                                                            <td>{data?.patient?.insuranceProviders?.providerName || "NA"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>TPA ID</th>
                                                                            <td>{data?.patient?.insuranceProviders?.policyNumber || "NA"}</td>
                                                                            <th>TPA Validity</th>
                                                                            <td>{data?.patient?.insuranceProviders?.validity || "NA"}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>National Identification Number</th>
                                                                            <td>{data?.patient?.insuranceProviders?.idNumber || "NA"}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>

                                                            </Col>

                                                        </Row>
                                                    </Col>
                                                    <Row className="px-2 mt-4">
                                                        <hr />
                                                        <h3 className="mb-3">Add Details  </h3>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Admission Date <span className="text-danger">*</span></label>
                                                                <Input
                                                                    className={`${admissionDateValidationError ? 'is-invalid' : ''}`}
                                                                    id="admissionDate"
                                                                    name="admissionDate"
                                                                    type="datetime-local"
                                                                    value={admissionDate}
                                                                    // min={formattedToday}
                                                                    onChange={e => handleAdmissionDateChange(e.target.value)}
                                                                />
                                                                {admissionDateValidationError && <div className="invalid-feedback">Admission Date Required.</div>}
                                                            </FormGroup>
                                                        </Col>
                                                        {/* <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Case</label>
                                                                <Input
                                                                    id="case"
                                                                    name="case"
                                                                    type="text"
                                                                    value={Case}
                                                                    onChange={e => setCase(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col> */}

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Casualty</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={casualty ? "Yes" : "No"} onChange={(e) => {
                                                                        setCasualty(e.target.value === "Yes");
                                                                    }}
                                                                >
                                                                    <option value="">--Select Casualty--</option>
                                                                    {isOldPatient.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.code}>{data.code}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Old Patient</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={oldPatient ? "Yes" : "No"} onChange={(e) => {
                                                                        setOldPatient(e.target.value === "Yes");
                                                                    }}
                                                                >
                                                                    <option value="">--Select Old Patient--</option>
                                                                    {isOldPatient.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.code}>{data.code}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Credit Limit (₹) <span className="text-danger">*</span> </label>
                                                                <Input
                                                                    className={`${cardLimitValidationError ? 'is-invalid' : ''}`}
                                                                    id="cardLimit"
                                                                    name="cardLimit"
                                                                    type="number"
                                                                    value={cardLimit}
                                                                    onChange={e => handleCardLimitChange(e.target.value)}
                                                                />
                                                                {cardLimitValidationError && <div className="invalid-feedback">Credit Limit (₹) Required.</div>}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Reference</label>
                                                                <Input
                                                                    id="reference"
                                                                    name="reference"
                                                                    type="text"
                                                                    value={reference}
                                                                    onChange={e => setReference(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <label className="text-start mb-2">
                                                                Consultant Doctor <span className="text-danger">*</span>
                                                            </label>
                                                            <AsyncTypeahead
                                                                filterBy={() => true}
                                                                id="patient-id-search-box"
                                                                className={`${consultantDoctorValidationError ? 'is-invalid' : ''}`}
                                                                isLoading={isLoading}
                                                                labelKey="fullName"
                                                                minLength={1}
                                                                options={options}
                                                                onSearch={onSearch}
                                                                onChange={(selectedItem: any) => {
                                                                    if (selectedItem.length > 0) {
                                                                        const doctorId = selectedItem[0].employeeId;
                                                                        setConsultDoctor(doctorId);
                                                                        setSelectedDoctor(selectedItem);
                                                                        setConsultantDoctorValidationError(false);
                                                                    } else {
                                                                        setConsultDoctor('');
                                                                        setSelectedDoctor([]);
                                                                        setConsultantDoctorValidationError(true);
                                                                    }
                                                                }}
                                                                placeholder="Search by Doctor Name or Id"
                                                                selected={selectedDoctor}
                                                            />
                                                            {consultantDoctorValidationError && (
                                                                <div className="invalid-feedback">Consultant Doctor Required.</div>
                                                            )}
                                                        </Col>

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Bed</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={bedGroup} onChange={(e) => { handleBedGroupChange(e.target.value) }}
                                                                >
                                                                    <option value="">--Select Bed--</option>
                                                                    {bedGroupData.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data?.bedGroupId}>{data?.bedGroupName} - {data?.floor?.floorName}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Bed Number<span className="text-danger">*</span></label>
                                                                <select
                                                                    className={`form-control  ${bedGroupNumberValidationError ? 'is-invalid' : ''}`}
                                                                    value={bedGroupNumber} onChange={(e) => { handleBedGroupNumberChange(e.target.value) }}
                                                                >
                                                                    <option value="">--Select Bed Number--</option>
                                                                    {roomData?.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.bedDetailsId} disabled={data.roomStatus}>
                                                                            {data.name} {data.roomStatus ? '(Booked)' : ''}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {bedGroupNumberValidationError && <div className="invalid-feedback">Bed Number Required.</div>}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-type" className="form-label ">Symptoms Type</Label>
                                                                <Input
                                                                    id="symptoms-type"
                                                                    name="symptoms-type"
                                                                    type="text"
                                                                    value={symptomsType}
                                                                    onChange={e => setSymptomsType(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-title" className="form-label ">Symptoms Title</Label>
                                                                <Input
                                                                    id="symptoms-title"
                                                                    name="symptoms-title"
                                                                    type="text"
                                                                    value={symptomsTitle}
                                                                    onChange={e => setSymptomsTitle(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={4} className="d-flex align-items-center">
                                                            <div className="form-check">
                                                                <Input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="visible"
                                                                    checked={IsAntenatal}
                                                                    onChange={(e) => setIsAntenatal(e.target.checked)}
                                                                />
                                                                <Label className="form-check-label">Is For Antenatal</Label>
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-description" className="form-label ">Symptoms Description</Label>
                                                                <textarea
                                                                    id="symptoms-description"
                                                                    name="symptoms-description"
                                                                    rows={3}
                                                                    value={symptomsDescription}
                                                                    className={`form-control`}
                                                                    onChange={e => setSymptomsDescription(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label className="form-label">Note</Label>
                                                                <textarea
                                                                    id="note"
                                                                    name="note"
                                                                    rows={3}
                                                                    value={note}
                                                                    className={`form-control`}
                                                                    onChange={e => setNote(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label className="form-label ">Previous Medical Issue</Label>
                                                                <textarea
                                                                    id="Previous Medical Issue"
                                                                    name="PreviousMedicalIssue"
                                                                    rows={3}
                                                                    value={previousMedicalIssue}
                                                                    className={`form-control`}
                                                                    onChange={e => setPreviousMedicalIssue(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col lg={4}>
                                                    <Row>

                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Col className="text-end">
                                                <Button color="primary">Submit</Button>
                                            </Col>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
export default EditIpdPatient