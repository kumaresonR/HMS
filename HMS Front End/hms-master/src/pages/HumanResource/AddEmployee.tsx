import React, { useEffect, useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Alert, Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row, UncontrolledAlert } from 'reactstrap';
import FormHeader from '../../common/FormHeader/FormHeader';
import { bloodGroupDetails } from '../../common/data/FakeData';
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';
import { toast } from 'react-toastify';
import ErrorHandler from '../../helpers/ErrorHandler';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import AppointmentApiService from '../../helpers/services/appointment/appointment-api-service';
import { useDispatch } from 'react-redux';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const contractTypeData = [
    {
        type: "Permanent"
    },
    {
        type: "Probation"
    }
]

const AddEmployee = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();
    const appointmentApiServic: AppointmentApiService = new AppointmentApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [reportedTo, setReportedTo] = useState('');
    const [reportedToValidationError, setReportedToValidationError] = useState(false);
    const [roleValidationError, setRoleValidationError] = useState(false);
    const [role, setRole] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roleData, setRoleData] = useState<any>([]);
    const [doctorFees, setDoctorFees] = useState('');
    const [doctorFeesValidationError, setDoctorFeesValidationError] = useState(false);
    const [modNo, setModNo] = useState('');
    const [designation, setDesignation] = useState('');
    const [designationValidationError, setDesignationValidationError] = useState(false);
    const [designationData, setDesignationData] = useState<any>([]);
    const [department, setDepartment] = useState('');
    const [departmentValidationError, setDepartmentValidationError] = useState(false);
    const [departmentData, setDepartmentData] = useState<any>([]);
    const [specialist, setSpecialist] = useState('');
    const [specialistData, setSpecialistData] = useState<any>([]);
    const [firstName, setFirstName] = useState('');
    const [firstNameValidationError, setFirstNameValidationError] = useState(false);
    const [lastName, setLastName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [gender, setGender] = useState('');
    const [genderValidationerror, setGenderValidationerror] = useState(false);
    const [maritalStatus, setMaritalStatus] = useState('');
    const [bloodGroup, setBloodGroupChange] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfBirthValidationError, setDateOfBirthValidationError] = useState(false);
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [dateOfJoiningValidationError, setDateOfJoiningValidationError] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneValidationError, setPhoneValidationError] = useState("");
    const [emergencyContact, setEmergencyContact] = useState('');
    const [emergencyContactValidationError, setEmergencyContactValidationError] = useState("");
    const [email, setEmail] = useState('');
    const [emailValidationError, setEmailValidationError] = useState('');
    const [note, setNote] = useState('');
    const [selectedFile, setSelectedFile] = useState<any>();
    const [workExperience, setWorkExperience] = useState('');
    const [currentAddress, setCurrentAddress] = useState('');
    const [permanentAddress, setPermanentAddress] = useState('');
    const [qualification, setQualification] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [nationalIdentificationNumber, setNationalIdentificationNumber] = useState('');
    const [localIdentificationNumber, setLocalIdentificationNumber] = useState('');
    const [referenceContact, setReferenceContact] = useState('');
    const [selectedResume, setSelectedResume] = useState<any>();
    const [epfNo, setEPFNo] = useState<any>();
    const [basicSalary, setBasicSalary] = useState('');
    const [contractType, setContractType] = useState('');
    const [workShift, setWorkShift] = useState('');
    const [workLocation, setWorkLocation] = useState('');
    const [casualLeave, setCasualLeave] = useState('');
    const [casualLeaveValidationError, setCasualLeaveValidationError] = useState(false);
    const [privilegeLeave, setPrivilegeLeave] = useState('');
    const [privilegeLeaveValidationError, setPrivilegeLeaveValidationError] = useState(false);
    const [sickLeave, setSickLeave] = useState('');
    const [sickLeaveValidationError, setSickLeaveValidationError] = useState(false);
    const [maternityLeave, setMaternityLeave] = useState('');
    const [maternityLeaveValidationError, setMaternityLeaveValidationError] = useState(false);
    const [paternityLeave, setPaternityLeave] = useState('');
    const [paternityLeaveLeaveValidationError, setPaternityLeaveValidationError] = useState(false);
    const [feverLeave, setFeverLeave] = useState<any>();
    const [feverLeaveLeaveValidationError, setFeverLeaveValidationError] = useState(false);
    const [accountTitle, setAccountTitle] = useState<any>();
    const [bankAccountNo, setBankAccountNo] = useState('');
    const [bankName, setBankName] = useState('');
    const [IFSCCode, setIFSCCode] = useState('');
    const [bankBranchName, setBankBranchName] = useState('');
    const [facebookURL, setFacebookURL] = useState('');
    const [twitterURL, setTwitterURL] = useState('');
    const [linkedinURL, setLinkedinURL] = useState('');
    const [instagramURL, setInstagramURL] = useState('');
    const [selectedResignationLetter, setSelectedResignationLetter] = useState<any>();
    const [selectedJoiningLetter, setSelectedJoiningLetter] = useState<any>();
    const [selectedOtherDocuments, setSelectedOtherDocuments] = useState<any>();
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<[]>([]);

    const [openPlusIcon, setOpenPlusIcon] = useState('1');
    const data = {
        reportedTo, firstName, lastName, password, gender, dateOfBirth,options,
        dateOfJoining, email, phone, maritalStatus, designation, roleId,
        department, fatherName, doctorFees, motherName, bloodGroup, specialist,
        nationalIdentificationNumber, panNumber, emergencyContact, localIdentificationNumber,
        currentAddress, permanentAddress, workExperience, basicSalary, referenceContact,
        qualification, specialization, epfNo, contractType, workShift, workLocation,
        casualLeave, privilegeLeave, sickLeave, maternityLeave, paternityLeave,
        accountTitle, bankAccountNo, bankName, IFSCCode, bankBranchName, facebookURL, twitterURL,
        linkedinURL, instagramURL, note, role,selectedFile,selectedResume,selectedResignationLetter,
        selectedJoiningLetter,selectedOtherDocuments
    }
    const togglePlusIcon = (id: any) => {
        if (openPlusIcon !== id) {
            setOpenPlusIcon(id);
        }
    };

    const onSearch = async (query: any) => {
        setIsLoading(true);
        try {
            let url = "department=&searchTerm=" + query
            let result = await appointmentApiServic.searchAllEmployee(url);
            setOptions(result)
        } catch (error: any) {
            return ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectedStaff = (selectedItem: any) => {
        const staffId = selectedItem?.[0]?.['employeeId'];
        setReportedTo(staffId);
        setReportedToValidationError(false);
    }

    const handleRoleChange = (roleId: string) => {
        const selectedRole = roleData.find((item: any) => item.roleId === roleId);
        if (selectedRole) {
            setRole(selectedRole.roleName);
            setRoleId(selectedRole.roleId);
            setRoleValidationError(false);
        }
    };

    const handleDesignationChange = (value: any) => {
        setDesignation(value);
        setDesignationValidationError(false);
    }

    const handleDepartmentChange = (value: any) => {
        setDepartment(value);
        setDepartmentValidationError(false);
    }

    const handleDoctorFeesChange = (value: any) => {
        setDoctorFees(value);
        setDoctorFeesValidationError(false);
    }

    const handleFirstNameChange = (value: any) => {
        setFirstName(value);
        setFirstNameValidationError(false);
    }

    const handleGenderChange = (value: any) => {
        setGender(value);
        setGenderValidationerror(false);
    }

    const handleDateOfBirthChange = (value: any) => {
        setDateOfBirth(value);
        setDateOfBirthValidationError(false);
    }

    const handleDateOfJoiningChange = (value: any) => {
        setDateOfJoining(value);
        setDateOfJoiningValidationError(false);
    }

    const handlePhoneChange = (value: string) => {
        const phoneValue = value.replace(/[^0-9]/g, "");
        setPhone(phoneValue);
        if (phoneValue.length !== 10) {
            setPhoneValidationError("Phone number must be exactly 10 digits.");
        } else {
            setPhoneValidationError("");
        }
    };

    const handleEmergencyContactChange = (value: string) => {
        const phoneValue = value.replace(/[^0-9]/g, "");
        setEmergencyContact(phoneValue);
        if (phoneValue.length !== 10) {
            setEmergencyContactValidationError("Emergency Contact must be exactly 10 digits.");
        } else {
            setEmergencyContactValidationError("");
        }
    };

    const handleEmailChange = (value: any) => {
        setEmail(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailValidationError("Invalid email format");
        } else {
            setEmailValidationError("");
        }
    }

    const handleCasualLeaveChange = (value: any) => {
        setCasualLeave(value);
        setCasualLeaveValidationError(false);
    }

    const handlePrivilegeLeaveChange = (value: any) => {
        setPrivilegeLeave(value);
        setPrivilegeLeaveValidationError(false);
    }

    const handleSickLeaveChange = (value: any) => {
        setSickLeave(value);
        setSickLeaveValidationError(false);
    }

    const handleMaternityLeaveChange = (value: any) => {
        setMaternityLeave(value);
        setMaternityLeaveValidationError(false);
    }

    const handlePaternityLeaveChange = (value: any) => {
        setPaternityLeave(value);
        setPaternityLeaveValidationError(false);
    }

    const handleFeverLeaveChange = (value: any) => {
        setFeverLeave(value);
        setFeverLeaveValidationError(false);
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleResumeUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedResume(file);
    }

    const handleResignationLetterUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedResignationLetter(file);
    };

    const handleJoiningLetterUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedJoiningLetter(file);
    }

    const handleOtherDocumentsUpload = (event: any) => {
        const file = event.target.files[0];
        setSelectedOtherDocuments(file);
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!role) {
            setRoleValidationError(true);
            isFormValid = false;
        }

        if (role === "DOCTOR") {
            if (!doctorFees) {
                setDoctorFeesValidationError(true);
                isFormValid = false;
            }
        }

        if (!reportedTo) {
            setReportedToValidationError(true);
            isFormValid = false;
        }

        if (!firstName) {
            setFirstNameValidationError(true);
            isFormValid = false;
        }

        if (!gender) {
            setGenderValidationerror(true);
            isFormValid = false;
        }

        if (!dateOfBirth) {
            setDateOfBirthValidationError(true);
            isFormValid = false;
        }
        if (!dateOfJoining) {
            setDateOfJoiningValidationError(true);
            isFormValid = false;
        }

        if (!department) {
            setDepartmentValidationError(true);
            isFormValid = false;
        }

        if (!designation) {
            setDesignationValidationError(true);
            isFormValid = false;
        }

        if (!firstName) {
            setFirstNameValidationError(true);
            isFormValid = false;
        }

        if (!casualLeave) {
            setCasualLeaveValidationError(true);
            isFormValid = false;
        }

        if (!privilegeLeave) {
            setPrivilegeLeaveValidationError(true);
            isFormValid = false;
        }
        if (!sickLeave) {
            setSickLeaveValidationError(true);
            isFormValid = false;
        }

        if (!maternityLeave) {
            setMaternityLeaveValidationError(true);
            isFormValid = false;
        }

        if (!paternityLeave) {
            setPaternityLeaveValidationError(true);
            isFormValid = false;
        }

        // if (!feverLeave) {
        //     setFeverLeaveValidationError(true);
        //     isFormValid = false;
        // }

        if (phone && !/^[0-9]{10}$/.test(phone)) {
            setPhoneValidationError("Phone number must be exactly 10 digits.");
            isFormValid = false;
        } else {
            setPhoneValidationError("");
        }

        if (emergencyContact && !/^[0-9]{10}$/.test(emergencyContact)) {
            setEmergencyContactValidationError("Emergency Contact must be exactly 10 digits.");
            isFormValid = false;
        } else {
            setEmergencyContactValidationError("");
        }

        if (!email) {
            setEmailValidationError("Email is required");
            isFormValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailValidationError("Invalid email format");
                isFormValid = false;
            } else {
                setEmailValidationError("");
            }
        }

        return isFormValid;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validateForm()) {
            addStaffDetails();
        }
    }

    const addStaffDetails = async () => {
        try {
            let formData: FormData = new FormData();
            const payload = {
                reporterId: reportedTo,
                firstName: firstName,
                lastName: lastName,
                password: password,
                gender: gender,
                dateOfBirth: dateOfBirth,
                dateOfJoining: dateOfJoining,
                email: email,
                phone: phone,
                maritalStatus: maritalStatus,
                designation: designation,
                roleId: roleId,
                departmentId: department,
                fatherName: fatherName,
                doctorFee: doctorFees,
                modNo: modNo,
                motherName: motherName,
                bloodGroup: bloodGroup,
                specialist: specialist,
                nationalIdNumber: nationalIdentificationNumber,
                panNumber: panNumber,
                emergencyContact: emergencyContact,
                localIdNumber: localIdentificationNumber,
                currentAddress: currentAddress,
                permanentAddress: permanentAddress,
                workExperience: workExperience,
                basicSalary: basicSalary,
                referenceContact: referenceContact,
                qualification: qualification,
                specialization: specialization,
                epfNumber: epfNo,
                contractType: contractType,
                workShift: workShift,
                workLocation: workLocation,
                casualLeave: casualLeave,
                privilegeLeave: privilegeLeave,
                sickLeave: sickLeave,
                maternityLeave: maternityLeave,
                paternityLeave: paternityLeave,
                // feverLeave: feverLeave,
                accountTitle: accountTitle,
                bankAccountNo: bankAccountNo,
                bankName: bankName,
                ifscCode: IFSCCode,
                bankBranchName: bankBranchName,
                facebookUrl: facebookURL,
                twitterUrl: twitterURL,
                linkedinUrl: linkedinURL,
                instagramUrl: instagramURL,
                note: note,
                role: role
            };
            console.log("staffData", payload)
            // Convert JSON payload to Blob with application/json type
            const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            formData.append('employeeData', jsonBlob);
            formData.append('photo', selectedFile);
            formData.append('resume', selectedResume);
            formData.append('resignationLetter', selectedResignationLetter);
            formData.append('joiningLetter', selectedJoiningLetter);
            formData.append('otherDocuments', selectedOtherDocuments);
            await employeeApiService.createEmployee(formData);
            navigate('/main/stafflist');
            toast.success('Staff Details Saved Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllRole = async () => {
        try {
            let result = await employeeApiService.getAllRole();
            setRoleData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllDepartment = async () => {
        try {
            let result = await employeeApiService.getAllDepartment();
            setDepartmentData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllDesignation = async () => {
        try {
            let result = await employeeApiService.getAllDesignation();
            setDesignationData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const getAllSpecialist = async () => {
        try {
            let result = await employeeApiService.getAllSpecialist();
            console.log("getAllSpecialist", result);
            setSpecialistData(result);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        getAllRole();
        getAllDepartment();
        getAllSpecialist();
        getAllDesignation();
    }, []);

    useEffect(() => {
        if (location?.state) {
            setOptions(location?.state?.options);
            setReportedTo(location?.state?.reportedTo);
            setFirstName(location?.state?.firstName);
            setLastName(location?.state?.lastName);
            setGender(location?.state?.gender);
            setDateOfBirth(location?.state?.dateOfBirth);
            setDateOfJoining(location?.state?.dateOfJoining);
            setEmail(location?.state?.email);
            setPhone(location?.state?.phone);
            setMaritalStatus(location?.state?.maritalStatus)
            setDesignation(location?.state?.designation);
            setRoleId(location?.state?.roleId);
            setDepartment(location?.state?.department);
            setFatherName(location?.state?.fatherName);
            setDoctorFees(location?.state?.doctorFee);
            setMotherName(location?.state?.motherName);
            setBloodGroupChange(location?.state?.bloodGroup);
            setSpecialist(location?.state?.specialist);
            setNationalIdentificationNumber(location?.state?.nationalIdentificationNumber);
            setPanNumber(location?.state?.panNumber);
            setEmergencyContact(location?.state?.emergencyContact);
            setLocalIdentificationNumber(location?.state?.localIdentificationNumber);
            setCurrentAddress(location?.state?.currentAddress);
            setPermanentAddress(location?.state?.permanentAddress);
            setWorkExperience(location?.state?.workExperience);
            setBasicSalary(location?.state?.basicSalary);
            setReferenceContact(location?.state?.referenceContact);
            setQualification(location?.state?.qualification);
            setSpecialization(location?.state?.specialization);
            setEPFNo(location?.state?.epfNo);
            setContractType(location?.state?.contractType);
            setWorkShift(location?.state?.workShift);
            setWorkLocation(location?.state?.workLocation);
            setCasualLeave(location?.state?.casualLeave);
            setPrivilegeLeave(location?.state?.privilegeLeave);
            setSickLeave(location?.state?.sickLeave);
            setMaternityLeave(location?.state?.maternityLeave);
            setPaternityLeave(location?.state?.paternityLeave);
            // setFeverLeave(location?.state?.feverLeave);
            setAccountTitle(location?.state?.accountTitle);
            setBankAccountNo(location?.state?.bankAccountNo);
            setBankName(location?.state?.bankName);
            setIFSCCode(location?.state?.IFSCCode);
            setBankBranchName(location?.state?.bankBranchName);
            setFacebookURL(location?.state?.facebookURL);
            setTwitterURL(location?.state?.twitterURL);
            setLinkedinURL(location?.state?.linkedinURL);
            setInstagramURL(location?.state?.instagramURL);
            setNote(location?.state?.note);
            setRole(location?.state?.role);
            setSelectedFile(location?.state?.selectedFile);
            setSelectedResume(location?.state?.selectedResume);
            setSelectedResignationLetter(location?.state?.selectedResignationLetter);
            setSelectedJoiningLetter(location?.state?.selectedJoiningLetter);
            setSelectedOtherDocuments(location?.state?.selectedOtherDocuments)
        }
    }, [location?.state]);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader
                        title="Employee"
                        pageTitle="Human Resource Management"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Add Employee",
                            data
                        }))} />

                    <Alert color="primary" className="alert-label-icon rounded-label material-shadow">
                        <i className="ri-user-smile-line label-icon"></i><strong>Note</strong> - Your username and password have been automatically generated and will be sent to your registered email address.
                    </Alert>

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="d-flex justify-content-between mb-3">
                                        <h4 className="card-title mb-0">Add Staff</h4>
                                        <Button
                                            color="primary"
                                            onClick={() => navigate(-1)}
                                            className="btn btn-primary add-btn ms-3"
                                        >
                                            <IoArrowBack /> Back
                                        </Button>
                                    </div>
                                    <Form onSubmit={handleSubmit}>
                                        <Accordion className="custom-accordionwithicon-plus" id="accordionWithplusicon" open={openPlusIcon} toggle={togglePlusIcon}>
                                            <AccordionItem className='material-shadow'>
                                                <AccordionHeader targetId="1" className='accordion-head-bg'>
                                                    Basic Information
                                                </AccordionHeader>
                                                <AccordionBody accordionId="1">
                                                    <div className="around10">
                                                        <div className="row">
                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <Label for="role">Role <span className='text-danger'>*</span></Label>
                                                                    <Input type="select"
                                                                        id="role"
                                                                        value={roleId}
                                                                        onChange={e => handleRoleChange(e.target.value)}
                                                                        invalid={!!roleValidationError}
                                                                    >
                                                                        <option value="">Select Role</option>
                                                                        {roleData.map((item: any, idx: any) => (
                                                                            <option key={idx} value={item.roleId}>{item.roleName}</option>
                                                                        ))}
                                                                    </Input>
                                                                    {roleValidationError && <div className="invalid-feedback">Role Required</div>}
                                                                </FormGroup>
                                                            </div>


                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <Label for="Designation">Designation <span className='text-danger'>*</span></Label>
                                                                    <Input type="select"
                                                                        id="Designation"
                                                                        value={designation}
                                                                        onChange={e => handleDesignationChange(e.target.value)}
                                                                        invalid={!!designationValidationError}
                                                                    >
                                                                        <option value="">Select Designation</option>
                                                                        {designationData.map((item: any, idx: any) => (
                                                                            <option key={idx} value={item.name}>{item.name}</option>
                                                                        ))}
                                                                    </Input>
                                                                    {designationValidationError && <div className="invalid-feedback">Designation Required</div>}
                                                                </FormGroup>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <Label for="Department">Department <span className='text-danger'>*</span></Label>
                                                                    <Input type="select"
                                                                        id="Department"
                                                                        value={department}
                                                                        onChange={e => handleDepartmentChange(e.target.value)}
                                                                        invalid={!!departmentValidationError}
                                                                    >
                                                                        <option value="">Select Department</option>
                                                                        {departmentData.map((item: any, idx: any) => (
                                                                            <option key={idx} value={item.departmentId}>{item.name}</option>
                                                                        ))}
                                                                    </Input>
                                                                    {departmentValidationError && <div className="invalid-feedback">Department Required</div>}
                                                                </FormGroup>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <Label for="Specialist">Specialist</Label>
                                                                    <Input type="select"
                                                                        id="Specialist"
                                                                        value={specialist}
                                                                        onChange={e => setSpecialist(e.target.value)}
                                                                    >
                                                                        <option value="">Select Specialist</option>
                                                                        {specialistData.map((item: any, idx: any) => (
                                                                            <option key={idx} value={item.name}>{item.name}</option>
                                                                        ))}
                                                                    </Input>
                                                                </FormGroup>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <label className="text-start mb-2">Reported To  <span className="text-danger">*</span></label>
                                                                    <AsyncTypeahead
                                                                        filterBy={() => true}
                                                                        id="patient-id-search-box"
                                                                        className={` ${reportedToValidationError ? 'is-invalid' : ''}`}
                                                                        isLoading={isLoading}
                                                                        labelKey="fullName"
                                                                        minLength={1}
                                                                        options={options}
                                                                        onSearch={onSearch}
                                                                        onChange={onSelectedStaff}
                                                                        placeholder="Search by Staff Name or Id"
                                                                        selected={options.filter((doctor: any) => doctor.employeeId === reportedTo)}
                                                                    />
                                                                    {reportedToValidationError && <div className="invalid-feedback">Reported To Required.</div>}
                                                                </FormGroup>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="firstName">First Name <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="firstName"
                                                                        name="firstName"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={firstName}
                                                                        onChange={e => handleFirstNameChange(e.target.value)}
                                                                        invalid={!!firstNameValidationError}
                                                                    />
                                                                    {firstNameValidationError && <div className="invalid-feedback">First Name Required</div>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="lastName">Last Name</label>
                                                                    <Input
                                                                        id="lastName"
                                                                        name="lastName"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={lastName}
                                                                        onChange={e => setLastName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="password">Password</label>
                                                                    <Input
                                                                        id="password"
                                                                        name="password"
                                                                        type="password"
                                                                        className="form-control"
                                                                        value={password}
                                                                        onChange={e => setPassword(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div> */}

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="fatherName">Husband Name</label>
                                                                    <Input
                                                                        id="fatherName"
                                                                        name="fatherName"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={fatherName}
                                                                        onChange={e => setFatherName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="motherName">Father / Mother Name</label>
                                                                    <Input
                                                                        id="motherName"
                                                                        name="motherName"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={motherName}
                                                                        onChange={e => setMotherName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="gender">Gender <span className='text-danger'>*</span></label>
                                                                    <Input type="select"
                                                                        id="gender"
                                                                        name="gender"
                                                                        className="form-control"
                                                                        value={gender}
                                                                        onChange={e => handleGenderChange(e.target.value)}
                                                                        invalid={!!genderValidationerror}
                                                                    >
                                                                        <option value="">Select Gender</option>
                                                                        <option value="Male">Male</option>
                                                                        <option value="Female">Female</option>
                                                                    </Input>
                                                                    {genderValidationerror && <span className="text-danger">Gender Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="maritalStatus">Marital Status</label>
                                                                    <select
                                                                        id="maritalStatus"
                                                                        name="maritalStatus"
                                                                        className="form-control"
                                                                        value={maritalStatus}
                                                                        onChange={e => setMaritalStatus(e.target.value)}
                                                                    >
                                                                        <option value="">Select Marital Status</option>
                                                                        <option value="Single">Single</option>
                                                                        <option value="Married">Married</option>
                                                                        <option value="Not Specified">Not Specified</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="bloodGroup">Blood Group</label>
                                                                    <select
                                                                        id="bloodGroup"
                                                                        name="bloodGroup"
                                                                        className="form-control"
                                                                        value={bloodGroup}
                                                                        onChange={e => setBloodGroupChange(e.target.value)}
                                                                    >
                                                                        <option value="">Select Blood Group</option>
                                                                        {bloodGroupDetails.map((item: any, idx: any) => (
                                                                            <option key={idx} value={item.type}>{item.type}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="dateOfBirth">Date of Birth <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="dateOfBirth"
                                                                        name="dateOfBirth"
                                                                        type="date"
                                                                        className="form-control"
                                                                        value={dateOfBirth}
                                                                        onChange={e => handleDateOfBirthChange(e.target.value)}
                                                                        invalid={!!dateOfBirthValidationError}
                                                                    />
                                                                    {dateOfBirthValidationError && <span className="text-danger">Date of Birth Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="DateOfJoining">Date Of Joining <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="DateOfJoining"
                                                                        name="DateOfJoining"
                                                                        type="date"
                                                                        className="form-control"
                                                                        value={dateOfJoining}
                                                                        onChange={e => handleDateOfJoiningChange(e.target.value)}
                                                                        invalid={!!dateOfJoiningValidationError}
                                                                    />
                                                                    {dateOfJoiningValidationError && <span className="text-danger">Date Of Joining Required</span>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="Phone">Phone <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="Phone"
                                                                        name="Phone"
                                                                        type="text"
                                                                        maxLength={10}
                                                                        className="form-control"
                                                                        value={phone}
                                                                        onChange={e => handlePhoneChange(e.target.value)}
                                                                        invalid={!!phoneValidationError}
                                                                    />
                                                                    {phoneValidationError && <div className="invalid-feedback">{phoneValidationError}</div>}
                                                                </div>
                                                            </div>

                                                            {/* <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="emergencyContact">Emergency Contact</label>
                                                                    <Input
                                                                        id="emergencyContact"
                                                                        name="emergencyContact"
                                                                        type="text"
                                                                        maxLength={10}
                                                                        className="form-control"
                                                                        value={emergencyContact}
                                                                        onChange={e => handleEmergencyContactChange(e.target.value)}
                                                                        invalid={!!emergencyContactValidationError}
                                                                    />
                                                                    {emergencyContactValidationError && <div className="invalid-feedback">{emergencyContactValidationError}</div>}
                                                                </div>
                                                            </div> */}

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="email">Email <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="email"
                                                                        name="email"
                                                                        type="email"
                                                                        className={`form-control ${emailValidationError ? "is-invalid" : ""}`}
                                                                        value={email}
                                                                        onChange={e => handleEmailChange(e.target.value)}
                                                                    />
                                                                    {emailValidationError && <span className="text-danger">{emailValidationError}</span>}
                                                                </div>
                                                            </div>

                                                            <Col>
                                                                <FormGroup>
                                                                    <label className="text-start mb-2"> Photo </label>
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
                                                                        accept=".jpg, .jpeg, .png"
                                                                        style={{ display: 'none' }}
                                                                        onChange={handleFileUpload}
                                                                    />
                                                                </FormGroup>
                                                            </Col>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="currentAddress"> Current Address</label>
                                                                    <textarea
                                                                        id="currentAddress"
                                                                        name="currentAddress"
                                                                        className="form-control"
                                                                        value={currentAddress}
                                                                        onChange={e => setCurrentAddress(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="PermanentAddress"> Permanent Address</label>
                                                                    <textarea
                                                                        id="permanentAddress"
                                                                        name="PermanentAddress"
                                                                        className="form-control"
                                                                        value={permanentAddress}
                                                                        onChange={e => setPermanentAddress(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="Qualification"> Qualification</label>
                                                                    <textarea
                                                                        id="Qualification"
                                                                        name="Qualification"
                                                                        className="form-control"
                                                                        value={qualification}
                                                                        onChange={e => setQualification(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="workExperience">Work Experience</label>
                                                                    <textarea
                                                                        id="workExperience"
                                                                        name="workExperience"
                                                                        className="form-control"
                                                                        value={workExperience}
                                                                        onChange={e => setWorkExperience(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="specialization"> Specialization</label>
                                                                    <textarea
                                                                        id="specialization"
                                                                        name="specialization"
                                                                        className="form-control"
                                                                        value={specialization}
                                                                        onChange={e => setSpecialization(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="note"> Note</label>
                                                                    <textarea
                                                                        id="note"
                                                                        name="note"
                                                                        className="form-control"
                                                                        value={note}
                                                                        onChange={e => setNote(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="panNumber">Pan Number</label>
                                                                    <Input
                                                                        id="panNumber"
                                                                        name="panNumber"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={panNumber}
                                                                        onChange={e => setPanNumber(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="nationalIdentificationNumber">National Identification Number</label>
                                                                    <Input
                                                                        id="nationalIdentificationNumber"
                                                                        name="nationalIdentificationNumber"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={nationalIdentificationNumber}
                                                                        onChange={e => setNationalIdentificationNumber(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="localIdentificationNumber">Local Identification Number</label>
                                                                    <Input
                                                                        id="localIdentificationNumber"
                                                                        name="localIdentificationNumber"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={localIdentificationNumber}
                                                                        onChange={e => setLocalIdentificationNumber(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="referenceContact">Reference Contact</label>
                                                                    <Input
                                                                        id="referenceContact"
                                                                        name="referenceContact"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={referenceContact}
                                                                        onChange={e => setReferenceContact(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {role === "DOCTOR" && (
                                                                <>
                                                                    <div className="col-md-6 col-lg-3 mb-2">
                                                                        <div className="form-group mb-2">
                                                                            <label htmlFor="doctorFees">Doctor Fees</label>
                                                                            <Input
                                                                                id="doctorFees"
                                                                                name="doctorFees"
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={doctorFees}
                                                                                onChange={e => handleDoctorFeesChange(e.target.value)}
                                                                                invalid={!!doctorFeesValidationError}
                                                                            />
                                                                            {doctorFeesValidationError && <div className="invalid-feedback">Doctor Fees Required</div>}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="modNo">Mod No</label>
                                                                    <Input
                                                                        id="modNo"
                                                                        name="modNo"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={modNo}
                                                                        onChange={e => handleModNoChange(e.target.value)}
                                                                        invalid={!!modNoValidationError}
                                                                    />
                                                                    {modNoValidationError && <div className="invalid-feedback">Mod No Required</div>}
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </AccordionBody>
                                            </AccordionItem>
                                            <AccordionItem className='material-shadow'>
                                                <AccordionHeader targetId="2" className='accordion-head-bg'> Add More Details </AccordionHeader>
                                                <AccordionBody accordionId="2">
                                                    <div className="around10">
                                                        <div className="row">
                                                            <div className="col-12 bg-secondary-subtle mb-3 py-3">
                                                                <h6 className='mb-0'>Payroll</h6>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="epfNo">EPF No</label>
                                                                    <Input
                                                                        id="epfNo"
                                                                        name="epfNo"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={epfNo}
                                                                        onChange={e => setEPFNo(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="basicSalary">Basic Salary</label>
                                                                    <Input
                                                                        id="basicSalary"
                                                                        name="basicSalary"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={basicSalary}
                                                                        onChange={e => setBasicSalary(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <Label for="contractType">Contract Type</Label>
                                                                    <Input type="select"
                                                                        id="contractType"
                                                                        value={contractType}
                                                                        onChange={e => setContractType(e.target.value)}
                                                                    >
                                                                        <option value="">Select Contract Type</option>
                                                                        {contractTypeData.map((item: any, idx: any) => (
                                                                            <option key={idx} value={item.type}>{item.type}</option>
                                                                        ))}
                                                                    </Input>
                                                                </FormGroup>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="workShift">Work Shift</label>
                                                                    <Input
                                                                        id="workShift"
                                                                        name="workShift"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={workShift}
                                                                        onChange={e => setWorkShift(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="workLocation">Work Location</label>
                                                                    <Input
                                                                        id="workLocation"
                                                                        name="workLocation"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={workLocation}
                                                                        onChange={e => setWorkLocation(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 bg-secondary-subtle mb-3 py-3">
                                                                <h6 className='mb-0'>Leaves</h6>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="casualLeave">Casual Leave <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="casualLeave"
                                                                        name="casualLeave"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={casualLeave}
                                                                        onChange={e => handleCasualLeaveChange(e.target.value)}
                                                                        invalid={!!casualLeaveValidationError}
                                                                    />
                                                                    {casualLeaveValidationError && <div className="invalid-feedback">Casual Leave Required</div>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="privilegeLeave">Privilege Leave <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="privilegeLeave"
                                                                        name="privilegeLeave"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={privilegeLeave}
                                                                        onChange={e => handlePrivilegeLeaveChange(e.target.value)}
                                                                        invalid={!!privilegeLeaveValidationError}
                                                                    />
                                                                    {privilegeLeaveValidationError && <div className="invalid-feedback">Privilege Leave Required</div>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="sickLeave">Sick Leave <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="sickLeave"
                                                                        name="sickLeave"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={sickLeave}
                                                                        onChange={e => handleSickLeaveChange(e.target.value)}
                                                                        invalid={!!sickLeaveValidationError}
                                                                    />
                                                                    {sickLeaveValidationError && <div className="invalid-feedback">Sick Leave Required</div>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="maternityLeave">Maternity Leave <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="maternityLeave"
                                                                        name="maternityLeave"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={maternityLeave}
                                                                        onChange={e => handleMaternityLeaveChange(e.target.value)}
                                                                        invalid={!!maternityLeaveValidationError}
                                                                    />
                                                                    {maternityLeaveValidationError && <div className="invalid-feedback">Maternity Leave Required</div>}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="paternityLeave">Paternity Leave <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="paternityLeave"
                                                                        name="paternityLeave"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={paternityLeave}
                                                                        onChange={e => handlePaternityLeaveChange(e.target.value)}
                                                                        invalid={!!paternityLeaveLeaveValidationError}
                                                                    />
                                                                    {paternityLeaveLeaveValidationError && <div className="invalid-feedback">Paternity Leave Required</div>}
                                                                </div>
                                                            </div>

                                                            {/* <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="feverLeave">Fever Leave <span className='text-danger'>*</span></label>
                                                                    <Input
                                                                        id="feverLeave"
                                                                        name="feverLeave"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={feverLeave}
                                                                        onChange={e => handleFeverLeaveChange(e.target.value)}
                                                                        invalid={!!feverLeaveLeaveValidationError}
                                                                    />
                                                                    {feverLeaveLeaveValidationError && <div className="invalid-feedback">Fever Leave Required</div>}
                                                                </div>
                                                            </div> */}
                                                            <Col xs={12} className='bg-secondary-subtle mb-3 py-3'>
                                                                <h6 className='mb-0'>Bank Account Details</h6>
                                                            </Col>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="accountTitle">Account Title</label>
                                                                    <Input
                                                                        id="accountTitle"
                                                                        name="accountTitle"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={accountTitle}
                                                                        onChange={e => setAccountTitle(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="bankAccountNo">Bank Account No</label>
                                                                    <Input
                                                                        id="bankAccountNo"
                                                                        name="bankAccountNo"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={bankAccountNo}
                                                                        onChange={e => setBankAccountNo(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="bankName">Bank Name</label>
                                                                    <Input
                                                                        id="bankName"
                                                                        name="bankName"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={bankName}
                                                                        onChange={e => setBankName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="IFSCCode">IFSC Code</label>
                                                                    <Input
                                                                        id="IFSCCode"
                                                                        name="IFSCCode"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={IFSCCode}
                                                                        onChange={e => setIFSCCode(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="bankBranchName">Bank Branch Name</label>
                                                                    <Input
                                                                        id="bankBranchName"
                                                                        name="bankBranchName"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={bankBranchName}
                                                                        onChange={e => setBankBranchName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Col xs={12} className='bg-secondary-subtle mb-3 py-3'>
                                                                <h6 className='mb-0'>Social Media Link</h6>
                                                            </Col>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="facebookURL">Facebook URL</label>
                                                                    <Input
                                                                        id="facebookURL"
                                                                        name="facebookURL"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={facebookURL}
                                                                        onChange={e => setFacebookURL(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="twitterURL">Twitter URL</label>
                                                                    <Input
                                                                        id="twitterURL"
                                                                        name="twitterURL"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={twitterURL}
                                                                        onChange={e => setTwitterURL(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="linkedinURL">Linkedin URL</label>
                                                                    <Input
                                                                        id="linkedinURL"
                                                                        name="linkedinURL"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={linkedinURL}
                                                                        onChange={e => setLinkedinURL(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <div className="form-group mb-2">
                                                                    <label htmlFor="instagramURL">Instagram URL</label>
                                                                    <Input
                                                                        id="instagramURL"
                                                                        name="instagramURL"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={instagramURL}
                                                                        onChange={e => setInstagramURL(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-12 bg-secondary-subtle mb-3 py-3">
                                                                <h6 className='mb-0'>Upload Documents</h6>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <label className="text-start mb-2"> Resume </label>
                                                                    <div
                                                                        style={{
                                                                            border: '2px dashed #ddd',
                                                                            padding: '6px',
                                                                            textAlign: 'center',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '5px',
                                                                        }}
                                                                        onClick={() => document.getElementById('resume')?.click()}
                                                                    >
                                                                        {selectedResume ? selectedResume.name : "Drop a file here or click"}
                                                                    </div>
                                                                    <Input
                                                                        id="resume"
                                                                        name="resume"
                                                                        type="file"
                                                                        accept=".pdf"
                                                                        style={{ display: 'none' }}
                                                                        onChange={handleResumeUpload}
                                                                    />
                                                                </FormGroup>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <label className="text-start mb-2"> Resignation Letter</label>
                                                                    <div
                                                                        style={{
                                                                            border: '2px dashed #ddd',
                                                                            padding: '6px',
                                                                            textAlign: 'center',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '5px',
                                                                        }}
                                                                        onClick={() => document.getElementById('resignationLetter')?.click()}
                                                                    >
                                                                        {selectedResignationLetter ? selectedResignationLetter.name : "Drop a file here or click"}
                                                                    </div>
                                                                    <Input
                                                                        id="resignationLetter"
                                                                        name="resignationLetter"
                                                                        type="file"
                                                                        accept=".pdf"
                                                                        style={{ display: 'none' }}
                                                                        onChange={handleResignationLetterUpload}
                                                                    />
                                                                </FormGroup>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <label className="text-start mb-2"> Joining Letter </label>
                                                                    <div
                                                                        style={{
                                                                            border: '2px dashed #ddd',
                                                                            padding: '6px',
                                                                            textAlign: 'center',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '5px',
                                                                        }}
                                                                        onClick={() => document.getElementById('joiningLetter')?.click()}
                                                                    >
                                                                        {selectedJoiningLetter ? selectedJoiningLetter.name : "Drop a file here or click"}
                                                                    </div>
                                                                    <Input
                                                                        id="joiningLetter"
                                                                        name="joiningLetter"
                                                                        type="file"
                                                                        style={{ display: 'none' }}
                                                                        accept=".pdf"
                                                                        onChange={handleJoiningLetterUpload}
                                                                    />
                                                                </FormGroup>
                                                            </div>

                                                            <div className="col-md-6 col-lg-3 mb-2">
                                                                <FormGroup>
                                                                    <label className="text-start mb-2"> Other Documents </label>
                                                                    <div
                                                                        style={{
                                                                            border: '2px dashed #ddd',
                                                                            padding: '6px',
                                                                            textAlign: 'center',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '5px',
                                                                        }}
                                                                        onClick={() => document.getElementById('otherDocuments')?.click()}
                                                                    >
                                                                        {selectedOtherDocuments ? selectedOtherDocuments.name : "Drop a file here or click"}
                                                                    </div>
                                                                    <Input
                                                                        id="otherDocuments"
                                                                        name="otherDocuments"
                                                                        type="file"
                                                                        accept=".pdf"
                                                                        style={{ display: 'none' }}
                                                                        onChange={handleOtherDocumentsUpload}
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionBody>
                                            </AccordionItem>

                                        </Accordion>
                                        <div className="col-12 text-center">
                                            <Button color="primary" className='mt-3' type="submit">Add Employee</Button>
                                        </div>

                                    </Form>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default AddEmployee;