import React, { useState, useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { IoArrowBack } from 'react-icons/io5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const AddSource = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [sourceData, setSourceData] = useState<any[]>([]);
    const [sourceValidationError, setSourceValidationError] = useState(false);
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const addSource = () => {
        setSourceData([...sourceData, {
            source: '',
            description: '',
            // modNo: '',
        }])
    }

    const handleSourceDataChange = (index: number, field: string, value: any) => {
        const newSource = [...sourceData];
        newSource[index] = {
            ...newSource[index],
            [field]: value,
        }
        setSourceData(newSource);

        switch (field) {
            case 'source':
                setSourceValidationError(!value);
                break;
            // case 'modNo':
            //     setModNoValidationError(!value);
            //     break;
            default:
                break;
        }
    }

    const removesource = (index: any) => {
        const newSource = [...sourceData];
        newSource.splice(index, 1);
        setSourceData(newSource);
    };

    const validateForm = () => {
        let isFormValid = true;

        const validationErrors = sourceData.map((item: any) => {
            const errors = {
                source: !item.source,
                // modNo: !item.modNo,
            };
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setSourceValidationError(validationErrors.some(error => error.source));
        // setModNoValidationError(validationErrors.some(error => error.modNo));

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createsource();
        }
    }
    const createsource = async () => {
        try {
            const payload: any = sourceData;
            await setupApiService.createSource(payload);
            navigate('/main/frontofficeMain');
            toast.success('Source Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addSource();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Source" pageTitle="Setup" />
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
                                        {sourceData.map((item: any, index: any) => (
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="source"> Source <span className='text-danger'> * </span> </Label>
                                                        <Input
                                                            className={`${sourceValidationError && !item.source ? 'is-invalid' : ''}`}
                                                            type="text"
                                                            id="source"
                                                            value={item.source}
                                                            onChange={e => handleSourceDataChange(index, 'source', e.target.value)}

                                                        />
                                                        {sourceValidationError && !item.source && <div className="invalid-feedback">source  Required</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md>
                                                    <FormGroup>
                                                        <Label for="description"> Description  </Label>
                                                        <textarea
                                                            className={`form-control`}
                                                            id="description"
                                                            value={item.description}
                                                            onChange={e => handleSourceDataChange(index, 'description', e.target.value)}
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
                                                            onChange={e => handleSourceDataChange(index, 'modNo', e.target.value)}
                                                        />
                                                        {modNoValidationError && !item.modNo && (
                                                            <div className="invalid-feedback">Version Required</div>
                                                        )}
                                                    </FormGroup>
                                                </Col> */}
                                                {index !== 0 && (
                                                    <Col xs="auto pt-2">
                                                        <button onClick={() => removesource(index)} className="btn btn-soft-danger">
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
                                                onClick={addSource}><FontAwesomeIcon icon={faCirclePlus} />
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

export default AddSource;
