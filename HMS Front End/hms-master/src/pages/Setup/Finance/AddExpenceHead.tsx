import React, { useEffect, useState } from 'react'
import SetupApiService from '../../../helpers/services/setup/setup-api-service';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { faXmark, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormHeader from '../../../common/FormHeader/FormHeader';
import ErrorHandler from '../../../helpers/ErrorHandler';

const AddExpenceHead = () => {
  const setupApiService: SetupApiService = new SetupApiService();

  let navigate: any = useNavigate();

  const [expenceHeadData, setExpenceHeadData] = useState<any[]>([]);
  const [expenceHeadValidationError, setExpenceHeadValidationError] = useState(false);
  const [modNoValidationError, setModNoValidationError] = useState(false);

  const addExpenceHead = () => {
    setExpenceHeadData([...expenceHeadData, {
      expenseHead: '',
      description: '',
      // modNo: '',
    }])
  }

  const handleExpenceHeadDataChange = (index: number, field: string, value: any) => {
    const newExpenceHead = [...expenceHeadData];
    newExpenceHead[index] = {
      ...newExpenceHead[index],
      [field]: value,
    }
    setExpenceHeadData(newExpenceHead);

    switch (field) {
      case 'expenseHead':
        setExpenceHeadValidationError(!value);
        break;
      // case 'modNo':
      //   setModNoValidationError(!value);
      //   break;
      default:
        break;
    }
  }

  const removeExpenceHead = (index: any) => {
    const newExpenceHead = [...expenceHeadData];
    newExpenceHead.splice(index, 1);
    setExpenceHeadData(newExpenceHead);
  };

  const validateForm = () => {
    let isFormValid = true;

    const validationErrors = expenceHeadData.map((item: any) => {
      const errors = {
        expenseHead: !item.expenseHead,
        // modNo: !item.modNo,
      };
      isFormValid = isFormValid && !Object.values(errors).includes(true);
      return errors;
    });

    setExpenceHeadValidationError(validationErrors.some(error => error.expenseHead));
    // setModNoValidationError(validationErrors.some(error => error.modNo));

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      createExpenseHeads();
    }
  }
  const createExpenseHeads = async () => {
    try {
      const payload: any = expenceHeadData;
      await setupApiService.createExpenseHeads(payload);
      navigate('/main/financeSetup');
      toast.success('Expence Head Added Successfully', { containerId: 'TR' });
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  useEffect(() => {
    addExpenceHead();
  }, []);

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Add Expence Head" pageTitle="Setup" />
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
                    {expenceHeadData.map((item: any, index: any) => (
                      <Row className='align-items-center'>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="expenseHead"> Expense Head <span className='text-danger'> * </span> </Label>
                            <Input
                              className={`${expenceHeadValidationError && !item.expenseHead ? 'is-invalid' : ''}`}
                              type="text"
                              id="expenseHead"
                              value={item.expenseHead}
                              onChange={e => handleExpenceHeadDataChange(index, 'expenseHead', e.target.value)}

                            />
                            {expenceHeadValidationError && !item.expenseHead && <div className="invalid-feedback">Expense Head  Required</div>}
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
                              onChange={e => handleExpenceHeadDataChange(index, 'description', e.target.value)}
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
                              onChange={e => handleExpenceHeadDataChange(index, 'modNo', e.target.value)}
                            />
                            {modNoValidationError && !item.modNo && (
                              <div className="invalid-feedback">Version Required</div>
                            )}
                          </FormGroup>
                        </Col> */}
                        {index !== 0 && (
                          <Col xs="auto pt-2">
                            <button onClick={() => removeExpenceHead(index)} className="btn btn-soft-danger">
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
                        onClick={addExpenceHead}><FontAwesomeIcon icon={faCirclePlus} />
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

export default AddExpenceHead