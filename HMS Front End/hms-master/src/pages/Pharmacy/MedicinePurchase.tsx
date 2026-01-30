import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import PharmacyApiService from '../../helpers/services/pharmacy/pharmacy-api-service';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import { paymentModeData } from '../../common/data/FakeData';
import SetupApiService from '../../helpers/services/setup/setup-api-service';

const MedicinePurchase = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [supplierData, setSupplierData] = useState([]);
    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [billNo, setBillNo] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [purchaseDate, setPurchaseDate] = useState(today);
    const [medicineCompanyData, setMedicineCompanyData] = useState<any>([]);
    const [tax, setTax] = useState<any>(0);
    const [note, setNote] = useState('');

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState<any>(0);
    const [netAmount, setNetAmount] = useState<any>(0);
    const [total, setTotal] = useState<any>(0);
    const [discount, setDiscount] = useState<any>(0);
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [paymentNote, setPaymentNote] = useState('');
    const [rows, setRows] = useState<any[]>([]);
    const [documentFile, setDocument] = useState<any>();
    const [chequeNo, setChequeNo] = useState('');
    const [chequeNoValidationError, setChequeNoValidationError] = useState(false);
    const [chequeDate, setChequeDate] = useState('');
    const [chequeDateValidationError, setChequeDateValidationError] = useState(false);
    const [supplierValidationError, setSupplierValidationError] = useState(false);

    const handleSupplierChange = (value: any) => {
        setSupplier(value);
        setSupplierValidationError(false);
    }

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
    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const getMedicineByCategoryId = (index: number, value: any) => {
        handleInputChange(index, "medicineCategory", value);
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                medicineName: '',
            };
            return updatedRows;
        });
    };

    const handleMedicineNameChange = (index: number, value: any) => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                medicineName: value.name,
                // tax: value.tax,
                // quantity : value.boxPacking
            };
            return updatedRows
        })
    }

    useEffect(() => {
        const discountValue = (total * (discount / 100));
        const netAmount = total - discountValue;
        setNetAmount(netAmount.toFixed(2));
        setPaymentAmount(netAmount.toFixed(2));
    }, [discount, total]);

    const addRow = () => {
        setRows([...rows, {
            medicineCategory: '',
            medicineName: '',
            companyId : '',
            batchNo: '',
            expiryDate: '',
            mrp: '',
            batchAmount: '',
            salePrice: '',
            packingQty: '',
            quantity: '',
            purchasePrice: '',
            tax: '',
            amount: '',
        }]);
    };

    const removeRow = (index: any) => {
        const newRow = [...rows];
        newRow.splice(index, 1);
        setRows(newRow);
    };
    const handleInputChange = (index: number, field: string, value: string) => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                [field]: value,
            };

            if (field === "quantity" || field === "purchasePrice" || field === "tax") {
                const quantity = parseFloat(updatedRows[index].quantity || "0");
                const purchasePrice = parseFloat(updatedRows[index].purchasePrice || "0");
                const tax = parseFloat(updatedRows[index].tax || "0");

                if (!isNaN(quantity) && !isNaN(purchasePrice) && !isNaN(tax)) {
                    const amount = (quantity * purchasePrice) + (quantity * purchasePrice * (tax / 100));
                    updatedRows[index].amount = amount.toFixed(2);
                    const taxAmount = quantity * purchasePrice * (tax / 100);
                    updatedRows[index].taxAmount = taxAmount.toFixed(2);
                }
            }

            // Aggregate totals and tax
            let total = 0;
            let totalTax = 0;
            updatedRows.forEach((row) => {
                total += parseFloat(row.amount || "0");
                totalTax += parseFloat(row.taxAmount || "0");
            });

            setTotal(total.toFixed(2));
            setTax(totalTax.toFixed(2));

            // Calculate Net Amount after discount
            const discountValue = (total * (discount / 100));
            const netAmount = total - discountValue;
            setNetAmount(netAmount.toFixed(2));
            setPaymentAmount(netAmount.toFixed(2));

            return updatedRows;
        });
    };

    const getAllSupplier = async () => {
        try {
            const result = await setupApiService.getAllSupplier();
            console.log("getAllSupplier:", result);
            setSupplierData(result);
        } catch (error: any) {
            console.error("Error in getAllSupplier:", error);
        }
    };

    const getAllMedicineCompany = async () => {
        try {
            let result = await setupApiService.getAllMedicineCompany();
            setMedicineCompanyData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllMedicineCategory = async () => {
        try {
            let data = await setupApiService.getAllMedicineCategory();
            setMedicineCategoryData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const validateRow = (row: any, index: number) => {
        let isValid = true;
        const errors: any = {};

        // Validate fields
        if (!row.medicineCategory) {
            errors.medicineCategoryValidationError = true;
            isValid = false;
        }

        if (!row.companyId) {
            errors.medicineCompanyNameValidationError = true;
            isValid = false;
        }

        if (!row.medicineName) {
            errors.medicineNameValidationError = true;
            isValid = false;
        }

        if (!row.batchNo) {
            errors.batchNoValidationError = true;
            isValid = false;
        }

        if (!row.expiryDate) {
            errors.expiryDateValidationError = true;
            isValid = false;
        }

        if (!row.quantity || row.quantity <= 0) {
            errors.quantityValidationError = true;
            isValid = false;
        }

        if (!row.purchasePrice || row.purchasePrice <= 0) {
            errors.purchasePriceValidationError = true;
            isValid = false;
        }

        if (!row.tax || row.tax < 0) {
            errors.taxValidationError = true;
            isValid = false;
        }

        if (!row.salePrice || row.salePrice <= 0) {
            errors.salePriceValidationError = true;
            isValid = false;
        }

        if (!row.mrp) {
            errors.mrpValidationError = true;
            isValid = false;
        }

        if (!row.mrp) {
            errors.amountValidationError = true;
            isValid = false;
        }

        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                ...errors, 
            };
            return updatedRows;
        });

        return isValid;
    };

    const validateForm = () => {
        let isFormValid = true;

        rows.forEach((row, index) => {
            if (!validateRow(row, index)) {
                isFormValid = false;
            }
        });

        if (!supplier) {
            setSupplierValidationError(true);
            isFormValid = false;
        }

        if (paymentMode === "Cheque") {
            if (!chequeNo) {
                setChequeNoValidationError(true);
                isFormValid = false;
            }

            if (!chequeDate) {
                setChequeDateValidationError(true);
                isFormValid = false;
            }
        }

        return isFormValid;
    };


    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            doCreatePayment();
        }
    }
    const doCreatePayment = async () => {
        try {
            let formData: FormData = new FormData();
            const payload: any = {
                supplierId: supplier,
                billNo: billNo,
                note: note,
                totalAmount: total,
                discount: discount,
                tax: tax,
                netAmount: netAmount,
                paymentMode: paymentMode,
                paymentAmount: paymentAmount,
                chequeDate: chequeDate,
                chequeNo: chequeNo,
                paymentNote: paymentNote,
                medicines: rows,
            };

            console.log("paylod", payload)
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)", JSON.stringify(payload))
            formData.append('purchaseBillData', jsonBlob);
            formData.append('chequeAttachment', documentFile);
            formData.append("attachment", selectedFile)
            await pharmacyApiService.createPurchaseMedicine(formData);
            toast.success('Purchase Medicine Details Saved Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllSupplier();
        getAllMedicineCompany();
        addRow();
        getAllMedicineCategory();
    }, []);

    useEffect(() => {
        if (props.restockData) {
            setSupplier(props.restockData?.supplierDetails?.supplierId)
            setRows([
                {
                    medicineCategory: props.restockData.category || '',
                    companyId: props.restockData.companyId || '',
                    medicineName: props.restockData.name || '',
                    batchNo: props.restockData.batchNo || '',
                    expiryDate: '',
                    salePrice: '',
                    batchAmount: '',
                    tax: '',
                    packingQty: '',
                    quantity: '', 
                    purchasePrice: '',
                    amount: '',
                }
            ]);
        }
    }, [props.restockData]);
    

    return (
        <Container fluid>
            <Row>
                <Col>
                    <FormGroup>
                        <label>Supplier <span className="text-danger">*</span></label>
                        <select
                            className={`form-control ${supplierValidationError ? 'is-invalid' : ''}`}
                            id="supplier"
                            name="supplier"
                            value={supplier}
                            onChange={(e) => handleSupplierChange(e.target.value)}
                        >
                            <option value="">--Select Supplier--</option>
                            {supplierData.map((item: any, idx: any) => (
                                <option key={idx} value={item.supplierId}>{item.supplierName}</option>
                            ))}
                        </select>
                        {supplierValidationError && <div className="invalid-feedback">Supplier Required.</div>}
                    </FormGroup>
                </Col>
            </Row>
            <Row className="bg-light py-3 mb-3">
                <Col>
                    <Row className="d-flex justify-content-between row-cols-auto">
                        <Col className="text-start d-flex align-items-center">
                            <FormGroup className="text-end d-flex align-items-center gap-2">
                                <Label className='nowrap'>Bill No</Label>
                                <Input
                                    id="billNo"
                                    name="billNo"
                                    type="text"
                                    value={billNo}
                                    onChange={(e) => setBillNo(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col className="text-end d-flex align-items-center gap-2">
                            <Label className='nowrap'>
                                Purchase Date
                            </Label>
                            <Input
                                id="purchaseDate"
                                name="purchaseDate"
                                type="date"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Form onSubmit={handleSubmit}>
                {rows.map((row: any, index: any) => (
                    <Row key={index} className="g-2">
                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Medicine Category <span className="text-danger">*</span></label>
                                <select
                                    id={`medicineCategory-${index}`}
                                    className={`form-control ${row.medicineCategoryValidationError ? 'is-invalid' : ''}`}
                                    value={row.medicineCategory || ""}
                                    onChange={(e) => getMedicineByCategoryId(index, e.target.value)}
                                >
                                    <option value="">--Select Category--</option>
                                    {medicineCategoryData.map((data: any, idx: any) => (
                                        <option key={idx} value={data.categoryName}>{data.categoryName}</option>
                                    ))}
                                </select>
                                {row.medicineCategoryValidationError && <div className="invalid-feedback">Medicine Category Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Company Name<span className="text-danger">*</span></label>
                                <select
                                    className={`form-control ${row.medicineCompanyNameValidationError ? 'is-invalid' : ''}`}
                                    value={row.companyId || ""}
                                    onChange={e => handleInputChange(index, "companyId", e.target.value)}
                                >
                                    <option value="">--Select Company Name--</option>
                                    {medicineCompanyData.map((data: any, idx: any) => (
                                        <option key={idx} value={data.id}>{data.companyName}</option>
                                    ))}
                                </select>
                                {row.medicineCompanyNameValidationError && <div className="invalid-feedback">Medicine Company Name Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Medicine Name <span className="text-danger">*</span></label>
                                <Input
                                    id="medicineName"
                                    name="medicineName"
                                    type="text"
                                    value={row.medicineName}
                                    className={`${row.medicineNameValidationError ? 'is-invalid' : ''}`}
                                    onChange={e => handleInputChange(index, "medicineName", e.target.value)}
                                />
                                {row.medicineNameValidationError && <div className="invalid-feedback">Medicine Name Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Batch No <span className="text-danger">*</span></label>
                                <Input
                                    id="batchNo"
                                    name="batchNo"
                                    type="text"
                                    value={row.batchNo}
                                    className={`${row.batchNoValidationError ? 'is-invalid' : ''}`}
                                    onChange={e => handleInputChange(index, "batchNo", e.target.value)}
                                />
                                {row.batchNoValidationError && <div className="invalid-feedback">Batch No Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Expiry Date <span className="text-danger">*</span></label>
                                <Input
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="month"
                                    value={row.expiryDate}
                                    className={`${row.expiryDateValidationError ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(index, "expiryDate", e.target.value)}
                                />
                                {row.expiryDateValidationError && <div className="invalid-feedback">Expiry Date Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">	MRP (₹) <span className="text-danger">*</span></label>
                                <Input
                                    id="mrp"
                                    name="mrp"
                                    type="number"
                                    value={row.mrp}
                                    className={`${row.mrpValidationError ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(index, "mrp", e.target.value)}
                                />
                                {row.mrpValidationError && <div className="invalid-feedback">MRP Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Batch Amount (₹)</label>
                                <Input
                                    id="batchAmount"
                                    name="batchAmount"
                                    type="number"
                                    value={row.batchAmount}
                                    onChange={(e) => handleInputChange(index, "batchAmount", e.target.value)}
                                />
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Sale Price(₹)<span className="text-danger">*</span></label>
                                <Input
                                    id="salePrice"
                                    name="salePrice"
                                    type="number"
                                    value={row.salePrice}
                                    className={`${row.salePriceValidationError ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(index, "salePrice", e.target.value)}
                                />
                                {row.salePriceValidationError && <div className="invalid-feedback">Sale Price Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Packing Quantity </label>
                                <Input
                                    id="packingQuantity"
                                    name="packingQuantity"
                                    type="number"
                                    value={row.packingQty}
                                    onChange={(e) => handleInputChange(index, "packingQty", e.target.value)}
                                />
                            </FormGroup>
                        </Col>

                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Quantity <span className="text-danger">*</span></label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="text"
                                    value={row.quantity}
                                    className={`${row.quantityValidationError ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                                />
                                {row.quantityValidationError && <div className="invalid-feedback">Quantity Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <label className="text-start mb-2">Purchase Price (₹)<span className="text-danger">*</span></label>
                                <Input
                                    id="purchasePrice"
                                    name="purchasePrice"
                                    type="text"
                                    value={row.purchasePrice}
                                    className={`${row.purchasePriceValidationError ? 'is-invalid' : ''}`}
                                    onChange={(e) => handleInputChange(index, "purchasePrice", e.target.value)}
                                />
                                {row.purchasePriceValidationError && <div className="invalid-feedback">Purchase Price Required.</div>}
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Tax (%)<span className="text-danger">*</span></label>
                                        <Input 
                                            className={`${row.taxValidationError ? 'is-invalid' : ''}`}
                                            type="number"
                                            id={`tax-${index}`}
                                            value={row.tax}
                                            onChange={(e) => handleInputChange(index, 'tax', e.target.value)}
                                        />
                                        {row.taxValidationError && <div className="invalid-feedback">Tax Required.</div>}
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <label className="text-start mb-2">Amount (₹)<span className="text-danger">*</span></label>
                                        <Input disabled
                                            type="text"
                                            className={`${row.amountValidationError ? 'is-invalid' : ''}`}
                                            value={row.amount || ""}
                                            readOnly
                                        />
                                        {row.amountValidationError && <div className="invalid-feedback">Amount Required.</div>}
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>

                        {index !== 0 && (
                            <Col md={3}>
                                <Button color='danger' className='my-3' onClick={() => removeRow(index)}>x</Button>
                            </Col>
                        )}
                        <hr />
                    </Row>
                ))}

                <Button color="primary" onClick={addRow}>
                    Add
                </Button>

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
                        <Row>
                            <Col>
                                <FormGroup>
                                    <label className="text-start mb-2">Attach Document</label>
                                    <div
                                        style={{
                                            border: '2px dashed #ddd',
                                            padding: '6px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                        }}
                                        onClick={() => document.getElementById('fileInput')?.click()}
                                    >
                                        {selectedFile ? selectedFile.name : "Drop a file here or click"}
                                    </div>
                                    <Input
                                        id="fileInput"
                                        name="medicinePhoto"
                                        type="file"
                                        // accept=".pdf"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload}
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
                                    <Input
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
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="tax">Tax (₹)</Label>
                                    <Input
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

                        </Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label for="paymentAmount">Payment Amount</Label>
                                <Input
                                    type="number"
                                    id="paymentAmount"
                                    value={paymentAmount}
                                    readOnly
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
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
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="paymentNote">Payment Note</Label>
                                    <Input
                                        type="text"
                                        id="paymentNote"
                                        value={paymentNote}
                                        onChange={e => setPaymentNote(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex align-items-center">
                        <Button type="submit" color="primary" className="ms-auto">
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container >
    );
}

export default MedicinePurchase