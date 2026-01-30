import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Row, Col, Label, Input, Button, Form, FormGroup } from 'reactstrap';

interface FormData {
    authKey: string;           // Twilio Account SID
    senderId: string;         // Authentication Token
    statusVal: string;        // Status
}

interface FormErrors {
    authKey?: string;
    senderId?: string;
    statusVal?: string;
}

const Msg91Form: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        authKey: '',
        senderId: '',
        statusVal: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        validateForm(); // Validate on change
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.authKey) newErrors.authKey = 'Auth Key is required';
        if (!formData.senderId) newErrors.senderId = 'Sender ID is required';
        if (!formData.statusVal) newErrors.statusVal = 'Status is required';

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
                console.log("Response from server:", responseText);

                if (response.ok) {
                    alert("Form submitted successfully!");
                    // Optionally, navigate to another page or reset the form
                    setFormData({
                        authKey: '',
                        senderId: '',
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
                <Label for="authKey">Auth Key</Label>
                <Input
                    type="text"
                    id="authKey"
                    value={formData.authKey}
                    onChange={handleChange}
                    invalid={!!errors.authKey}
                />
                {errors.authKey && <div className="invalid-feedback">{errors.authKey}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="senderId">Sender ID</Label>
                <Input
                    type="text"
                    id="senderId"
                    value={formData.senderId}
                    onChange={handleChange}
                    invalid={!!errors.senderId}
                />
                {errors.senderId && <div className="invalid-feedback">{errors.senderId}</div>}
            </FormGroup>

            <FormGroup>
                <Label for="statusVal">Status</Label>
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

export default Msg91Form;
