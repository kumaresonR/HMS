import React, { useState, } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const AddBloodProducts = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [type, setType] = useState('');
    const [typeValidationError, setTypeValidationError] = useState(false);
    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleTypeChange = (value: any) => {
        setType(value);
        setTypeValidationError(false);
    }

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!type) {
            setTypeValidationError(true);
            isFormValid = false;
        }

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        // if (!modNo) {
        //     setModNoValidationError(true);
        //     isFormValid = false;
        // }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createCategory();
        }
    }
    const createCategory = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                name: name,
                type: type,
            }
            await setupApiService.createProduct(payload);
            navigate('/main/BloadBankMainSetup');
            toast.success('Product Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Add Products" pageTitle="Blood Bank" />
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
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="type">Type <span className='text-danger'> * </span></Label>
                                                <Input
                                                    type="select"
                                                    id="type"
                                                    value={type}
                                                    onChange={e => handleTypeChange(e.target.value)}
                                                    invalid={!!typeValidationError}
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="Component">Component</option>
                                                    <option value="Blood Group">Blood Group</option>
                                                </Input>
                                                {typeValidationError && <div className="invalid-feedback">Type required</div>}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="name">Name <span className='text-danger'> * </span></Label>
                                                <Input
                                                    type="text"
                                                    id="name"
                                                    value={name}
                                                    onChange={e => handleNameChange(e.target.value)}
                                                    invalid={!!nameValidationError}
                                                />
                                                {nameValidationError && (
                                                    <div className="invalid-feedback"> Name Required</div>
                                                )}
                                            </FormGroup>
                                        </Col>
                                        {/* <Col>
                                            <FormGroup>
                                                <Label for="name">Version <span className='text-danger'> * </span></Label>
                                                <Input
                                                    type="text"
                                                    id="name"
                                                    value={modNo}
                                                    onChange={e => handleModNoChange(e.target.value)}
                                                    invalid={!!modNoValidationError}
                                                />
                                                {modNoValidationError && (
                                                    <div className="invalid-feedback">Version Required</div>
                                                )}
                                            </FormGroup>
                                        </Col> */}
                                    </Row>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default AddBloodProducts;
