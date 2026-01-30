import React, { useState, useEffect } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, Col, Container, Row, CardBody } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import TpaApiService from '../../../helpers/services/tpa/tpa-api-service';

const AddHospitalCharges = () => {
    const setupApiService: SetupApiService = new SetupApiService();
    const tpaApiService: TpaApiService = new TpaApiService();

    let navigate: any = useNavigate();

    const [name, setName] = useState('');
    const [nameValidationError, setNameValidationError] = useState(false);
    const [modNo, setModNo] = useState<any>('');
    const [modNoValidationError, setModNoValidationError] = useState(false);
    const [chargeTypeData, setChargeTypeData] = useState<any>([]);
    const [chargeType, setChargeType] = useState('');
    const [chargeTypeId, setChargeTypeId] = useState<any>();
    const [chargeTypeValidationError, setChargeTypeValidationError] = useState(false);
    const [description, setDescription] = useState('');
    const [chargeCategory, setChargeCategory] = useState<any>();
    const [chargeCategoryData, setChargeCategoryData] = useState<any>([]);
    const [chargeCategoryValidationError, setChargeCategoryValidationError] = useState(false);
    const [unitType, setUnitType] = useState<any>();
    const [unitTypeData, setUnitTypeData] = useState<any>([]);
    const [unitTypeValidationError, setUnitTypeValidationError] = useState(false);
    const [chargeName, setChargeName] = useState<any>();
    const [chargeNameValidationError, setChargeNameValidationError] = useState(false);
    const [taxCategory, setTaxCategory] = useState<any>();
    const [taxCategoryData, setTaxCategoryData] = useState<any>([]);
    const [taxCategoryValidationError, setTaxCategoryValidationError] = useState(false);
    const [taxPercentage, setTaxPercentage] = useState<any>();
    const [standardCharge, setStandardCharge] = useState<any>('');
    const [standardChargeValidationError, setStandardChargeValidationError] = useState(false);
    const [tpaData, setTpaData] = useState<any>([]);

    const handleChargeCategory = (value: any) => {
        setChargeCategory(value);
        setChargeCategoryValidationError(false);
    }

    const handleChargeTypeChange = (selectedChargeType: string) => {
        const selectedItem = chargeTypeData.find((item: any) => item.chargeTypeId === selectedChargeType);

        if (selectedItem) {
            setChargeType(selectedItem.chargeType);
            setChargeTypeId(selectedItem.chargeTypeId);
        } else {
            setChargeType('');
            setChargeTypeId('');
        }

        setChargeTypeValidationError(false);
    };

    const handleUnitTypeChange = (value: any) => {
        setUnitType(value);
        setUnitTypeValidationError(false);
    }

    const handleChargeNameChange = (value: any) => {
        setChargeName(value);
        setChargeNameValidationError(false);
    }

    const handleTaxCategoryChange = (value: any) => {
        const selectedItem = taxCategoryData.find((item: any) => item.id === value);

        if (selectedItem) {
            setTaxCategory(selectedItem.id);
            setTaxPercentage(selectedItem.percentage);
        } else {
            setTaxCategory('');
            setTaxPercentage('');
        }
        
        setTaxCategoryValidationError(false);
    }

    const handleStandardChargeChange = (value: any) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setStandardCharge(value);
            setStandardChargeValidationError(false);
        }
    }

    const handleModNoChange = (value: any) => {
        setModNo(value);
        setModNoValidationError(false);
    }

    const applyToAll = () => {
        if (!standardCharge) {
            setStandardChargeValidationError(true);
            return;
        }

        const updatedTpaData = tpaData.map((item: any) => ({
            ...item,
            charge: standardCharge,
        }));

        setTpaData(updatedTpaData);
    }

    const handleTpaChargeChange = (value: any, idx: number) => {
        const updatedTpaData: any = [...tpaData];
        updatedTpaData[idx] = { ...updatedTpaData[idx], charge: value };
        setTpaData(updatedTpaData);
    };

    const validateForm = () => {
        let isFormValid = true;

        if (!chargeCategory) {
            setChargeCategoryValidationError(true);
            isFormValid = false;
        }

        if (!chargeTypeId) {
            setChargeTypeValidationError(true);
            isFormValid = false;
        }

        if (!unitType) {
            setUnitTypeValidationError(true);
            isFormValid = false;
        }

        if (!chargeName) {
            setChargeNameValidationError(true);
            isFormValid = false;
        }

        if (!taxCategory) {
            setTaxCategoryValidationError(true);
            isFormValid = false;
        }

        if (!standardCharge) {
            setStandardChargeValidationError(true);
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
            const scheduleCharges = tpaData.map((item: any) => ({
                id: item.id,
                charge: isNaN(item.charge) ? 0 : Number(item.charge),
            }));
            const payload: any = {
                // modNo: modNo,
                chargeTypeId: chargeTypeId,
                categoryId: chargeCategory,
                unitTypeId: unitType,
                taxCategoryId: taxCategory,
                chargeName: chargeName || 'NA',
                taxPercentage: taxPercentage,
                standardCharge: standardCharge,
                description: description || 'NA',
                scheduleCharges: scheduleCharges
            }
            await setupApiService.createCharges(payload);
            navigate('/main/hospitalMain');
            toast.success('Charge Added Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllTmChargesCategory = async () => {
        try {
            let result = await setupApiService.getAllTmChargesCategory();
            setChargeCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllTmChragesType = async () => {
        try {
            let result = await setupApiService.getAllTmChargesType();
            setChargeTypeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllTmUnitType = async () => {
        try {
            let result = await setupApiService.getAllTmUnitType();
            setUnitTypeData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllTmTaxCategory = async () => {
        try {
            let result = await setupApiService.getAllTmTaxCategory();
            setTaxCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllTpa = async () => {
        try {
            let result = await tpaApiService.getAllTpa();
            setTpaData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllTmChargesCategory();
        getAllTmTaxCategory();
        getAllTmUnitType();
        getAllTmChragesType();
        getAllTpa();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Add Charges" pageTitle="Setup" />
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
                            <Row className="d-flex justify-content-center py-3">
                                <Col xl={12}>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col lg={8}>
                                                <Row>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label for="chargeType">Charge Type <span className='text-danger'> * </span></Label>
                                                            <Input
                                                                type="select"
                                                                id="chargeType"
                                                                value={chargeTypeId}
                                                                onChange={e => handleChargeTypeChange(e.target.value)}
                                                                invalid={!!chargeTypeValidationError}
                                                            >
                                                                <option value="">Select Charge Type</option>
                                                                {chargeTypeData.map((item: any, idx: any) => (
                                                                    <option key={idx} value={item.chargeTypeId}>{item.chargeType}</option>
                                                                ))}
                                                            </Input>
                                                            {chargeTypeValidationError && <div className="invalid-feedback">Charge Type Required</div>}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label for="chargeCategory">Charge Category <span className='text-danger'> * </span></Label>
                                                            <Input
                                                                type="select"
                                                                id="chargeCategory"
                                                                value={chargeCategory}
                                                                onChange={e => handleChargeCategory(e.target.value)}
                                                                invalid={!!chargeCategoryValidationError}
                                                            >
                                                                <option value="">Select Charge Category</option>
                                                                {chargeCategoryData.map((item: any, idx: any) => (
                                                                    <option key={idx} value={item.categoryId}>{item.name}</option>
                                                                ))}
                                                            </Input>
                                                            {chargeCategoryValidationError && <div className="invalid-feedback">Charge Category Required</div>}
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label for="unitType">Unit Type <span className='text-danger'> * </span></Label>
                                                            <Input
                                                                type="select"
                                                                id="unitType"
                                                                value={unitType}
                                                                onChange={e => handleUnitTypeChange(e.target.value)}
                                                                invalid={!!unitTypeValidationError}
                                                            >
                                                                <option value="">Select Unit Type</option>
                                                                {unitTypeData.map((item: any, idx: any) => (
                                                                    <option key={idx} value={item.id}>{item.unitType}</option>
                                                                ))}
                                                            </Input>
                                                            {unitTypeValidationError && <div className="invalid-feedback">Unit Type Required</div>}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label for="chargeName">Charge Name</Label>
                                                            <Input
                                                                type="text"
                                                                id="chargeName"
                                                                value={chargeName}
                                                                onChange={e => handleChargeNameChange(e.target.value)}
                                                                invalid={!!chargeNameValidationError}
                                                            />
                                                            {chargeNameValidationError && <div className="invalid-feedback">Charge Name Required</div>}
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label for="taxCategory">Tax Category <span className='text-danger'> * </span></Label>
                                                            <Input
                                                                type="select"
                                                                id="taxCategory"
                                                                value={taxCategory}
                                                                onChange={e => handleTaxCategoryChange(e.target.value)}
                                                                invalid={!!taxCategoryValidationError}
                                                            >
                                                                <option value="">Select Tax Category</option>
                                                                {taxCategoryData.map((item: any, idx: any) => (
                                                                    <option key={idx} value={item.id}>{item.name}</option>
                                                                ))}
                                                            </Input>
                                                            {taxCategoryValidationError && <div className="invalid-feedback">Tax Category Required</div>}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label for="taxPercentage">Tax %</Label>
                                                            <Input
                                                                type="text"
                                                                id="taxPercentage"
                                                                value={taxPercentage}
                                                                disabled
                                                                onChange={e => setTaxPercentage(e.target.value)}
                                                            />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label for="standardCharge">Standard Charge (₹) <span className='text-danger'> * </span></Label>
                                                            <Input
                                                                type="text"
                                                                id="standardCharge"
                                                                value={standardCharge}
                                                                onChange={e => handleStandardChargeChange(e.target.value)}
                                                                invalid={!!standardChargeValidationError}
                                                            />
                                                            {standardChargeValidationError && <div className="invalid-feedback">Standard Charge Required</div>}
                                                        </FormGroup>
                                                    </Col>
                                                    {/* <Col md={6}>
                                                        <FormGroup>
                                                            <Label for="name">Version <span className='text-danger'>*</span></Label>
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
                                                    <Col md={12}>
                                                        <FormGroup>
                                                            <Label for="description">Description</Label>
                                                            <Input type="textarea" id="description" value={description} onChange={e => setDescription(e.target.value)} />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col>
                                                <Col md={12}>
                                                    <div className='d-flex justify-content-between align-items-center'>
                                                        <Label for="scheduledChargesForTPA">Scheduled Charges For TPA</Label>
                                                        <Button color='warning' className='mx-3' onClick={applyToAll}>Apply To All</Button>
                                                    </div>

                                                    {tpaData.map((item: any, idx: any) => (
                                                        <div className="row my-2" key={idx}>
                                                            <div className="col">
                                                                <Label>{item.tpaName}</Label>
                                                            </div>
                                                            <div className="col">
                                                                <input
                                                                    id={`${item.tpaName}-${idx}`}
                                                                    name={`${item.tpaName}-${idx}`}
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={item.charge || ''}
                                                                    onChange={e => {
                                                                        const value = e.target.value;
                                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                                            handleTpaChargeChange(value, idx);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                </Col>
                                            </Col>
                                        </Row>
                                        <Button type="submit" color="primary">Submit</Button>
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

export default AddHospitalCharges;
