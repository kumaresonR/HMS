import { useLocation, useNavigate } from "react-router-dom";
import SetupApiService from "../../../helpers/services/setup/setup-api-service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ErrorHandler from "../../../helpers/ErrorHandler";
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import React from "react";
import FormHeader from "../../../common/FormHeader/FormHeader";

const EditBloodProducts = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const data = state?.data;

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
            editProduct();
        }
    }
    const editProduct = async () => {
        try {
            const payload: any = {
                // modNo: modNo,
                name: name,
                type: type,
            }
            await setupApiService.editProduct(data.id, payload);
            navigate('/main/BloadBankMainSetup');
            toast.success('Product Updated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        if (state?.data) {
            // setModNo(data.modNo);
            setName(data.name);
            setType(data.type);
        }
    }, [state?.data]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Edit Products" pageTitle="Blood Bank" />
                <Card>
                    <CardBody>
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

export default EditBloodProducts;