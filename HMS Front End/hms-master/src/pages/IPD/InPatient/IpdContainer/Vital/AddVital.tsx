import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { Button, Col, Container, FormGroup, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { vitalData } from "../../../../../common/data/IpdData";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";

const AddVital = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState(props.data);
    const [vitals, setVitals] = useState<any[]>([]);
    const [dateValidationError, setDateValidationError] = useState(false);
    const [vitalNameValidationError, setVitalNameValidationError] = useState(false);
    const [vitalValueValidationError, setVitalValueValidationError] = useState(false);

    const addNew = () => {
        if(props.title === 'ipd') {
            setVitals([...vitals, { ipdId: data.admissions?.ipdId ,date: '', vitalName: '', vitalValue: '' }]);
        } else {
            setVitals([...vitals, { opdId: data.admissions?.opdId ,date: '', vitalName: '', vitalValue: '' }]);
        }
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const netVital = [...vitals];
        netVital[index] = {
            ...netVital[index],
            [field]: value,
        };
        setVitals(netVital);

        switch (field) {
            case 'date':
                setDateValidationError(!value);
                break;
            case 'vitalName':
                setVitalNameValidationError(!value);
                break;
            case 'vitalValue':
                setVitalValueValidationError(!value);
                break;
            default:
                break;
        }
    };

    const removeVitals = (index: any) => {
        const netVital = [...vitals];
        netVital.splice(index, 1);
        setVitals(netVital);
    };

    const validateForm = () => {
        let isFormValid = true;

        const vitalErrors = vitals.map((vital) => {
            const errors = {
                date: !vital.date,
                vitalName: !vital.vitalName,
                vitalValue: !vital.vitalValue,
            };

            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        // Set validation errors for all vitals
        setDateValidationError(vitalErrors.some(error => error.date));
        setVitalNameValidationError(vitalErrors.some(error => error.vitalName));
        setVitalValueValidationError(vitalErrors.some(error => error.vitalValue));
        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateVital();
        }
    }

    const doCreateVital = async () => {
        try {
            let payload: any =  vitals;
            if(props.title === 'ipd') {
                await iPDApiService.createVital(payload);
            } else {
                await opdApiService.createVital(payload);
            }
            toast.success('Vitals Created Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            console.log("Vitals Created Failed", error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addNew();
    }, []);
    return <>
        <Container fluid>
            <Row>
                <Col md={11} className="mx-auto">
                    {vitals.map((vital: any, index: any) => (
                        <Row key={index} className="align-items-center">
                            <Col sm={12} md>
                                <FormGroup>
                                    <label className="text-start mb-2">Vital Name <span className="text-danger">*</span></label>
                                    <select
                                        className={`${vitalNameValidationError && !vital.vitalName ? 'is-invalid' : ''} form-control`}
                                        value={vital.vitalName}
                                        onChange={(e) => handleInputChange(index, 'vitalName', e.target.value)}
                                    >
                                        <option value="">--Select Vital Name--</option>
                                        {vitalData.map((data: any, idx: any) => (
                                            <option key={idx} value={data.name}>{data.name}</option>
                                        ))}
                                    </select>
                                    {vitalNameValidationError && !vital.vitalName && <div className="invalid-feedback">Vital Name Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col sm={12} md>
                                <FormGroup>
                                    <label className="text-start mb-2">Vital Value<span className="text-danger">*</span></label>
                                    <Input
                                        className={`${vitalValueValidationError && !vital.vitalValue ? 'is-invalid' : ''} form-control`}
                                        id="VitalValue"
                                        name="VitalValue"
                                        type="text"
                                        value={vital.vitalValue}
                                        onChange={(e) => handleInputChange(index, 'vitalValue', e.target.value)}
                                    />
                                    {vitalValueValidationError && !vital.vitalValue && <div className="invalid-feedback">Vital Value Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col sm={12} md>
                                <FormGroup>
                                    <label className="text-start mb-2">Date<span className="text-danger">*</span></label>
                                    <Input
                                        className={`${dateValidationError && !vital.date ? 'is-invalid' : ''} form-control`}
                                        id="date"
                                        name="date"
                                        type="datetime-local"
                                        value={vital.date}
                                        onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                                    />
                                    {dateValidationError && !vital.date && <div className="invalid-feedback">Date Required.</div>}
                                </FormGroup>
                            </Col>
                            <Col xs="auto">
                                {index !== 0 && (
                                    <Button onClick={() => removeVitals(index)} color="danger">
                                        <FontAwesomeIcon
                                            className="mx-2"
                                            icon={faXmark}
                                        />
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ))}
                    <Button onClick={addNew} color="success"><FontAwesomeIcon icon={faCirclePlus} />
                        &nbsp;Add New</Button>
                </Col>

                <Col className="text-end">
                    <Button onClick={handleSubmit}>Save</Button>
                </Col>
            </Row>
        </Container >
    </>
}
export default AddVital