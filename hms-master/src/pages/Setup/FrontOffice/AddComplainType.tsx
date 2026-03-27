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

const AddComplainType = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [complainTypeData, setComplainTypeData] = useState<any[]>([]);
    const [complainTypeValidationError, setComplainTypeValidationError] = useState(false);
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const addNew = () => {
        setComplainTypeData([...complainTypeData, {
            complainType: '',
            description: '',
            // modNo: '',
        }])
    }

    const handleComplainTypeDataChange = (index: number, field: string, value: any) => {
        const newComplain = [...complainTypeData];
        newComplain[index] = {
            ...newComplain[index],
            [field]: value,
        }
        setComplainTypeData(newComplain);

        switch (field) {
            case 'complainType':
                setComplainTypeValidationError(!value);
                break;
            // case 'modNo':
            //     setModNoValidationError(!value);
            //     break;
            default:
                break;
        }
    }

    const removeComplainType = (index: any) => {
        const newComplain = [...complainTypeData];
        newComplain.splice(index, 1);
        setComplainTypeData(newComplain);
    };

    const validateForm = () => {
        let isFormValid = true;

        const validationErrors = complainTypeData.map((item: any) => {
            const errors = {
                complainType: !item.complainType,
                // modNo: !item.modNo,
            };
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setComplainTypeValidationError(validationErrors.some(error => error.complainType));
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
            const payload: any = complainTypeData;
            await setupApiService.createComplainType(payload);
            navigate('/main/frontofficeMain');
            toast.success('Complain Type Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addNew();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Complain Type" pageTitle="Setup" />
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
                                        {complainTypeData.map((item: any, index: any) => (
                                            <Row className='align-items-center'>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="complainType"> Complain Type <span className='text-danger'> * </span> </Label>
                                                        <Input
                                                            className={`${complainTypeValidationError && !item.complainType ? 'is-invalid' : ''}`}
                                                            type="text"
                                                            id="complainType"
                                                            value={item.complainType}
                                                            onChange={e => handleComplainTypeDataChange(index, 'complainType', e.target.value)}

                                                        />
                                                        {complainTypeValidationError && !item.complainType && <div className="invalid-feedback">Complain Type  Required</div>}
                                                    </FormGroup>
                                                </Col>
                                                <Col md>
                                                    <FormGroup>
                                                        <Label for="description"> Description  </Label>
                                                        <textarea
                                                            className={`form-control`}
                                                            id="description"
                                                            value={item.description}
                                                            onChange={e => handleComplainTypeDataChange(index, 'description', e.target.value)}
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
                                                            onChange={e => handleComplainTypeDataChange(index, 'modNo', e.target.value)}
                                                        />
                                                        {modNoValidationError && !item.modNo && (
                                                            <div className="invalid-feedback">Version Required</div>
                                                        )}
                                                    </FormGroup>
                                                </Col> */}
                                                {index !== 0 && (
                                                    <Col xs="auto pt-2">
                                                        <button onClick={() => removeComplainType(index)} className="btn btn-soft-danger">
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
                                                onClick={addNew}><FontAwesomeIcon icon={faCirclePlus} />
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

export default AddComplainType;
