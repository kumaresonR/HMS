import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';

const AddDosageDuration = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [durationData, setDurationData] = useState<any[]>([]);
    const [durationValidationError, setDurationValidationError] = useState(false);
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const addDuration = () => {
        setDurationData([...durationData, {
            duration: '',
            // modNo: '',
        }])
    }

    const handleDurationDataChange = (index: number, field: string, value: any) => {
        const newDuration = [...durationData];
        newDuration[index] = {
            ...newDuration[index],
            [field]: value,
        }
        setDurationData(newDuration);

        switch (field) {
            case 'duration':
                setDurationValidationError(!value);
                break;
            // case 'modNo':
            //     setModNoValidationError(!value);
            //     break;
            default:
                break;
        }
    }

    const removeDuration = (index: any) => {
        const newDuration = [...durationData];
        newDuration.splice(index, 1);
        setDurationData(newDuration);
    };

    const validateForm = () => {
        let isFormValid = true;

        const durationErrors = durationData.map((item: any) => {
            const errors = {
                duration: !item.duration,
                // modNo: !item.modNo,
            };
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setDurationValidationError(durationErrors.some(error => error.duration));
        // setModNoValidationError(durationErrors.some(error => error.modNo));

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createDoseDuration();
        }
    }
    const createDoseDuration = async () => {
        try {
            const payload: any = durationData;
            await setupApiService.createDoseDuration(payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Duration Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addDuration();
    }, []);


    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Dosage Duration" pageTitle="Setup" />
                    <Card>
                        <CardBody>
                            <div className='text-end'>
                                <Button
                                    color="primary"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-primary add-btn mx-2"
                                >
                                    <IoArrowBack /> Back
                                </Button>
                            </div>
                            <Row className="d-flex ">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            {durationData.map((item: any, index: any) => (
                                                <Col md={6}>
                                                    <Row className='align-items-center'>
                                                        <Col>
                                                            <FormGroup>
                                                                <Label for="duration"> Dosage Duration <span className='text-danger'> * </span></Label>
                                                                <Input
                                                                    className={`${durationValidationError && !item.duration ? 'is-invalid' : ''}`}
                                                                    type="text"
                                                                    id="duration"
                                                                    value={item.duration}
                                                                    onChange={e => handleDurationDataChange(index, 'duration', e.target.value)}

                                                                />
                                                                {durationValidationError && !item.duration && <div className="invalid-feedback">Dosage Duration  Required</div>}
                                                            </FormGroup>
                                                        </Col>
                                                        {/* <Col>
                                                    <FormGroup>
                                                        <Label for="name">Version <span className='text-danger'> * </span></Label>
                                                        <Input
                                                            className={`${modNoValidationError && !item.modNo ? 'is-invalid' : ''}`}
                                                            type="text"
                                                            id="name"
                                                            value={index.modNo}
                                                            onChange={e => handleDurationDataChange(index, 'modNo', e.target.value)}
                                                        />
                                                        {modNoValidationError && !item.modNo && (
                                                            <div className="invalid-feedback">Version Required</div>
                                                        )}
                                                    </FormGroup>
                                                </Col> */}
                                                        {index !== 0 && (
                                                            <Col xs="auto pt-2">
                                                                <button onClick={() => removeDuration(index)} className="btn btn-soft-danger">
                                                                    <FontAwesomeIcon
                                                                        className="mx-2"
                                                                        icon={faXmark}
                                                                    />
                                                                </button>
                                                            </Col>
                                                        )}
                                                    </Row>
                                                </Col>
                                            ))}
                                        </Row>


                                        <Col className='text-start'>
                                            <Button
                                                color="primary"
                                                className="btn btn-primary mx-3 mb-3 add-bt"
                                                onClick={addDuration}><FontAwesomeIcon icon={faCirclePlus} />
                                                &nbsp;Add New</Button>
                                        </Col>

                                        <Col className='text-end'>
                                            <Button type="submit" color="primary">Submit</Button>
                                        </Col>
                                    </Form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AddDosageDuration;
