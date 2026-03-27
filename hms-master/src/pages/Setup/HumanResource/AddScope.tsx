import React, { useEffect, useState } from 'react'
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const AddScope = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [scopeData, setScopeData] = useState<any[]>([]);
    const [nameValidationError, setNameValidationError] = useState(false);
    const [description, setDescription] = useState<any>('');

    const addScope = () => {
        setScopeData([...scopeData, {
            scopeName: '',
            description: '',
        }])
    }

    const handleDataChange = (index: number, field: string, value: any) => {
        const newScope = [...scopeData];
        newScope[index] = {
            ...newScope[index],
            [field]: value,
        }
        setScopeData(newScope);

        switch (field) {
            case 'scopeName':
                setNameValidationError(!value);
                break;
            default:
                break;
        }
    }

    const removeScope = (index: any) => {
        const newScope = [...scopeData];
        newScope.splice(index, 1);
        setScopeData(newScope);
    };

    const validateForm = () => {
        let isFormValid = true;

        const durationErrors = scopeData.map((item: any) => {
            const errors = {
                scopeName: !item.scopeName,
            };
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setNameValidationError(durationErrors.some(error => error.scopeName));
        return isFormValid;
    };


    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createScope();
        }
    }
    const createScope = async () => {
        try {
            const payload: any = scopeData
            await setupApiService.createScope(payload);
            navigate('/main/humanResourceMainSetup');
            toast.success('Scope Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addScope();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Scope" pageTitle="Setup" />
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
                                        {scopeData.map((item: any, index: any) => (
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="scopeName">Scope Name <span className='text-danger'> * </span></Label>
                                                        <Input
                                                            type="text"
                                                            id="name"
                                                            value={item.scopeName}
                                                            onChange={e => handleDataChange(index, 'scopeName', e.target.value)}
                                                            invalid={!!nameValidationError && !item.scopeName}
                                                        />
                                                        {nameValidationError && !item.scopeName && (
                                                            <div className="invalid-feedback">Scope Name Required</div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="Description">Description</Label>
                                                        <textarea className='form-control'
                                                            id="Description"
                                                            value={item.description}
                                                            onChange={e => handleDataChange(index, 'description', e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                {index !== 0 && (
                                                    <Col xs="auto pt-2">
                                                        <button onClick={() => removeScope(index)} className="btn btn-soft-danger">
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
                                                className="btn btn-primary mb-3 add-bt"
                                                onClick={addScope}><FontAwesomeIcon icon={faCirclePlus} />
                                                &nbsp;Add New</Button>
                                        </Col>
                                        <Col className='text-center'>
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

export default AddScope