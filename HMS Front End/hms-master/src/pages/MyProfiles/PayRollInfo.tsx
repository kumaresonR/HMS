import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Row,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
} from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import "react-toastify/dist/ReactToastify.css";
import { PayrollDataWidgets } from '../../common/data/PayrollDataWidgets'
import CountUp from "react-countup";
import './myProfile.css';
import ViewPaySlip from "../HumanResource/ViewPaySlip";
import PrintComponent from "../../Components/Common/PrintComponent";
import EmployeeApiService from "../../helpers/services/employee/EmployeeApiService";
import ErrorHandler from "../../helpers/ErrorHandler";
import { FaHandHoldingUsd } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { MdCurrencyRupee } from "react-icons/md";
import { RiArrowDownSLine } from "react-icons/ri";

const PayrollInfo = (props: any) => {
    const employeeApiService: EmployeeApiService = new EmployeeApiService();

    const data = props?.data?.payrollDetails
    const [selectedId, setselectedId] = useState<any>('');
    const [paySlipModel, setPaySlipModel] = useState<boolean>(false);
    const payrollData = props.payrollData || {};

    const PayrollDataWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Total Net Salary Paid",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+16.24",
            counter: payrollData?.totalNetSalary || 0,
            link: "See details",
            bgcolor: "secondary",
            icon: MdCurrencyRupee, 
            decimals: 0,
            prefix: "₹",
            suffix: ""
        },
        {
            id: 2,
            cardColor: "secondary",
            label: "Total Gross Salary",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+10.50",
            counter: payrollData?.totalGrossSalary || 0,
            link: "See details",
            bgcolor: "secondary",
            icon: GiMoneyStack, 
            decimals: 0,
            prefix: "₹",
            suffix: ""
        },
        {
            id: 3,
            cardColor: "success",
            label: "Total Earning",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+20.15",
            counter: payrollData?.totalEarnings || 0,
            link: "See details",
            bgcolor: "secondary",
            icon: FaHandHoldingUsd, 
            decimals: 0,
            prefix: "₹",
            suffix: ""
        },
        {
            id: 4,
            cardColor: "info",
            label: "Total Deduction",
            badge: "ri-arrow-right-down-line",
            badgeClass: "danger",
            percentage: "-5.87",
            counter: payrollData?.totalDeductions || 0,
            link: "See details",
            bgcolor: "secondary",
            icon: RiArrowDownSLine, 
            decimals: 0,
            prefix: "₹",
            suffix: ""
        }
    ];

    const payrollColumns = [
        // {
        //     header: "Payslip",
        //     accessorKey: "payslip",
        //     enableColumnFilter: false
        // },
        {
            header: "Month - Year",
            accessorKey: "month",
            enableColumnFilter: false
        },
        {
            header: "Date",
            accessorKey: "payrollDate",
            enableColumnFilter: false
        },
        {
            header: "Mode",
            accessorKey: "paymentMode",
            enableColumnFilter: false
        },
        {
            header: "Status",
            accessorKey: "status",
            enableColumnFilter: false,
            cell: ({ cell }: { cell: any }) => {
                const status = cell.getValue();
                let badgeClass = "";

                if (status === "Paid") {
                    badgeClass = "bg-success";
                } else if (status === "Not Generated") {
                    badgeClass = "bg-danger";
                } else {
                    badgeClass = "bg-purple";
                }

                return (
                    <span className={`badge ${badgeClass}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            header: "Net Salary (₹)",
            accessorKey: "netSalary",
            enableColumnFilter: false
        },
        {
            header: "Action",
            accessorKey: "action",
            cell: (info: any) => (
                <Button color="primary" size="sm" onClick={e => viewPaySlip(info.row.original)}>
                    View Payslip
                </Button>
            ),
            enableColumnFilter: false
        },
    ];

    const viewPaySlip = (id: any) => {
        setselectedId(id);
        handlePaySlipClose();
    }

    const handlePaySlipClose = () => {
        setPaySlipModel(!paySlipModel);
    }

    return (
        <React.Fragment>
            <Card className="myProfile">
                <CardBody >
                    <div>
                        <h5 className="card-title mb-4">Payroll Information</h5>
                        <Row>

                            {PayrollDataWidgets.map((item: any, key: number) => (
                                <Col xl={3} md={6} className="col" key={key}>
                                    <Card className="card-animate">
                                        <CardBody>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-end justify-content-between mt-4">
                                                <div>
                                                    <h4 className="fs-20 fw-semibold ff-secondary mb-4">
                                                        <span className="counter-value" data-target="559.25">
                                                            <CountUp
                                                                start={0}
                                                                prefix="₹"
                                                                separator={item.separator}
                                                                end={item.counter}
                                                                decimals={item.decimals}
                                                                duration={4}
                                                            />
                                                        </span>
                                                    </h4>
                                                </div>
                                                <div className="avatar-sm icon_highlight flex-shrink-0">
                                                    <span className={`avatar-title rounded fs-3 `}>
                                                        <i className={`text-${item.bgcolor}`}>
                                                            <item.icon />
                                                        </i>
                                                    </span>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        {data && data.length > 0 ? (
                                            <TableContainer
                                                columns={payrollColumns}
                                                data={data}
                                                isGlobalFilter={true}
                                                isCustomerFilter={true}
                                                customPageSize={5}
                                                tableClass="table table-bordered"
                                                theadClass="thead-light"
                                                divClass="table-responsive"
                                            />
                                        ) : (
                                            <div className="text-center mt-3">
                                                <h5>No payroll details available.</h5>
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>

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

export default PayrollInfo;
