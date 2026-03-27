import React, { useState, useEffect } from 'react';
import {
  Label,
  Input,
  Button,
  Form,
  FormGroup,
  Card,
  CardBody,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import FormHeader from '../../common/FormHeader/FormHeader';
import ErrorHandler from '../../helpers/ErrorHandler';
import { toast } from 'react-toastify';
import DispatchApiService  from '../../helpers/services/employee/EmployeeApiService';
import { minimizePage } from '../../slices/pageResizer/uiSlice';
import { useDispatch } from 'react-redux';

const AddDispatch: React.FC = () => {
  const dispatchApiService = new DispatchApiService();
  const navigate = useNavigate();
  const location = useLocation();
  const reduxDispatch = useDispatch();

  // form state
  const [toTitle, setToTitle] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [fromTitle, setFromTitle] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // validation
  const [errors, setErrors] = useState<{[key:string]: string}>({});

  useEffect(() => {
    if (location.state?.data) {
      const data = location.state.data;
      setToTitle(data.to_title);
      setReferenceNo(data.reference_no);
      setAddress(data.address);
      setNote(data.note);
      setFromTitle(data.from_title);
      setDate(data.date);
      // file cannot be prefilled
    }
  }, [location.state]);

  const validate = () => {
    const errs: any = {};
    if (!toTitle.trim()) errs.toTitle = 'To Title is required';
    if (!referenceNo.trim()) errs.referenceNo = 'Reference No is required';
    if (!fromTitle.trim()) errs.fromTitle = 'From Title is required';
    if (!date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const formData = new FormData();
      formData.append('to_title', toTitle);
      formData.append('reference_no', referenceNo);
      formData.append('address', address);
      formData.append('note', note);
      formData.append('from_title', fromTitle);
      formData.append('date', date);
      if (file) formData.append('file', file);

    //   if (location.state?.data) {
    //     await dispatchApiService.updateDispatch(location.state.data.id, formData);
    //     toast.success('Dispatch updated successfully', { containerId: 'TR' });
    //   } else {
    //     await dispatchApiService.createDispatch(formData);
    //     toast.success('Dispatch created successfully', { containerId: 'TR' });
    //   }

      navigate('/main/dispatchList');
    } catch (err: any) {
      ErrorHandler(err);
    }
  };

  return (
    <Container fluid>
      <FormHeader
        title={location.state?.data ? 'Edit Dispatch' : 'Add Dispatch'}
        pageTitle="Front Office"
        onMinimize={() => reduxDispatch(minimizePage({ route: location.pathname, pageName: location.state?.data ? 'Edit Dispatch' : 'Add Dispatch' }))}
      />
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">{location.state?.data ? 'Edit Dispatch' : 'Add Dispatch'}</h5>
            <Link to="/main/dispatchList">
              <Button color="primary">
                <IoArrowBack /> Back
              </Button>
            </Link>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>To Title</Label>
                  <Input
                    type="text"
                    value={toTitle}
                    onChange={e => setToTitle(e.target.value)}
                    invalid={!!errors.toTitle}
                  />
                  {errors.toTitle && <div className="invalid-feedback d-block">{errors.toTitle}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Reference No</Label>
                  <Input
                    type="text"
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                    invalid={!!errors.referenceNo}
                  />
                  {errors.referenceNo && <div className="invalid-feedback d-block">{errors.referenceNo}</div>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Address</Label>
                  <Input
                    type="textarea"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Note</Label>
                  <Input
                    type="textarea"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>From Title</Label>
                  <Input
                    type="date"
                    value={fromTitle}
                    onChange={e => setFromTitle(e.target.value)}
                    invalid={!!errors.fromTitle}
                  />
                  {errors.fromTitle && <div className="invalid-feedback d-block">{errors.fromTitle}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    invalid={!!errors.date}
                  />
                  {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Attach Document</Label>
                  <Input type="file" onChange={handleFileChange} />
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" type="submit">
              {location.state?.data ? 'Update Dispatch' : 'Add Dispatch'}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default AddDispatch;
