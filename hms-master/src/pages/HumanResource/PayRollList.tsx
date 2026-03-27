import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    CardBody,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import FormHeader from "../../common/FormHeader/FormHeader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import ErrorHandler from "../../helpers/ErrorHandler";
import ProceedToPay from "./ProceedToPay";
import { toast } from "react-toastify";
import ViewPaySlip from "./ViewPaySlip";
import PrintComponent from "../../Components/Common/PrintComponent";
import Spinner from "../../common/Spinner";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";

const PayRoll = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [role, setRole] = useState('');
    const [roleData, setRoleData] = useState<any>([]);
    const [month, setMonth] = useState("");
    const [monthValidationError, setMonthValidationError] = useState<any>('');
    const [year, setYear] = useState("");
    const [yearValidationError, setYearValidationError] = useState<any>('');
    const [payRoleData, setPayRoleData] = useState([]);
    const [selectedId, setselectedId] = useState<any>('');
    const [proceedToPayModel, setProceedToPayModel] = useState<boolean>(false);
    const [paySlipModel, setPaySlipModel] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const months = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL",
        "MAY", "JUNE", "JULY", "AUGUST",
        "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1];

    const [isExportCSV, setIsExportCSV] = useState(false);

    const payrollColumns = [
        {
            header: 'Staff ID',
            accessorKey: 'staffId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <span className="text-primary">
                    {info.getValue()}
                </span>
            ),
        },
        {
            header: 'Name',
            accessorKey: 'firstName',
            enableColumnFilter: false,
        },
        {
            header: 'Role',
            accessorKey: 'employeeDetails.roleDetails.roleName',
            enableColumnFilter: false,
            cell: (info: any) => (
                <span className="text-indigo">
                    {info.getValue()}
                </span>
            ),
        },
        {
            header: 'Department',
            accessorKey: 'employeeDetails.departmentId',
            enableColumnFilter: false,
            cell: (info: any) => (
                <span className="text-pink">
                    {info.getValue()}
                </span>
            ),
        },
        {
            header: 'Designation',
            accessorKey: 'employeeDetails.designation',
            enableColumnFilter: false,
            cell: (info: any) => (
                <span className="text-purple">
                    {info.getValue()}
                </span>
            ),
        },
        {
            header: 'Phone',
            accessorKey: 'employeeDetails.phone',
            enableColumnFilter: false,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            enableColumnFilter: false,
            cell: (info: any) => {
                const status = info.getValue();
                return (
                    <span className={
                        status === "Paid"
                            ? "badge bg-success-subtle text-success"
                            : status === "Generated"
                                ? "badge bg-primary-subtle text-primary"
                                : "badge bg-danger-subtle text-danger"
                    }>
                        {status}
                    </span>

                );
            },
        },

        {
            header: 'Action',
            accessorKey: 'action',
            enableColumnFilter: false,
            cell: (info: any) => {
                const status = info.row.original.status;

                return (
                    <ul className="list-inline hstack gap-2 mb-0">
                        {status === 'Not Generated' && (
                            <li className="list-inline-item">
                                <Link
                                    className="edit-item-btn badge bg-primary-subtle text-primary py-2"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        generatePayroll(info.row.original)
                                    }}
                                    title="Generate Payroll"
                                >
                                    Generate Payroll
                                </Link>
                            </li>
                        )}
                        {status === 'Generated' && (
                            <li className="list-inline-item">
                                <Link
                                    className="edit-item-btn badge bg-warning-subtle text-warning py-2"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        proceedToPay(info.row.original)
                                    }}
                                    title="Proceed to Payment"
                                >
                                    Proceed to Payment
                                </Link>
                            </li>
                        )}
                        {status === 'Paid' && (
                            <li className="list-inline-item">
                                <Link
                                    className="edit-item-btn badge bg-success-subtle text-success py-2"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        viewPaySlip(info.row.original)
                                    }}
                                    title="View Payslip"
                                >
                                    View Payslip
                                </Link>
                            </li>
                        )}
                    </ul>
                );
            },
        },
    ];

    const getAllRole = async () => {
        try {
            let result = await employeeApiService.getAllRole();
            console.log("getAllRole", result);
            setRoleData(result);
        } catch (error: any) {
            console.log("getAllRole Error");
            console.log(error);
            return ErrorHandler(error)
        }
    }

    const getAllPayroll = async () => {
        try {
            setLoading(true);
            const url =
                (month ? `month=${month}` : '') +
                (year ? `${month ? '&' : ''}year=${year}` : '') +
                (role ? `${month || year ? '&' : ''}roleId=${role}` : '');

            let result = await employeeApiService.getAllPayroll(url);
            console.log("getAllPayroll", result);
            setPayRoleData(result);
        } catch (error: any) {
            console.log("getAllPayroll Error");
            console.log(error);
            return ErrorHandler(error)
        } finally {
            setLoading(false);
        }
    }

    const generatePayroll = (id: any) => {
        navigate('/main/generatePayroll', { state: { id: id, month: month, year: year } })
    }

    const proceedToPay = (id: any) => {
        setselectedId(id);
        handleProceedToPayClose();
    }

    const handleProceedToPayClose = () => {
        setProceedToPayModel(!proceedToPayModel);
        getAllPayroll();
    }

    const viewPaySlip = (id: any) => {
        setselectedId(id);
        handlePaySlipClose();
    }

    const handlePaySlipClose = () => {
        setPaySlipModel(!paySlipModel);
    }

    const handleSearch = () => {
        if (!year || !month) {
            toast.error('Please select both Year and Month', { containerId: 'TR' });
        } else {
            getAllPayroll();
        }
    };

    useEffect(() => {
        getAllRole();
    }, []);

    return (
        <React.Fragment>
            <div>
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={payRoleData}
                />

                <Container fluid>
                    <FormHeader title="Payroll List"
                        pageTitle="Human Resource"
                        onMinimize={() => dispatch(minimizePage({
                            route: location.pathname,
                            pageName: "Payroll List",
                        }))} />
                    <Row>
                        <Col lg={12}>
                            <Card id="payrollList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Payroll List</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                {/* <Button
                                                    color="primary"
                                                    onClick={() => navigate("/main/SalarySlipDataTable")}
                                                    className="btn btn-primary add-btn mx-2"
                                                >
                                                    <IoArrowBack /> Download Payroll
                                                </Button> */}
                                                <Button
                                                    color="primary"
                                                    onClick={() => navigate(-1)}
                                                    className="btn btn-primary add-btn mx-2"
                                                >
                                                    <IoArrowBack /> Back
                                                </Button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary mx-2"
                                                    onClick={() => setIsExportCSV(true)}
                                                >
                                                    <i className="ri-file-download-line align-bottom me-1"></i>
                                                    Export
                                                </button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Row className="align-items-center">
                                        <Col>
                                            <FormGroup>
                                                <Label for="role">Role</Label>
                                                <Input type="select"
                                                    id="role"
                                                    value={role}
                                                    onChange={e => setRole(e.target.value)}
                                                >
                                                    <option value="">Select Role</option>
                                                    {roleData.map((item: any, idx: any) => (
                                                        <option key={idx} value={item.roleId}>{item.roleName}</option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label for="month">Month</Label>
                                                <Input
                                                    type="select"
                                                    id="month"
                                                    value={month}
                                                    onChange={e => setMonth(e.target.value)}
                                                >
                                                    <option value="">Select Month</option>
                                                    {months.map((monthName, idx) => (
                                                        <option key={idx} value={monthName}>
                                                            {monthName}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label for="year">Year</Label>
                                                <Input
                                                    type="select"
                                                    id="year"
                                                    value={year}
                                                    onChange={e => setYear(e.target.value)}
                                                >
                                                    <option value="">Select Year</option>
                                                    {years.map((yearValue, idx) => (
                                                        <option key={idx} value={yearValue}>
                                                            {yearValue}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="auto">
                                            <Button onClick={handleSearch}>Search</Button>
                                        </Col>
                                    </Row>
                                    <div className="card-body pt-0">
                                        <div>
                                            <TableContainer
                                                columns={payrollColumns}
                                                data={payRoleData}
                                                isGlobalFilter={true}
                                                isCustomerFilter={true}
                                                customPageSize={5}
                                                tableClass="table table-bordered"
                                                theadClass="thead-light"
                                                divClass="table-responsive"
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal isOpen={proceedToPayModel} toggle={handleProceedToPayClose}
                backdrop={'static'} id="staticBackdrop" centered size='lg' scrollable
            >
                <ModalHeader toggle={handleProceedToPayClose} className="p-3 bg-info-subtle modal-title">
                    Proceed To Pay
                </ModalHeader>
                <ModalBody>
                    <ProceedToPay id={selectedId} handleClose={handleProceedToPayClose} />
                </ModalBody>
            </Modal>

            <Modal isOpen={paySlipModel} toggle={handlePaySlipClose}
                backdrop={'static'} id="staticBackdrop" centered size='xl' scrollable
            >
                <ModalHeader toggle={handlePaySlipClose} className="p-3 bg-info-subtle modal-title model-header-container">
                    Pay Slip
                    <PrintComponent contentId="opdBill" />
                </ModalHeader>
                <ModalBody id="opdBill">
                    <ViewPaySlip data={selectedId} handleClose={handlePaySlipClose} />
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default PayRoll;
