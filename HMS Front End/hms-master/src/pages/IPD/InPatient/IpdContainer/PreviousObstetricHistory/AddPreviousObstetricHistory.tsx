import { Button, Col, Container, Form, FormFeedback, FormGroup, Input, Row } from "reactstrap"
import { birthStatusData, genderData } from "../../../../../common/data/IpdData"
import { useEffect, useState } from "react"
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";

const AddPreviousObstetricHistory = (props: any) => {
    const ipdApiService: IPDApiService = new IPDApiService();

    const [data, setData] = useState(props.data);
    const [placeOfDelivery, setPlaceOfDelivery] = useState('');
    const [placeOfDeliveryValidationError, setPlaceOfDeliveryValidationError] = useState(false);
    const [durationOfPregnancy, setDurationOfPregnancy] = useState('');
    const [complicationInPregnancyOrPuerperium, setComplicationInPregnancyOrPuerperium] = useState('');
    const [birthWeight, setBirthWeight] = useState('');
    const [weightValidationError, setWeightValidationError] = useState('');
    const [gender, setGender] = useState('');
    const [infantFeeding, setInfantFeeding] = useState('');
    const [birthStatus, setBirthStatus] = useState('');
    const [aliveOrDeadDate, setAliveOrDeadDate] = useState('');
    const [previousMedicalHistory, setPreviousMedicalHistory] = useState('');
    const [specialInstruction, setSpecialInstruction] = useState('');
    const [deathCause, setDeathCause] = useState('');

    const handlePlaceOfBirthChange = (value: any) => {
        setPlaceOfDelivery(value);
        setPlaceOfDeliveryValidationError(false);
    }

    const handleBirthWeightChange = (value: any) => {
        setBirthWeight(value);
        validateWeight(value);
    }

    const validateWeight = (value: string) => {
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            setWeightValidationError('Weight must be a valid number.');
            return false;
        } else if (parseFloat(value) <= 0) {
            setWeightValidationError('Weight must be greater than 0.');
            return false;
        } else {
            setWeightValidationError('');
            return true;
        }
    };

    const validateForm = () => {
        let isFormValid = true;

        if (!placeOfDelivery) {
            setPlaceOfDeliveryValidationError(true);
            isFormValid = false;
        }

        if (!validateWeight(birthWeight)) {
            isFormValid = false;
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreate();
        }
    }

    const doCreate = async () => {
        try {
            let payload: any = {
                ipdId: data.admissions?.ipdId,
                placeOfDelivery: placeOfDelivery,
                durationOfPregnancy: durationOfPregnancy,
                complicationsInPregnancyOrPuerperium: complicationInPregnancyOrPuerperium,
                birthWeight: birthWeight,
                gender: gender,
                infantFeeding: infantFeeding,
                birthStatus: birthStatus,
                deathCause: deathCause,
                aliveOrDeadDate: aliveOrDeadDate,
                previousMedicalHistory: previousMedicalHistory,
                specialInstruction: specialInstruction
            }
            await ipdApiService.createPreviousObstetricHistory(payload);
            toast.success('Previous Obstetric History Added Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("Previous Obstetric History Failed", error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <>
        <Container fluid>
            <Form onSubmit={handleSubmit} >
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Place Of Delivery <span className="text-danger">*</span> </label>
                            <Input className={` ${placeOfDeliveryValidationError ? 'is-invalid' : ''}`}
                                id="PlaceOfDelivery"
                                name="PlaceOfDelivery"
                                type="text"
                                value={placeOfDelivery}
                                onChange={e => handlePlaceOfBirthChange(e.target.value)}
                            />
                            {placeOfDeliveryValidationError && <div className="invalid-feedback">Place Of Delivery Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Duration Of Pregnancy</label>
                            <Input
                                id="DurationOfPregnancy"
                                name="DurationOfPregnancy"
                                type="text"
                                value={durationOfPregnancy}
                                onChange={e => setDurationOfPregnancy(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Complication In Pregnancy Or Puerperium</label>
                            <Input
                                id="ComplicationInPregnancyOrPuerperium"
                                name="ComplicationInPregnancyOrPuerperium"
                                type="text"
                                value={complicationInPregnancyOrPuerperium}
                                onChange={e => setComplicationInPregnancyOrPuerperium(e.target.value)}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Birth Weight</label>
                            <Input
                                id="BirthWeight"
                                name="BirthWeight"
                                type="text"
                                value={birthWeight}
                                invalid={!!weightValidationError}
                                onChange={e => handleBirthWeightChange(e.target.value)}
                            />
                            {weightValidationError && <FormFeedback>{weightValidationError}</FormFeedback>}
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Gender</label>
                            <select
                                className={`form-control`}
                                value={gender} onChange={(e) => { setGender(e.target.value) }}
                            >
                                <option value="">--Select Gender--</option>
                                {genderData.map((data: any, idx: any) => (
                                    <option key={idx} value={data.name}>{data.name}</option>
                                ))}
                            </select>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Infant Feeding</label>
                            <Input
                                id="InfantFeeding"
                                name="InfantFeeding"
                                type="text"
                                value={infantFeeding}
                                onChange={e => setInfantFeeding(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Birth Status</label>
                            <select
                                className={`form-control`}
                                value={birthStatus} onChange={(e) => { setBirthStatus(e.target.value) }}
                            >
                                <option value="">--Select Birth Status--</option>
                                {birthStatusData.map((data: any, idx: any) => (
                                    <option key={idx} value={data.status}>{data.status}</option>
                                ))}
                            </select>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <label className="text-start mb-2">Alive / Dead Date</label>
                            <Input
                                id="AliveOrDeadDate"
                                name="AliveOrDeadDate"
                                type="date"
                                value={aliveOrDeadDate}
                                onChange={e => setAliveOrDeadDate(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    {birthStatus === "Dead" && (
                        <Col md={4}>
                            <FormGroup>
                                <label className="text-start mb-2">Death Cause</label>
                                <Input
                                    id="DeathCause"
                                    name="DeathCause"
                                    type="text"
                                    value={deathCause}
                                    onChange={e => setDeathCause(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    )}
                    <Col md={12}>
                        <FormGroup>
                            <label className="text-start mb-2">Previous Medical History</label>
                            <textarea className="form-control"
                                id="PreviousMedicalHistory"
                                name="PreviousMedicalHistory"
                                value={previousMedicalHistory}
                                onChange={e => setPreviousMedicalHistory(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={12}>
                        <FormGroup>
                            <label className="text-start mb-2">Special Instruction</label>
                            <textarea className="form-control"
                                id="SpecialInstruction"
                                name="SpecialInstruction"
                                value={specialInstruction}
                                onChange={e => setSpecialInstruction(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col className="text-end">
                        <Button color="primary">Save</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    </>
}
export default AddPreviousObstetricHistory