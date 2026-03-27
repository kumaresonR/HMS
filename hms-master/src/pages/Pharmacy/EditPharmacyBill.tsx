import { Button, Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { useEffect, useState } from "react";
import PatientApiService from "../../helpers/services/patient/patient-api-service";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { paymentModeData } from "../../common/data/FakeData";
import { toast } from "react-toastify";
import ErrorHandler from "../../helpers/ErrorHandler";
import AppointmentApiService from "../../helpers/services/appointment/appointment-api-service";
import PharmacyApiService from "../../helpers/services/pharmacy/pharmacy-api-service";
import SetupApiService from "../../helpers/services/setup/setup-api-service";

const EditPharmacyBill = (props: any) => {
    const patientApiService: PatientApiService = new PatientApiService();
    const pharmacyApiService: PharmacyApiService = new PharmacyApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();
    const setupApiService: SetupApiService = new SetupApiService();

    const [medicineStockData, setMedicineStockData] = useState<any>([]);
    const [medicineCategoryData, setMedicineCategoryData] = useState([]);
    const [purchaseMedicines, setPurchaseMedicines] = useState<any>([]);

    const [tax, setTax] = useState<any>(0);
    const [doctorName, setDoctorName] = useState('');
    const [hospitalDoctor, setHospitalDoctor] = useState('');
    const [caseId, setCaseId] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentAmount, setPaymentAmount] = useState<any>(0);
    const [paymentAmountValidationError, setPaymentAmountValidationError] = useState(false);
    const [discount, setDiscount] = useState<number>(0);
    const [netAmount, setNetAmount] = useState<any>(0);
    const [note, setNote] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [patientValidationError, setPatientValidationError] = useState(false);
    const [total, setTotal] = useState<any>(0);
    const [prescriptionNo, setPrescriptionNo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);
    const [doctorOptions, setDoctorOptions] = useState<[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [documentFile, setDocument] = useState<any>();
    const [chequeNo, setChequeNo] = useState('');
    const [chequeNoValidationError, setChequeNoValidationError] = useState(false);
    const [chequeDate, setChequeDate] = useState('');
    const [chequeDateValidationError, setChequeDateValidationError] = useState(false);
    const [medicineCategoryValidationError, setMedicineCategoryValidationError] = useState(false);
    const [medicineNameValidationError, setMedicineNameValidationError] = useState(false);
    const [batchNoValidationError, setBatchNoValidationError] = useState(false);
    const [expiryDateValidationError, setExpiryDateValidationError] = useState(false);
    const [qntValidationError, setQntValidationError] = useState(false);
    const [salePriceValidationError, setSalePriceValidationError] = useState(false);
    const [amountValidationError, setAmountValidationError] = useState(false);

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

    const handleHospitalDoctorChange = (value: any) => {
        const doctorId = value?.[0]?.['employeeId'];
        const doctorName = value?.[0]?.['fullName']
        setHospitalDoctor(doctorId);
        setDoctorName(doctorName);
    }
    const addRow = () => {
        setRows([...rows, {
            medicineCategory: '',
            medicineName: '',
            batchNo: '',
            expiryDate: '',
            quantity: '',
            availableQty: '',
            salePrice: '',
            tax: '',
            amount: '',
            filteredMedicine: [],
            filteredBatchData: [],
            billId : props.data.billId
        }]);
    };

    const removeRow = (index: any) => {
        const newRow = [...rows];
        newRow.splice(index, 1);
        setRows(newRow);
    };

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "getPatientData?searchTerm=" + query
            let result = await patientApiService.searchPatient(url);
            console.log("search result", result);
            setOptions(result.data)
        } catch (error) {
            console.log("Patient search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onDoctorSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "role=DOCTOR&department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            console.log("search result", result);
            setDoctorOptions(result)
        } catch (error) {
            console.log("Doctor search Error");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedPatientId = (selectedItem: any) => {
        const patientId = selectedItem?.[0]?.['patientId'];
        setSelectedPatientId(patientId);
        setPatientValidationError(false);
    }

    const handlePaymentAmountChange = (value: any) => {
        const numericValue = parseFloat(value) || 0;
        setPaymentAmount(value);

        if (numericValue > netAmount) {
            setPaymentAmountValidationError(true);
        } else {
            setPaymentAmountValidationError(false);
        }
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                [field]: value,
            };

            if (field === "quantity" || field === "salePrice" || field === "tax") {
                const quantity = parseFloat(updatedRows[index].quantity || "0");
                const salePrice = parseFloat(updatedRows[index].salePrice || "0");
                const tax = parseFloat(updatedRows[index].tax || "0");

                if (!isNaN(quantity) && !isNaN(salePrice) && !isNaN(tax)) {
                    const amount = (quantity * salePrice) + (quantity * salePrice * (tax / 100));
                    updatedRows[index].amount = amount.toFixed(2);
                    const taxAmount = quantity * salePrice * (tax / 100);
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

        switch (field) {
            case 'medicineCategory':
                setMedicineCategoryValidationError(!value);
                break;
            case 'medicineName':
                setMedicineNameValidationError(!value);
                break;
            case 'batchNo':
                setBatchNoValidationError(!value);
                break;
            case 'expiryDate':
                setExpiryDateValidationError(!value);
                break;
            case 'quantity':
                setQntValidationError(!value);
                break;
            case 'salePrice':
                setSalePriceValidationError(!value);
                break;
            case 'amount':
                setAmountValidationError(!value);
                break;
            default:
                break;
        }
    };
    const getMedicineByCategoryId = (index: number, value: any) => {
        handleInputChange(index, "medicineCategory", value);

        const filteredMedicineStock = medicineStockData
            ? medicineStockData.filter((item: any) => item.category === value)
            : [];

        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                filteredMedicine: filteredMedicineStock,
                medicineName: '',
            };
            return updatedRows;
        });
    };

    const handleMedicineNameChange = (index: number, value: any) => {
        handleInputChange(index, "medicineName", value);

        const filteredBathData = purchaseMedicines
            ? purchaseMedicines.filter((item: any) =>
                item.medicines.some((medicine: any) => medicine.medicineName === value)
            )
            : [];
        console.log("filteredBathData", filteredBathData)
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                filteredBatchData: filteredBathData,
                batchNo: '',
                tax: '',
                salePrice : '',
                packingQty :'',
                expiryDate : '',
                amount : '',
                quantity : ''
            };
            return updatedRows
        })
    }

    const handleBatchNoChange = (index: number, value: any) => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
                ...updatedRows[index],
                batchNo: value.batchNo,
                tax: value.tax,
                salePrice: value.salePrice,
                availableQty: value.packingQty,
                expiryDate: value.expiryDate,
            };
            return updatedRows
        })
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!selectedPatientId) {
            setPatientValidationError(true);
            isFormValid = false;
        }

        if (!paymentAmount || parseFloat(paymentAmount) > netAmount) {
            setPaymentAmountValidationError(true);
            isFormValid = false;
        }

        const rowErrors = rows.map((row: any) => {
            const errors = {
                medicineCategory: !row.medicineCategory,
                medicineName: !row.medicineName,
                batchNo: !row.batchNo,
                expiryDate: !row.expiryDate,
                quantity: !row.quantity,
                salePrice: !row.salePrice,
                amount: !row.amount
            };

            isFormValid = isFormValid && !Object.values(errors).includes(true);
            return errors;
        });

        setMedicineCategoryValidationError(rowErrors.some(error => error.medicineCategory));
        setMedicineNameValidationError(rowErrors.some(error => error.medicineName));
        setBatchNoValidationError(rowErrors.some(error => error.batchNo));
        setExpiryDateValidationError(rowErrors.some(error => error.expiryDate));
        setQntValidationError(rowErrors.some(error => error.quantity));
        setSalePriceValidationError(rowErrors.some(error => error.salePrice));
        setAmountValidationError(rowErrors.some(error => error.amount));

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
            const sanitizedRows = rows.map(({ filteredMedicine, filteredBatchData, ...rest }) => rest);
            let formData: FormData = new FormData();
            const payload: any = {
                patientId: selectedPatientId,
                hospitalDoctor: hospitalDoctor,
                caseId: caseId,
                prescriptionNo: prescriptionNo,
                doctorName: doctorName,
                note: note,
                totalAmount: total,
                discount: discount,
                tax: tax,
                netAmount: netAmount,
                paymentMode: paymentMode,
                paymentAmount: paymentAmount,
                chequeNo: chequeNo,
                chequeDate: chequeDate,
                medicines: sanitizedRows
            };
            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            console.log("JSON.stringify(jsonBlob)",payload)
            formData.append('medicineData', jsonBlob);
            formData.append('photo', documentFile);
            await pharmacyApiService.editPharmacyBill(props.data.billId,formData);
            toast.success('Bill Details Updated Successfully', { containerId: 'TR' });
            props.handleClose();
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllMedicineStock = async () => {
        try {
            let url = "all"
            let result = await pharmacyApiService.getAllMedicineStock(url);
            console.log("getAllMedicineStock", result);
            setMedicineStockData(result);
        } catch (error: any) {
            console.log("getAllMedicineStock Error");
            console.log(error);
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

    const getAllPharmacyBill = async () => {
        try {
            let url = props.data.billId
            let result = await pharmacyApiService.getAllPharmacyBill(url);
            console.log("getAllPharmacyBill", result);
            setPharmacyData(result);
        } catch (error: any) {
            console.log("getAllPharmacyBill Error");
            console.log(error);
        }
    }

    const setPharmacyData = (data: any) => {
        const updatedRows = data.medicines.map((medicine: any) => {
            const filteredMedicineStock = medicineStockData?.filter(
                (item: any) => item.category === medicine.medicineCategory
            ) || [];

            const filteredBathData = purchaseMedicines?.filter((item: any) =>
                item.medicines.some((med: any) => med.medicineName === medicine.medicineName)
            ) || [];

            return {
                ...medicine,
                filteredMedicine: filteredMedicineStock,
                filteredBatchData: filteredBathData,
            };
        });

        setRows(updatedRows);

        setSelectedPatientId(data.patientId);
        if(data.patientId){
            onSearch(data.patientId)
        }
        setHospitalDoctor(data.hospitalDoctor);
        setCaseId(data.caseId);
        setPrescriptionNo(data.prescriptionNo);
        setDoctorName(data.doctorName);
        setNote(data.note);
        setTotal(data.totalAmount);
        setDiscount(data.discount);
        setTax(data.tax);
        setNetAmount(data.netAmount);
        setPaymentAmount(data.paymentAmount);
        setChequeNo(data.chequeNo);
        setChequeDate(data.chequeDate);
        if (data.doctorName) {
            const firstName = data.doctorName.split(" ")[0];
            onDoctorSearch(firstName)
        }
        setPaymentMode(data.paymentMode)
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAllMedicineCategory();
            await getAllMedicineStock();
            await getAllPurchaseMedicine();
        };

        fetchData();
    }, []);  

    useEffect(() => {
        if (medicineCategoryData.length > 0 && medicineStockData.length > 0 && purchaseMedicines.length > 0) {
            getAllPharmacyBill();
        }
    }, [medicineCategoryData, medicineStockData, purchaseMedicines]);

    useEffect(() => {
        const discountValue = (total * (discount / 100));
        const netAmount = total - discountValue;
        setNetAmount(netAmount.toFixed(2));
        setPaymentAmount(netAmount.toFixed(2));
    }, [discount, total]);


    return (
        <Container fluid>
            <Row className='mb-2'>
                <Col sm={6}>
                    <AsyncTypeahead
                        filterBy={() => true}
                        id="patient-id-search-box"
                        className={` ${patientValidationError ? 'is-invalid' : ''}`}
                        isLoading={isLoading}
                        labelKey="name"
                        minLength={1}
                        options={options}
                        onSearch={onSearch}
                        onChange={onSelectedPatientId}
                        placeholder="Search by Patient Name or Id"
                        selected={options.filter((patient:any) => patient.patientId === selectedPatientId)}
                    />
                    {patientValidationError && <div className="invalid-feedback">Patient Required.</div>}
                </Col>
                <Col sm={6} className='d-flex align-items-center justify-content-end gap-2'>
                    <Input
                        type="text"
                        placeholder="Prescription No"
                        id={`Prescription No`}
                        value={prescriptionNo}
                        onChange={e => setPrescriptionNo(e.target.value)}
                    />
                    <div>
                        <Button>Search</Button>
                    </div>
                </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
                {rows.map((row: any, index: any) => (
                    <Row key={index} className='align-items-center'>
                        <Col>
                            <FormGroup>
                                <Label for={`medicineCategory-${index}`}>Medicine Category<span className='text-danger'>*</span></Label>
                                <select
                                    className={`form-control ${medicineCategoryValidationError && !row.medicineCategory ? 'is-invalid' : ''}`}
                                    id={`medicineCategory-${index}`}
                                    value={row.medicineCategory || ""}
                                    onChange={(e) => getMedicineByCategoryId(index, e.target.value)}
                                >
                                    <option value="">--Select Medicine Category--</option>
                                    {medicineCategoryData.map((data: any, idx: any) => (
                                        <option key={idx} value={data.categoryName}>{data.categoryName}</option>
                                    ))}
                                </select>
                                {medicineCategoryValidationError && !row.medicineCategory && <div className="invalid-feedback">Medicine Category Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col>
                            <FormGroup>
                                <Label for={`medicineName-${index}`}>Medicine Name<span className='text-danger'>*</span></Label>
                                <select
                                    className={`form-control ${medicineNameValidationError && !row.medicineName ? 'is-invalid' : ''}`}
                                    value={row.medicineName || ""}
                                    onChange={(e) => handleMedicineNameChange(index, e.target.value)}
                                >
                                    <option value="">--Select Medicine--</option>
                                    {(row.filteredMedicine || []).map((data: any, idx: any) => (
                                        <option key={idx} value={data.name}>{data.name}</option>
                                    ))}
                                </select>
                                {medicineNameValidationError && !row.medicineName && <div className="invalid-feedback">Medicine Name Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col>
                            <FormGroup>
                                <Label for={`batchNo-${index}`}>Batch No<span className='text-danger'>*</span></Label>
                                <select
                                    className={`form-control ${batchNoValidationError && !row.batchNo ? 'is-invalid' : ''}`}
                                    value={row.batchNo || ""}
                                    onChange={(e) => {
                                        const selectedBatch = row.filteredBatchData
                                            ?.flatMap((batch: any) => batch.medicines) // Flatten all medicines into a single array
                                            ?.find((medicine: any) => medicine.batchNo === e.target.value); // Find the selected batchNo

                                        if (selectedBatch) {
                                            handleBatchNoChange(index, selectedBatch);
                                        }
                                    }}
                                >
                                    <option value="">--Select Batch No--</option>
                                    {row?.filteredBatchData.map((batch: any) =>
                                        batch.medicines.map((medicine: any, idx: any) => (
                                            <option key={idx} value={medicine.batchNo}>{medicine.batchNo}</option>
                                        )))}
                                </select>
                                {batchNoValidationError && !row.batchNo && <div className="invalid-feedback">Batch No Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col>
                            <FormGroup>
                                <Label for={`expiryDate-${index}`}>Expiry Date<span className='text-danger'>*</span></Label>
                                <Input
                                    className={`form-control ${expiryDateValidationError && !row.expiryDate ? 'is-invalid' : ''}`}
                                    type="text"
                                    id={`expiryDate-${index}`}
                                    value={row.expiryDate || ''}
                                    onChange={(e) => handleInputChange(index, 'expiryDate', e.target.value)}
                                    disabled
                                />
                                {expiryDateValidationError && !row.expiryDate && <div className="invalid-feedback">Expiry Date Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col xs="auto">
                            <FormGroup className='mb-0'>
                                <Label for={`quantity-${index}`}>Qty<span className="text-danger">*</span> |
                                    {row.availableQty && (
                                        <span style={{ fontSize: '10px' }} className='text-success'>Available Qty {row.availableQty}</span>
                                    )}
                                </Label>
                                <input
                                    type="number"
                                    className={`form-control ${qntValidationError && !row.quantity ? 'is-invalid' : ''}`}
                                    value={row.quantity}
                                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                                />
                                {qntValidationError && !row.quantity && <div className="invalid-feedback">Qty Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col>
                            <FormGroup>
                                <Label for={`salePrice-${index}`}>Sale Price<span className="text-danger">*</span></Label>
                                <Input className={`${salePriceValidationError && !row.salePrice ? 'is-invalid' : ''}`}
                                    type="number" disabled
                                    id={`salePrice-${index}`}
                                    value={row.salePrice}
                                    onChange={(e) => handleInputChange(index, 'salePrice', e.target.value)}
                                />
                                {salePriceValidationError && !row.salePrice && <div className="invalid-feedback">Sale Price Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col>
                            <FormGroup>
                                <Label for={`tax-${index}`}>Tax %</Label>
                                <Input disabled
                                    type="number"
                                    id={`tax-${index}`}
                                    value={row.tax}
                                    onChange={(e) => handleInputChange(index, 'tax', e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for={`amount-${index}`}>Amount<span className="text-danger">*</span></Label>
                                <input disabled
                                    type="text"
                                    className={`form-control ${amountValidationError && !row.amount ? 'is-invalid' : ''}`}
                                    value={row.amount || ""}
                                    readOnly
                                />
                                {amountValidationError && !row.amount && <div className="invalid-feedback">Amount Required.</div>}
                            </FormGroup>
                        </Col>

                        <Col>
                            {!row.medicineId &&  index !== 0 && (
                                <Button color='danger' onClick={() => removeRow(index)}>x</Button>
                            )}
                        </Col>
                    </Row>
                )
                )}

                <Button color="primary" onClick={addRow}>
                    Add
                </Button>

                <hr />
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="Hospital Doctor">Hospital Doctor</Label>
                                    <AsyncTypeahead
                                        filterBy={() => true}
                                        id="patient-id-search-box"
                                        isLoading={isLoading}
                                        labelKey="fullName"
                                        minLength={1}
                                        options={doctorOptions}
                                        onSearch={onDoctorSearch}
                                        onChange={handleHospitalDoctorChange}
                                        placeholder="Hospital Doctor"
                                        selected={doctorOptions.filter((doctor:any) => doctor.fullName === doctorName)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label for="DoctorName">Doctor Name</Label>
                                    <Input
                                        type="text"
                                        id="doctorName"
                                        value={doctorName}
                                        onChange={(e) => setDoctorName(e.target.value)}
                                    >
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
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
                            <Col sm={6}>
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

                            <Col sm={6}>
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

                            <Col sm={6}>
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

                            <Col sm={6}>
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

                            <Col sm={6}>
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
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex align-items-center justify-content-center mt-3">
                        {/* <Button type="submit" color="primary" className="me-2">
                            Save & Print
                        </Button> */}
                        <Button color="primary" >
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container >
    );
};

export default EditPharmacyBill;