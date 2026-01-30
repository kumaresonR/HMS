import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const AddPharmacyUnits = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [unitData, setUnitData] = useState<any[]>([]);
    const [unitNameValidationError, setUnitNameValidationError] = useState(false);
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const addUnit = () => {
        setUnitData([...unitData, {
            unitName: '',
            // modNo: '',
        }])
    }

    const handleUnitDataChange = (index: number, field: string, value: any) => {
        const newUnit = [...unitData];
        newUnit[index] = {
            ...newUnit[index],
            [field]: value,
        }
        setUnitData(newUnit);

        switch (field) {
            case 'unitName':
                setUnitNameValidationError(!value);
                break;
            // case 'modNo':
            //     setModNoValidationError(!value);
            //     break;
            default:
                break;
        }
    }

    const removeUnit = (index: any) => {
        const newUnit = [...unitData];
        newUnit.splice(index, 1);
        setUnitData(newUnit);
    };

    const validateForm = () => {
        let isFormValid = true;

        const durationErrors = unitData.map((item: any) => {
            const errors = {
                unitName: !item.unitName,
                // modNo: !item.modNo,
            };
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setUnitNameValidationError(durationErrors.some(error => error.unitName));
        // setModNoValidationError(durationErrors.some(error => error.modNo));

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createUnit();
        }
    }
    const createUnit = async () => {
        try {
            const payload: any = unitData;
            await setupApiService.createUnit(payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Units Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addUnit();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Units" pageTitle="Setup" />
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
                                        {unitData.map((item: any, index: any) => (
                                            <Row className='align-items-center'>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="unitName"> Unit Name <span className='text-danger'> * </span></Label>
                                                        <Input
                                                            className={`${unitNameValidationError && !item.unitName ? 'is-invalid' : ''}`}
                                                            type="text"
                                                            id="unitName"
                                                            value={item.unitName}
                                                            onChange={e => handleUnitDataChange(index, 'unitName', e.target.value)}

                                                        />
                                                        {unitNameValidationError && !item.unitName && <div className="invalid-feedback">Unit Name  Required</div>}
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
                                                            onChange={e => handleUnitDataChange(index, 'modNo', e.target.value)}
                                                        />
                                                        {modNoValidationError && !item.modNo && (
                                                            <div className="invalid-feedback">Version Required</div>
                                                        )}
                                                    </FormGroup>
                                                </Col> */}
                                                {index !== 0 && (
                                                    <Col xs="auto pt-2">
                                                        <button onClick={() => removeUnit(index)} className="btn btn-soft-danger">
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
                                                onClick={addUnit}><FontAwesomeIcon icon={faCirclePlus} />
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

export default AddPharmacyUnits;
