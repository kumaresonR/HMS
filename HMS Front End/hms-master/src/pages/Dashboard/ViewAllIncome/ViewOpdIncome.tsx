import moment from "moment";
import React, { useEffect, useState } from "react"
import { IoArrowBack } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, Table, UncontrolledDropdown } from "reactstrap";
import FormHeader from "../../../common/FormHeader/FormHeader";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardApiService from "../../../helpers/services/dashboard/dashboard-api-service";
import { useDispatch } from "react-redux";
import { minimizePage } from "../../../slices/pageResizer/uiSlice";

const ViewOpdIncome = () => {
    const dashboardApiService: DashboardApiService = new DashboardApiService();
    let navigate: any = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [selectedName, setSelectedName] = useState("Today");
    const [filter, setFilter] = useState("all-incomes");
    const [data, setData] = useState([]);

    const handleFilterChange = (filterKey: string) => {
        const incomeFilterMap: { [key: string]: string } = {
            "all-incomes": "today",
            "all-weekly-incomes": "week",
            "all-monthly-incomes": "month",
            "all-yearly-incomes": "year",
        };
        setFilter(filterKey);
        setSelectedName(incomeFilterMap[filterKey])
        getAllIncome(incomeFilterMap[filterKey]);
    };

    const getAllIncome = async (selectedFilter: any) => {
        try {
            let url = selectedFilter
            let ipdIncome = await dashboardApiService.getAllOPDIncome(url);
            setData(ipdIncome)
        } catch (error: any) {
            console.log(error);
            setData([])
        }
    }

    useEffect(() => {
        getAllIncome("today")
    }, []);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader
                    title="OPD INCOME"
                    pageTitle="Billing"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "OPD INCOME",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">OPD INCOME</h4>
                                <Button color="light" className="bg-gradient backBtn" onClick={() => navigate(-1)}>
                                    <IoArrowBack />
                                </Button>
                            </CardHeader>

                            <CardBody>
                                <div className="text-end">
                                    <UncontrolledDropdown className="card-header-dropdown pb-4">
                                        <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                                            <span className="text-muted" style={{ textTransform: "capitalize" }}>
                                                <FontAwesomeIcon icon={faFilter} /> Filter By: {selectedName} <i className="mdi mdi-chevron-down ms-1"></i>
                                            </span>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-end">
                                            <DropdownItem onClick={() => handleFilterChange("all-incomes")}>Today</DropdownItem>
                                            <DropdownItem onClick={() => handleFilterChange("all-weekly-incomes")}>Weekly</DropdownItem>
                                            <DropdownItem onClick={() => handleFilterChange("all-monthly-incomes")}>Monthly</DropdownItem>
                                            <DropdownItem onClick={() => handleFilterChange("all-yearly-incomes")}>Yearly</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                <div className="table-responsive">
                                    <Table hover className="table-centered table-bordered align-middle table-nowrap mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>OPD ID</th>
                                                <th>Date</th>
                                                <th>Transaction Id</th>
                                                <th>Payment Mode</th>
                                                <th>Note</th>
                                                <th>Amount (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.map((data: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td className="text-primary">{data.opdId || 'NA'}</td>
                                                    <td>{moment(data?.date).format('DD/MM/YYYY') || 'NA'}</td>
                                                    <td>{data?.transactionId || 'NA'}</td>
                                                    <td className="text-nowrap">{data.paymentMode || 'NA'} </td>
                                                    <td>{data?.note || 'NA'} </td>
                                                    <td className="text-primary">{data?.amount || 'NA'} </td>
                                                </tr>
                                            ))}
                                            <tr className="table-light">
                                                <td colSpan={5}></td>
                                                <td colSpan={2}><b>
                                                    Total :  {data?.reduce((total: any, item: any) => total + item.amount, 0).toFixed(2) || "0.00"}</b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    {/* <Paginator
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        pageSize={pageSize}
                                        handlePageSizeChange={handlePageSizeChange}
                                        handlePrevious={handlePrevious}
                                        handleNext={handleNext}
                                        disableNext={data.length === 0}
                                    /> */}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default ViewOpdIncome