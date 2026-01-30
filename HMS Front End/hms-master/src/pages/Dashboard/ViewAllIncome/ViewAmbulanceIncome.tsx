import React, { useEffect, useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Row, Table, UncontrolledDropdown } from "reactstrap"
import FormHeader from "../../../common/FormHeader/FormHeader"
import moment from "moment"
import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DashboardApiService from "../../../helpers/services/dashboard/dashboard-api-service"
import { minimizePage } from "../../../slices/pageResizer/uiSlice"
import { useDispatch } from "react-redux"

const ViewAmbulanceIncome = () => {
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
            "all-weekly-incomes": "weekly",
            "all-monthly-incomes": "monthly",
            "all-yearly-incomes": "yearly",
        };
        setFilter(filterKey);
        setSelectedName(incomeFilterMap[filterKey])
        getAllIncome(incomeFilterMap[filterKey]);
    };

    const getAllIncome = async (selectedFilter: any) => {
        try {
            let url = selectedFilter
            let ipdIncome = await dashboardApiService.getAllAmbulanceIncome(url);
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
                    title="AMBULANCE INCOME"
                    pageTitle="Billing"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "AMBULANCE INCOME",
                    }))} />
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader className="border-0 align-items-center d-flex flex-wrap justify-content-between">
                                <h4 className="card-title mb-0">AMBULANCE INCOME</h4>
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
                                                <th>Date</th>
                                                <th>Payment Mode</th>
                                                <th>Amount (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.map((data: any, idx: any) => (
                                                <tr key={idx}>
                                                    <td>{moment(data?.date).format('DD/MM/YYYY') || 'NA'}</td>
                                                    <td className="text-nowrap">{data.paymentMode || 'NA'} </td>
                                                    <td className="text-primary">{data?.paymentAmount || 'NA'} </td>
                                                </tr>
                                            ))}
                                            <tr className="table-light">
                                                <td colSpan={2}><b>Total:</b></td>
                                                <td className="text-primary"><b>
                                                    {data?.reduce((total: number, item: any) => total + (parseFloat(item.paymentAmount) || 0), 0).toFixed(2)}
                                                </b></td>
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

export default ViewAmbulanceIncome