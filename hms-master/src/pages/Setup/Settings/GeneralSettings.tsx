import React, { useState } from 'react';
import { Card, CardBody, Form, Row, Col, Input, Label, Button, CardHeader } from 'reactstrap';

// Define an interface for the form data
interface FormData {
    hospitalName: string;
    hospitalCode: string;
    address: string;
    phone: string;
    email: string;
    country: string;
    dateFormat: string;
    timeZone: string;
    currency: string;
    currencySymbol: string;
    creditLimit: string; // Change to number if you prefer to store as a number
    timeFormat: string;
    mobileApiUrl: string;
    primaryColor: string;
    secondaryColor: string;
    doctorRestrictionMode: string; // 'Disabled' | 'Enabled'
    superadminVisibility: string; // 'Disabled' | 'Enabled'
    patientPanel: string; // 'Disabled' | 'Enabled'
    scanType: string; // 'Barcode' | 'QR Code'
}

const GeneralSettings: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        hospitalName: "",
        hospitalCode: "",
        address: "",
        phone: "",
        email: "",
        country: "",
        dateFormat: "",
        timeZone: "",
        currency: "",
        currencySymbol: "",
        creditLimit: "",
        timeFormat: "",
        mobileApiUrl: "",
        primaryColor: "",
        secondaryColor: "",
        doctorRestrictionMode: "Disabled",
        superadminVisibility: "Disabled",
        patientPanel: "Disabled",
        scanType: "Barcode",
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};
        for (const key in formData) {
            if (!formData[key as keyof FormData]) {
                newErrors[key as keyof FormData] = 'This field is required.';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '', // Clear error for the field being edited
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const formDataToSend = new FormData();
                for (const key in formData) {
                    formDataToSend.append(key, formData[key as keyof FormData]);
                }

                const response = await fetch('http://localhost:8087/employees/create', {
                    method: 'POST',
                    body: formDataToSend,
                });

                const responseText = await response.text();
                console.log('Response from server:', responseText);

                if (response.ok) {
                    const result = JSON.parse(responseText);
                    alert(result.message || 'Form submitted successfully!');
                    // Use your preferred navigation method here
                } else {
                    const errorResponse = JSON.parse(responseText);
                    alert(errorResponse.message || 'An error occurred');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to submit form. Please try again.');
            }
        }
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <h5 className="mb-0">General Setting</h5>
                    <p className="text-muted mb-0">Fill all information below</p>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col sm={6}>
                                <Label htmlFor="hospitalName" className="form-label">Hospital Name</Label>
                                <Input
                                    type="text"
                                    name="hospitalName"
                                    id="hospitalName"
                                    placeholder="Enter Hospital Name"
                                    value={formData.hospitalName}
                                    onChange={handleChange}
                                />
                                {errors.hospitalName && <div className="text-danger">{errors.hospitalName}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="hospitalCode" className="form-label">Hospital Code</Label>
                                <Input
                                    type="text"
                                    name="hospitalCode"
                                    id="hospitalCode"
                                    placeholder="Enter Hospital Code"
                                    value={formData.hospitalCode}
                                    onChange={handleChange}
                                />
                                {errors.hospitalCode && <div className="text-danger">{errors.hospitalCode}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="address" className="form-label">Address</Label>
                                <Input
                                    type="text"
                                    name="address"
                                    id="address"
                                    placeholder="Enter Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                                {errors.address && <div className="text-danger">{errors.address}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="phone" className="form-label">Phone</Label>
                                <Input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="Enter Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <div className="text-danger">{errors.phone}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="email" className="form-label">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <div className="text-danger">{errors.email}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="country" className="form-label">Country</Label>
                                <Input
                                    type="select"
                                    name="country"
                                    id="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                >
                                    <option defaultValue="">Choose...</option>
                                    <option>Assamese</option>
                                    <option>Bengali</option>
                                    <option>Bodo</option>
                                    <option>Dogri</option>
                                    <option>Gujarati</option>
                                    <option>Hindi</option>
                                    <option>Kannada</option>
                                    <option>Kashmiri</option>
                                    <option>Konkani</option>
                                    <option>Maithili</option>
                                    <option>Malayalam</option>
                                    <option>Manipuri</option>
                                    <option>Marathi</option>
                                    <option>Nepali</option>
                                    <option>Odia</option>
                                    <option>Punjabi</option>
                                    <option>Sanskrit</option>
                                    <option>Santali</option>
                                    <option>Sindhi</option>
                                    <option>Tamil</option>
                                    <option>Telugu</option>
                                    <option>Urdu</option>
                                </Input>
                                {errors.country && <div className="text-danger">{errors.country}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="dateFormat" className="form-label">Date Format</Label>
                                <Input
                                    type="select"
                                    name="dateFormat"
                                    id="dateFormat"
                                    value={formData.dateFormat}
                                    onChange={handleChange}
                                >
                                    <option defaultValue="">Choose...</option>
                                    <option>DD/MM/YYYY</option>
                                    <option>MM/DD/YYYY</option>
                                    <option>YYYY/MM/DD</option>
                                </Input>
                                {errors.dateFormat && <div className="text-danger">{errors.dateFormat}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="timeZone" className="form-label">Time Zone</Label>
                                <Input
                                    type="select"
                                    name="timeZone"
                                    id="timeZone"
                                    value={formData.timeZone}
                                    onChange={handleChange}
                                >
                                    <option defaultValue="">Choose...</option>
                                    <option>UTC</option>
                                    <option>GMT</option>
                                    <option>IST</option>
                                    <option>PST</option>
                                    <option>EST</option>
                                </Input>
                                {errors.timeZone && <div className="text-danger">{errors.timeZone}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="currency" className="form-label">Currency</Label>
                                <Input
                                    type="select"
                                    name="currency"
                                    id="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                >
                                    <option defaultValue="">Choose...</option>
                                    <option>USD</option>
                                    <option>INR</option>
                                    <option>EUR</option>
                                </Input>
                                {errors.currency && <div className="text-danger">{errors.currency}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="currencySymbol" className="form-label">Currency Symbol</Label>
                                <Input
                                    type="select"
                                    name="currencySymbol"
                                    id="currencySymbol"
                                    value={formData.currencySymbol}
                                    onChange={handleChange}
                                >
                                    <option defaultValue="">Choose...</option>
                                    <option>$</option>
                                    <option>₹</option>
                                    <option>€</option>
                                </Input>
                                {errors.currencySymbol && <div className="text-danger">{errors.currencySymbol}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="creditLimit" className="form-label">Credit Limit</Label>
                                <Input
                                    type="number"
                                    name="creditLimit"
                                    id="creditLimit"
                                    placeholder="Enter Credit Limit"
                                    value={formData.creditLimit}
                                    onChange={handleChange}
                                />
                                {errors.creditLimit && <div className="text-danger">{errors.creditLimit}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="timeFormat" className="form-label">Time Format</Label>
                                <Input
                                    type="select"
                                    name="timeFormat"
                                    id="timeFormat"
                                    value={formData.timeFormat}
                                    onChange={handleChange}
                                >
                                    <option defaultValue="">Choose...</option>
                                    <option>12 Hour</option>
                                    <option>24 Hour</option>
                                </Input>
                                {errors.timeFormat && <div className="text-danger">{errors.timeFormat}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="mobileApiUrl" className="form-label">Mobile App API URL</Label>
                                <Input
                                    type="url"
                                    name="mobileApiUrl"
                                    id="mobileApiUrl"
                                    placeholder="Enter Mobile App API URL"
                                    value={formData.mobileApiUrl}
                                    onChange={handleChange}
                                />
                                {errors.mobileApiUrl && <div className="text-danger">{errors.mobileApiUrl}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="primaryColor" className="form-label">Primary Color</Label>
                                <Input
                                    type="text"
                                    name="primaryColor"
                                    id="primaryColor"
                                    placeholder="Enter Primary Color Code"
                                    value={formData.primaryColor}
                                    onChange={handleChange}
                                />
                                {errors.primaryColor && <div className="text-danger">{errors.primaryColor}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="secondaryColor" className="form-label">Secondary Color</Label>
                                <Input
                                    type="text"
                                    name="secondaryColor"
                                    id="secondaryColor"
                                    placeholder="Enter Secondary Color Code"
                                    value={formData.secondaryColor}
                                    onChange={handleChange}
                                />
                                {errors.secondaryColor && <div className="text-danger">{errors.secondaryColor}</div>}
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="doctorRestrictionMode" className="form-label">Doctor Restriction Mode</Label>
                                <Input
                                    type="select"
                                    name="doctorRestrictionMode"
                                    id="doctorRestrictionMode"
                                    value={formData.doctorRestrictionMode}
                                    onChange={handleChange}
                                >
                                    <option value="Disabled">Disabled</option>
                                    <option value="Enabled">Enabled</option>
                                </Input>
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="superadminVisibility" className="form-label">Superadmin Visibility</Label>
                                <Input
                                    type="select"
                                    name="superadminVisibility"
                                    id="superadminVisibility"
                                    value={formData.superadminVisibility}
                                    onChange={handleChange}
                                >
                                    <option value="Disabled">Disabled</option>
                                    <option value="Enabled">Enabled</option>
                                </Input>
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="patientPanel" className="form-label">Patient Panel</Label>
                                <Input
                                    type="select"
                                    name="patientPanel"
                                    id="patientPanel"
                                    value={formData.patientPanel}
                                    onChange={handleChange}
                                >
                                    <option value="Disabled">Disabled</option>
                                    <option value="Enabled">Enabled</option>
                                </Input>
                            </Col>

                            <Col sm={6}>
                                <Label htmlFor="scanType" className="form-label">Scan Type</Label>
                                <Input
                                    type="select"
                                    name="scanType"
                                    id="scanType"
                                    value={formData.scanType}
                                    onChange={handleChange}
                                >
                                    <option value="Barcode">Barcode</option>
                                    <option value="QR Code">QR Code</option>
                                </Input>
                            </Col>
                        </Row>
                        <Button type="submit" color="primary" className="mt-3">Save Changes</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default GeneralSettings;
