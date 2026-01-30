import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap"
import { customStyles, doctorList, isOldPatient, paymentModeData, symptomsData } from "../../../../../common/data/FakeData";
import { chargeData } from "../../../../../common/data/IpdData";
import Select from "react-select";
import user from "../../../../../assets/images/users/no_image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDroplet, faEnvelope, faHourglassHalf, faLocationDot, faPhone, faRing, faUserSecret, faVenusMars } from "@fortawesome/free-solid-svg-icons";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import AppointmentApiService from "../../../../../helpers/services/appointment/appointment-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import CalculateAge from "../../../../../Components/Common/CalculateAge";

const AddCheckup = (props: any) => {
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState(props.data);
    const [selectedType, setSelectedType] = useState<any>([]);
    const [selectedTitles, setSelectedTitles] = useState<any>([]);
    const [symptomsDescription, setSymptomsDescription] = useState('');
    const [selectedTypeString, setSelectedTypeString] = useState<string>('');
    const [selectedTitlesString, setSelectedTitlesString] = useState<string>('');

    const [note, setNote] = useState('');
    const [anyKnownAllergies, setAnyKnownAllergies] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [admissionDate, setAdmissionDate] = useState('');
    const [admissionDateValidationError, setAdmissionDateValidationError] = useState(false);
    const [Case, setCase] = useState('');
    const [consultantDoctor, setConsultDoctor] = useState('');
    const [consultantDoctorValidationError, setConsultantDoctorValidationError] = useState(false);
    const [oldPatient, setOldPatient] = useState(true);
    const [casualty, setCasualty] = useState(false);
    const [reference, setReference] = useState('');
    const [applyTPA, setApplyTPA] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [tax, setTax] = useState(18.00);
    const [totalTax, setTotalTax] = useState(5);
    const [netAmount, setNetAmount] = useState(0);
    const [chargeType, setChargeType] = useState('');
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeName, setChargeName] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredChargeNames, setFilteredChargeNames] = useState([]);
    const [standardCharge, setStandardCharge] = useState('');
    const [tpaCharge, setTpaCharge] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [appliedCharge, setAppliedCharge] = useState<number>();
    const [discount, setDiscount] = useState<number>();
    const [paidAmount, setPaidAmount] = useState('');
    const [isAntenatal, setIsAntenatal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);

    const handleTypeChange = (selected: any) => {
        setSelectedType(selected);
        // Reset titles and description when the type changes
        setSelectedTitles([]);
        setSymptomsDescription('');

        // Save selected types as a comma-separated string
        const typeString = selected.map((type: any) => type.value).join(', ');
        setSelectedTypeString(typeString); // Store the comma-separated types string

        // Update available titles based on selected types
        const titles = selected.flatMap((type: any) =>
            symptomsData
                .filter(symptom => symptom.symptomsType === type.value)
                .map(symptom => ({
                    label: symptom.symptomsTitle,
                    value: symptom.symptomsTitle,
                }))
        );

        // Automatically set the first title's description if there's any title available
        if (titles.length > 0) {
            setSelectedTitles([titles[0]]); // Select the first title

            // Set the description based on the first title
            const firstTitleDescription = symptomsData.find(symptom => symptom.symptomsTitle === titles[0].value)?.symptomsDescription || '';
            setSymptomsDescription(firstTitleDescription);
        }
    };

    const handleTitleChange = (selected: any) => {
        setSelectedTitles(selected);
        // Update the description based on the selected titles
        if (selected.length > 0) {
            const descriptions = selected.map((title: any) => {
                const symptom = symptomsData.find(symptom => symptom.symptomsTitle === title.value);
                return symptom ? `${title.value}: ${symptom.symptomsDescription}` : '';
            });
            // Join descriptions with line breaks for better readability
            setSymptomsDescription(descriptions.join('\n\n')); // Two line breaks for spacing

            // Save selected titles as a comma-separated string
            const titleString = selected.map((title: any) => title.value).join(', ');
            setSelectedTitlesString(titleString); // Store the comma-separated titles string
        } else {
            setSymptomsDescription('');
        }
    };

    const titleOptions = selectedType.flatMap((type: any) =>
        symptomsData
            .filter(symptom => symptom.symptomsType === type.value)
            .map(symptom => ({
                label: symptom.symptomsTitle,
                value: symptom.symptomsTitle,
            }))
    );

    const handleAdmissionDateChange = (value: any) => {
        setAdmissionDate(value);
        setAdmissionDateValidationError(false);
    }

    const handleChargeTypeChange = (type: string) => {
        setChargeType(type);
        setChargeCategory('');
        setChargeName('');
        setStandardCharge('');
        setTpaCharge('');

        const selectedChargeType: any = chargeData.find((data: any) => data.chargeType === type);
        setFilteredCategories(selectedChargeType ? selectedChargeType.chargeCategory : []);
    };

    const handleChargeCategoryChange = (category: string) => {
        setChargeCategory(category);
        setChargeName('');
        setStandardCharge('');
        setTpaCharge('');

        const selectedCategory: any = filteredCategories.find((cat: any) => cat.category === category);
        setFilteredChargeNames(selectedCategory ? selectedCategory.chargeName : []);
    };

    const handleChargeNameChange = (name: string) => {
        setChargeName(name);

        const selectedCharge: any = filteredChargeNames.find((charge: any) => charge.name === name);
        setStandardCharge(selectedCharge ? selectedCharge.standardCharge.toString() : '');
        setTpaCharge(selectedCharge ? selectedCharge.tpaCharge.toString() : '');
    };

    const calculateCharges = () => {
        const charge = parseFloat(standardCharge) || 0;
        const tpa = parseFloat(tpaCharge) || 0;

        // Calculate total amount before discount and tax
        const appliedCharge = charge;
        setAppliedCharge(appliedCharge);

        // Calculate discount
        const discountAmount = (appliedCharge * discountPercentage) / 100;
        const discountedTotal = appliedCharge - discountAmount;

        // Calculate tax on discounted total
        const taxAmount = (discountedTotal * tax) / 100;
        setTotalTax(Number(taxAmount.toFixed(2)));  // Convert to number after fixing decimal places

        // Calculate final net amount
        const finalAmount = discountedTotal + taxAmount + (applyTPA ? tpa : 0);
        setNetAmount(Number(finalAmount.toFixed(2)));  // Convert to number after fixing decimal places

    };

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            console.log("search result", result);
            setOptions(result)
        } catch (error) {
            console.log("Doctor search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedDoctorId = (selectedItem: any) => {
        const doctorId = selectedItem?.[0]?.['employeeId'];
        setConsultDoctor(doctorId);
        setConsultantDoctorValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!admissionDate) {
            setAdmissionDateValidationError(true);
            isFormValid = false;
        }

        if (!consultantDoctor) {
            setConsultantDoctorValidationError(true);
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
                patientId: data.admissions?.patientId,
                doctorId: consultantDoctor,
                admissionDate: admissionDate,
                cardLimit: 20000,
                symptomsType: selectedTypeString,
                symptomsTitle: selectedTitlesString,
                symptomsDescription: symptomsDescription,
                note: note,
                tpa: applyTPA,
                reference: reference || 'NA',
                casualty: casualty,
                oldPatient: oldPatient,
                anyKnownAllergies: anyKnownAllergies,
                antenatal: isAntenatal,
                chargeCategory: chargeCategory,
                chargeName: chargeName,
                standardCharge: standardCharge,
                // tpaCharge : tpaCharge,
                appliedCharge: appliedCharge,
                discountPercentage: discount,
                taxPercentage: tax,
                amount: netAmount,
                paymentMode: paymentMode,
                paidAmount: paidAmount
            }
            await opdApiService.createOPD(payload);
            toast.success('Admission Created Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("Admission Created Failed", error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        calculateCharges();
    }, [standardCharge, tpaCharge, discountPercentage, tax, applyTPA]);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

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
                                                <Col lg={8}>
                                                    <Col>
                                                        <Row>
                                                            <Col>
                                                                <h4>{data?.patient?.firstName} {data?.patient?.lastName} ({data?.patient?.patientId})</h4>
                                                                <label><FontAwesomeIcon icon={faUserSecret} title="Guardian" /> {data?.patient?.emergencyContacts[0]?.contactName || 'NA'}</label>
                                                                <br />
                                                                <label className="me-4"><FontAwesomeIcon icon={faVenusMars} title="Gender" /> {data?.patient?.gender}</label>
                                                                <label className="me-4"><FontAwesomeIcon icon={faDroplet} title="Blood Group" /> {data.patient?.bloodType || 'NA'}</label>
                                                                <label className="me-4"><FontAwesomeIcon icon={faRing} title="Marital Status" /> {data.patient?.maritalStatus || 'NA'}</label>
                                                                <br />
                                                                <label><FontAwesomeIcon icon={faHourglassHalf} title="Age" /> <CalculateAge dateOfBirth={data?.patient?.dateOfBirth} /></label>
                                                                <br />
                                                                <label><FontAwesomeIcon icon={faPhone} title="Phone" />  {data?.patient?.contactNumber || 'NA'}</label>
                                                                <br />
                                                                <label><FontAwesomeIcon icon={faEnvelope} title="Gmail" /> {data?.patient?.email || 'NA'} </label>
                                                                <br />
                                                                <label><FontAwesomeIcon icon={faLocationDot} title="Address" /> {data.admissions?.address || 'NA'}</label>
                                                                <br />
                                                                <label><b>Any Known Allergies :</b> {data.admissions?.knownAllergies}</label>
                                                                <br />
                                                                <label><b>Remarks : </b> {data.admissions?.remarks}</label>
                                                                <br />
                                                                <label><b>TPA :</b> {data?.patient?.insuranceProviders?.providerName || "NA"}</label>
                                                                <br />
                                                                <label><b>TPA ID : </b> {data?.patient?.insuranceProviders?.policyNumber || "NA"}</label>
                                                                <br />
                                                                <label><b>TPA Validity : </b> {data?.patient?.insuranceProviders?.validity || "NA"}</label>
                                                                <br />
                                                                <label><b> National Identification Number : </b> {data?.patient?.insuranceProviders?.idNumber || "NA"}</label>
                                                            </Col>
                                                            <Col xs="auto">
                                                                <img className="profile-user-img img-responsive" width={100} alt="User profile picture"
                                                                    src={user} />
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Row>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-type" className="form-label ">Symptoms Type</Label>
                                                                <Select
                                                                    id="symptoms-type"
                                                                    value={selectedType}
                                                                    isMulti={true}
                                                                    onChange={handleTypeChange}
                                                                    options={symptomsData.map(symptom => ({
                                                                        label: symptom.symptomsType,
                                                                        value: symptom.symptomsType,
                                                                    }))}
                                                                    styles={customStyles}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-title" className="form-label ">Symptoms Title</Label>
                                                                <Select
                                                                    id="symptoms-title"
                                                                    value={selectedTitles}
                                                                    isMulti={true}
                                                                    onChange={handleTitleChange}
                                                                    options={titleOptions}
                                                                    styles={customStyles}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={12}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-description" className="form-label ">Symptoms Description</Label>
                                                                <textarea
                                                                    id="symptoms-description"
                                                                    name="symptoms-description"
                                                                    rows={6}
                                                                    value={symptomsDescription}
                                                                    className={`form-control`}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
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
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label className="form-label ">Any Known Allergies</Label>
                                                                <textarea
                                                                    id="AnyKnownAllergies"
                                                                    name="AnyKnownAllergies"
                                                                    rows={3}
                                                                    value={anyKnownAllergies}
                                                                    className={`form-control`}
                                                                    onChange={e => setAnyKnownAllergies(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col lg={4}>
                                                    <Row>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Admission Date <span className="text-danger">*</span></label>
                                                                <Input
                                                                    className={`${admissionDateValidationError ? 'is-invalid' : ''}`}
                                                                    id="admissionDate"
                                                                    name="admissionDate"
                                                                    type="date"
                                                                    value={admissionDate}
                                                                    min={today}
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
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Consultant Doctor <span className="text-danger">*</span></label>
                                                                <AsyncTypeahead
                                                                    filterBy={() => true}
                                                                    id="patient-id-search-box"
                                                                    className={` ${consultantDoctorValidationError ? 'is-invalid' : ''}`}
                                                                    isLoading={isLoading}
                                                                    labelKey="fullName"
                                                                    minLength={1}
                                                                    options={options}
                                                                    onSearch={onSearch}
                                                                    onChange={onSelectedDoctorId}
                                                                    placeholder="Search by Doctor Name or Id"
                                                                />
                                                                {consultantDoctorValidationError && <div className="invalid-feedback">Consultant Doctor Required.</div>}
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="form-check">
                                                                <Input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="visible"
                                                                    checked={applyTPA}
                                                                    onChange={(e) => setApplyTPA(e.target.checked)}
                                                                />
                                                                <Label className="form-check-label">Apply TPA </Label>
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Charge Type <span className="text-danger">*</span></label>
                                                                <select
                                                                    className="form-control"
                                                                    value={chargeType}
                                                                    onChange={(e) => handleChargeTypeChange(e.target.value)}
                                                                >
                                                                    <option value="">--Select Charge Type--</option>
                                                                    {chargeData.map((data, idx) => (
                                                                        <option key={idx} value={data.chargeType}>{data.chargeType}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Charge Category <span className="text-danger">*</span></label>
                                                                <select
                                                                    className="form-control"
                                                                    value={chargeCategory}
                                                                    onChange={(e) => handleChargeCategoryChange(e.target.value)}
                                                                >
                                                                    <option value="">--Select Charge Category--</option>
                                                                    {filteredCategories.map((cat: any, idx: any) => (
                                                                        <option key={idx} value={cat.category}>{cat.category}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Charge Name <span className="text-danger">*</span></label>
                                                                <select
                                                                    className="form-control"
                                                                    value={chargeName}
                                                                    onChange={(e) => handleChargeNameChange(e.target.value)}
                                                                >
                                                                    <option value="">--Select Charge Name--</option>
                                                                    {filteredChargeNames.map((charge: any, idx: any) => (
                                                                        <option key={idx} value={charge.name}>{charge.name}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Standard Charge <span className="text-danger">*</span></label>
                                                                <Input
                                                                    readOnly
                                                                    id="StandardCharge"
                                                                    name="StandardCharge"
                                                                    type="text"
                                                                    value={standardCharge}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">TPA Charge <span className="text-danger">*</span></label>
                                                                <Input
                                                                    readOnly
                                                                    id="TPACharge"
                                                                    name="TPACharge"
                                                                    type="text"
                                                                    value={tpaCharge}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Applied Charge <span className="text-danger">*</span></label>
                                                                <Input
                                                                    id="AppliedCharge"
                                                                    name="AppliedCharge"
                                                                    type="text"
                                                                    value={appliedCharge}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Discount</label>
                                                                <Input
                                                                    id="Discount"
                                                                    name="Discount"
                                                                    type="text"
                                                                    value={discount}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Tax<span className="text-danger">*</span></label>
                                                                <Input
                                                                    readOnly
                                                                    id="Tax"
                                                                    name="Tax"
                                                                    type="text"
                                                                    value={tax}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Amount  <span className="text-danger">*</span></label>
                                                                <Input
                                                                    readOnly
                                                                    id="Amount"
                                                                    name="Amount"
                                                                    type="text"
                                                                    value={netAmount}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Payment Mode</label>
                                                                <select
                                                                    className={`form-control`}
                                                                    value={paymentMode} onChange={(e) => { setPaymentMode(e.target.value) }}
                                                                >
                                                                    <option value="">--Select Payment Mode--</option>
                                                                    {paymentModeData.map((data: any, idx: any) => (
                                                                        <option key={idx} value={data.type}>{data.type}</option>
                                                                    ))}
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Paid Amount<span className="text-danger">*</span></label>
                                                                <Input
                                                                    id="paidAmount"
                                                                    name="paidAmount"
                                                                    type="text"
                                                                    value={paidAmount}
                                                                    onChange={(e: any) => setPaidAmount(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6} className="py-4">
                                                            <div className="form-check">
                                                                <Input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="visible"
                                                                    checked={isAntenatal}
                                                                    onChange={(e) => setIsAntenatal(e.target.checked)}
                                                                />
                                                                <Label className="form-check-label">Is Antenatal</Label>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Col className="text-end">
                                                <Button>Submit</Button>
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
export default AddCheckup