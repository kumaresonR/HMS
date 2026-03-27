import { faXmark, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';

const AddIncomeHead = () => {
  const setupApiService: SetupApiService = new SetupApiService();

  let navigate: any = useNavigate();

  const [incomeHeadData, setIncomeHeadData] = useState<any[]>([]);
  const [incomeHeadValidationError, setIncomeHeadValidationError] = useState(false);
  const [modNoValidationError, setModNoValidationError] = useState(false);

  const addIncomeHead = () => {
    setIncomeHeadData([...incomeHeadData, {
      incomeHead: '',
      description: '',
      // modNo: '',
    }])
  }

  const handleincomeHeadDataChange = (index: number, field: string, value: any) => {
    const newIncomeHead = [...incomeHeadData];
    newIncomeHead[index] = {
      ...newIncomeHead[index],
      [field]: value,
    }
    setIncomeHeadData(newIncomeHead);

    switch (field) {
      case 'incomeHead':
        setIncomeHeadValidationError(!value);
        break;
      // case 'modNo':
      //   setModNoValidationError(!value);
      //   break;
      default:
        break;
    }
  }

  const removeIncomeHead = (index: any) => {
    const newIncomeHead = [...incomeHeadData];
    newIncomeHead.splice(index, 1);
    setIncomeHeadData(newIncomeHead);
  };

  const validateForm = () => {
    let isFormValid = true;

    const validationErrors = incomeHeadData.map((item: any) => {
      const errors = {
        incomeHead: !item.incomeHead,
        // modNo: !item.modNo,
      };
      isFormValid = isFormValid && !Object.values(errors).includes(true);
      return errors;
    });

    setIncomeHeadValidationError(validationErrors.some(error => error.incomeHead));
    // setModNoValidationError(validationErrors.some(error => error.modNo));

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      createIncomeHeads();
    }
  }
  const createIncomeHeads = async () => {
    try {
      const payload: any = incomeHeadData;
      await setupApiService.createIncomeHeads(payload);
      navigate('/main/financeSetup');
      toast.success('Income Head Added Successfully', { containerId: 'TR' });
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    addIncomeHead();
  }, []);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Add Income Head" pageTitle="Setup" />
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
                    {incomeHeadData.map((item: any, index: any) => (
                      <Row className='align-items-center'>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="incomeHead"> Income Head  <span className='text-danger'> * </span></Label>
                            <Input
                              className={`${incomeHeadValidationError && !item.incomeHead ? 'is-invalid' : ''}`}
                              type="text"
                              id="incomeHead"
                              value={item.incomeHead}
                              onChange={e => handleincomeHeadDataChange(index, 'incomeHead', e.target.value)}

                            />
                            {incomeHeadValidationError && !item.incomeHead && <div className="invalid-feedback">Income Head  Required</div>}
                          </FormGroup>
                        </Col>
                        <Col md>
                          <FormGroup>
                            <Label for="description"> Description  </Label>
                            <Input
                              className={`form-control`}
                              type="text"
                              id="description"
                              value={item.description}
                              onChange={e => handleincomeHeadDataChange(index, 'description', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        {/* <Col>
                          <FormGroup>
                            <Label for="name">Version <span className='text-danger'> * </span></Label>
                            <Input
                              className={`${modNoValidationError && !item.modNo ? 'is-invalid' : ''}`}
                              type="text"
                              id="name"
                              value={index.modNo}
                              onChange={e => handleincomeHeadDataChange(index, 'modNo', e.target.value)}
                            />
                            {modNoValidationError && !item.modNo && (
                              <div className="invalid-feedback">Version Required</div>
                            )}
                          </FormGroup>
                        </Col> */}
                        {index !== 0 && (
                          <Col xs="auto pt-2">
                            <button onClick={() => removeIncomeHead(index)} className="btn btn-soft-danger">
                              <FontAwesomeIcon
                                className="mx-2"
                                icon={faXmark}
                              />
                            </button>
                          </Col>
                        )}
                      </Row>
                    ))}

                    <Col className='text-start'>
                      <Button
                        color="primary"
                        className="btn btn-primary mx-3 mb-3 add-bt"
                        onClick={addIncomeHead}><FontAwesomeIcon icon={faCirclePlus} />
                        &nbsp;Add New</Button>
                    </Col>

                    <Col className='text-end'>
                      <Button type="submit" color="primary">Submit</Button>
                    </Col>
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

export default AddIncomeHead