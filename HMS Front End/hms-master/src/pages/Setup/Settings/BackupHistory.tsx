import React, { ChangeEvent, FormEvent, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    CardBody,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
 
import { Link } from "react-router-dom";

// Define a type for the backup data
interface BackupData {
    id: number;
    role: string;
    type: string;
    action: string;
}
interface FormData {

    name: string;
}

interface FormErrors {

    name?: string;
}

const BackupHistory: React.FC = () => {
    // Dummy backup data
    const backupData: BackupData[] = [
        { id: 1, role: 'Admin', type: 'Full Backup', action: 'Download' },
        { id: 2, role: 'Editor', type: 'Partial Backup', action: 'Download' },
        { id: 3, role: 'Viewer', type: 'Database Backup', action: 'Restore' },
        { id: 4, role: 'Moderator', type: 'Content Backup', action: 'Delete' },
        { id: 5, role: 'Contributor', type: 'User Data Backup', action: 'Download' },
        { id: 6, role: 'Guest', type: 'Log Backup', action: 'Restore' },
        { id: 7, role: 'Manager', type: 'Settings Backup', action: 'Delete' },
        { id: 8, role: 'Super Admin', type: 'All Data Backup', action: 'Download' },
    ];

    const [isExportCSV, setIsExportCSV] = useState<boolean>(false);

    // Updated backup columns
    const backupColumns = [
        {
            header: 'Backup Files',
            accessorKey: 'role',
            enableColumnFilter: false,
        },
        {
            header: 'Type',
            accessorKey: 'type',
            enableColumnFilter: false,
        },
        {
            header: "Action",
            cell: (cell: any) => {
             

                function handleCompanyClick(companyData: any) {
                    throw new Error("Function not implemented.");
                }

                function onClickDelete(companyData: any) {
                    throw new Error("Function not implemented.");
                }

              return (
                <ul className="list-inline hstack gap-2 mb-0">
                 
                  <li className="list-inline-item" title="Edit">
                    <Link className="edit-item-btn" to="#"
                      onClick={() => { const companyData = cell.row.original; handleCompanyClick(companyData); }}
                    >
                      <i className="ri-pencil-fill align-bottom text-muted"></i>
                    </Link>
                  </li>
                  <li className="list-inline-item" title="Delete">
                    <Link
                      className="remove-item-btn"
                      onClick={() => { const companyData = cell.row.original; onClickDelete(companyData); }}
                      to="#"
                    >
                      <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                    </Link>
                  </li>
                </ul>
              );
            },
          },
    ];
    const [formData, setFormData] = useState<FormData>({

        name: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validate form fields
    const validateForm = (data: FormData): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.name) newErrors.name = 'Name is required';
        return newErrors;
    };

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        const updatedData = { ...formData, [id]: value };
        setFormData(updatedData);

        // Validate on change
        const newErrors = validateForm(updatedData);
        setErrors(newErrors);
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form from refreshing the page

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch("http://localhost:8087/payumoney/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const responseText = await response.text();
                console.log("Response from server:", responseText);

                if (response.ok) {
                    alert("Form submitted successfully!");
                    setFormData({

                        name: '',
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

    // Handler for delete action
    const handleDelete = (id: number) => {
        // Implement delete logic here
        console.log(`Deleted backup file with id: ${id}`);
    };

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={backupData}
                />

                <Container fluid>
                   
                    <Row>
                        <Col lg={12}>
                            <Card id="backupHistory">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Backup History</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button type="button" className="btn btn-secondary" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>

                                <CardBody>
                                    <Row>
                                        <Col lg={8}>
                                            <div>
                                                <TableContainer
                                                    columns={backupColumns}
                                                    data={backupData}
                                                    isGlobalFilter={true}
                                                    isCustomerFilter={true}
                                                    customPageSize={5}
                                                    tableClass="table table-bordered"
                                                    theadClass="thead-light"
                                                    divClass="table-responsive"
                                                />
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <Form onSubmit={handleSubmit}>


                                                <FormGroup>
                                                    <Label for="name">Upload From Local Directory</Label>
                                                    <Input
                                                        type="file"
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        invalid={!!errors.name}
                                                    />
                                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                </FormGroup>

                                                <Button type="submit" color="primary">Submit</Button>
                                            </Form>
                                        </Col>
                                    </Row>
                                </CardBody>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default BackupHistory;
