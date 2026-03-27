import { Button, Col, Container, FormGroup, Input, Row } from "reactstrap"
import { vitalData } from "../../../../../common/data/IpdData"
import { useEffect, useState } from "react"
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";

const EditVital = (props: any) => {
    const iPDApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();

    const [data, setData] = useState(props.data);
    const [ipdId, setIpdId] = useState('');
    const [opdId, setOpdId] = useState('');
    const [vitalName, setVitalName] = useState('');
    const [vitalValue, setVitalValue] = useState('');
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [vitalNameValidationError, setVitalNameValidationError] = useState(false);
    const [vitalValueValidationError, setVitalValueValidationError] = useState(false);

    const handleVitalValueChange = (value: any) => {
        setVitalValue(value);
        setVitalValueValidationError(false);
    }

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const getVitalById = async () => {
        try {
            if (props.title === 'ipd') {
                let data = await iPDApiService.getVitalById(props.id);
                setVitalData(data);
            } else {
                let data = await opdApiService.getVitalById(props.id);
                setVitalData(data);
            }
            console.log('getVitalById data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const setVitalData = (data: any) => {
        setVitalName(data.vitalName);
        setVitalValue(data.vitalValue);
        setDate(new Date(data.date).toISOString().slice(0, 16));
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!vitalName) {
            setVitalNameValidationError(true);
            isFormValid = false;
        }

        if (!vitalValue) {
            setVitalValueValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }

        return isFormValid;

    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            let payload: any = {
                date: date,
                vitalName: vitalName,
                vitalValue: vitalValue
            };
            if (props.title === 'ipd') {
                payload.ipdId = data.admissions?.ipdId;
            } else {
                payload.opdId = data.admissions?.opdId;
            }
            if (props.title === 'ipd') {
                await iPDApiService.editVital(props.id, payload);
            } else {
                await opdApiService.editVital(props.id, payload);
            }
            toast.success('Vitals Updated Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getVitalById();
    }, []);

    return <>
        <Container fluid>
            <Row>
                <Col md={11} className="mx-auto">
                    <Row className="align-items-center">
                        <Col sm={12} md>
                            <FormGroup>
                                <label className="text-start mb-2">Vital Name <span className="text-danger">*</span></label>
                                <select disabled
                                    className={`form-control`}
                                    value={vitalName}
                                    onChange={(e) => setVitalName(e.target.value)}
                                >
                                    <option value="">--Select Vital Name--</option>
                                    {vitalData.map((data: any, idx: any) => (
                                        <option key={idx} value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                            </FormGroup>
                        </Col>
                        <Col sm={12} md>
                            <FormGroup>
                                <label className="text-start mb-2">Vital Value<span className="text-danger">*</span></label>
                                <Input
                                    id="VitalValue"
                                    name="VitalValue"
                                    type="text"
                                    value={vitalValue}
                                    className={`${vitalValueValidationError ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleVitalValueChange(e.target.value)}
                                />
                                {vitalValueValidationError && <div className="invalid-feedback">Vital Value Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col sm={12} md>
                            <FormGroup>
                                <label className="text-start mb-2">Date<span className="text-danger">*</span></label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="datetime-local"
                                    value={date}
                                    className={`${dateValidationError ? 'is-invalid' : ''}`}
                                    onChange={e => handleDateChange(e.target.value)}
                                />
                                {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Col className="text-end">
                        <Button onClick={handleSubmit}>Update</Button>
                    </Col>
                </Col>
            </Row>
        </Container >
    </>
}

export default EditVital