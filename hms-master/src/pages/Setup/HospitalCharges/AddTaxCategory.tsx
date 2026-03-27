import React, { useState } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody, InputGroupText, InputGroup } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import { IoArrowBack } from 'react-icons/io5';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';

const AddTaxCategory = () => {

    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [percentage, setPercentage] = useState('');
    const [percentageValidationError, setPercentageValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const handleNameChange = (value: any) => {
        setName(value);
        setNameValidationError(false);
    }

    const handlePercentageChange = (value: any) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setPercentage(value);
            setPercentageValidationError(false);
        }
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!name) {
            setNameValidationError(true);
            isFormValid = false;
        }

        if (!percentage) {
            setPercentageValidationError(true);
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
            createBedGroup();
        }
    }
    const createBedGroup = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                percentage: percentage,
                name: name,
            }
            await setupApiService.createTaxCategory(payload);
            navigate('/main/hospitalMain');
            toast.success('Tax Category Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Tax Category" pageTitle="Setup" />
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
                                                    <Label for="name">Name <span className='text-danger'> * </span></Label>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={e => handleNameChange(e.target.value)}
                                                        invalid={!!nameValidationError}
                                                    />
                                                    {nameValidationError && <div className="invalid-feedback">Name Required</div>}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="percentage">Percentage <span className='text-danger'> * </span></Label>
                                                    <InputGroup>
                                                        <Input
                                                            type="text"
                                                            id="percentage"
                                                            value={percentage}
                                                            onChange={e => handlePercentageChange(e.target.value)}
                                                            invalid={!!percentageValidationError}
                                                        />
                                                        <InputGroupText>
                                                           %
                                                        </InputGroupText>
                                                    </InputGroup>
                                                    {percentageValidationError && <div className="invalid-feedback">Percentage Required</div>}
                                                </FormGroup>
                                            </Col>
                                            {/* <Col md={6}>
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
                                        <Button color="primary" type="submit">Submit</Button>
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

export default AddTaxCategory;
