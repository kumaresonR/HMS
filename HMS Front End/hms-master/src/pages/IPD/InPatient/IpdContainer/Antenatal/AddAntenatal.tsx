import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormFeedback, FormGroup, Input, Row } from "reactstrap"
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";

const AddAntenatal = (props: any) => {
    const ipdApiService: IPDApiService = new IPDApiService();

    const [data, setData] = useState(props.data);
    const [bleeding, setBleeding] = useState('');
    const [headache, setHeadache] = useState('');
    const [pain, setPain] = useState('');
    const [constipation, setConstipation] = useState('');
    const [urinarySymptoms, setUrinarySymptoms] = useState('');
    const [vomiting, setVomiting] = useState('');
    const [cough, setCough] = useState('');
    const [vaginal, setVaginal] = useState('');
    const [discharge, setDischarge] = useState('');
    const [height, setHeight] = useState<number>();
    const [heightValidationError, setHeightValidationError] = useState('');
    const [oedema, setOedema] = useState('');
    const [haemoroids, setHaemoroids] = useState('');
    const [weight, setWeight] = useState<number>();
    const [weightValidationError, setWeightValidationError] = useState('');
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [condition, setCondition] = useState('');
    const [specialFindingsAndRemark, setSpecialFindingsAndRemark] = useState('');
    const [pelvicExamination, setPelvicExamination] = useState('');
    const [SP, setSP] = useState('');

    const [uterSize, setUterSize] = useState('');
    const [uterusSize, setUterusSize] = useState('');
    const [presentationPosition, setPresentationPosition] = useState('');
    const [presentingPartToBrim, setPresentingPartToBrim] = useState('');
    const [foetaHeart, setFoetaHeart] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [antenatalOedema, setAntenatalOedema] = useState('');
    const [urine, setUrine] = useState('');
    const [urineAaibumen, setUrineAaibumen] = useState('');
    const [antenatalWeight, setAntenatalWeight] = useState<number>();
    const [remark, setRemark] = useState('');
    const [nextVisit, setNextVisit] = useState('');
    const [previousAntenatalDetails, setPreviousAntenatalDetails] = useState('');

    const handleHeightChange = (value: string) => {
        const numericValue = parseFloat(value);
        setHeight(numericValue);
        validateHeight(numericValue);
    };

    const handleWeightChange = (value: string) => {
        const numericValue = parseFloat(value);
        setWeight(numericValue);
        validateWeight(numericValue);
    };

    const validateHeight = (value: number | undefined) => {
        if (value === undefined || value === null) {
            setHeightValidationError('Height is required.');
            return false;
        } else if (value <= 0) {
            setHeightValidationError('Height must be greater than 0.');
            return false;
        } else {
            setHeightValidationError('');
            return true;
        }
    };

    const validateWeight = (value: number | undefined) => {
        if (value === undefined || value === null) {
            setWeightValidationError('Weight is required.');
            return false;
        } else if (value <= 0) {
            setWeightValidationError('Weight must be greater than 0.');
            return false;
        } else {
            setWeightValidationError('');
            return true;
        }
    };

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (height) {
            if (!validateHeight(height)) {
                isFormValid = false;
            }
        }

        if (weight) {
            if (!validateWeight(weight)) {
                isFormValid = false;
            }
        }

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateOperation();
        }
    }

    const doCreateOperation = async () => {
        try {
            let payload: any = {
                ipdId: data.admissions?.ipdId,
                bleeding: bleeding || 'NA',
                headache: headache || 'NA',
                pain: pain || 'NA',
                constipation: constipation || 'NA',
                urinarySymptoms: urinarySymptoms || 'NA',
                vomiting: vomiting || 'NA',
                cough: cough || 'NA',
                vaginal: vaginal || 'NA',
                discharge: discharge || 'NA',
                height: height,
                oedema: oedema || 'NA',
                haemoroids: haemoroids || 'NA',
                weight: weight,
                date: date,
                condition: condition || 'NA',
                specialFindingsAndRemark: specialFindingsAndRemark || 'NA',
                pelvicExamination: pelvicExamination || 'NA',
                sp: SP || 'NA',
                uterSize: uterSize || 'NA',
                uterusSize: uterusSize || 'NA',
                presentationPosition: presentationPosition || 'NA',
                presentingPartToBrim: presentingPartToBrim || 'NA',
                foetalHeart: foetaHeart || 'NA',
                bloodPressure: bloodPressure || 'NA',
                antenatalOedema: antenatalOedema || 'NA',
                urineSugar: urine || 'NA',
                urineAlbumen: urineAaibumen || 'NA',
                antenatalWeight: antenatalWeight,
                remark: remark || 'NA',
                nextVisit: nextVisit || 'NA',
                previousAntenatalDetails: previousAntenatalDetails || 'NA'
            }
            await ipdApiService.createAntenatal(payload);
            toast.success('Antenatal Created Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("Antenatal Failed", error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col lg={8}>
                        <h5>History Of Present Pregnancy </h5>
                        <hr />
                        <Row>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Bleeding</label>
                                    <Input
                                        id="Bleeding"
                                        name="Bleeding"
                                        type="text"
                                        value={bleeding}
                                        onChange={e => setBleeding(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Headache</label>
                                    <Input
                                        id="Headache"
                                        name="Headache"
                                        type="text"
                                        value={headache}
                                        onChange={e => setHeadache(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Pain</label>
                                    <Input
                                        id="Pain"
                                        name="Pain"
                                        type="text"
                                        value={pain}
                                        onChange={e => setPain(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Constipation</label>
                                    <Input
                                        id="Constipation"
                                        name="Constipation"
                                        type="text"
                                        value={constipation}
                                        onChange={e => setConstipation(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Urinary Symptoms</label>
                                    <Input
                                        id="UrinarySymptoms"
                                        name="Urinary Symptoms"
                                        type="text"
                                        value={urinarySymptoms}
                                        onChange={e => setUrinarySymptoms(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Vomiting</label>
                                    <Input
                                        id="Vomiting"
                                        name="Vomiting"
                                        type="text"
                                        value={vomiting}
                                        onChange={e => setVomiting(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Cough</label>
                                    <Input
                                        id="Cough"
                                        name="Cough"
                                        type="text"
                                        value={cough}
                                        onChange={e => setCough(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Vaginal</label>
                                    <Input
                                        id="Vaginal"
                                        name="Vaginal"
                                        type="text"
                                        value={vaginal}
                                        onChange={e => setVaginal(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Discharge</label>
                                    <Input
                                        id="Discharge"
                                        name="Discharge"
                                        type="text"
                                        value={discharge}
                                        onChange={e => setDischarge(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Height</label>
                                    <Input
                                        id="Height"
                                        name="Height"
                                        type="number"
                                        invalid={!!heightValidationError}
                                        value={height}
                                        onChange={e => handleHeightChange(e.target.value)}
                                    />
                                    {heightValidationError && <FormFeedback>{heightValidationError}</FormFeedback>}
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Oedema</label>
                                    <Input
                                        id="Oedema"
                                        name="Oedema"
                                        type="text"
                                        value={oedema}
                                        onChange={e => setOedema(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Haemoroids</label>
                                    <Input
                                        id="Haemoroids"
                                        name="Haemoroids"
                                        type="text"
                                        value={haemoroids}
                                        onChange={e => setHaemoroids(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Weight</label>
                                    <Input
                                        id="Weight"
                                        name="Weight"
                                        type="number"
                                        value={weight}
                                        invalid={!!weightValidationError}
                                        onChange={e => handleWeightChange(e.target.value)}
                                    />
                                    {weightValidationError && <FormFeedback>{weightValidationError}</FormFeedback>}
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <label className="text-start mb-2">Date <span className="text-danger">*</span></label>
                                    <Input className={` ${dateValidationError ? 'is-invalid' : ''}`}
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={date}
                                        onChange={e => handleDateChange(e.target.value)}
                                    />
                                    {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label className="text-start mb-2">Condition</label>
                                    <textarea className="form-control"
                                        id="Condition"
                                        name="Condition"
                                        value={condition}
                                        onChange={e => setCondition(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label className="text-start mb-2">Special Findings And Remark</label>
                                    <textarea className="form-control"
                                        id="SpecialFindingsAndRemark"
                                        name="SpecialFindingsAndRemark"
                                        value={specialFindingsAndRemark}
                                        onChange={e => setSpecialFindingsAndRemark(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label className="text-start mb-2">Pelvic Examination</label>
                                    <textarea className="form-control"
                                        id="PelvicExamination"
                                        name="PelvicExamination"
                                        value={pelvicExamination}
                                        onChange={e => setPelvicExamination(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label className="text-start mb-2">SP</label>
                                    <textarea className="form-control"
                                        id="SP"
                                        name="SP"
                                        value={SP}
                                        onChange={e => setSP(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={4}>
                        <h5>Antenatal Examination </h5>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Uter Size</label>
                                    <Input
                                        id="UterSize"
                                        name="UterSize"
                                        type="text"
                                        value={uterSize}
                                        onChange={e => setUterSize(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Uterus Size</label>
                                    <Input
                                        id="UterusSize"
                                        name="UterusSize"
                                        type="text"
                                        value={uterusSize}
                                        onChange={e => setUterusSize(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Presentation Position</label>
                                    <Input
                                        id="PresentationPosition"
                                        name="PresentationPosition"
                                        type="text"
                                        value={presentationPosition}
                                        onChange={e => setPresentationPosition(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Presenting Part To Brim </label>
                                    <Input
                                        id="PresentingPartToBrim"
                                        name="PresentingPartToBrim"
                                        type="text"
                                        value={presentingPartToBrim}
                                        onChange={e => setPresentingPartToBrim(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Foeta Heart</label>
                                    <Input
                                        id="FoetaHeart"
                                        name="FoetaHeart"
                                        type="text"
                                        value={foetaHeart}
                                        onChange={e => setFoetaHeart(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Blood Pressure</label>
                                    <Input
                                        id="BloodPressure"
                                        name="BloodPressure"
                                        type="text"
                                        value={bloodPressure}
                                        onChange={e => setBloodPressure(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Antenatal Oedema</label>
                                    <Input
                                        id="AntenatalOedema"
                                        name="AntenatalOedema"
                                        type="text"
                                        value={antenatalOedema}
                                        onChange={e => setAntenatalOedema(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Urine (Sugar)</label>
                                    <Input
                                        id="Urine(Sugar)"
                                        name="Urine(Sugar)"
                                        type="text"
                                        value={urine}
                                        onChange={e => setUrine(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Urine Aaibumen</label>
                                    <Input
                                        id="UrineAaibumen"
                                        name="UrineAaibumen"
                                        type="text"
                                        value={urineAaibumen}
                                        onChange={e => setUrineAaibumen(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="text-start mb-2">Antenatal weight</label>
                                    <Input
                                        id="Antenatalweight"
                                        name="Antenatalweight"
                                        type="number"
                                        value={antenatalWeight}
                                        onChange={e => setAntenatalWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label className="text-start mb-2">Remark</label>
                                    <textarea className="form-control"
                                        id="Remark"
                                        name="Remark"
                                        value={remark}
                                        onChange={e => setRemark(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label className="text-start mb-2">Next Visit</label>
                                    <Input
                                        id="NextVisit"
                                        name="NextVisit"
                                        value={nextVisit}
                                        type="date"
                                        onChange={e => setNextVisit(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label className="text-start mb-2">Previous Antenatal Details</label>
                                    <Input
                                        id="Previous Antenatal Details"
                                        name="Previous Antenatal Details"
                                        type="text"
                                        value={previousAntenatalDetails}
                                        onChange={e => setPreviousAntenatalDetails(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Col className="text-end" >
                            <Button color="primary">Save</Button>
                        </Col>
                    </Col>
                </Row>
            </Form>
        </Container>
    </>
}

export default AddAntenatal