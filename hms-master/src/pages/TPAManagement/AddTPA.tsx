import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Spinner
} from "reactstrap";
import FormHeader from "../../common/FormHeader/FormHeader";
import { IoArrowBack } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TpaApiService from "../../helpers/services/tpa/tpa-api-service";
import ErrorHandler from "../../helpers/ErrorHandler";
import { toast } from "react-toastify";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const AddTPA: React.FC = () => {
  const tpaApiService: TpaApiService = new TpaApiService();
  let navigate: any = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [name, setName] = useState("");
  const [nameValidationError, setNameValidationError] = useState(false);
  const [contactNo, setContactNo] = useState("");
  const [contactNovalidationError, setContactNoValidationError] = useState('');
  const [code, setCode] = useState("");
  const [codeValidationError, setCodeValidationError] = useState(false);
  const [address, setAddress] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [contactPersonPhone, setContactPersonPhone] = useState("");
  const [contactPersonPhoneValidationError, setContactPersonPhoneValidationError] = useState("");
  const [documentFile, setDocument] = useState<any>();
  const [loading, setLoading] = useState(false);

  const data = { name, code, contactNo, address, contactPersonName, contactPersonPhone, documentFile }

  const handleNameChange = (value: any) => {
    setName(value);
    setNameValidationError(false);
  };

  const handleCodeChange = (value: any) => {
    setCode(value);
    setCodeValidationError(false);
  };

  const onFileUploadListener = (event: any) => {
    const file = event.target.files[0];
    setDocument(file);
  }

  const handleContactNoChange = (value: any) => {
    const phoneValue = value.replace(/[^0-9]/g, "");
    setContactNo(phoneValue);
    if (phoneValue.length !== 10) {
      setContactNoValidationError("Customor care Number must be exactly 10 digits.");
    } else {
      setContactNoValidationError("");
    }
  };

  const handleContactPersonPhoneChange = (value: any) => {
    const phoneValue = value.replace(/[^0-9]/g, "");
    setContactPersonPhone(phoneValue);
    if (phoneValue.length !== 10) {
      setContactPersonPhoneValidationError("Contact Person Number must be exactly 10 digits.");
    } else {
      setContactPersonPhoneValidationError("");
    }
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!name) {
      setNameValidationError(true);
      isFormValid = false;
    }

    if (!code) {
      setCodeValidationError(true);
      isFormValid = false;
    }

    if (!contactPersonPhone) {
      setContactPersonPhoneValidationError('Contact Person Number Required');
      isFormValid = false;
    } else if (contactPersonPhone && !/^[0-9]{10}$/.test(contactPersonPhone)) {
      setContactPersonPhoneValidationError("Contact Person Number be exactly 10 digits.");
      isFormValid = false;
    } else {
      setContactPersonPhoneValidationError("");
    }

    if (contactNovalidationError && !/^[0-9]{10}$/.test(contactNovalidationError)) {
      setContactNoValidationError("Customor care Number must be exactly 10 digits.");
      isFormValid = false;
    } else {
      setContactNoValidationError("");
    }

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      addTpa();
    }
  };

  const addTpa = async () => {
    try {
      let formData: FormData = new FormData();
      const payload: any = {
        tpaName: name,
        code: code,
        contactNo: contactNo,
        address: address,
        contactPersonName: contactPersonName,
        contactPersonPhone: contactPersonPhone,
      }
      const jsonBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      console.log("tpa", payload)
      formData.append('tpaDetails', jsonBlob);
      formData.append('otherDocuments', documentFile);
      await tpaApiService.createtpaRecord(formData);
      toast.success("TPA Added Successfully", { containerId: "TR" });
      navigate("/main/tpaManagement");
    } catch (error: any) {
      return ErrorHandler(error);
    }
  };

  useEffect(() => {
    if (location?.state) {
      setName(location?.state?.name);
      setCode(location?.state?.code);
      setContactNo(location?.state?.contactNo);
      setAddress(location?.state?.address);
      setContactPersonName(location?.state?.contactPersonName);
      setContactPersonPhone(location?.state?.contactPersonPhone);
      setDocument(location?.state?.documentFile);
    }
  }, [location?.state]);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Add TPA"
            pageTitle="TPA Management"
            onMinimize={() => dispatch(minimizePage({
              route: location.pathname,
              pageName: "Add TPA",
              data
            }))} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Add TPA Details</h5>
                        <Link to="/main/tpaManagement" className="text-end">
                          <Button
                            color="primary"
                            className="btn btn-primary add-btn"
                          >
                            <IoArrowBack /> Back
                          </Button>
                        </Link>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="around10">
                          <div className="row">
                            <div className="col-md-6 mb-2">
                              <div className="form-group mb-2">
                                <label htmlFor="name">Name</label>
                                <small className="req"> *</small>
                                <Input
                                  id="name"
                                  name="name"
                                  type="text"
                                  className="form-control"
                                  value={name}
                                  onChange={(e) =>
                                    handleNameChange(e.target.value)
                                  }
                                  invalid={!!nameValidationError}
                                />
                                {nameValidationError && (
                                  <div className="invalid-feedback">
                                    Name Required
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6 mb-2">
                              <div className="form-group mb-2">
                                <label htmlFor="code">Code</label>
                                <small className="req"> *</small>
                                <Input
                                  id="code"
                                  name="code"
                                  type="text"
                                  className="form-control"
                                  value={code}
                                  onChange={(e) =>
                                    handleCodeChange(e.target.value)
                                  }
                                  invalid={!!codeValidationError}
                                />
                                {codeValidationError && (
                                  <div className="invalid-feedback">
                                    Code Required
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6 mb-2">
                              <div className="form-group mb-2">
                                <label htmlFor="contact_no">Customer Care No</label>
                                <Input
                                  id="contact_no"
                                  name="contact_no"
                                  type="text"
                                  maxLength={10}
                                  className="form-control"
                                  value={contactNo}
                                  onChange={(e) =>
                                    handleContactNoChange(e.target.value)
                                  }
                                  invalid={!!contactNovalidationError}
                                />
                                {contactNovalidationError && (
                                  <div className="invalid-feedback">
                                    {contactNovalidationError}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-md-6 mb-2">
                              <div className="form-group mb-2">
                                <label htmlFor="contact_person_name">
                                  Contact Person Name
                                </label>
                                <Input
                                  id="contact_person_name"
                                  name="contact_person_name"
                                  type="text"
                                  className="form-control"
                                  value={contactPersonName}
                                  onChange={e => setContactPersonName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6 mb-2">
                              <div className="form-group mb-2">
                                <label htmlFor="contact_person_number">
                                  Contact Person Number
                                  <small className="req"> *</small>
                                </label>
                                <Input
                                  id="contact_person_number"
                                  name="contact_person_number"
                                  type="text"
                                  maxLength={10}
                                  className="form-control"
                                  value={contactPersonPhone}
                                  onChange={e => handleContactPersonPhoneChange(e.target.value)}
                                  invalid={!!contactPersonPhoneValidationError}
                                />
                                {contactPersonPhoneValidationError && <div className="invalid-feedback">{contactPersonPhoneValidationError}</div>}
                              </div>
                            </div>
                            <div className="col-md-6 mb-2">
                              <div className="form-group mb-2">
                                <label htmlFor="address">Address</label>
                                <small className="req"> *</small>
                                <Input
                                  id="address"
                                  name="address"
                                  type="textarea"
                                  className="form-control"
                                  value={address}
                                  onChange={e => setAddress(e.target.value)}
                                />
                              </div>
                            </div>
                            <Col>
                              <Label>Attach Document</Label>
                              <Input
                                type="file"
                                className="form-control"
                                id="attachment"
                                onChange={onFileUploadListener}
                              />
                            </Col>
                            <div className="col-md-12 my-3 text-right">
                              <Button color="primary" disabled={loading}>
                                {loading ? <Spinner size="sm" className="me-2" /> : ' Add TPA'}
                              </Button>
                              {/* <Button color="primary" disabled={loading}>
                              {loading ? <Spinner size="sm" className="me-2" /> : 'Submit'}
                              </Button> */}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div >
    </React.Fragment >
  );
};

export default AddTPA;
