import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, CardBody, CardHeader, Row } from 'reactstrap';

interface FormData {
    ipdNo: string;
    opdNo: string;
    ipdPrescription: string;
    opdPrescription: string;
    appointment: string;
    pharmacyBill: string;
    operationReferenceNo: string;
    bloodBankBill: string;
    ambulanceCallBill: string;
    radiologyBill: string;
    pathologyBill: string;
    opdCheckupId: string;
    pharmacyPurchaseNo: string;
    transactionId: string;
    birthRecordReferenceNo: string;
    deathRecordReferenceNo: string;
}

interface FormErrors {
    ipdNo?: string;
    opdNo?: string;
    ipdPrescription?: string;
    opdPrescription?: string;
    appointment?: string;
    pharmacyBill?: string;
    operationReferenceNo?: string;
    bloodBankBill?: string;
    ambulanceCallBill?: string;
    radiologyBill?: string;
    pathologyBill?: string;
    opdCheckupId?: string;
    pharmacyPurchaseNo?: string;
    transactionId?: string;
    birthRecordReferenceNo?: string;
    deathRecordReferenceNo?: string;
}

const PrefixSetting: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        ipdNo: '',
        opdNo: '',
        ipdPrescription: '',
        opdPrescription: '',
        appointment: '',
        pharmacyBill: '',
        operationReferenceNo: '',
        bloodBankBill: '',
        ambulanceCallBill: '',
        radiologyBill: '',
        pathologyBill: '',
        opdCheckupId: '',
        pharmacyPurchaseNo: '',
        transactionId: '',
        birthRecordReferenceNo: '',
        deathRecordReferenceNo: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        Object.keys(data).forEach((key) => {
            if (!data[key as keyof FormData]) {
                newErrors[key as keyof FormErrors] = `${key} is required`;
            }
        });
        return newErrors;
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const updatedData = { ...formData, [id]: value };
        setFormData(updatedData);

        // Validate on change
        const newErrors = validateForm(updatedData);
        setErrors(newErrors);
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form from refreshing the page

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch("http://localhost:8087/employees/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const responseText = await response.text();
                console.log("Response from server:", responseText);

                if (response.ok) {
                    alert("Form submitted successfully!");
                    // Reset the form
                    setFormData({
                        ipdNo: '',
                        opdNo: '',
                        ipdPrescription: '',
                        opdPrescription: '',
                        appointment: '',
                        pharmacyBill: '',
                        operationReferenceNo: '',
                        bloodBankBill: '',
                        ambulanceCallBill: '',
                        radiologyBill: '',
                        pathologyBill: '',
                        opdCheckupId: '',
                        pharmacyPurchaseNo: '',
                        transactionId: '',
                        birthRecordReferenceNo: '',
                        deathRecordReferenceNo: '',
                    });
                    setErrors({});
                } else {
                    alert("Error submitting form: " + responseText);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            }
        }
    };

    return (


        <Card id="backupHistory">
            <CardHeader className="border-0">
                <Row className="g-4 align-items-center">
                    <div className="col-sm">
                        <div>
                            <h5 className="card-title mb-0"> Prefix Settings</h5>
                        </div>
                    </div>

                </Row>
            </CardHeader>


            <CardBody>
                <Form onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key) => (
                        <FormGroup key={key}>
                            <Label for={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</Label> {/* Format the label */}
                            <Input
                                type="text"
                                id={key}
                                value={formData[key as keyof FormData]}
                                onChange={handleChange}
                                invalid={!!errors[key as keyof FormErrors]}
                            />
                            {errors[key as keyof FormErrors] && <div className="invalid-feedback">{errors[key as keyof FormErrors]}</div>}
                        </FormGroup>
                    ))}
                    <Button type="submit" color="primary">Submit</Button>
                </Form>
            </CardBody>
        </Card>
    );
};

export default PrefixSetting;
