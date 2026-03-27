import React, { useState } from 'react'
import { Button, Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import ErrorHandler from '../../../helpers/ErrorHandler';
import FormHeader from '../../../common/FormHeader/FormHeader';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';
import SetupApiService from '../../../helpers/services/setup/setup-api-service';

const AddStore = () => {
  const setupApiService: SetupApiService = new SetupApiService();

  let navigate: any = useNavigate();

  const [itemStoreName, setItemStoreName] = useState('');
  const [itemStoreNameValidationError, setItemStoreNameValidationError] = useState(false);
  const [itemStockCode, setItemStockCode] = useState('');
  const [description, setDescription] = useState('');
  const [modNo, setModNo] = useState('');
  const [modNoValidationError, setModNoValidationError] = useState(false);

  const handleItemStoreNameChange = (value: any) => {
    setItemStoreName(value);
    setItemStoreNameValidationError(false);
  }

  const handleModNoChange = (value: any) => {
    setModNo(value);
    setModNoValidationError(false);
  }

  const validateForm = () => {
    let isFormValid = true;

    if (!itemStoreName) {
      setItemStoreNameValidationError(true);
      isFormValid = false;
    }

    // if (!modNo) {
    //   setModNoValidationError(true);
    //   isFormValid = false;
    // }

    return isFormValid;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      createItemStore();
    }
  }

  const createItemStore = async () => {
    try {
      const payload = [{
        itemStoreName: itemStoreName,
        itemStockCode: itemStockCode || 'NA',
        description: description || 'NA',
        // modNo : modNo
      }]
      await setupApiService.createItemStore(payload);
      toast.success('Item Store Details Added Successfully', { containerId: 'TR' });
      navigate('/main/InventoryMainSetup')
    } catch (error: any) {
      return ErrorHandler(error)
    }
  }

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <FormHeader title="Add Item Store" pageTitle="Setup" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Add Item Store </h5>

                        <Link to="/main/InventoryMainSetup" className="text-end">
                          <Button
                            color="primary"
                            className="btn btn-primary add-btn"
                          >
                            <IoArrowBack /> Back
                          </Button>
                        </Link>
                      </div>
                      <div>
                        <h4 className="pagetitleh2 mb-4"></h4>
                        <form onSubmit={handleSubmit}>
                          <div className="around10">
                            <Input type="hidden" name="ci_csrf_token" defaultValue="" />
                            <div className="row">
                              <div className="col-md-6 mb-2">
                                <div className="form-group mb-2">
                                  <label htmlFor="itemStoreName"> Item Store Name </label>
                                  <small className="req"> *</small>
                                  <Input
                                    id="itemStoreName"
                                    name="itemStoreName"
                                    type="text"
                                    value={itemStoreName}
                                    onChange={e => handleItemStoreNameChange(e.target.value)}
                                    invalid={!!itemStoreNameValidationError}
                                  />
                                  {itemStoreNameValidationError && <span className="text-danger"> Item Store Name Required</span>}
                                </div>
                              </div>

                              <div className="col-md-6 mb-2">
                                <div className="form-group mb-2">
                                  <label htmlFor="ItemStockCode"> Item Stock Code </label>
                                  <Input
                                    id="itemStockCode"
                                    name="itemStockCode"
                                    type="text"
                                    value={itemStockCode}
                                    onChange={e => setItemStockCode(e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="col-md-6">
                                <div className="form-group mb-2">
                                  <label htmlFor="description">Description</label>
                                  <textarea
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* <div className="col-md-6 mb-2">
                                <div className="form-group mb-2">
                                  <label htmlFor="modNo">Mod No <span className='text-danger'> * </span></label>
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
                          <Button color="primary" type="submit" >
                            Submit
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AddStore