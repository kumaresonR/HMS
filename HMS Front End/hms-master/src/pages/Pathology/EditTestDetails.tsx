import React, { useEffect, useState } from "react"
import { Button, Col, Container, Form, FormGroup, Input, Row } from "reactstrap";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import ErrorHandler from "../../helpers/ErrorHandler";
import BillingApiService from "../../helpers/services/billing/billing-api-service";
import SetupApiService from "../../helpers/services/setup/setup-api-service";

const categoryNameData = [
    {
        category: "Histopathology",
        name: "Pathology Charges",
        tax: 18.00,
        standardCharge: 160.00,
        amount: 180.80
    },
    {
        category: "Cytopathology",
        name: "Surgical Pathology",
        tax: 18.00,
        standardCharge: 150.00,
        amount: 177.00
    },
    {
        category: "X-ray",
        name: "X-ray",
        tax: 10.00,
        standardCharge: 160.00,
        amount: 180.80
    }
]

const categoryData = [
    {
        name: "Clinical Microbiology",
    },
    {
        name: "Clinical Chemistry",
    },
    {
        name: "Hematology",
    },
    {
        name: "Molecular Diagnostics",
    }
]

const testParameterdata = [
    {
        name: "RBC",
        referanceRange: "4.1 to 5.1 million/mm3",
        unit: "million/mm3"
    },
    {
        name: "Liver Function Test",
        referanceRange: "7 to 55 units per liter",
        unit: "(U/L)"
    },
    {
        name: "TSH (Thyroid Stimulating Hormone)",
        referanceRange: "0.5 to 3.0",
        unit: "(U/L)"
    },
]

