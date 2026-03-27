import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Row, Col, Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    accountSid: string;           // Twilio Account SID
    authToken: string;            // Authentication Token
    registeredPhoneNumber: string; // Registered Phone Number
    statusVal: string;               // statusVal
}

interface FormErrors {
    accountSid?: string;
    authToken?: string;
    registeredPhoneNumber?: string;
    statusVal?: string;
}

const TwilioForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        accountSid: '',
        authToken: '',
        registeredPhoneNumber: '',
        statusVal: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.accountSid) newErrors.accountSid = 'Twilio Account SID is required';
        if (!formData.authToken) newErrors.authToken = 'Authentication Token is required';
        if (!formData.registeredPhoneNumber) newErrors.registeredPhoneNumber = 'Registered Phone Number is required';
        if (!formData.statusVal) newErrors.statusVal = 'status is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form from refreshing the page

        if (validateForm()) {
            const dataToSend = {
                ...formData,
            };

            try {
                const response = await fetch("http://localhost:8087/employees/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                });

                const responseText = await response.text();

                if (response.ok) {
                    alert("Form submitted successfully!");
                    // Optionally, navigate to another page or reset the form
                    setFormData({
                        accountSid: '',
                        authToken: '',
                        registeredPhoneNumber: '',
                        statusVal: '',
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
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="accountSid">Twilio Account SID</Label>
                <Input
                    type="text"
                    id="accountSid"
                    value={formData.accountSid}
                    onChange={handleChange}
                    invalid={!!errors.accountSid}
                />
                {errors.accountSid && <div className="invalid-feedback">{errors.accountSid}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="authToken">Authentication Token</Label>
                <Input
                    type="text"
                    id="authToken"
                    value={formData.authToken}
                    onChange={handleChange}
                    invalid={!!errors.authToken}
                />
                {errors.authToken && <div className="invalid-feedback">{errors.authToken}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="registeredPhoneNumber">Registered Phone Number</Label>
                <Input
                    type="text"
                    id="registeredPhoneNumber"
                    value={formData.registeredPhoneNumber}
                    onChange={handleChange}
                    invalid={!!errors.registeredPhoneNumber}
                />
                {errors.registeredPhoneNumber && <div className="invalid-feedback">{errors.registeredPhoneNumber}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="statusVal">status</Label>
                <Input
                    type="select"
                    id="statusVal"
                    value={formData.statusVal}
                    onChange={handleChange}
                    invalid={!!errors.statusVal}
                >
                    <option value="">Select status...</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </Input>
                {errors.statusVal && <div className="invalid-feedback">{errors.statusVal}</div>}
            </FormGroup>

            <Button type="submit" color="primary">Submit</Button>
        </Form>
    );
};

export default TwilioForm;
