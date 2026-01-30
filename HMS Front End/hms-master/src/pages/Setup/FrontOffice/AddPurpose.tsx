import React, { useState,  useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const AddPurpose = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [purposeData, setPurposeData] = useState<any[]>([]);
    const [purposeValidationError, setPurposeValidationError] = useState(false);
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const addPurpose = () => {
        setPurposeData([...purposeData, {
            purpose: '',
            description: '',
            // modNo: '',
        }])
    }

    const handlePurposeDataChange = (index: number, field: string, value: any) => {
        const newPurpose = [...purposeData];
        newPurpose[index] = {
            ...newPurpose[index],
            [field]: value,
        }
        setPurposeData(newPurpose);

        switch (field) {
            case 'purpose':
                setPurposeValidationError(!value);
                break;
            // case 'modNo':
            //     setModNoValidationError(!value);
            //     break;
            default:
                break;
        }
    }

    const removePurpose = (index: any) => {
        const newPurpose = [...purposeData];
        newPurpose.splice(index, 1);
        setPurposeData(newPurpose);
    };

    const validateForm = () => {
        let isFormValid = true;

        const validationErrors = purposeData.map((item: any) => {
            const errors = {
                purpose: !item.purpose,
                // modNo: !item.modNo,
            };
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setPurposeValidationError(validationErrors.some(error => error.purpose));
        // setModNoValidationError(validationErrors.some(error => error.modNo));

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createPurpose();
        }
    }
    const createPurpose = async () => {
        try {
            const payload: any = purposeData;
            await setupApiService.createPurpose(payload);
            navigate('/main/frontofficeMain');
            toast.success('Purpose Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addPurpose();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Purpose" pageTitle="FrontOffice" />
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
                            <Row className="d-flex justify-content-center">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        {purposeData.map((item: any, index: any) => (
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="purpose"> Purpose <span className='text-danger'> * </span> </Label>
                                                        <Input
                                                            className={`${purposeValidationError && !item.purpose ? 'is-invalid' : ''}`}
                                                            type="text"
                                                            id="purpose"
                                                            value={item.purpose}
                                                            onChange={e => handlePurposeDataChange(index, 'purpose', e.target.value)}

                                                        />
                                                        {purposeValidationError && !item.purpose && <div className="invalid-feedback">Purpose  Required</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md>
                                                    <FormGroup>
                                                        <Label for="description"> Description  </Label>
                                                        <textarea
                                                            className={`form-control`}
                                                            id="description"
                                                            value={item.description}
                                                            onChange={e => handlePurposeDataChange(index, 'description', e.target.value)}
                                                        />
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
                                                            onChange={e => handlePurposeDataChange(index, 'modNo', e.target.value)}
                                                        />
                                                        {modNoValidationError && !item.modNo && (
                                                            <div className="invalid-feedback">Version Required</div>
                                                        )}
                                                    </FormGroup>
                                                </Col> */}
                                                {index !== 0 && (
                                                    <Col xs="auto pt-2">
                                                        <button onClick={() => removePurpose(index)} className="btn btn-soft-danger">
                                                            <FontAwesomeIcon
                                                                className="mx-2"
                                                                icon={faXmark}
                                                            />
                                                        </button>
                                                    </Col>
                                                )}
                                            </Row>
                                        ))}

                                        <Col className='text-start'>
                                            <Button
                                                color="primary"
                                                className="btn btn-primary mx-3 mb-3 add-bt"
                                                onClick={addPurpose}><FontAwesomeIcon icon={faCirclePlus} />
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

export default AddPurpose;
