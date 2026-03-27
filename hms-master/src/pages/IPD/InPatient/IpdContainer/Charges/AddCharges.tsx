import { Button, Col, Container, FormGroup, Input, Label, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import IPDApiService from "../../../../../helpers/services/ipd/ipd-api-service";
import ErrorHandler from "../../../../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import OPDApiService from "../../../../../helpers/services/opd/opd-api-service";
import moment from "moment";
import SetupApiService from "../../../../../helpers/services/setup/setup-api-service";

const AddCharges = (props: any) => {
    const ipdApiService: IPDApiService = new IPDApiService();
    const opdApiService: OPDApiService = new OPDApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [chargeType, setChargeType] = useState('');
    const [chargeTypeValidationError, setChargeTypeValidationError] = useState(false);
    const [chargeCategory, setChargeCategory] = useState('');
    const [chargeCategoryValidationError, setChargeCategoryValidationError] = useState(false);
    const [chargeCategoryName, setChargeCategoryName] = useState('');
    const [chargeName, setChargeName] = useState('');
    const [chargeId, setChargeId] = useState('');
    const [chargeNameValidationError, setChargeNameValidationError] = useState(false);
    const [chargeTypeData, setChargeTypeData] = useState([]);
    const [chargeCategoryData, setChargeCategoryData] = useState([]);
    const [chargeNameData, setChargeNameData] = useState();
    const [standardCharge, setStandardCharge] = useState<any>(0);
    const [standardChargeValidationError, setStandardChargeValidationError] = useState(false);
    const [tpaCharge, setTpaCharge] = useState('');
    const [tpaChargeValidationError, setTPAChargeValidationError] = useState(false);
    const [qty, setQty] = useState(1);
    const [qtyValidationError, setQtyValidationError] = useState(false);
    const [discountPercentage, setDiscountPercentage] = useState<any>(0);
    const [discountPercentageValidationError, setDiscountPercentageValidationError] = useState(false);
    const [discountAmount, setDiscountAmount] = useState<any>();
    const [tax, setTax] = useState<any>(0);
    const [totalTax, setTotalTax] = useState(5);
    const [netAmount, setNetAmount] = useState(0);
    const [applyTPA, setApplyTPA] = useState(false);
    const [chargeNote, setChargeNote] = useState('');
    const [date, setDate] = useState('');
    const [dateValidationError, setDateValidationError] = useState(false);
    const [chargesList, setChargesList] = useState<any>([]);
    const [totalAmount, setTotalAmount] = useState<number>();
    const [tpaId, setTpaId] = useState(props?.data?.admissions?.insurance?.id || props?.data?.patient?.insuranceProviders?.insuranceId);
    const [isGSTAdded, setIsGSTAdded] = useState(true);

    const toggleSwitch = () => {
        const newIsGSTAdded = !isGSTAdded;
        setIsGSTAdded(newIsGSTAdded);
        calculateCharges();
    };

    const handleApplyTpaChange = (value: any) => {
        setApplyTPA(value);
        setChargesList([]);
    }
    const handleChargeTypeChange = (type: any) => {
        setChargeType(type);
        setChargeTypeValidationError(false);
        setChargeCategory('');
        setChargeName('');
        setChargeId('');
        setStandardCharge('');
        setTpaCharge('');
        if (type) {
            getAllChargeCategory(type);
        }
    };

    const handleChargeCategoryChange = (category: any) => {
        const selectedCategory: any = chargeCategoryData.find((cat: any) => cat.categoryId === category);
        if (selectedCategory) {
            setChargeCategoryName(selectedCategory.name);
        } else {
            setChargeCategoryName('');
        }
        setChargeCategory(category);
        setChargeCategoryValidationError(false);
        setChargeName('');
        setChargeId('');
        setStandardCharge('');
        setTpaCharge('');
        if (category) {
            getAllChargeNameByCategoryId(category);
        }
    };

    // const handleChargeNameChange = (chargeNameId: any) => {
    //     const selectedCharge: any = chargeNameData.find(
    //         (charge: any) => charge.chargeNameId === chargeNameId
    //     );

    //     if (selectedCharge) {
    //         setChargeName(chargeNameId);
    //         setChargeNameValidationError(false);
    //         setStandardCharge(selectedCharge.standardCharge);
    //         setStandardChargeValidationError(false);
    //         setTpaCharge(selectedCharge.tpaCharge);
    //         setTPAChargeValidationError(false);
    //         setTax(selectedCharge.taxPercentage)
    //     }
    // };

    const handleQtyChange = (value: any) => {
        setQty(value);
        setQtyValidationError(false);
    }

    const handleDiscountPercentageChange = (value: any) => {
        const discount = parseFloat(value) || 0;
        setDiscountPercentage(discount);
        const discountAmount: any = ((standardCharge * qty * discount) / 100).toFixed(2);
        setDiscountAmount(discountAmount);
        setDiscountPercentageValidationError(false);
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
        // setTotalTax(Number(taxAmount.toFixed(2)));

        // Calculate final net amount
        const finalAmount = discountedTotal + taxAmount;
        setNetAmount(Number(finalAmount.toFixed(2)));

    };

    useEffect(() => {
        calculateCharges();
    }, [qty, standardCharge, tpaCharge, discountPercentage, tax, applyTPA, isGSTAdded]);

    const addCharge = () => {
        const newCharge: any = {
            chargeTypeId: chargeType,
            chargeCategoryId: chargeCategory,
            chargeCategoryName: chargeCategoryName,
            chargeNameId: chargeId,
            chargeName: chargeName,
            standardCharge: parseFloat(standardCharge) * qty,
            tpaCharge: applyTPA ? parseFloat(tpaCharge) : 0,
            qty: qty,
            total: totalAmount,
            discountAmount: (parseFloat(standardCharge) * qty * discountPercentage) / 100,
            discountPercentage: discountPercentage,
            taxAmount: totalTax,
            taxPercentage: tax,
            netAmount: netAmount,
            chargeNote: chargeNote || 'NA',
            date: date,
            tpa: applyTPA,
            isGstAdded: isGSTAdded
        };
        if (props.title === 'ipd') {
            newCharge.ipdId = props.data?.admissions?.ipdId;
        } else {
            newCharge.opdId = props?.data?.admissions?.opdId;
        }

        setChargesList([...chargesList, newCharge]);

        setDate('');
        setChargeType('');
        setChargeCategory('');
        setChargeName('');
        setQty(1);
        setStandardCharge('');
        setTpaCharge('');
        setChargeNote('');
        setTax(0)
    };

    const removeCharge = (idx: any) => {
        const newCharge = [...chargesList];
        newCharge.splice(idx, 1);
        setChargesList(newCharge)
    }

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
            console.log('getallCharges data', data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAllChargeNameByCategoryId = async (id: any) => {
        try {
            let data = await setupApiService.getAllChargeNameByCategoryId(id);
            setChargeNameData(data);
            if (data) {
                setChargeName(data.chargeName);
                setChargeNameValidationError(false);
                setChargeId(data.chargeId);
                setStandardCharge(data.standardCharge);
                setStandardChargeValidationError(false);
                if (tpaId) {
                    const matchingCharge = data.scheduleCharges?.find((sc: any) => sc.id === tpaId);
                    if (matchingCharge) {
                        setTpaCharge(matchingCharge.charge);
                    } else {
                        setTpaCharge(data.tpaCharge);
                    }
                } else {
                    console.log("No TPA ID provided.");
                    // alert("No TPA ID found.");
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

        if (isNaN(discountPercentage)) {
            setDiscountPercentageValidationError(true);
            isFormValid = false;
        }
        if (applyTPA) {
            if (!tpaCharge) {
                setTPAChargeValidationError(true);
                isFormValid = false;
            }
        } else {
            setTPAChargeValidationError(false);
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
            addCharge();
        }
    };

    const doCreateCharges = async () => {
        try {
            let payload: any = chargesList
            if (props.title === 'ipd') {
                await ipdApiService.createCharges(payload);
            } else {
                await opdApiService.createCharges(payload);
            }

            toast.success('Charges Added Successfully', { containerId: 'TR' });
            props.handleClose();
            props.refresh();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }
    useEffect(() => {
        getAllChargeType();
    }, []);

    return <>
        <ModalHeader toggle={props.handleClose} className="p-3 model-header-container bg-info-subtle modal-title">
            Add Charges
            <div className="form-check">
                <Input
                    className="form-check-input"
                    type="checkbox"
                    id="visible"
                    checked={applyTPA}
                    onChange={(e) => handleApplyTpaChange(e.target.checked)}
                    disabled={!tpaId}
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
                                type="number"
                                value={standardCharge}
                                onWheel={(e: any) => e.target.blur()}
                                step="any"
                            />
                            {standardChargeValidationError && <div className="invalid-feedback">Standard Charge Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">TPA Charge <span className="text-danger">*</span></label>
                            <Input className={`input  ${tpaChargeValidationError ? 'is-invalid' : ''}`}
                                readOnly
                                id="TPACharge"
                                name="TPACharge"
                                type="text"
                                value={tpaCharge}
                            />
                            {tpaChargeValidationError && <div className="invalid-feedback">TPA Charge Required.</div>}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <label className="text-start mb-2">Qty <span className="text-danger">*</span></label>
                            <Input className={`input  ${qtyValidationError ? 'is-invalid' : ''}`}
                                id="Qty"
                                name="Qty"
                                type="number"
                                value={qty}
                                onChange={(e: any) => handleQtyChange(e.target.value)}
                                onWheel={(e: any) => e.target.blur()}
                                step="any"
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
                                    invalid={!!discountPercentageValidationError}
                                />
                                {discountPercentageValidationError && <div className="invalid-feedback">Discount Percentage Required.</div>}
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
                            <Col><b>Net Amount </b></Col>
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
                        <Col className="text-end">
                            <Button color="primary" onClick={handleSubmit}>Add</Button>
                        </Col>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <div className="table-responsive">
                            <Table hover className="table-centered align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Charge Type	</th>
                                        <th>Charge Category</th>
                                        <th>Charge Name / Charge Note</th>
                                        <th>Qty</th>
                                        <th>Standard Charge (₹)	 </th>
                                        <th>TPA Charge (₹)</th>
                                        <th>Total (₹)</th>
                                        <th>Discount (₹)</th>
                                        <th>Tax (₹)	</th>
                                        <th>Net Amount (₹)</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chargesList.map((item: any, idx: any) => {
                                        const chargeTypeName = (chargeTypeData as { chargeTypeId: any; chargeType: any }[]).find(
                                            (type) => String(type.chargeTypeId) === String(item.chargeTypeId)
                                        )?.chargeType || 'N/A';

                                        const chargeNote = item.chargeNote || 'No Note';

                                        return (
                                            <tr key={idx}>
                                                <td>{moment(item.date).format('DD/MM/YYYY hh:mm A')}</td>
                                                <td>{chargeTypeName}</td>
                                                <td>{item.chargeCategoryName}</td>
                                                <td>{item.chargeName} / {chargeNote}</td>
                                                <td>{item.qty}</td>
                                                <td>{item.standardCharge}</td>
                                                <td>{item.tpaCharge}</td>
                                                <td>{item.total}</td>
                                                <td>{item.discountAmount}</td>
                                                <td>{item.taxAmount}</td>
                                                <td>{item.netAmount}</td>
                                                <td>
                                                    <Button onClick={() => removeCharge(idx)} color="danger">
                                                        <FontAwesomeIcon className="mx-2" icon={faXmark} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </ModalBody>
        <ModalFooter>
            <Col className="text-end">
                <Button onClick={doCreateCharges} color="primary">Save</Button>
            </Col>
        </ModalFooter>
    </>
}
export default AddCharges