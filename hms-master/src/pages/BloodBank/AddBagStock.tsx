import React, { useEffect, useState } from 'react'
import ErrorHandler from '../../helpers/ErrorHandler';
import SetupApiService from '../../helpers/services/setup/setup-api-service';
import BloodBankApiService from '../../helpers/services/bloodBank/BloodBankApiService';
import { toast } from 'react-toastify';
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import moment from 'moment';
import { paymentModeData } from '../../common/data/FakeData';

const unitTypeDetails = [
    { value: "1", label: "(ML)" },
    { value: "2", label: "Litter" },
    { value: "3", label: "(nm)" },
    { value: "4", label: "per day" },
    { value: "5", label: "Hour" },
    { value: "6", label: "Insurance" },
    { value: "7", label: "g/dl" },
    { value: "8", label: "MG" },
    { value: "9", label: "per km" },
    { value: "10", label: "per hour" },
    { value: "11", label: "Digital mammography" },
    { value: "12", label: "PET/CT scan" },
    { value: "13", label: "Bone density scan" },
    { value: "14", label: "10-21 mm Hg" },
];

const AddBagStock = (props: any) => {
    const bloodBankApiService: BloodBankApiService = new BloodBankApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const today = new Date().toISOString().split('T')[0];
    const [bloodDonorData, setBloodDonorData] = useState<any>([]);
    const [donateDateValidationError, setDonateDateValidationError] = useState(false);
    const [donateDate, setDonateDate] = useState('');
    const [bloodDonor, setBloodDonor] = useState('');
    const [bloodDonorValidationError, setBloodDonorValidationError] = useState(false);
    const [unitType, setUnitType] = useState('');
    const [volume, setVolume] = useState('');
    const [institution, setInstitution] = useState('');
    const [bag, setBag] = useState('');
    const [bagValidationError, setBagValidationError] = useState(false);
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeCategoryValidationError, setChargeCategoryValidationEroor] = useState(false);
    const [standardChargeValidationError, setStandardChargeValidationError] = useState(false);
    const [chargeName, setChargeName] = useState('');
    const [chargeNameValidationError, setchargeNameValidationError] = useState(false);
    const [standardCharge, setStandardCharge] = useState<number>();
    const [note, setNote] = useState('');
    const [lot, setLot] = useState('');
    const [categoryData, setCategoryData] = useState([]);
    const [total, setTotal] = useState<any>();
    const [tax, setTax] = useState<number>();
    const [discount, setDiscount] = useState<number>();
    const [taxPercentage, setTaxPercentage] = useState<any>();
    const [discountPercent, setDiscountPercent] = useState<any>(0);
    const [netAmount, setNetAmount] = useState<any>(0);
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentAmount, setPaymentAmount] = useState<any>();
    const [documentFile, setDocument] = useState<any>();
    const [chequeNo, setChequeNo] = useState('');
    const [chequeNoValidationError, setChequeNoValidationError] = useState(false);
    const [chequeDate, setChequeDate] = useState('');
    const [chequeDateValidationError, setChequeDateValidationError] = useState(false);
    const [paymentAmountValidationError, setPaymentAmountValidationError] = useState(false);

    const handleBagChange = (value: any) => {
        setBag(value);
        setBagValidationError(false);
    }

    const handleDonateDateChange = (dates: Date[]) => {
        if (dates[0]) {
            // const formattedDate = moment(dates[0]).format("DD-MM-YYYY");
            const formattedDate = moment(dates[0]).format("YYYY-MM-DD");
            setDonateDate(formattedDate);
            setDonateDateValidationError(false);
        }
    };

    const handleBloodDonorChange = (value: any) => {
        setBloodDonor(value);
        setBloodDonorValidationError(false);
    }

    const handleCategoryChange = (value: any) => {
        setChargeCategory(value);
        const selectedCharge: any = categoryData.find((item: any) => item?.chargeCategory?.name === value);
        if (selectedCharge) {
            setChargeName(selectedCharge.chargeName);
            if (selectedCharge.chargeName) {
                setchargeNameValidationError(false);
            }
            setStandardCharge(selectedCharge.standardCharge);
            if (selectedCharge.standardCharge) {
                setStandardChargeValidationError(false);
            }
            setTaxPercentage(selectedCharge.taxPercentage);
            setTotal(selectedCharge.standardCharge)
            if (selectedCharge.standardCharge) {
                recalculateNetAmount(selectedCharge.standardCharge, discountPercent, selectedCharge.taxPercentage);
            }
            if (selectedCharge.taxPercentage) {
                handleTaxPercentChange(selectedCharge.taxPercentage)
            }
        } else {
            setChargeName('');
            setStandardCharge(0);
            setTotal(0);
            setDiscountPercent(0);
            setDiscount(0);
            setTaxPercentage(0);
        }
        setChargeCategoryValidationEroor(false);
    };

    const handleChargeNameChange = (value: any) => {
        setChargeName(value);
        setchargeNameValidationError(false);
    }

    const handleStandardChargeChange = (value: any) => {
        setStandardCharge(value);
        setStandardChargeValidationError(false);
    }

    const handleDiscountPercentChange = (value: number) => {
        setDiscountPercent(value);
        const calculatedDiscount = (value / 100) * total;
        setDiscount(calculatedDiscount);
        recalculateNetAmount(total, value, taxPercentage);
    };

    const handleDiscountChange = (value: number) => {
        setDiscount(value);
        setDiscountPercent((value / total) * 100);
        recalculateNetAmount(total, discountPercent, taxPercentage);
    };

    const handleTaxPercentChange = (value: number) => {
        setTaxPercentage(value);
        const calculatedTax = (value / 100) * total;
        setTax(calculatedTax);
        recalculateNetAmount(total, discountPercent, value);
    };

    const recalculateNetAmount = (total: number, discountPercent: number, taxPercent: number) => {
        const calculatedDiscount = (discountPercent / 100) * total;
        const calculatedTax = (taxPercent / 100) * total;

        const netAmount = total - calculatedDiscount + calculatedTax;

        setNetAmount(netAmount);
        setPaymentAmount(netAmount)
        setTax(calculatedTax);
        setDiscount(calculatedDiscount);
    };

    const handlePaymentAmountChange = (value: any) => {
        const numericValue = parseFloat(value) || 0;
        setPaymentAmount(value);

        if (numericValue > netAmount) {
            setPaymentAmountValidationError(true);
        } else {
            setPaymentAmountValidationError(false);
        }
    };

    const handleChequeNoChange = (value: any) => {
        setChequeNo(value);
        setChequeNoValidationError(false);
    }

    const handleChequeDateChange = (value: any) => {
        setChequeDate(value);
        setChequeDateValidationError(false);
    }

    const onFileUploadListener = (event: any) => {
        const file = event.target.files[0];
        setDocument(file);
    }

    const getAllCategory = async () => {
        try {
            let result = await setupApiService.getAllChargeCategory();
            console.log("getAllCategory", result);
            setCategoryData(result);
        } catch (error: any) {
            console.log("getAllCategory Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreateDonorDetails();
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!donateDate) {
            setDonateDateValidationError(true);
            isFormValid = false;
        }

        if (!bag) {
            setBagValidationError(true);
            isFormValid = false;
        }

        if (!chargeCategory) {
            setChargeCategoryValidationEroor(true);
            isFormValid = false;
        }
        if (!chargeName) {
            setchargeNameValidationError(true);
            isFormValid = false;
        }

        if (!standardCharge) {
            setStandardChargeValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const getAllDonorData = async (pageNumber = 1) => {
        try {
            let url = "all";
            let result = await bloodBankApiService.getAllDonor(url);
            console.log("getAllDonorData", result);
            setBloodDonorData(result);
        } catch (error: any) {
            console.log("getAllDonorData Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllDonorData();
        getAllCategory();
    }, []);

    useEffect(() => {
        recalculateNetAmount(total, discountPercent, taxPercentage);
    }, [standardCharge, total, taxPercentage]);

    const doCreateDonorDetails = async () => {
        try {
            let formData: FormData = new FormData();
            const payload: any = {
                donorId: props.id,
                donateDate: donateDate,
                bagNo: bag,
                volume: volume || 'NA',
                unitType: unitType,
                lot: lot,
                chargeCategory: chargeCategory,
                chargeName: chargeName,
                standardCharge: standardCharge,
                institution: institution,
                note: note || 'NA',
                total: total,
                discount: discount,
                tax: tax,
                netAmount: netAmount,
                paymentMode: paymentMode,
                paymentAmount: paymentAmount,
                chequeNo: chequeNo,
                chequeDate: chequeDate
            };
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", JSON.stringify(payload))
            formData.append('bagStockData', jsonBlob);
            formData.append('attachDocument', documentFile);
            await bloodBankApiService.CreateBagStock(formData);
            toast.success('Record Saved Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    return (
        <Container fluid>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Donate Date<span className="text-danger">*</span></label>
                            <Flatpickr id="bloodDonateDate"
                                className={`${donateDateValidationError ? 'is-invalid' : ''} form-control`}
                                name="bloodDonateDate"
                                value={donateDate}
                                options={{
                                    // dateFormat: "d-m-Y",
                                    dateFormat: "Y-m-d",
                                }}
                                onChange={handleDonateDateChange}
                                placeholder="Select date"
                            />
                            {donateDateValidationError && <div className="invalid-feedback">Donate Date Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Bag No <span className="text-danger">*</span></label>
                            <Input className={`form-control ${bagValidationError ? 'is-invalid' : ''}`}
                                id="bloodBag"
                                name="bloodBag"
                                type="text"
                                value={bag}
                                onChange={(e) => { handleBagChange(e.target.value) }}
                            />
                            {bagValidationError && <div className="invalid-feedback">Bag Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Volume</label>
                            <Input
                                id="BloodVolume"
                                name="BloodVolume"
                                type="number"
                                value={volume}
                                onChange={e => setVolume(e.target.value)}
                                onWheel={(e: any) => e.target.blur()}
                                step="any"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <label className="text-start">Unit Type</label>
                            <select id="bloodUnitType"
                                className={`form-control`}
                                value={unitType}
                                onChange={(e) => { setUnitType(e.target.value) }}
                            >
                                <option value="">--Select--</option>
                                {unitTypeDetails.map((data, idx) => (
                                    <option key={idx} value={data.label}>{data.label}</option>
                                ))}
                            </select>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Lot</label>
                            <Input
                                id="lot"
                                name="lot"
                                type="number"
                                value={lot}
                                onChange={e => setLot(e.target.value)}
                                onWheel={(e: any) => e.target.blur()}
                                step="any"
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Charge Category <span className="text-danger">*</span></label>
                            <select id="bloodChargeCategory"
                                className={`form-control ${chargeCategoryValidationError ? 'is-invalid' : ''}`}
                                value={chargeCategory}
                                onChange={e => handleCategoryChange(e.target.value)}
                            >
                                <option value="">--Select--</option>
                                {categoryData?.map((item: any, idx: any) => (
                                    <option key={idx} value={item?.chargeCategory?.name}>{item?.chargeCategory?.name}</option>
                                ))}
                            </select>
                            {chargeCategoryValidationError && <div className="invalid-feedback">Charge Category Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Charge Name <span className="text-danger">*</span></label>
                            <Input
                                type="text"
                                id="blood_charge_name"
                                name="blood_charge_name"
                                className="form-control"
                                value={chargeName}
                                onChange={e => handleChargeNameChange(e.target.value)}
                                invalid={!!chargeNameValidationError}
                                readOnly
                            />
                            {chargeNameValidationError && <div className="invalid-feedback">Charge Name Required.</div>}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>

                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Standard Charge (₹)<span className="text-danger">*</span></label>
                            <Input
                                type="text"
                                id="standardChargeForBlood"
                                name="standardChargeForBlood"
                                className="form-control"
                                value={standardCharge}
                                onChange={e => handleStandardChargeChange(e.target.value)}
                                invalid={!!standardChargeValidationError}
                                readOnly
                            />
                            {standardChargeValidationError && <div className="invalid-feedback">Standard Charge Required.</div>}
                        </FormGroup>

                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Institution</label>
                            <Input
                                id="bloodDonorInstitution"
                                name="bloodDonorInstitution"
                                type="text"
                                value={institution}
                                onChange={e => setInstitution(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="note">Note</Label>
                                    <Input
                                        type="textarea"
                                        id="note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        rows={4}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="total">Total (₹)</Label>
                                    <Input disabled
                                        type="number"
                                        id="total"
                                        value={total}
                                        onChange={(e) => setTotal(Number(e.target.value))}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="discount">Discount (%)</Label>
                                    <Input
                                        type="number"
                                        id="discount"
                                        value={discountPercent}
                                        onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="discount">Discount (₹)</Label>
                                    <Input
                                        type="number"
                                        id="discount"
                                        value={discount}
                                        onChange={(e) => handleDiscountChange(Number(e.target.value))}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="tax">Tax (%)</Label>
                                    <Input disabled
                                        type="number"
                                        id="tax"
                                        value={taxPercentage}
                                        onChange={(e) => handleTaxPercentChange(Number(e.target.value))}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="tax">Tax (₹)</Label>
                                    <Input disabled
                                        type="number"
                                        id="tax"
                                        value={tax}
                                        onChange={(e) => setTax(Number(e.target.value))}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="netAmount">Net Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        id="netAmount"
                                        value={netAmount}
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="paymentAmount">Payment Amount <span className="text-danger">*</span></Label>
                                    <Input
                                        className={`${paymentAmountValidationError ? 'is-invalid' : ''}`}
                                        type="number"
                                        id="paymentAmount"
                                        value={paymentAmount}
                                        onChange={e => handlePaymentAmountChange(e.target.value)}
                                    />
                                    {paymentAmountValidationError && (
                                        <div className="invalid-feedback">
                                            {paymentAmount > netAmount
                                                ? 'Payment Amount cannot be greater than Net Amount.'
                                                : 'Payment Amount is required.'}
                                        </div>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>

                        <Col>
                            <FormGroup>
                                <label className="text-start mb-2">Payment Mode</label>
                                <select
                                    className={`form-control`}
                                    value={paymentMode} onChange={(e) => { setPaymentMode(e.target.value) }}
                                >
                                    <option value="">--Select Payment Mode--</option>
                                    {paymentModeData.map((data: any, idx: any) => (
                                        <option key={idx} value={data.type}>{data.type}</option>
                                    ))}
                                </select>
                            </FormGroup>
                        </Col>
                        {paymentMode === "Cheque" && (
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Cheque No<span className="text-danger">*</span></label>
                                        <Input className={`${chequeNoValidationError ? 'is-invalid' : ''}`}
                                            id="ChequeNo"
                                            name="ChequeNo"
                                            type="text"
                                            value={chequeNo}
                                            onChange={e => handleChequeNoChange(e.target.value)}
                                        />
                                        {chequeNoValidationError && <div className="invalid-feedback">Cheque No Required.</div>}
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Cheque Date<span className="text-danger">*</span></label>
                                        <Input className={`${chequeDateValidationError ? 'is-invalid' : ''}`}
                                            id="ChequeDate"
                                            name="ChequeDate"
                                            type="date"
                                            value={chequeDate}
                                            onChange={e => handleChequeDateChange(e.target.value)}
                                        />
                                        {chequeDateValidationError && <div className="invalid-feedback">Cheque Date Required.</div>}
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Attach Document</label>
                                        <Input
                                            type="file"
                                            className="form-control"
                                            id="attachment"
                                            onChange={onFileUploadListener}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex align-items-center justify-content-end">
                        <Button color="secondary" >
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default AddBagStock