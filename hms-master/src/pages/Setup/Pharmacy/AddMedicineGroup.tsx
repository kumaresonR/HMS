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

const AddMedicineGroup = () => {
    const setupApiService: SetupApiService = new SetupApiService();

    let navigate: any = useNavigate();

    const [medicineGroupData, setMedicineGroupData] = useState<any[]>([]);
    const [medicineGroupNameValidationError, setMedicineGroupNameValidationError] = useState(false);
    const [modNoValidationError, setModNoValidationError] = useState(false);

    const addMedicineGroupData = () => {
        setMedicineGroupData([...medicineGroupData, {
            medicineGroupName: '',
            // modNo: '',
        }])
    }

    const handleDataChange = (index: number, field: string, value: any) => {
        const newUnit = [...medicineGroupData];
        newUnit[index] = {
            ...newUnit[index],
            [field]: value,
        }
        setMedicineGroupData(newUnit);

        switch (field) {
            case 'medicineGroupName':
                setMedicineGroupNameValidationError(!value);
                break;
            // case 'modNo':
            //     setModNoValidationError(!value);
            //     break;
            default:
                break;
        }
    }

    const removeUnit = (index: any) => {
        const newUnit = [...medicineGroupData];
        newUnit.splice(index, 1);
        setMedicineGroupData(newUnit);
    };

    const validateForm = () => {
        let isFormValid = true;

        const durationErrors = medicineGroupData.map((item: any) => {
            const errors = {
                medicineGroupName: !item.medicineGroupName,
                // modNo: !item.modNo,
            };
            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setMedicineGroupNameValidationError(durationErrors.some(error => error.medicineGroupName));
        // setModNoValidationError(durationErrors.some(error => error.modNo));

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            createMedicineGroup();
        }
    }
    const createMedicineGroup = async () => {
        try {
            const payload: any = medicineGroupData;
            await setupApiService.createMedicineGroup(payload);
            navigate('/main/pharmacyMainSetup');
            toast.success('Medicine Group Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        addMedicineGroupData();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Medicine Group" pageTitle="Setup" />
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
                                        {medicineGroupData.map((item: any, index: any) => (
                                            <Row className='align-items-center'>
                                                <Col>
                                                    <FormGroup>
                                                        <Label for="medicineGroupName"> Group Name <span className='text-danger'> * </span></Label>
                                                        <Input
                                                            className={`${medicineGroupNameValidationError && !item.medicineGroupName ? 'is-invalid' : ''}`}
                                                            type="text"
                                                            id="medicineGroupName"
                                                            value={item.medicineGroupName}
                                                            onChange={e => handleDataChange(index, 'medicineGroupName', e.target.value)}

                                                        />
                                                        {medicineGroupNameValidationError && !item.medicineGroupName && <div className="invalid-feedback">Group Name  Required</div>}
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
                                                            onChange={e => handleDataChange(index, 'modNo', e.target.value)}
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
                                                onClick={addMedicineGroupData}><FontAwesomeIcon icon={faCirclePlus} />
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

export default AddMedicineGroup;
