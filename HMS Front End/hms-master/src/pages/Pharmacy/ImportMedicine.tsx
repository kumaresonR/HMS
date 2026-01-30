import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap"
import FormHeader from '../../common/FormHeader/FormHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { minimizePage } from '../../slices/pageResizer/uiSlice';

const ImportMedicine = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [importMedicines, setImportMedicines] = useState<any>([1]);
    const [medicineCategory, setMedicineCategory] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const createPatient = () => {
    }
    const downloadSampledata = () => {
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
        if (file) {
            console.log("File selected:", file.name);
        }
    };

    const handleClick = () => {
        const fileInput = document.getElementById('file') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.click();
        }
    };
    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="Medicines"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "Medicines",
                    }))} />

                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex justify-content-between">
                                <div className="ms-auto">
                                    <Button className="mx-2" onClick={() => downloadSampledata()}>
                                        <i className="ri-add-circle-line" /> Download Sample Data
                                    </Button>
                                </div>
                            </CardHeader>
                            <hr />
                            <CardBody>
                                <Label className="mb-0"> <strong>Note:</strong>  Your CSV data should be in the format below. The first line of your CSV file should be the column headers as in the table example. Also make sure that your file is UTF-8 to avoid unnecessary encoding problems. Also make sure that Medicine Company, Medicine Group and Unit should me table id.
                                </Label>
                                <hr />
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Medicine </th>
                                                <th>Company</th>
                                                <th>Composition</th>
                                                <th>Group</th>
                                                <th>Unit</th>
                                                <th>Min Level</th>
                                                <th>Re-Order Level</th>
                                                <th>VAT</th>
                                                <th>Box/Packing</th>
                                                <th>Note</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {importMedicines?.map((data: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td>{data.medicine} </td>
                                                    <td>{data.company}</td>
                                                    <td>{data.Composition}</td>
                                                    <td>{data.group} </td>
                                                    <td>{data.unit} </td>
                                                    <td>{data.minlevel}</td>
                                                    <td>{data.reorderlevel}</td>
                                                    <td>{data.vat} </td>
                                                    <td>{data.tax}</td>
                                                    <td>{data.boxorpacking}</td>
                                                    <td>{data.note}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="my-5">
                                </div>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label for="Medicine Category">Medicine Category <span className='text-danger'>*</span></Label>
                                            <Input
                                                type="select"
                                                id="medicineCategory"
                                                value={medicineCategory}
                                                onChange={(e) => setMedicineCategory(e.target.value)}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Syrup">Syrup</option>
                                                <option value="Capsule">Capsule</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup>
                                            <Label for="file" className="form-label">Select CSV File <span className='text-danger'>*</span></Label>
                                            <div
                                                className="file-drop-zone"
                                                style={{
                                                    border: '2px dashed #ccc',
                                                    padding: '6px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    borderRadius: '5px'
                                                }}
                                                onClick={handleClick}
                                            >
                                                {selectedFile ? selectedFile.name : "Drop a file here or click"}
                                            </div>
                                            <Input
                                                type="file"
                                                id="file"
                                                name="file"
                                                accept=".csv"
                                                onChange={handleFileUpload}
                                                style={{ display: 'none' }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='text-end'>
                                        <Button>
                                            <FontAwesomeIcon icon={faUpload} className='me-2' />
                                            Import Medicines
                                        </Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default ImportMedicine