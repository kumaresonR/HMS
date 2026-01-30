import { faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row, Table } from 'reactstrap'
import EmployeeApiService from '../../helpers/services/employee/EmployeeApiService';
import ErrorHandler from '../../helpers/ErrorHandler';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';
import userImg from '../../assets/images/user.jpg';

const GeneratePayroll = () => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    let navigate: any = useNavigate();

    const { state } = useLocation();

    const id = state?.id.employeeId;
    const staffId = state?.id.staffId;
    const month = state?.month;
    const year = state?.year;
    const currentMonth = moment().format('MMMM');
    const [earning, setEarning] = useState<any[]>([]);
    const [deduction, setDeduction] = useState<any[]>([]);
    const [basicSalary, setBasicSalary] = useState<number>();
    const [totalEarnings, setTotalEarnings] = useState<number>();
    const [totalDeduction, setTotalDeduction] = useState<number>();
    const [grossSalary, setGrossSalary] = useState<number>();
    const [taxPercentage, setTaxPercentage] = useState<number>();
    const [totalTax, setTotalTax] = useState<number>();
    const [netSalary, setNetSalary] = useState<number>();
    const [employeeData, setEmployeeData] = useState<any>('');
    const [filteredAttendance, setFilteredAttendance] = useState<any>([]);
    const [basicSalaryValidationError, setBasicSalaryValidationError] = useState(false);
    const [netSalaryValidationError, setNetSalaryValidationError] = useState<any>('');

    const addEarning = () => {
        setEarning([...earning, { type: '', amount: '' }]);
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        const newEarning = [...earning];
        const parsedValue = field === 'amount' ? parseFloat(value) || 0 : value;  // Default to 0 if it's not a valid number
        newEarning[index] = {
            ...newEarning[index],
            [field]: parsedValue,
        };
        setEarning(newEarning);
        calculateTotalEarnings(newEarning);
    };

    const calculateTotalEarnings = (earnings: { type: string; amount: number }[]) => {
        const total = earnings.reduce((acc, earning) => acc + earning.amount, 0);
        setTotalEarnings(total);
    };


    const removeEarning = (index: any) => {
        const newEarning = [...earning];
        newEarning.splice(index, 1);
        setEarning(newEarning);
        calculateTotalEarnings(newEarning);
    };

    const addDeduction = () => {
        setDeduction([...deduction, { type: '', amount: '' }]);
    };

    const handleDeductionChange = (index: number, field: string, value: string) => {
        const newDeduction = [...deduction];
        const parsedValue = field === 'amount' ? parseFloat(value) || 0 : value; // Default to 0 if invalid
        newDeduction[index] = {
            ...newDeduction[index],
            [field]: parsedValue,
        };
        setDeduction(newDeduction);
        calculateTotalDeduction(newDeduction);
    };

    const calculateTotalDeduction = (deductions: { type: string; amount: number }[]) => {
        const total = deductions.reduce((acc, deduction) => acc + (deduction.amount || 0), 0);
        setTotalDeduction(total);
    };


    const removeDeduction = (index: any) => {
        const newDeduction = [...deduction];
        newDeduction.splice(index, 1);
        setDeduction(newDeduction);
        calculateTotalDeduction(newDeduction);
    };

    const getPayrollByEmployeeId = async () => {
        try {
            let result = await employeeApiService.getPayrollByEmployeeId(id);
            setEmployeeData(result);

            const filterLastThreeMonths = (attendanceData: any[]) => {
                const currentDate = new Date();
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

                return attendanceData.filter((record) => {
                    const attendanceDate = new Date(record.attendanceDate);
                    return attendanceDate >= threeMonthsAgo && attendanceDate <= currentDate;
                });
            };

            const filteredAttendance = filterLastThreeMonths(result.hmsTmAttendanceLeave);
            setFilteredAttendance(filteredAttendance);

        } catch (error: any) {
            console.log(error);
            return ErrorHandler(error);
        }
    };

    const countAttendanceTypes = (attendanceData: any[]) => {
        const groupedByMonth: { [key: string]: any } = {};

        attendanceData.forEach((record) => {
            const month = record.month;

            // Initialize month if not already
            if (!groupedByMonth[month]) {
                groupedByMonth[month] = {
                    PRESENT: 0,
                    LATE: 0,
                    ABSENT: 0,
                    HALF_DAY: 0,
                    SECOND_SHIFT: 0,
                    HOLIDAY: 0,
                    APPROVED_LEAVE: 0
                };
            }

            // Increment the count based on staffAttendance
            switch (record.staffAttendance) {
                case 'Present':
                    groupedByMonth[month].PRESENT++;
                    break;
                case 'Late':
                    groupedByMonth[month].LATE++;
                    break;
                case 'Absent':
                    groupedByMonth[month].ABSENT++;
                    break;
                case 'Half Day':
                    groupedByMonth[month].HALF_DAY++;
                    break;
                case 'Second Half':
                    groupedByMonth[month].SECOND_SHIFT++;
                    break;
                case 'Holiday':
                    groupedByMonth[month].HOLIDAY++;
                    break;
                case 'APPROVED LEAVE':
                    groupedByMonth[month].APPROVED_LEAVE++;
                    break;
                default:
                    break;
            }
        });

        return Object.entries(groupedByMonth).map(([month, counts]) => ({
            month,
            ...counts
        }));
    };

    const aggregatedAttendance = countAttendanceTypes(filteredAttendance);

    const handleBasicSalaryChange = (value: string) => {
        const parsedValue = parseFloat(value) || 0; 
        setBasicSalary(parsedValue);
        setBasicSalaryValidationError(false);
        calculateGrossSalary(parsedValue, totalEarnings, totalDeduction); 
    };
    
    const handleTaxPercentageChange = (value: string) => {
        const parsedValue = parseFloat(value) || 0; 
        setTaxPercentage(parsedValue);
        calculateTax(grossSalary, parsedValue);
    };
    
    const calculateGrossSalary = (basicSalaryValue = basicSalary, earningsValue = totalEarnings, deductionsValue = totalDeduction) => {
        const gross = (basicSalaryValue || 0) + (earningsValue || 0) - (deductionsValue || 0);
        setGrossSalary(gross);
        calculateTax(gross, taxPercentage);
    };
    
    const calculateTax = (grossValue = grossSalary, taxPercentValue = taxPercentage) => {
        const taxAmount = ((grossValue || 0) * (taxPercentValue || 0)) / 100;
        setTotalTax(taxAmount);
        calculateNetSalary(grossValue, taxAmount); 
    };
    
    const calculateNetSalary = (grossValue = grossSalary, taxValue = totalTax) => {
        const net = (grossValue || 0) - (taxValue || 0);
        setNetSalary(net);
    };
    

    const handleSubmit = () => {
        if (validateForm()) {
            generatePayroll();
        }
    }

    const validateForm = () => {
        let isFormValid = true;

        if (!basicSalary) {
            setBasicSalaryValidationError(true);
            isFormValid = false;
        }

        return isFormValid;
    };

    const generatePayroll = async () => {
        try {
            const payload: any = {
                employeeId: id,
                basicSalary: basicSalary,
                taxPercentage: taxPercentage,
                tax: totalTax,
                netSalary: netSalary,
                earnings: earning,
                deductions: deduction,
                grossSalary: grossSalary,
                totalDeductions: totalDeduction,
                totalEarnings: totalEarnings,
                year : year, 
                month : month
            };
            await employeeApiService.generatePayroll(payload);
            navigate('/main/payroll-list');
            toast.success('Payroll Generated Successfully', { containerId: 'TR' });
        } catch (error: any) {
            return ErrorHandler(error)
        }
    }

    useEffect(() => {
        calculateTax();
    }, [grossSalary, taxPercentage]);

    useEffect(() => {
        calculateNetSalary();
    }, [grossSalary, totalTax]);

    useEffect(() => {
        addEarning();
        addDeduction();
        getPayrollByEmployeeId();
    }, []);

    useEffect(() => {
        calculateGrossSalary();
    }, [basicSalary, totalEarnings, totalDeduction]);

    return (
        <React.Fragment>
            <Container>
                <Card>
                    <CardHeader className='d-flex justify-content-between'>
                        <h4>Generate Payroll for : {month} - {year}</h4>
                        <Button
                            color="primary"
                            onClick={() => navigate(-1)}
                            className="btn btn-primary add-btn mx-2"
                        >
                            <IoArrowBack /> Back
                        </Button>
                    </CardHeader>
                    <CardBody>
                        <Row className='mb-3'>
                            <Col md={12} className='mb-3'>
                                <Row>
                                    <Col xs="auto">
                                        <img src={userImg} width={150} alt="user" />
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col md="6">
                                                <Row className='mb-3'>
                                                    <Col><b>Name</b></Col>
                                                    <Col>{employeeData.fullName}</Col>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Col><b>Phone</b></Col>
                                                    <Col>{employeeData.phoneNumber}</Col>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Col><b>EPF No</b></Col>
                                                    <Col>{employeeData.epfNumber || 'NA'}</Col>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Col><b>Department</b></Col>
                                                    <Col>{employeeData.departmentName || 'NA'}</Col>
                                                </Row>
                                            </Col>
                                            <Col md="6">
                                                <Row className='mb-3'>
                                                    <Col><b>Staff Id</b></Col>
                                                    <Col>{staffId || 'NA'}</Col>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Col><b>Email</b></Col>
                                                    <Col>{employeeData.email || 'NA'}</Col>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Col><b>Role</b></Col>
                                                    <Col>{employeeData.roleName}</Col>
                                                </Row>
                                                <Row className='mb-3'>
                                                    <Col><b>Designation</b></Col>
                                                    <Col>{employeeData.designation}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={9}>
                                <div className="table-responsive">
                                    <Table hover className="table-centered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Month</th>
                                                <th>P</th>
                                                <th>L</th>
                                                <th>A</th>
                                                <th>F</th>
                                                <th>H</th>
                                                <th>SH</th>
                                                <th>V</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {aggregatedAttendance && aggregatedAttendance.length > 0 ? (
                                                aggregatedAttendance.map((data: any, index: any) => (
                                                    <tr key={index}>
                                                        <td>{data.month}</td>
                                                        <td>{data.PRESENT}</td>
                                                        <td>{data.LATE}</td>
                                                        <td>{data.ABSENT}</td>
                                                        <td>{data.HALF_DAY}</td>
                                                        <td>{data.HOLIDAY}</td>
                                                        <td>{data.SECOND_SHIFT}</td>
                                                        <td>{data.APPROVED_LEAVE}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center">
                                                        No attendance records available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                            <Col>
                                <h6>P - Present</h6>
                                <h6>L - Late</h6>
                                <h6>A - Absent</h6>
                                <h6>FH - Half Day</h6>
                                <h6>H - Holiday</h6>
                                <h6>SH - Second Half</h6>
                                <h6>V - Approved Leave</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='d-flex justify-content-between'>
                                    <h5>Earning</h5>
                                    <Button color="primary" onClick={addEarning} className="mx-3">
                                        <FontAwesomeIcon icon={faCirclePlus} /></Button>
                                </div>
                                <div>
                                    {earning.map((earning: any, index: any) => (
                                        <Row key={index} className="align-items-center">
                                            <Col >
                                                <FormGroup>
                                                    {index === 0 && <label className="text-start">Type</label>}
                                                    <Input
                                                        id="type"
                                                        name="type"
                                                        type="text"
                                                        value={earning.type}
                                                        onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col >
                                                <FormGroup>
                                                    {index === 0 && <label className="text-start">Amount</label>}
                                                    <Input
                                                        id="Amount"
                                                        name="Amount"
                                                        type="text"
                                                        value={earning.amount}
                                                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col xs="3">
                                                {index !== 0 && (
                                                    <button onClick={() => removeEarning(index)} className="btn mb-3 btn-soft-danger">
                                                        <FontAwesomeIcon
                                                            className="mx-2"
                                                            icon={faXmark}
                                                        />
                                                    </button>
                                                )}
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            </Col>
                            <Col>
                                <div className='d-flex justify-content-between'>
                                    <h5>Deduction</h5>
                                    <Button color="primary" onClick={addDeduction} className="mx-3">
                                        <FontAwesomeIcon icon={faCirclePlus} /></Button>
                                </div>
                                <div>
                                    {deduction.map((deduction: any, index: any) => (
                                        <Row key={index} className="align-items-center">
                                            <Col >
                                                <FormGroup>
                                                    {index === 0 && <label className="text-start">Type</label>}
                                                    <Input
                                                        id="type"
                                                        name="type"
                                                        type="text"
                                                        value={deduction.type}
                                                        onChange={(e) => handleDeductionChange(index, 'type', e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col >
                                                <FormGroup>
                                                    {index === 0 && <label className="text-start">Amount</label>}
                                                    <Input
                                                        id="Amount"
                                                        name="Amount"
                                                        type="text"
                                                        value={deduction.amount}
                                                        onChange={(e) => handleDeductionChange(index, 'amount', e.target.value)}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col xs="3">
                                                {index !== 0 && (
                                                    <button onClick={() => removeDeduction(index)} className="btn mb-3 btn-soft-danger">
                                                        <FontAwesomeIcon
                                                            className="mx-2"
                                                            icon={faXmark}
                                                        />
                                                    </button>
                                                )}
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            </Col>
                            <Col>
                                <div className='d-flex justify-content-between'>
                                    <h5>Payroll Summary</h5>
                                </div>
                                <div>
                                    <FormGroup>
                                        <label className="text-start mb-2">Basic Salary</label>
                                        <Input
                                            id="type"
                                            name="type"
                                            type="text"
                                            value={basicSalary}
                                            invalid={!!basicSalaryValidationError}
                                            onChange={(e) => handleBasicSalaryChange(e.target.value)}
                                        />
                                        {basicSalaryValidationError && <div className="invalid-feedback">Basic Salary Required</div>}
                                    </FormGroup>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <label className="text-start mb-2">Earning</label>
                                                <Input
                                                    id="type"
                                                    name="type"
                                                    type="text"
                                                    disabled
                                                    value={totalEarnings}
                                                    onChange={(e: any) => setTotalEarnings(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <label className="text-start mb-2">Deduction</label>
                                                <Input
                                                    id="type"
                                                    name="type"
                                                    type="text"
                                                    disabled
                                                    value={totalDeduction}
                                                    onChange={(e: any) => setTotalDeduction(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <FormGroup>
                                        <label className="text-start mb-2">Gross Salary</label>
                                        <Input
                                            id="type"
                                            name="type"
                                            type="text"
                                            disabled
                                            value={grossSalary}
                                            onChange={(e: any) => setGrossSalary(e.target.value)}
                                        />
                                    </FormGroup>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <label className="text-start mb-2">Tax(%)</label>
                                                <Input
                                                    id="type"
                                                    name="type"
                                                    type="text"
                                                    value={taxPercentage}
                                                    onChange={(e: any) => handleTaxPercentageChange(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <label className="text-start mb-2">Tax</label>
                                                <Input
                                                    id="type"
                                                    name="type"
                                                    type="text"
                                                    value={totalTax}
                                                    disabled
                                                    onChange={(e: any) => setTotalTax(e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <FormGroup>
                                        <label className="text-start mb-2">Net Salary</label>
                                        <Input
                                            id="type"
                                            name="type"
                                            type="text"
                                            disabled
                                            value={netSalary}
                                            onChange={(e: any) => setNetSalary(e.target.value)}
                                        />
                                    </FormGroup>
                                </div>
                                <div className='text-end'>
                                    <Button onClick={handleSubmit}>Save</Button>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </React.Fragment>
    )
}

export default GeneratePayroll