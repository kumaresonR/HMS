import { useEffect, useState } from "react"
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap"
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";

const AddBadStock = (props: any) => {
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();

    const [batchNo, setBatchNo] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [outwardDate, setOutwardDate] = useState(today);
    const [qty, setQty] = useState('');
    const [note, setNote] = useState('');
    const [purchaseMedicines, setPurchaseMedicines] = useState<any>([]);
    const [batchNoValidationError, setBatchNoValidationError] = useState(false);
    const [expiryDateValidationError, setExpiryDateValidationError] = useState(false);
    const [outwardDateValidationError, setOutwardDateValidationError] = useState(false);
    const [qntValidationError, setQntValidationError] = useState(false);

    const handleExpiryDate = (value: any) => {
        setExpiryDate(value);
        setExpiryDateValidationError(false);
    }

    const handleBatchNoChange = (selectedBatchNo: string) => {
        const selectedMedicine = purchaseMedicines
            .flatMap((data: any) => data.medicines)
            .find((item: any) => item.batchNo === selectedBatchNo);

        setBatchNo(selectedBatchNo);
        setBatchNoValidationError(false);
        setExpiryDate(selectedMedicine?.expiryDate || "");
        setExpiryDateValidationError(false);
    };
    const handleOutwardDate = (value: any) => {
        setOutwardDate(value);
        setOutwardDateValidationError(false);
    }

    const handleQty = (value: any) => {
        setQty(value);
        setQntValidationError(false);
    }

    const getAllPurchaseMedicine = async () => {
        try {
            let result = await pharmacyApiService.getAllPurchaseMedicine('?all');
            console.log("getAllPurchaseMedicine", result);
            setPurchaseMedicines(result);
        } catch (error: any) {
            console.log("getAllPurchaseMedicine Error");
            console.log(error);
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!batchNo) {
            setBatchNoValidationError(true);
            isFormValid = false;
        }

        if (!expiryDate) {
            setExpiryDateValidationError(true);
            isFormValid = false;
        }

        if (!outwardDate) {
            setOutwardDateValidationError(true);
            isFormValid = false;
        }

        if (!qty) {
            setQntValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    }
    const handleSubmit = () => {
        if (validateForm()) {
            doCreateMedication();
        }
    };

    const doCreateMedication = async () => {
        try {
            let payload: any = {
                batchNo: batchNo,
                expiryDate: expiryDate,
                outwardDate: outwardDate,
                qty: qty,
                note: note || 'NA',
                addMedicineId : props.id
            }

            await pharmacyApiService.createBadStock(payload);
            toast.success('Bad Stock Added Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            console.log("Bad Stock Added Failed", error);
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllPurchaseMedicine();
    }, []);

    return <>
        <Container>
            <Row>
                <Col>
                    <FormGroup>
                        <label className="text-start mb-2">Batch No <span className="text-danger">*</span></label>
                        <select
                            className={`${batchNoValidationError ? 'is-invalid' : ''} form-control`}
                            value={batchNo}
                            onChange={(e) => handleBatchNoChange(e.target.value)} 
                        >
                            <option value="">--Select Batch No--</option>
                            {purchaseMedicines.map((data: any, idx: any) =>
                                data.medicines.map((item: any, subIdx: any) => (
                                    <option key={`${idx}-${subIdx}`} value={item.batchNo}>
                                        {item.batchNo}
                                    </option>
                                ))
                            )}
                        </select>
                        {batchNoValidationError && <div className="invalid-feedback">Batch No Required.</div>}
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label className="text-start mb-2">Expiry Date <span className="text-danger">*</span></label>
                        <Input className={`${expiryDateValidationError ? 'is-invalid' : ''}`}
                            id="expiryDate"
                            name="expiryDate"
                            type="text" disabled
                            value={expiryDate}
                            onChange={e => handleExpiryDate(e.target.value)}
                        />
                        {expiryDateValidationError && <div className="invalid-feedback">Expiry Date Required.</div>}
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label className="text-start mb-2">Outward Date <span className="text-danger">*</span></label>
                        <Input
                            className={`${outwardDateValidationError ? 'is-invalid' : ''}`}
                            id="outwardDate"
                            name="outwardDate"
                            type="date"
                            value={outwardDate}
                            onChange={e => handleOutwardDate(e.target.value)}
                        />
                        {outwardDateValidationError && <div className="invalid-feedback">Outward Date Required.</div>}
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <label className="text-start mb-2">Qty <span className="text-danger">*</span></label>
                        <Input className={`${qntValidationError ? 'is-invalid' : ''}`}
                            id="Qty"
                            name="Qty"
                            type="text"
                            value={qty}
                            onChange={e => handleQty(e.target.value)}
                        />
                        {qntValidationError && <div className="invalid-feedback">Qty Required.</div>}
                    </FormGroup>
                </Col>
                <Col md={12}>
                    <div className="mb-3">
                        <Label htmlFor="note" className="form-label ">Note</Label>
                        <textarea
                            id="note"
                            name="note"
                            rows={3}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className={`form-control`}
                        />
                    </div>
                </Col>
                <Col sm={12} className="text-end">
                    <Button onClick={handleSubmit}>Save</Button>
                </Col>
            </Row>
        </Container>
    </>
}
export default AddBadStock