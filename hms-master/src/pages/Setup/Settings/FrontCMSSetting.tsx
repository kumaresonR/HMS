import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Label, Input, Button, Form, FormGroup, Card, CardBody, CardHeader } from 'reactstrap';

interface FormData {
    frontCMSSwitch: boolean;
    onlineAppointmentSwitch: boolean;
    sidebarSwitch: boolean;
    languageRTLTextModeSwitch: boolean;
    sidebarCheckbox: string[];
    logo: File | null;
    googleAnalytics: string;
    facebookURL: string;
    twitterURL: string;
    youtubeURL: string;
    googlePlusURL: string;
    linkedinURL: string;
    instagramURL: string;
    pinterestURL: string;
}

interface FormErrors {
    [key: string]: string | undefined;
}

const FrontCMSSetting: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        frontCMSSwitch: false,
        onlineAppointmentSwitch: false,
        sidebarSwitch: false,
        languageRTLTextModeSwitch: false,
        sidebarCheckbox: [],
        logo: null,
        googleAnalytics: '',
        facebookURL: '',
        twitterURL: '',
        youtubeURL: '',
        googlePlusURL: '',
        linkedinURL: '',
        instagramURL: '',
        pinterestURL: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Regular expression for basic URL validation
    const urlRegex = /^(https?:\/\/)?([\w.-]+)+[\w-]+(\.[\w]{2,})+\/?$/;

    // Validate form fields
    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.logo) newErrors.logo = 'Logo is required';
        if (!formData.googleAnalytics) newErrors.googleAnalytics = 'Google Analytics code is required';

        const urlFields = [
            'facebookURL', 'twitterURL', 'youtubeURL',
            'googlePlusURL', 'linkedinURL', 'instagramURL', 'pinterestURL'
        ];

        urlFields.forEach((field) => {
            if (!formData[field as keyof FormData]) {
                newErrors[field] = `${field} is required`;
            } else if (!urlRegex.test(formData[field as keyof FormData] as string)) {
                newErrors[field] = `${field} is invalid`;
            }
        });

        if (formData.sidebarCheckbox.length === 0) newErrors.sidebarCheckbox = 'At least one sidebar option is required';

        return newErrors;
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, type, value } = e.target;

        if (type === 'checkbox') {
            const checked = e.target.checked;
            if (id.startsWith('sidebarCheckbox')) {
                const optionValue = value;
                setFormData((prev) => ({
                    ...prev,
                    sidebarCheckbox: checked
                        ? [...prev.sidebarCheckbox, optionValue]
                        : prev.sidebarCheckbox.filter((item) => item !== optionValue),
                }));
            } else {
                setFormData((prev) => ({ ...prev, [id]: checked }));
            }
        } else if (type === 'file') {
            const files = e.target.files;
            setFormData((prev) => ({ ...prev, logo: files ? files[0] : null }));
        } else {
            setFormData((prev) => ({ ...prev, [id]: value }));
        }

        // Validate on change
        setErrors(validateForm());
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const dataToSend = new FormData();
            for (const key in formData) {
                if (key === 'logo') {
                    if (formData.logo) dataToSend.append(key, formData.logo);
                } else {
                    dataToSend.append(key, String(formData[key as keyof FormData]));
                }
            }

            try {
                const response = await fetch("http://localhost:8087/settings/update", {
                    method: "POST",
                    body: dataToSend,
                });

                const responseText = await response.text();
                console.log("Response from server:", responseText);

                if (response.ok) {
                    alert("Form submitted successfully!");
                    setFormData({
                        frontCMSSwitch: false,
                        onlineAppointmentSwitch: false,
                        sidebarSwitch: false,
                        languageRTLTextModeSwitch: false,
                        sidebarCheckbox: [],
                        logo: null,
                        googleAnalytics: '',
                        facebookURL: '',
                        twitterURL: '',
                        youtubeURL: '',
                        googlePlusURL: '',
                        linkedinURL: '',
                        instagramURL: '',
                        pinterestURL: '',
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
            <CardHeader>
                <h5 className="mb-0">Front Cms</h5>
            </CardHeader>
            <CardBody className="border-0">



                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <div className="form-check form-switch">
                            <Input className="form-check-input" type="checkbox" role="switch" id="frontCMSSwitch" checked={formData.frontCMSSwitch} onChange={handleChange} />
                            <Label for="frontCMSSwitch">Front CMS</Label>
                        </div>
                        {errors.frontCMSSwitch && <div className="text-danger">{errors.frontCMSSwitch}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="logo">Logo</Label>
                        <Input type="file" id="logo" onChange={handleChange} />
                        {errors.logo && <div className="text-danger">{errors.logo}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="googleAnalytics">Google Analytics</Label>
                        <Input
                            type="text"
                            id="googleAnalytics"
                            value={formData.googleAnalytics}
                            onChange={handleChange}
                        />
                        {errors.googleAnalytics && <div className="text-danger">{errors.googleAnalytics}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="onlineAppointmentSwitch">Online Appointment</Label>
                        <Input
                            type="checkbox"
                            id="onlineAppointmentSwitch"
                            checked={formData.onlineAppointmentSwitch}
                            onChange={handleChange} className='ms-2'
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="sidebarSwitch">Sidebar</Label>
                        <Input
                            type="checkbox"
                            id="sidebarSwitch"
                            checked={formData.sidebarSwitch}
                            onChange={handleChange}  className='ms-2'
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="languageRTLTextModeSwitch">Language RTL Text Mode</Label>
                        <Input
                            type="checkbox"
                            id="languageRTLTextModeSwitch"
                            checked={formData.languageRTLTextModeSwitch}
                            onChange={handleChange}  className='ms-2'
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Sidebar Options</Label>
                        <div>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    id="sidebarCheckboxOptionNews"
                                    value="OptionNews"
                                    checked={formData.sidebarCheckbox.includes('OptionNews')}
                                    onChange={handleChange}   className='mx-2'
                                />
                                Option News
                            </Label>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    id="sidebarCheckboxComplain"
                                    value="Complain"  className='mx-2  ms-4'
                                    checked={formData.sidebarCheckbox.includes('Complain')}
                                    onChange={handleChange} 
                                />
                                Complain
                            </Label>
                        </div>
                        {errors.sidebarCheckbox && <div className="text-danger">{errors.sidebarCheckbox}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="facebookURL">Facebook URL</Label>
                        <Input
                            type="text"
                            id="facebookURL"
                            value={formData.facebookURL}
                            onChange={handleChange}
                            invalid={!!errors.facebookURL}
                        />
                        {errors.facebookURL && <div className="invalid-feedback">{errors.facebookURL}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="twitterURL">Twitter URL</Label>
                        <Input
                            type="text"
                            id="twitterURL"
                            value={formData.twitterURL}
                            onChange={handleChange}
                            invalid={!!errors.twitterURL}
                        />
                        {errors.twitterURL && <div className="invalid-feedback">{errors.twitterURL}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="youtubeURL">YouTube URL</Label>
                        <Input
                            type="text"
                            id="youtubeURL"
                            value={formData.youtubeURL}
                            onChange={handleChange}
                            invalid={!!errors.youtubeURL}
                        />
                        {errors.youtubeURL && <div className="invalid-feedback">{errors.youtubeURL}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="googlePlusURL">Google Plus URL</Label>
                        <Input
                            type="text"
                            id="googlePlusURL"
                            value={formData.googlePlusURL}
                            onChange={handleChange}
                            invalid={!!errors.googlePlusURL}
                        />
                        {errors.googlePlusURL && <div className="invalid-feedback">{errors.googlePlusURL}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="linkedinURL">LinkedIn URL</Label>
                        <Input
                            type="text"
                            id="linkedinURL"
                            value={formData.linkedinURL}
                            onChange={handleChange}
                            invalid={!!errors.linkedinURL}
                        />
                        {errors.linkedinURL && <div className="invalid-feedback">{errors.linkedinURL}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="instagramURL">Instagram URL</Label>
                        <Input
                            type="text"
                            id="instagramURL"
                            value={formData.instagramURL}
                            onChange={handleChange}
                            invalid={!!errors.instagramURL}
                        />
                        {errors.instagramURL && <div className="invalid-feedback">{errors.instagramURL}</div>}
                    </FormGroup>

                    <FormGroup>
                        <Label for="pinterestURL">Pinterest URL</Label>
                        <Input
                            type="text"
                            id="pinterestURL"
                            value={formData.pinterestURL}
                            onChange={handleChange}
                            invalid={!!errors.pinterestURL}
                        />
                        {errors.pinterestURL && <div className="invalid-feedback">{errors.pinterestURL}</div>}
                    </FormGroup>

                    <Button type="submit" color="primary">Submit</Button>
                </Form>
            </CardBody>
        </Card>
    );
};

export default FrontCMSSetting;
