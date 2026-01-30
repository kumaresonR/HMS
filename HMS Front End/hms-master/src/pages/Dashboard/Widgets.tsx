import React, { useEffect, useState } from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from 'reactstrap';
import { RiStethoscopeLine, RiHospitalLine, RiMedicineBottleLine, RiMicroscopeLine, RiHeartPulseLine, RiDropLine, RiPlaneLine, RiMoneyDollarCircleLine, RiCoinLine } from "react-icons/ri";
import { MdCurrencyRupee } from "react-icons/md";
import { PiAmbulance } from "react-icons/pi";
import DashboardApiService from '../../helpers/services/dashboard/dashboard-api-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const Widgets = () => {
    const dashboardApiService: DashboardApiService = new DashboardApiService();
    const [opdData, setOpdData] = useState('');
    const [ipdData, setIpdData] = useState('');
    const [pathologyData, setPathologyData] = useState('');
    const [radiologyData, setRadiologyData] = useState('');
    const [pharmacyData, setPharmacyData] = useState('');
    const [bloodBankData, setBloodBankData] = useState('');
    const [ambulanceIncomeData, setAmbulanceIncomeData] = useState('');
    const [generalIncomeData, setGeneralIncomeData] = useState('');
    const [generalExpenceData, setGeneralExpenceData] = useState('');
    const [ipdPercentageChangeFromYesterday, setIpdPercentageChangeFromYesterday] = useState('');
    const [opdPercentageChangeFromYesterday, setOpdPercentageChangeFromYesterday] = useState('');
    const [pharmacyPercentageChangeFromYesterday, setPharmacyPercentageChangeFromYesterday] = useState('');
    const [radiologyPercentageChangeFromYesterday, setRadiologyPercentageChangeFromYesterday] = useState('');
    const [pathologyPercentageChangeFromYesterday, setPathologyPercentageChangeFromYesterday] = useState('');
    const [bloodBankPercentageChangeFromYesterday, setBloodBankPercentageChangeFromYesterday] = useState('');
    const [ambulancePercentageChangeFromYesterday, setAmbulancePercentageChangeFromYesterday] = useState('');
    const [generalPercentageChangeFromYesterday, setGeneralPercentageChangeFromYesterday] = useState('');
    const [expensePercentageChangeFromYesterday, setExpensePercentageChangeFromYesterday] = useState('');
    const [filter, setFilter] = useState("all-incomes");
    const [selectedName, setSelectedName] = useState("Today");

    const getBadgeDetails = (percentage: any) => {
        if (percentage === "No change") {
            return { badge: "-", badgeClass: "secondary" };
        }

        if (typeof percentage === "string") {
            if (percentage.startsWith("-")) {
                return { badge: "ri-arrow-right-down-line", badgeClass: "danger" };
            }
            if (percentage.startsWith("+")) {
                return { badge: "ri-arrow-right-up-line", badgeClass: "success" };
            }
        }
        return { badge: "ri-arrow-right-up-line", badgeClass: "success" };
    };

    const dashboardWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "OPD Income",
            ...getBadgeDetails(opdPercentageChangeFromYesterday),
            percentage: opdPercentageChangeFromYesterday,
            amount: opdData,
            link: "View details",
            icon: <RiStethoscopeLine />,
            iconColor: "rgb(10, 179, 156)",
            bgColor: "rgb(10, 179, 156)",
            decimals: 2,
            prefix: "₹",
            path: "/main/opd-income"
        },
        {
            id: 2,
            cardColor: "primary",
            label: "IPD Income",
            ...getBadgeDetails(ipdPercentageChangeFromYesterday),
            percentage: ipdPercentageChangeFromYesterday,
            amount: ipdData,
            link: "View details",
            icon: <RiHospitalLine />,
            iconColor: "rgb(64, 81, 137)",
            bgColor: "rgb(64, 81, 137)",
            decimals: 0,
            prefix: "₹",
            separator: ",",
            path: "/main/ipd-income"
        },
        {
            id: 3,
            cardColor: "success",
            label: "Pharmacy Income",
            ...getBadgeDetails(pharmacyPercentageChangeFromYesterday),
            percentage: pharmacyPercentageChangeFromYesterday,
            amount: pharmacyData,
            link: "View details",
            icon: <RiMedicineBottleLine />,
            iconColor: "rgb(41, 156, 219)",
            bgColor: "rgb(41, 156, 219)",
            decimals: 2,
            prefix: "₹",
            path: "/main/pharmacy-income"
        },
        {
            id: 4,
            cardColor: "info",
            label: "Pathology Income",
            ...getBadgeDetails(ambulancePercentageChangeFromYesterday),
            percentage: pathologyPercentageChangeFromYesterday,
            amount: pathologyData,
            link: "View details",
            icon: <RiMicroscopeLine />,
            iconColor: "rgb(240, 101, 72)",
            bgColor: "rgb(240, 101, 72)",
            decimals: 2,
            prefix: "₹",
            path: "/main/pathology-income"
        },
        {
            id: 5,
            cardColor: "primary",
            label: "Radiology Income",
            ...getBadgeDetails(radiologyPercentageChangeFromYesterday),
            percentage: radiologyPercentageChangeFromYesterday,
            amount: radiologyData,
            link: "View details",
            icon: <RiHeartPulseLine />,
            iconColor: "rgb(247, 184, 75)",
            bgColor: "rgb(247, 184, 75)",
            decimals: 2,
            prefix: "₹",
            path: "/main/radiology-income"
        },
        {
            id: 6,
            cardColor: "secondary",
            label: "Blood Bank Income",
            ...getBadgeDetails(bloodBankPercentageChangeFromYesterday),
            percentage: bloodBankPercentageChangeFromYesterday,
            amount: bloodBankData,
            link: "View details",
            icon: <RiDropLine />,
            iconColor: "rgb(64, 81, 137)",
            bgColor: "rgb(64, 81, 137)",
            decimals: 0,
            prefix: "₹",
            separator: ",",
            path: "/main/bloodbank-income"
        },
        {
            id: 7,
            cardColor: "success",
            label: "Ambulance Income",
            ...getBadgeDetails(ambulancePercentageChangeFromYesterday),
            percentage: ambulancePercentageChangeFromYesterday,
            amount: ambulanceIncomeData,
            link: "View details",
            icon: <PiAmbulance />,
            iconColor: "rgb(10, 179, 156)",
            bgColor: "rgb(10, 179, 156)",
            decimals: 2,
            prefix: "₹",
            path: "/main/ambulance-income"
        },
        {
            id: 8,
            cardColor: "primary",
            label: "Total Expenses",
            ...getBadgeDetails(ambulancePercentageChangeFromYesterday),
            percentage: generalPercentageChangeFromYesterday,
            amount: generalExpenceData,
            link: "View details",
            icon: <MdCurrencyRupee />,
            iconColor: "rgb(255, 87, 34)",
            bgColor: "rgb(255, 87, 34)",
            decimals: 2,
            prefix: "₹",
            path: "/main/view-total-income"
        }

    ];
    const handleFilterChange = (filterKey: string) => {
        const filterMap: { [key: string]: string } = {
            "all-incomes": "Today",
            "all-weekly-incomes": "Weekly",
            "all-monthly-incomes": "Monthly",
            "all-yearly-incomes": "Yearly",
        };
        setFilter(filterKey);
        setSelectedName(filterMap[filterKey])
        getAllData(filterKey)
    };


    const getAllData = async (selectedFilter: any) => {
        try {
            let url = selectedFilter
            let data = await dashboardApiService.getAllIncome(url);
            setOpdData(data.opdIncome);
            setOpdPercentageChangeFromYesterday(
                data.opdPercentageChangeFromYesterday ??
                data.opdPercentageChangeFromWeekly ??
                data.opdPercentageChangeFromMonthly ??
                data.opdPercentageChangeFromYearly ??
                ''
            );

            setIpdPercentageChangeFromYesterday(
                data.ipdPercentageChangeFromYesterday ??
                data.ipdPercentageChangeFromWeekly ??
                data.ipdPercentageChangeFromMonthly ??
                data.ipdPercentageChangeFromYearly ??
                ''
            )
            setIpdData(data.ipdIncome);
            setPathologyData(data.pathologyIncome);
            setPathologyPercentageChangeFromYesterday(
                data.pathologyPercentageChangeFromYesterday ??
                data.pathologyPercentageChangeFromWeekly ??
                data.pathologyPercentageChangeFromMonthly ??
                data.pathologyPercentageChangeFromYearly ??
                ''
            );
            setRadiologyData(data.radiologyIncome);
            setRadiologyPercentageChangeFromYesterday(
                data.radiologyPercentageChangeFromYesterday ??
                data.radiologyPercentageChangeFromWeekly ??
                data.radiologyPercentageChangeFromMonthly ??
                data.radiologyPercentageChangeFromYearly ?? ''
            );
            setPharmacyData(data.pharmacyIncome);
            setPharmacyPercentageChangeFromYesterday(
                data.pharmacyPercentageChangeFromYesterday ??
                data.pharmacyPercentageChangeFromWeekly ??
                data.pharmacyPercentageChangeFromMonthly ??
                data.pharmacyPercentageChangeFromYearly ?? ''
            );
            setBloodBankData(data.bloodBankIncome);
            setBloodBankPercentageChangeFromYesterday(
                data.bloodBankPercentageChangeFromYesterday ?? 
                data.bloodBankPercentageChangeFromWeekly ??
                data.bloodBankPercentageChangeFromMonthly ??
                data.bloodBankPercentageChangeFromYearly ?? ''
            );
            setAmbulanceIncomeData(data.ambulanceIncome);
            setAmbulancePercentageChangeFromYesterday(
                data.ambulancePercentageChangeFromYesterday ??
                data.ambulancePercentageChangeFromWeekly ??
                data.ambulancePercentageChangeFromMonthly ??
                data.ambulancePercentageChangeFromYearly ?? ''
            );
            setGeneralIncomeData(data.generalIncome);
            setGeneralPercentageChangeFromYesterday(
                data.generalPercentageChangeFromYesterday ?? 
                data.generalPercentageChangeFromWeekly ??
                data.generalPercentageChangeFromMonthly ??
                data.generalPercentageChangeFromYearly ?? ''
            );
            setGeneralExpenceData(data.expense);
            setExpensePercentageChangeFromYesterday(
                data.expensePercentageChangeFromYesterday ??
                data.expensePercentageChangeFromWeekly ??
                data.expensePercentageChangeFromMonthly ??
                data.expensePercentageChangeFromYearly ?? ''
            )
            // setAppointmentData(result);
        } catch (error: any) {
            console.log("getAllData Error");
            console.log(error);
        }
    }

    useEffect(() => {
        getAllData(filter);
    }, []);

    return (
        <React.Fragment>
            <div className="text-end">
                <UncontrolledDropdown className="card-header-dropdown pb-4">
                    <DropdownToggle tag="a" className="text-reset dropdown-btn" role="button">
                        <span className="text-muted">
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

            {dashboardWidgets.map((item: any, key) => (
                <Col xl={3} md={6} key={key}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                                        {item.badge ? <i className={"fs-13 align-middle " + item.badge}></i> : null} {item.percentage}
                                    </h5>
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-22 fw-semibold ff-secondary mb-4"><span className="amount-value" data-target="559.25">
                                        <CountUp
                                            start={0}
                                            prefix={item.prefix}
                                            separator={item.separator}
                                            end={item.amount}
                                            decimals={item.decimals}
                                            duration={4}
                                        />
                                    </span></h4>
                                    <Link to={item.path} className="text-decoration-underline">{item.link}</Link>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span
                                        className="avatar-tile rounded fs-3"
                                        style={{
                                            alignItems: 'center',

                                            backgroundColor: `${item.bgColor.replace("rgb", "rgba").slice(0, -1)}, 0.1)`,
                                            color: '#fff',
                                            display: 'flex',
                                            fontWeight: '500',
                                            height: '100%',
                                            justifyContent: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        <span style={{ color: item.iconColor }}>{item.icon}</span>
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>))}
        </React.Fragment>
    );
};

export default Widgets;
