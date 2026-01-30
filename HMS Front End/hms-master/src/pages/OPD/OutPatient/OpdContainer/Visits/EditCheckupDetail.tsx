import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import {isOldPatient, paymentModeData, symptomsData } from "../../../../../common/data/FakeData";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import AppointmentApiService from "../../../../../helpers/services/appointment/appointment-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";

const EditCheckupDetail = (props: any) => {
    const opdApiService: OPDApiService = new OPDApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    // const [data, setData] = useState(props.data);
    const [selectedType, setSelectedType] = useState<any>([]);
    const [selectedTitles, setSelectedTitles] = useState<any>([]);
    const [symptomsType, setSymptomsType] = useState<any>('');
    const [symptomsTitle, setSymptomsTitle] = useState<any>('');
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
    const [paymentNote, setPaymentNote] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [reference, setReference] = useState('');
    const [applyTPA, setApplyTPA] = useState(false);
    const [netAmount, setNetAmount] = useState<any>(0);
    const [amount, setAmount] = useState<number>();
    const [paymentMode, setPaymentMode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<any[]>([]);
    const [isAntenatal, setIsAntenatal] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [tax, setTax] = useState(18.00);
    const [totalTax, setTotalTax] = useState(5);
    const [chargeType, setChargeType] = useState('');
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeName, setChargeName] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredChargeNames, setFilteredChargeNames] = useState([]);
    const [standardCharge, setStandardCharge] = useState('');
    const [tpaCharge, setTpaCharge] = useState('');
    const [appliedCharge, setAppliedCharge] = useState<number>();
    const [discount, setDiscount] = useState<number>();
    const [paidAmount, setPaidAmount] = useState('');

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

    const setIpdData = (data: any) => {
        setSelectedPatientId(data.admissions?.patientId || data?.patientId || '');

        // const symptomsTypeArray = (data.admissions?.symptomsType || data?.symptomsType || '')
        //     .split(', ')
        //     .map((type: string) => ({ label: type, value: type }));
        // setSelectedType(symptomsTypeArray);

        // const symptomsTitleArray = (data.admissions?.symptomsTitle || data?.symptomsTitle || '')
        //     .split(', ')
        //     .map((title: string) => ({ label: title, value: title }));
        // setSelectedTitles(symptomsTitleArray);
        setSymptomsTitle(data.admissions?.symptomsTitle || data?.symptomsTitle || 'NA');
        setSymptomsType(data.admissions?.symptomsType || data?.symptomsType || 'NA');
        setSymptomsDescription(data.admissions?.symptomsDescription || data?.symptomsDescription || 'NA');
        setNote(data.admissions?.note || data?.note || '');
        setAnyKnownAllergies(data.admissions?.anyKnownAllergies || data.admissions?.knownAllergies || data?.anyKnownAllergies || 'NA')
        setAdmissionDate(
            data.admissions?.admissionDate || data.admissions?.appointmentDate || data.appointmentDate || ''
        );
        setCasualty(data.admissions?.casualty || data?.casualty || false);
        setOldPatient(data.admissions?.oldPatient || data?.oldPatient || false);
        setReference(data.admissions?.reference || data?.reference || '');

        if (data.admissions?.doctorId || data?.doctorId) {
            onSelectedDoctorId(data.admissions?.doctorId || data?.doctorId);
        }

        setIsAntenatal(data.admissions?.antenatal || data?.antenatal || false);
        setChargeCategory(data?.chargeCategory || '');
        setChargeName(data?.chargeName || '');
        setStandardCharge(data?.standardCharge || 0);
        setAppliedCharge(data?.appliedCharge || 0);
        setDiscountPercentage(data?.discountPercentage || 0);
        setTax(data?.taxPercentage || 0);
        setAmount(data?.amount || 0);
        setPaidAmount(data?.paidAmount || 0);
        setPaymentMode(data?.paymentMode || '');

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
    };


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
                patientId: props?.data?.admissions?.patientId,
                doctorId: consultantDoctor,
                admissionDate: admissionDate,
                cardLimit: 20000,
                symptomsType: symptomsType,
                symptomsTitle: symptomsTitle,
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
            await opdApiService.editOPD(props?.data?.admissions?.admissionId || props?.data?.admissionId, payload);
            toast.success('Admission Details Updated Successfully', { containerId: 'TR' });
            props.handleClose();
            if (props.refresh) {
                props.refresh();
            }
            if(props.handleParentClose){
                props.handleParentClose();
            }
        } catch (error: any) {
            console.log("Admission Updated Failed", error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        setIpdData(props?.data);
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
                                                    <Row>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-type" className="form-label ">Symptoms Type</Label>
                                                                <Input
                                                                    id="symptoms-type"
                                                                    name="symptoms-type"
                                                                    type="text"
                                                                    value={symptomsType}
                                                                    onChange={e => setSymptomsType(e.target.value)}
                                                                />
                                                                {/* <Select
                                                                    id="symptoms-type"
                                                                    value={selectedType}
                                                                    isMulti={true}
                                                                    onChange={handleTypeChange}
                                                                    options={symptomsData.map(symptom => ({
                                                                        label: symptom.symptomsType,
                                                                        value: symptom.symptomsType,
                                                                    }))}
                                                                    styles={customStyles}
                                                                /> */}
                                                            </div>
                                                        </Col>
                                                        <Col md={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="symptoms-title" className="form-label ">Symptoms Title</Label>
                                                                <Input
                                                                    id="symptoms-title"
                                                                    name="symptoms-title"
                                                                    type="text"
                                                                    value={symptomsTitle}
                                                                    onChange={e => setSymptomsTitle(e.target.value)}
                                                                />
                                                                {/* <Select
                                                                    id="symptoms-title"
                                                                    value={selectedTitles}
                                                                    isMulti={true}
                                                                    onChange={handleTitleChange}
                                                                    options={titleOptions}
                                                                    styles={customStyles}
                                                                /> */}
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
                                                                    onChange={e => setSymptomsDescription(e.target.value)}
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
                                                                    type="datetime-local"
                                                                    value={admissionDate}
                                                                    // min={today}
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
                                                                {consultantDoctorValidationError && <div className="invalid-feedback">Consultant Doctor Required.</div>}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Payment Date<span className="text-danger">*</span></label>
                                                                <Input
                                                                    id="paymentDate"
                                                                    name="paymentDate"
                                                                    type="datetime-local"
                                                                    value={paymentDate}
                                                                    onChange={(e) => setPaymentDate(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label className="text-start mb-2">Amount  <span className="text-danger">*</span></label>
                                                                <Input
                                                                    id="Amount"
                                                                    name="Amount"
                                                                    type="text"
                                                                    value={netAmount}
                                                                    onChange={(e) => setNetAmount(e.target.value)}
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
                                                                <label className="text-start mb-2">Payment Note </label>
                                                                <Input
                                                                    id="PaymentNote"
                                                                    name="PaymentNote"
                                                                    type="text"
                                                                    value={paymentNote}
                                                                    onChange={(e) => setPaymentNote(e.target.value)}
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
export default EditCheckupDetail