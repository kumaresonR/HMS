import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import Select from 'react-select';
import { customStyles } from '../../../common/data/FakeData';

const AddRole = () => {
  const setupApiService: SetupApiService = new SetupApiService();

  let navigate: any = useNavigate();

  const [name, setName] = useState('');
  const [nameValidationError, setNameValidationError] = useState(false);
  const [scopeNameValidationError, setScopeNameValidationError] = useState(false);
  const [description, setDescription] = useState<any>('');
  const [scopeData, setScopeData] = useState([]);
  const [scopeId, setScopeId] = useState('');
  const [selectedScopeName, setSelectedScopeName] = useState<any>([]);

  const handleNameChange = (value: any) => {
    setName(value);
    setNameValidationError(false);
  }

  const handleScopeNameChange = (value: any) => {
    setSelectedScopeName(value);
    const selectedIds = value ? value.map((item: any) => item.value).join(',') : '';
    setScopeId(selectedIds);
    setScopeNameValidationError(false);
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!name) {
      setNameValidationError(true);
      isFormValid = false;
    }

    if (!scopeId) {
      setScopeNameValidationError(true);
      isFormValid = false;
    }

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      createScope();
    }
  }
  const createScope = async () => {
    try {
      const payload: any = {
        description: description,
        roleName: name,
        scopeIds: scopeId

      }
      await setupApiService.createRole(payload);
      navigate('/main/humanResourceMainSetup');
      toast.success('Role Added Successfully', { containerId: 'TR' });
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  const getAllScope = async () => {
    try {
      let result = await setupApiService.getAllScope();
      setScopeData(result);
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    getAllScope();
  }, []);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Add Role" pageTitle="Setup" />
          <Card>
            <CardBody>
              <div className='text-end'>
                <Button
                  color="primary"
                  onClick={() => navigate(-1)}
                  className="btn btn-primary add-btn mx-2"
                >
                  <IoArrowBack /> Back
                </Button>
              </div>
              <Row className="d-flex justify-content-center">
                <Col xl={12}>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="roleName">Role Name <span className='text-danger'> * </span></Label>
                          <Input
                            type="text"
                            id="roleName"
                            value={name}
                            onChange={e => handleNameChange(e.target.value.toUpperCase())}
                            invalid={!!nameValidationError}
                          />
                          {nameValidationError && (
                            <div className="invalid-feedback">Role Name Required</div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="scopeName">Scope Name <span className='text-danger'> * </span></Label>
                          <Select
                            id="scopeName"
                            value={selectedScopeName}
                            isMulti={true}
                            onChange={handleScopeNameChange}
                            options={scopeData.map((item: any) => ({
                              label: item.scopeName,
                              value: item.scopeId,
                            }))}
                            styles={customStyles}
                          />
                          {/* <select className="form-control" value={scopeName} onChange={e => handleScopeNameChange(e.target.value)}>
                            <option value="">--Select Scope Name--</option>
                            {scopeData.map((data: any, idx: any) => (
                              <option key={idx} value={data.scopeId}>{data.scopeName}</option>
                            ))}
                          </select> */}
                          {scopeNameValidationError && (
                            <div className="invalid-feedback">Scope Name Required</div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label for="Description">Description</Label>
                          <textarea className='form-control'
                            id="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Button type="submit" color="primary">Submit</Button>
                  </Form>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddRole