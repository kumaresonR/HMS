import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';

const EditScope = () => {
  const setupApiService: SetupApiService = new SetupApiService();

  let navigate: any = useNavigate();

  const { state } = useLocation();

  const data = state?.data;

  const [name, setName] = useState('');
  const [nameValidationError, setNameValidationError] = useState(false);
  const [description, setDescription] = useState<any>('');

  const handleNameChange = (value: any) => {
    setName(value);
    setNameValidationError(false);
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!name) {
      setNameValidationError(true);
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
        scopeName: name,
      }
      await setupApiService.editScope(data.scopeId, payload);
      navigate('/main/humanResourceMainSetup');
      toast.success('Scope Updated Successfully', { containerId: 'TR' });
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    if (state?.data) {
      setDescription(data.description || 'NA');
      setName(data.scopeName);
    }
  }, [state?.data]);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Edit Scope" pageTitle="Setup" />
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
                      <Col md={12}>
                        <FormGroup>
                          <Label for="scopeName">Scope Name <span className='text-danger'> * </span></Label>
                          <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => handleNameChange(e.target.value)}
                            invalid={!!nameValidationError}
                          />
                          {nameValidationError && (
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

export default EditScope