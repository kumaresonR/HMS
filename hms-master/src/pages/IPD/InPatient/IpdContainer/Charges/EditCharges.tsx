import { useState, useEffect } from "react";
import { Button, Col, Container, FormGroup, Input, Label, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import SetupApiService from "../../../../../helpers/services/setup/setup-api-service";

const EditCharges = (props: any) => {
    const ipdApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [ipdId, setIpdId] = useState('');
    const [opdId, setOpdId] = useState('');
    const [chargeType, setChargeType] = useState('');
    const [chargeTypeValidationError, setChargeTypeValidationError] = useState(false);
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeCategoryValidationError, setChargeCategoryValidationError] = useState(false);
    const [chargeName, setChargeName] = useState('');
    const [chargeId, setChargeId] = useState('');
    const [chargeNameValidationError, setChargeNameValidationError] = useState(false);
    const [chargeTypeData, setChargeTypeData] = useState([]);
    const [chargeCategoryData, setChargeCategoryData] = useState([]);
    const [chargeNameData, setChargeNameData] = useState([]);
    const [standardCharge, setStandardCharge] = useState<any>(0);
    const [standardChargeValidationError, setStandardChargeValidationError] = useState(false);
    const [tpaCharge, setTpaCharge] = useState('');
    const [tpaChargeValidationError, setTPAChargeValidationError] = useState(false);
    const [qty, setQty] = useState(1);
    const [qtyValidationError, setQtyValidationError] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [tax, setTax] = useState<any>(0);
    const [totalTax, setTotalTax] = useState(5);
    const [netAmount, setNetAmount] = useState(0);
    const [applyTPA, setApplyTPA] = useState(false);
    const [chargeNote, setChargeNote] = useState('');
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [chargesList, setChargesList] = useState<any>([]);
    const [totalAmount, setTotalAmount] = useState<number>();
    const [isGSTAdded, setIsGSTAdded] = useState(true);

    const toggleSwitch = () => {
        const newIsGSTAdded = !isGSTAdded;
        setIsGSTAdded(newIsGSTAdded);
        calculateCharges();
    };

    const handleChargeTypeChange = (type: any) => {
        setChargeType(type);
        setChargeTypeValidationError(false);
        setChargeCategory('');
        setChargeName('');
        setStandardCharge('');
        setTpaCharge('');
        if (type) {
            getAllChargeCategory(type);
        }
    };

    const handleChargeCategoryChange = (category: any) => {
        setChargeCategory(category);
        setChargeCategoryValidationError(false);
        setChargeName('');
        setStandardCharge('');
        setTpaCharge('');
        if (category) {
            getAllChargeNameByCategoryId(category);
        }
    };

    const getAllChargeNameByCategoryId = async (id: any) => {
        try {
            let data = await setupApiService.getAllChargeNameByCategoryId(id);
            setChargeNameData(data);
            if (data) {
                setChargeId(data.chargeId);
                setChargeName(data.chargeName);
                setChargeNameValidationError(false);
                setStandardCharge(data.standardCharge);
                setStandardChargeValidationError(false);
                if (props?.data?.patient?.insuranceProviders?.insuranceId) {
                    const matchingCharge = data.scheduleCharges?.find((sc: any) => sc.id === props?.data?.patient?.insuranceProviders?.insuranceId);
                    if (matchingCharge) {
                        setTpaCharge(matchingCharge.charge);
                    } else {
                        setTpaCharge(data.tpaCharge);
                    }
                } else {
                    console.log("No TPA ID provided.");
                    alert("No TPA ID found.");
                }
                setTPAChargeValidationError(false);
                // setTpaCharge(data.tpaCharge);
                // setTPAChargeValidationError(false);
                setTax(data.taxPercentage);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChargeNameChange = (chargeNameId: any) => {
        const selectedCharge: any = chargeNameData.find(
            (charge: any) => charge.chargeNameId === chargeNameId
        );

        if (selectedCharge) {
            setChargeName(chargeNameId);
            setChargeNameValidationError(false);
            setStandardCharge(selectedCharge.standardCharge);
            setStandardChargeValidationError(false);
            setTpaCharge(selectedCharge.tpaCharge);
            setTax(selectedCharge.taxPercentage)
        }
    };

    const handleQtyChange = (value: any) => {
        setQty(value);
        setQtyValidationError(false);
    }

    const handleDiscountPercentageChange = (value: any) => {
        const discount = parseFloat(value) || 0;
        setDiscountPercentage(discount);
        const discountAmount: any = ((standardCharge * qty * discount) / 100).toFixed(2);
        setDiscountAmount(discountAmount);
    }

    const handleDateChange = (value: any) => {
        setDate(value);
        setDateValidationError(false);
    }

    const calculateCharges = () => {
        const quantity = qty || 1;
        const charge = parseFloat(standardCharge) || 0;
        const tpa = parseFloat(tpaCharge) || 0;
        const amount = applyTPA ? tpa : charge
        // Calculate total amount before discount and tax
        const totalAmount = amount * quantity;
        setTotalAmount(totalAmount);

        // Calculate discount
        const discountAmount = (totalAmount * discountPercentage) / 100;
        const discountedTotal = totalAmount - discountAmount;

        // Calculate tax on discounted total
        let taxAmount = 0;
        if (isGSTAdded) {
            taxAmount = (discountedTotal * tax) / 100;
        }

        setTotalTax(Number(taxAmount.toFixed(2)));
        // const taxAmount = (discountedTotal * tax) / 100;
        // setTotalTax(Number(taxAmount.toFixed(2)));  // Convert to number after fixing decimal places

        // Calculate final net amount
        const finalAmount = discountedTotal + taxAmount;
        setNetAmount(Number(finalAmount.toFixed(2)));  // Convert to number after fixing decimal places

    };

    useEffect(() => {
        calculateCharges();
    }, [qty, standardCharge, tpaCharge, discountPercentage, tax, applyTPA, isGSTAdded]);

    const getAllChargeType = async () => {
        try {
            let data = await setupApiService.getAllTmChargesType();
            setChargeTypeData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllChargeCategory = async (id: any) => {
        try {
            let data = await setupApiService.getAllChargeCategoryByChargeType(id);
            setChargeCategoryData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllChargeNameByType = async (id: any) => {
        try {
            let data = await ipdApiService.getAllChargeNameByType(id);
            setChargeNameData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!chargeType) {
            setChargeTypeValidationError(true);
            isFormValid = false;
        }

        if (!chargeCategory) {
            setChargeCategoryValidationError(true);
            isFormValid = false;
        }

        if (!chargeName) {
            setChargeNameValidationError(true);
            isFormValid = false;
        }

        if (!standardCharge) {
            setStandardChargeValidationError(true);
            isFormValid = false;
        }

        if (!qty) {
            setQtyValidationError(true);
            isFormValid = false;
        }

        if (!date) {
            setDateValidationError(true);
            isFormValid = false;
        }
        return isFormValid;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            doUpdateCharges();
        }
    };

    const doUpdateCharges = async () => {
        try {
            let payload: any = {
                chargeTypeId: chargeType,
                chargeCategoryId: chargeCategory,
                chargeNameId: chargeId,
                standardCharge: parseFloat(standardCharge) * qty,
                tpaCharge: applyTPA ? parseFloat(tpaCharge) : 0,
                qty: qty,
                total: totalAmount,
                discountAmount: (parseFloat(standardCharge) * qty * discountPercentage) / 100,
                discountPercentage: discountPercentage,
                taxAmount: totalTax,
                taxPercentage: tax,
                netAmount: netAmount,
                chargeNote: chargeNote,
                date: date,
                tpa: applyTPA,
                isGstAdded: isGSTAdded
            }
            if (props.title === 'ipd') {
                payload.ipdId = ipdId;
            } else {
                payload.opdId = opdId;
            }

            if (props.title === 'ipd') {
                await ipdApiService.editCharges(props.id, payload);
            } else {
                await opdApiService.editCharges(props.id, payload);
            }
            toast.success('Charges Updated Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getChargesById = async () => {
        try {
            if (props.title === 'ipd') {
                let data = await ipdApiService.getAllCharges(props.id);
                setChargesData(data);
            } else {
                let data = await opdApiService.getAllCharges(props.id);
                setChargesData(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setChargesData = (data: any) => {
        if (props.title === 'ipd') {
            setIpdId(data.ipdId);
        } else {
            setOpdId(data.opdId);
        }
        setChargeType(data.chargeTypeId);
        if (data.chargeTypeId) {
            getAllChargeCategory(data.chargeTypeId);
            setChargeCategory(data.chargeCategoryId);
        }
        if (data.chargeCategoryId) {
            handleChargeCategoryChange(data.chargeCategoryId);
            getAllChargeNameByCategoryId(data.chargeCategoryId);
            setChargeName(data.chargeName);
        }
        setStandardCharge(data.standardCharge);
        setTpaCharge(data.tpaCharge);
        setQty(data.qty);
        setTotalAmount(data.total);
        setDiscountAmount(data.discountAmount);
        setDiscountPercentage(data.discountPercentage);
        setTotalTax(data.taxAmount);
        setTax(data.taxPercentage);
        setNetAmount(data.netAmount);
        setChargeNote(data.chargeNote);
        setDate(data.date);
        setApplyTPA(data.tpa)
    }

    useEffect(() => {
        getAllChargeType();
        getChargesById();
    }, []);

    return <>
        <ModalHeader toggle={props.handleClose} className="p-3 model-header-container bg-info-subtle modal-title">
            Edit Charges
            <div className="form-check">
                <Input
                    className="form-check-input"
                    type="checkbox"
                    id="visible"
                    checked={applyTPA}
                    onChange={(e) => setApplyTPA(e.target.checked)}
                />
                <Label className="form-check-label">Apply TPA </Label>
            </div>
        </ModalHeader>
        <ModalBody>
            <Container fluid>
                <Row>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Charge Type <span className="text-danger">*</span></label>
                            <select className={`${chargeTypeValidationError ? 'is-invalid' : ''} form-control`}
                                value={chargeType}
                                onChange={(e) => handleChargeTypeChange(e.target.value)}
                            >
                                <option value="">--Select Charge Type--</option>
                                {chargeTypeData.map((data: any, idx: any) => (
                                    <option key={idx} value={data.chargeTypeId}>{data.chargeType}</option>
                                ))}
                            </select>
                            {chargeTypeValidationError && <div className="invalid-feedback">Charge Type Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Charge Category <span className="text-danger">*</span></label>
                            <select className={`${chargeCategoryValidationError ? 'is-invalid' : ''} form-control`}
                                value={chargeCategory}
                                onChange={(e) => handleChargeCategoryChange(e.target.value)}
                            >
                                <option value="">--Select Charge Category--</option>
                                {chargeCategoryData?.map((cat: any, idx: any) => (
                                    <option key={idx} value={cat.categoryId}>{cat.name}</option>
                                ))}
                            </select>
                            {chargeCategoryValidationError && <div className="invalid-feedback">Charge Category Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Charge Name <span className="text-danger">*</span></label>
                            <Input className={`input  ${chargeNameValidationError ? 'is-invalid' : ''}`}
                                readOnly
                                id="chargeName"
                                name="chargeName"
                                type="text"
                                value={chargeName}
                            />
                            {chargeNameValidationError && <div className="invalid-feedback">Charge Name Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Standard Charge <span className="text-danger">*</span></label>
                            <Input className={`input  ${standardChargeValidationError ? 'is-invalid' : ''}`}
                                readOnly
                                id="StandardCharge"
                                name="StandardCharge"
                                type="text"
                                value={standardCharge}
                            />
                            {standardChargeValidationError && <div className="invalid-feedback">Standard Charge Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">TPA Charge <span className="text-danger">*</span></label>
                            <Input
                                readOnly
                                id="TPACharge"
                                name="TPACharge"
                                type="text"
                                value={tpaCharge}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Qty <span className="text-danger">*</span></label>
                            <Input className={`input  ${qtyValidationError ? 'is-invalid' : ''}`}
                                id="Qty"
                                name="Qty"
                                type="text"
                                value={qty}
                                onChange={(e: any) => handleQtyChange(e.target.value)}
                            />
                            {qtyValidationError && <div className="invalid-feedback">Qty Required.</div>}
                        </FormGroup>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <Row>
                            <Col><label>Total </label></Col>
                            <Col></Col>
                            <Col><b>{totalAmount}</b></Col>
                        </Row>
                        <Row className="mb-3">
                            <Col><label>Discount Percentage %</label></Col>
                            <Col>
                                <Input className="w-50"
                                    id="discountPercentage"
                                    name="discountPercentage"
                                    type="text"
                                    value={discountPercentage}
                                    onChange={(e: any) => handleDiscountPercentageChange(e.target.value)}
                                />
                            </Col>
                            <Col><b>{discountAmount}</b></Col>
                        </Row>
                        <Row>
                            <Col><label>Tax</label></Col>
                            <Col className="d-flex justify-content-between">
                                {tax} %
                                <FormGroup switch className="fs-4">
                                    <Input
                                        type="switch"
                                        role="switch"
                                        checked={isGSTAdded}
                                        onChange={toggleSwitch}
                                    />
                                    <Label check>GST</Label>
                                </FormGroup>
                            </Col>
                            <Col><b>{totalTax.toFixed(2)}</b></Col>
                        </Row>
                        <Row>
                            <Col><b>Net Amount (₹)</b></Col>
                            <Col></Col>
                            <Col><b>{netAmount.toFixed(2)}</b></Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <label className="text-start mb-2">Charge Note</label>
                                    <textarea
                                        className={`form-control`}
                                        id="ChargeNote"
                                        name="ChargeNote"
                                        value={chargeNote}
                                        onChange={e => setChargeNote(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <label className="text-start mb-2">Date<span className="text-danger">*</span></label>
                                    <Input className={`input  ${dateValidationError ? 'is-invalid' : ''}`}
                                        id="Date"
                                        name="Date"
                                        type="datetime-local"
                                        value={date}
                                        onChange={e => handleDateChange(e.target.value)}
                                    />
                                    {dateValidationError && <div className="invalid-feedback">Date Required.</div>}
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </ModalBody>
        <ModalFooter>
            <Col className="text-end">
                <Button color="primary" onClick={handleSubmit}>Save</Button>
            </Col>
        </ModalFooter>
    </>
}
export default EditCharges