const EditTestDetails = (props: any) => {
    const billingApiService: BillingApiService = new BillingApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const id = props.data.pathologyTestId;
    const [testName, setTestName] = useState('');
    const [testNameValidationError, setTestNameValidationError] = useState(false);
    const [shortName, setShortName] = useState('');
    const [shortNameValidationError, setShortNameValidationError] = useState(false);
    const [testType, setTestType] = useState('');
    const [filteredChargeName, setFilteredChargeName] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [categoryNameValidationError, setCategoryNameValidationError] = useState(false);
    const [subCategory, setSubCategory] = useState('');
    const [method, setMethod] = useState('');
    const [reportDaysValidationError, setReportDaysValidationError] = useState(false);
    const [reportDays, setReportDays] = useState('');
    const [chargeCategoryValidationError, setChargeCategoryValidationError] = useState(false);
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeCategoryData, setChargeCategoryData] = useState([]);
    const [chargeNameValidationError, setChargeNameValidationError] = useState(false);
    const [chargeName, setChargeName] = useState('');
    const [tax, setTax] = useState<any>('');
    const [standardChargeValidationError, setStandardChargeValidationError] = useState(false);
    const [standardCharge, setStandardCharge] = useState<any>('');
    const [amountValidationError, setAmountValidationError] = useState(false);
    const [amount, setAmount] = useState<any>('');
    const [testParameterNameValidationError, setTestParameterNameValidationError] = useState(false);
    const [normalRangeValidationError, setNormalRangeValidationError] = useState(false);
    const [unitValidationError, setUnitValidationError] = useState(false);
    const [testData, setTestData] = useState<any[]>([]);
    const [testParameterdata, setTestParameterData] = useState<any[]>([]);

    const handleChargeCategory = (value: any) => {
        setChargeCategory(value);

        const selectedCharge: any = chargeCategoryData.find((item: any) => item?.chargeCategory?.name === value);

        if (selectedCharge) {
            setChargeName(selectedCharge.chargeName);
            setStandardCharge(selectedCharge.standardCharge);
            setTax(selectedCharge.taxPercentage);
            setAmount(selectedCharge.standardCharge);
            setChargeNameValidationError(false);
            setStandardChargeValidationError(false);
            setAmountValidationError(false);
        } else {
            setChargeName('');
            setStandardCharge(0);
            setAmount(0);
            setTax(0);
        }
        setChargeCategoryValidationError(false);
    };

    const handleChargeName = (value: any) => {
        setChargeName(value);
        setChargeNameValidationError(false);
    }

    // const handleChargeName = (value: any) => {
    //     setChargeName(value);
    //     setChargeNameValidationError(false)
    //     const selectedData: any = categoryNameData.find((data: any) => data.name === value);

    //     if (selectedData) {
    //         setTax(selectedData.tax);
    //         setStandardCharge(selectedData.standardCharge);
    //         setAmount(selectedData.amount);
    //     }
    // };

    const addNew = () => {
        setTestData([...testData, { pathologyTestId: id, parameterName: '', normalRange: '', unit: '' }]);
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const newTest = [...testData];
        newTest[index] = {
            ...newTest[index],
            [field]: value,
        };

        // Automatically update normalRange and unit based on selected parameterName
        if (field === 'parameterName') {
            // const selectedParameter: any = testParameterdata.find(item => item.name === value);
            // if (selectedParameter) {
            //     newTest[index].normalRange = selectedParameter.referanceRange;
            //     newTest[index].unit = selectedParameter.unit;
            // }
            const selectedParameter: any = testParameterdata.find((item: any) => item.parameterName === value);
            if (selectedParameter) {
                newTest[index].normalRange = `${selectedParameter.referenceRangeFrom} to ${selectedParameter.referenceRangeTo}`;
                newTest[index].unit = selectedParameter.unit;
            }
            setTestParameterNameValidationError(!value);
        } else if (field === 'normalRange') {
            setNormalRangeValidationError(!value);
        } else if (field === 'unit') {
            setUnitValidationError(!value);
        }

        setTestData(newTest);
    };

    const removeTestData = (index: any) => {
        const netTest = [...testData];
        netTest.splice(index, 1);
        setTestData(netTest);
    };

    const handleTestNameChange = (value: any) => {
        setTestName(value);
        setTestNameValidationError(false);
    }

    const handleShortNameChange = (value: any) => {
        setShortName(value);
        setShortNameValidationError(false);
    }

    const handleCateroryName = (value: any) => {
        setCategoryName(value)
        setCategoryNameValidationError(false)
    }

    const handleSubCategory = (value: any) => {
        setSubCategory(value)
    }

    const handleMethod = (value: any) => {
        setMethod(value);

    }

    const handleReportDays = (value: any) => {
        setReportDaysValidationError(false)
        setReportDays(value)
    }

    const handleTax = (value: any) => {
        setTax(value)

    }

    const handleStandardChargeChange = (value: any) => {
        setStandardCharge(value)
        setStandardChargeValidationError(false)
    }

    const handleAmountChange = (value: any) => {
        setAmount(value)
        setAmountValidationError(false)
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateTestData();
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!chargeName) {
            setChargeNameValidationError(true);
            isFormValid = false;
        }

        if (!testName) {
            setTestNameValidationError(true);
            isFormValid = false;
        }
        if (!shortName) {
            setShortNameValidationError(true);
            isFormValid = false;
        }
        if (!categoryName) {
            setCategoryNameValidationError(true);
            isFormValid = false;
        }

        if (!reportDays) {
            setReportDaysValidationError(true);
            isFormValid = false;
        }
        if (!chargeCategory) {
            setChargeCategoryValidationError(true);
            isFormValid = false;
        }
        if (!standardCharge) {
            setStandardChargeValidationError(true);
            isFormValid = false;
        }

        if (!amount) {
            setAmountValidationError(true);
            isFormValid = false;
        }

        const testDataErrors = testData.map((test) => {
            const errors = {
                parameterName: !test.parameterName,
                normalRange: !test.normalRange,
                unit: !test.unit,
            };

            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        // Set validation errors for all vitals
        setTestParameterNameValidationError(testDataErrors.some(error => error.parameterName));
        setNormalRangeValidationError(testDataErrors.some(error => error.normalRange));
        setUnitValidationError(testDataErrors.some(error => error.unit));

        return isFormValid;
    };

    const doCreateTestData = async () => {
        try {
            let payload: any = {
                pathologyTestId: id,
                testName: testName,
                shortName: shortName,
                testType: testType,
                categoryName: categoryName,
                subCategory: subCategory,
                method: method,
                reportDays: reportDays,
                chargeCategory: chargeCategory,
                chargeName: chargeName,
                taxPercentage: tax,
                standardCharge: standardCharge,
                amount: amount,
                testParameters: testData
            };
            await billingApiService.editPathologyTest(id, payload);
            toast.success('Pathology Test Updated Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            console.log("Pathology Test Created Failed", error);
            return ErrorHandler(error)
        }
    }

    const getPathologyById = async () => {
        try {
            let data = await billingApiService.getPathologyTest(id);
            setData(data);
            console.log('getPathologyById data', data);
        } catch (error) {
            console.log(error);
        }

    }

    const setData = (data: any) => {
        setTestName(data.testName);
        setShortName(data.shortName);
        setTestType(data.testType);
        setCategoryName(data.categoryName);
        setSubCategory(data.subCategory);
        setMethod(data.method);
        setReportDays(data.reportDays);
        setChargeCategory(data.chargeCategory);
        // Filter charge names based on chargeCategory before setting chargeName
        // const selectedCategoryNames: any = categoryNameData
        //     .filter(category => category.category === data.chargeCategory)
        //     .map(category => category.name);
        // setFilteredChargeName(selectedCategoryNames);

        setChargeName(data.chargeName);
        setTax(data.taxPercentage);
        setStandardCharge(data.standardCharge);
        setAmount(data.amount);
        if (data.testParameters) {
            setTestData(data.testParameters)
        }
    }

    const getAllPathologyCategory = async () => {
        try {
            let result = await setupApiService.getAllPathologyCategoryMaster();
            setCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllCategory = async () => {
        try {
            let result = await setupApiService.getAllChargeCategory();
            setChargeCategoryData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllPathologyParameter = async () => {
        try {
            let result = await setupApiService.getAllPathologyParameterTM();
            setTestParameterData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllCategory();
        getAllPathologyCategory();
        getAllPathologyParameter();
        getPathologyById();
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Row className="justify-content-around">
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Test Name <span className="text-danger">*</span></label>
                                        <Input
                                            id="testName"
                                            name="testName"
                                            type="text"
                                            value={testName}
                                            className={`${testNameValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleTestNameChange(e.target.value)}
                                        />
                                        {testNameValidationError && <div className="invalid-feedback">Test Name Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Short Name<span className="text-danger">*</span></label>
                                        <Input
                                            id="shortName"
                                            name="shortName"
                                            type="text"
                                            value={shortName}
                                            className={`${shortNameValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleShortNameChange(e.target.value)}
                                        />
                                        {shortNameValidationError && <div className="invalid-feedback">Short Name Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Test Type</label>
                                        <Input
                                            id="testType"
                                            name="testType"
                                            type="text"
                                            value={testType}
                                            onChange={e => setTestType(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Category Name <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-control ${categoryNameValidationError ? 'is-invalid' : ''}`}
                                            value={categoryName}
                                            onChange={(e) => handleCateroryName(e.target.value)}
                                        >
                                            <option value="">--Select Category Name--</option>
                                            {/* {categoryData.map((data, idx) => (
                                                <option key={idx} value={data.name}>{data.name}</option>
                                            ))} */}
                                            {categoryData.map((data: any, idx: any) => (
                                                <option key={idx} value={data.categoryName}>{data.categoryName}</option>
                                            ))}
                                        </select>
                                        {categoryNameValidationError && <div className="invalid-feedback">Category Name Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Sub Category</label>
                                        <Input
                                            id="subCategory"
                                            name="subCategory"
                                            type="text"
                                            value={subCategory}
                                            onChange={e => handleSubCategory(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Method</label>
                                        <Input
                                            id="method"
                                            name="method"
                                            type="text"
                                            value={method}
                                            onChange={e => handleMethod(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Report Days <span className="text-danger">*</span></label>
                                        <Input
                                            id="reportDays"
                                            name="reportDays"
                                            type="number"
                                            min="0"
                                            value={reportDays}
                                            className={`form-control ${reportDaysValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleReportDays(e.target.value)}
                                        />
                                        {reportDaysValidationError && <div className="invalid-feedback">Report Days Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Charge Category<span className="text-danger">*</span></label>
                                        <Input
                                            type="select"
                                            id="charge_category"
                                            name="charge_category"
                                            className="form-control"
                                            value={chargeCategory}
                                            onChange={e => handleChargeCategory(e.target.value)}
                                            invalid={!!chargeCategoryValidationError}
                                        >
                                            <option value="">Select</option>
                                            {chargeCategoryData?.map((item: any, idx: any) => (
                                                <option key={idx} value={item?.chargeCategory?.name}>{item?.chargeCategory?.name}</option>
                                            ))}
                                        </Input>
                                        {chargeCategoryValidationError && <div className="invalid-feedback">Charge Category Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Charge Name<span className="text-danger">*</span></label>
                                        <Input
                                            type="text"
                                            id="charge_name"
                                            name="charge_name"
                                            className="form-control"
                                            value={chargeName}
                                            onChange={e => handleChargeName(e.target.value)}
                                            invalid={!!chargeNameValidationError}
                                            readOnly
                                        />
                                        {chargeNameValidationError && <div className="invalid-feedback">Charge Name Required.</div>}
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Tax(%) <span className="text-danger">*</span></label>
                                        <Input
                                            id="tax"
                                            name="tax"
                                            type="text"
                                            value={tax}
                                            readOnly
                                            onChange={e => handleTax(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Standard Charge(₹)<span className="text-danger">*</span></label>
                                        <Input
                                            id="standardCharge"
                                            name="standardCharge"
                                            type="text"
                                            readOnly
                                            value={standardCharge}
                                            className={`${standardChargeValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleStandardChargeChange(e.target.value)}
                                        />
                                        {standardChargeValidationError && <div className="invalid-feedback">Standard Charge Required.</div>}
                                    </FormGroup>
                                </Col>

                                <Col>
                                    <FormGroup>
                                        <label className="text-start mb-2">Amount(₹)<span className="text-danger">*</span></label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="text"
                                            readOnly
                                            value={amount}
                                            className={`readonly form-control ${amountValidationError ? 'is-invalid' : ''}`}
                                            onChange={e => handleAmountChange(e.target.value)}
                                        />
                                        {amountValidationError && <div className="invalid-feedback">Amount Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>
                            {testData.map((row, index) => (
                                <Row key={index} className='align-items-center'>
                                    <Col>
                                        <FormGroup>
                                            <label className="text-start mb-2">Test Parameter Name<span className="text-danger">*</span></label>
                                            <select
                                                className={`form-control ${testParameterNameValidationError ? 'is-invalid' : ''}`}
                                                value={row.parameterName}
                                                onChange={(e) => handleInputChange(index, 'parameterName', e.target.value)}
                                            >
                                                <option value="">--Select Test Parameter Name--</option>
                                                {/* {testParameterdata.map((data, idx) => (
                                                    <option key={idx} value={data.name}>{data.name}</option>
                                                ))} */}
                                                {testParameterdata.map((data: any, idx: any) => (
                                                    <option key={idx} value={data.parameterName}>{data.parameterName}</option>
                                                ))}
                                            </select>
                                            {testParameterNameValidationError && <div className="invalid-feedback">Test Parameter Name Required.</div>}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label className="text-start mb-2">Reference Range<span className="text-danger">*</span></label>
                                            <Input
                                                id="normalRange"
                                                name="normalRange"
                                                type="text"
                                                value={row.normalRange}
                                                readOnly
                                                className={`${normalRangeValidationError ? 'is-invalid' : ''}`}
                                                onChange={(e) => handleInputChange(index, 'normalRange', e.target.value)}
                                            />
                                            {normalRangeValidationError && <div className="invalid-feedback">Reference range Required.</div>}
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <label className="text-start mb-2">Unit<span className="text-danger">*</span></label>
                                            <Input
                                                id="unit"
                                                name="unit"
                                                type="text"
                                                readOnly
                                                value={row.unit}
                                                className={`readonly form-control ${unitValidationError ? 'is-invalid' : ''}`}
                                                onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                                            />
                                            {unitValidationError && <div className="invalid-feedback">Unit Required.</div>}
                                        </FormGroup>
                                    </Col>
                                    <Col xs="auto">
                                        {index !== 0 && (
                                            <Button onClick={() => removeTestData(index)} color="danger">
                                                <FontAwesomeIcon
                                                    className="mx-2"
                                                    icon={faXmark}
                                                />
                                            </Button>
                                        )}
                                    </Col>
                                </Row>

                            ))}

                            <Button color="primary" onClick={addNew}>
                                Add
                            </Button>
                            <hr />
                            <Row>
                                <Col className="text-end">
                                    <Button type="submit">Save</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};
export default EditTestDetails