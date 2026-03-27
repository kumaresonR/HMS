import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Input,
    Label,
    Row,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import 'react-toastify/dist/ReactToastify.css';
import FormHeader from "../../common/FormHeader/FormHeader";
import { Link, useNavigate } from "react-router-dom";
import ErrorHandler from "../../helpers/ErrorHandler";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import CertificateApiService from "../../helpers/services/certificate/certificate-api-service";
import { toast } from "react-toastify";

const StaffIDCard = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();
    const certificateApiService: CertificateApiService = new CertificateApiService();

    const [employeeData, setEmployeeData] = useState<any>([]);
    const [roleData, setRoleData] = useState([]);
    const [role, setRole] = useState('');
    const [templateData, setTemplateData] = useState([]);
    const [templateId, setTemplateId] = useState<any>('');
    const [selectedData,setSelectedData] = useState<any>('');
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({}); 

    let navigate: any = useNavigate();

    const staffColumns = [
        {
            header: 'Select',
            accessorKey: 'select',
            enableColumnFilter: false,
            cell: (info: any) => (
                <input 
                    type="checkbox"
                    checked={!!selectedRows[info.row.id]} 
                    onChange={(e) => handleCheckboxChange(info, e.target.checked)}  
                />
            )
        },
        {
            header: 'Staff ID',
            accessorKey: 'staffId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary">
                    {info.getValue()}
                </div>
            )
        },
        {
            header: 'Name',
            accessorKey: 'fullName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <div className="text-primary text-nowrap">
                    {info.getValue()}
                </div>
            )
        },
        // {
        //     header: 'Designation',
        //     accessorKey: 'designation',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className="text-primary">{info.getValue()}</div>
        //     ),
        // },
        // {
        //     header: 'Department',
        //     accessorKey: 'department',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className="text-primary">{info.getValue()}</div>
        //     ),
        // },
        // {
        //     header: 'Father Name',
        //     accessorKey: 'fatherName',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className="text-nowrap">
        //             {info.getValue()}
        //         </div>
        //     )

        // },
        // {
        //     header: 'Mother Name',
        //     accessorKey: 'motherName',
        //     enableColumnFilter: false,

        // },
        // {
        //     header: 'Date Of Joining',
        //     accessorKey: 'dateOfJoining',
        //     enableColumnFilter: false,

        // },

        // {
        //     header: 'Phone',
        //     accessorKey: 'phone',
        //     enableColumnFilter: false,
        //     cell: (info: any) => (
        //         <div className="text-primary">
        //             {info.getValue()}
        //         </div>
        //     )
        // },
        // {
        //     header: 'Date Of Birth',
        //     accessorKey: 'dateOfBirth',
        //     enableColumnFilter: false,

        // },
        // {
        //     header: 'Address',
        //     accessorKey: 'address',
        //     enableColumnFilter: false,

        // },
        // {
        //     header: 'Action',
        //     accessorKey: 'action',
        //     enableColumnFilter: false,
        //     cell: () => (
        //         <ul className="list-inline hstack gap-2 mb-0">


        //             <li className="list-inline-item">
        //                 <Link
        //                     className="edit-item-btn"
        //                     to="#"
        //                     onClick={(e) => {
        //                         e.preventDefault();

        //                     }}
        //                     title="Edit"
        //                 >
        //                     <i className="ri-pencil-fill align-bottom text-purple"></i>
        //                 </Link>
        //             </li>

        //             <li className="list-inline-item" title="Delete">
        //                 <Link
        //                     className="remove-item-btn" data-bs-toggle="modal"

        //                     to="#"
        //                 >
        //                     <i className="ri-delete-bin-fill align-bottom text-danger"></i>
        //                 </Link>
        //             </li><li className="list-inline-item" title="View">
        //                 <Link
        //                     className="view-item-btn"
        //                     to="#"
        //                 >
        //                     <i className="ri-eye-fill align-bottom text-pink"></i>
        //                 </Link>
        //             </li>
        //         </ul>
        //     ),
        // },
    ];

    const addCertificate = () => {
        navigate('/main/addStaffId')
    }


    const handleEmployeeSearch = async () => {
        try {
            let url = "role=" + role
            let result = await employeeApiService.searchAllEmployee(url);
            setEmployeeData(result)
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

    const getAllCertificateTemplate = async () => {
        try {
            let result = await certificateApiService.getAllStaffIdTemplate();
            setTemplateData(result.ResponseBody);
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    const generateTemplate = () => {
        if (!templateId) {
            toast.warning('Please Select The Template', { containerId: 'TR' });
            return;
        } 
        if (!selectedData) {
            toast.warning('Please Select Any Staff', { containerId: 'TR' });
            return;
        }
        navigate('/main/generateStaffID', { state: { id: templateId, data: selectedData } })
    }

    const handleCheckboxChange = (info: any, checked: boolean) => {
        const rowId = info.row.id;
        setSelectedRows((prev) => ({ ...prev, [rowId]: checked }));
    
        if (checked) {
            setSelectedData(info.row.original);
        } else {
            setSelectedData(null); 
        }
    };

    useEffect(() => {
        getAllRole();
        getAllCertificateTemplate();
    }, []);

    return (
        <React.Fragment>
            <div>
                <Container fluid>
                    <FormHeader title="Staff ID Card" pageTitle="Staff ID Card" />
                    <Row className="d-flex justify-content-center">
                        <Col xl={12} className="p-0">
                            <Card>
                                <CardHeader className=" d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">Staff List</h4>
                                    <Button onClick={addCertificate}>  Certificate Template </Button>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="role">
                                                    Role
                                                </Label>
                                                <Input type="select"
                                                    id="role"
                                                    value={role}
                                                    onChange={e => setRole(e.target.value)}
                                                >
                                                    <option value="">Select User Type</option>
                                                    {roleData.map((item: any, idx: any) => (
                                                        <option key={idx} value={item.roleName}>{item.roleName}</option>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <Label className="form-label" htmlFor="id-card-template-input">
                                                    ID Card Template
                                                </Label>
                                                <Input type="select"
                                                    className="form-control"
                                                    id="id-card-template-input"
                                                    value={templateId}
                                                    onChange={(e: any) => setTemplateId(e.target.value)}>
                                                    <option>Select Template</option>
                                                    {templateData.map((item: any, idx: any) => (
                                                        <option key={idx} value={item.StaffIdCardTemplateId}>{item.StaffIdCardTitle}</option>
                                                    ))}
                                                </Input>
                                            </div>
                                        </Col>
                                        <Col>
                                            <Button onClick={handleEmployeeSearch}>Search</Button>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg={12} className="px-0">
                                            <Card id="staffListReport">
                                                <CardHeader className="border-0">
                                                    <Row className="g-4 align-items-end justify-content-end">
                                                        <div className="col-sm-auto">
                                                            <Button color="success" onClick={generateTemplate}>Generate</Button>
                                                        </div>
                                                    </Row>
                                                </CardHeader>
                                                <div className="card-body pt-0">
                                                    <TableContainer
                                                        columns={staffColumns}
                                                        data={employeeData}
                                                        isGlobalFilter={false}
                                                        isCustomerFilter={false}
                                                        customPageSize={5}
                                                        tableClass="table table-bordered"
                                                        theadClass="thead-light"
                                                        divClass="table-responsive"
                                                    />
                                                </div>
                                            </Card>
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

export default StaffIDCard;
