import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, CardBody, CardHeader } from 'reactstrap';

interface FormData {
    emailEngine: string;
    smtpUsername?: string;
    smtpPassword?: string;
    smtpServer?: string;
    smtpPort?: string;
    smtpSecurity?: string;
    smtpAuth?: string;
}

interface FormErrors {
    emailEngine?: string;
    smtpUsername?: string;
    smtpPassword?: string;
    smtpServer?: string;
    smtpPort?: string;
    smtpSecurity?: string;
    smtpAuth?: string;
}

const EmailSettingForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        emailEngine: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.emailEngine) newErrors.emailEngine = 'Email Engine is required';
        if (data.emailEngine === 'smtp') {
            if (!data.smtpUsername) newErrors.smtpUsername = 'SMTP Username is required';
            if (!data.smtpPassword) newErrors.smtpPassword = 'SMTP Password is required';
            if (!data.smtpServer) newErrors.smtpServer = 'SMTP Server is required';
            if (!data.smtpPort) newErrors.smtpPort = 'SMTP Port is required';
            if (!data.smtpSecurity) newErrors.smtpSecurity = 'SMTP Security is required';
            if (!data.smtpAuth) newErrors.smtpAuth = 'SMTP Auth is required';
        }
        return newErrors;
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        const updatedData = { ...formData, [id]: value };
        setFormData(updatedData);
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
                        emailEngine: '',
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
        <Card>
            <CardHeader>
                <h5 className="mb-0">Email Setting</h5>
            </CardHeader>
            <CardBody>

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="emailEngine">Email Engine</Label>
                        <Input
                            type="select"
                            id="emailEngine"
                            value={formData.emailEngine}
                            onChange={handleChange}
                            invalid={!!errors.emailEngine}
                        >
                            <option value="">Select Email Engine</option>
                            <option value="sendemail">Send Email</option>
                            <option value="smtp">SMTP</option>
                        </Input>
                        {errors.emailEngine && <div className="invalid-feedback">{errors.emailEngine}</div>}
                    </FormGroup>

                    {formData.emailEngine === 'smtp' && (
                        <>
                            <FormGroup>
                                <Label for="smtpUsername">SMTP Username</Label>
                                <Input
                                    type="text"
                                    id="smtpUsername"
                                    value={formData.smtpUsername}
                                    onChange={handleChange}
                                    invalid={!!errors.smtpUsername}
                                />
                                {errors.smtpUsername && <div className="invalid-feedback">{errors.smtpUsername}</div>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="smtpPassword">SMTP Password</Label>
                                <Input
                                    type="password"
                                    id="smtpPassword"
                                    value={formData.smtpPassword}
                                    onChange={handleChange}
                                    invalid={!!errors.smtpPassword}
                                />
                                {errors.smtpPassword && <div className="invalid-feedback">{errors.smtpPassword}</div>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="smtpServer">SMTP Server</Label>
                                <Input
                                    type="text"
                                    id="smtpServer"
                                    value={formData.smtpServer}
                                    onChange={handleChange}
                                    invalid={!!errors.smtpServer}
                                />
                                {errors.smtpServer && <div className="invalid-feedback">{errors.smtpServer}</div>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="smtpPort">SMTP Port</Label>
                                <Input
                                    type="text"
                                    id="smtpPort"
                                    value={formData.smtpPort}
                                    onChange={handleChange}
                                    invalid={!!errors.smtpPort}
                                />
                                {errors.smtpPort && <div className="invalid-feedback">{errors.smtpPort}</div>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="smtpSecurity">SMTP Security</Label>
                                <Input
                                    type="select"
                                    id="smtpSecurity"
                                    value={formData.smtpSecurity}
                                    onChange={handleChange}
                                    invalid={!!errors.smtpSecurity}
                                >
                                    <option value="">Select Security</option>
                                    <option value="OFF">OFF</option>
                                    <option value="SSL">SSL</option>
                                    <option value="TLS">TLS</option>
                                </Input>
                                {errors.smtpSecurity && <div className="invalid-feedback">{errors.smtpSecurity}</div>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="smtpAuth">SMTP Auth</Label>
                                <Input
                                    type="select"
                                    id="smtpAuth"
                                    value={formData.smtpAuth}
                                    onChange={handleChange}
                                    invalid={!!errors.smtpAuth}
                                >
                                    <option value="">Select Auth</option>
                                    <option value="OFF">OFF</option>
                                    <option value="ON">ON</option>
                                </Input>
                                {errors.smtpAuth && <div className="invalid-feedback">{errors.smtpAuth}</div>}
                            </FormGroup>
                        </>
                    )}

                    <Button type="submit" color="primary">Submit</Button>
                </Form>
            </CardBody>
        </Card>
    );
};

export default EmailSettingForm;
