import React, { useEffect, useState } from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
import { RiStethoscopeLine, RiHospitalLine, RiMedicineBottleLine, RiMicroscopeLine, RiHeartPulseLine, RiDropLine, RiPlaneLine, RiMoneyDollarCircleLine, RiCoinLine, RiCheckboxCircleFill, RiDeleteBinLine, RiFolderLine, RiMedalLine, RiCheckboxBlankCircleLine } from "react-icons/ri";
import DashboardApiService from '../../../helpers/services/dashboard/dashboard-api-service';

const Widgets = () => {
    const dashboardApiService: DashboardApiService = new DashboardApiService();

    const [pharmacyIncome, setPharmacyIncome] = useState('');
    const [pharmacyPercentageChangeFromYesterday, setPharmacyIncomePercentageChangeFromYesterday] = useState('');
    const [medicinePurchase, setMedicinePurchase] = useState('');
    const [purchasePercentageChangeFromYesterday, setPurchasePercentageChangeFromYesterdayData] = useState('');
    const [totalBadStock, setTotalBadStockData] = useState('');
    const [totalMedicineStock, setTotalMedicineStock] = useState('');

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

    const pharmacyWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Pharmacy Income",
            ...getBadgeDetails(pharmacyPercentageChangeFromYesterday),
            percentage: pharmacyPercentageChangeFromYesterday,
            counter: pharmacyIncome,
            link: "View details",
            icon: <RiMedicineBottleLine />,
            iconColor: "rgb(10, 179, 156)",
            bgColor: "rgb(10, 179, 156)",
            decimals: 2,
            prefix: "₹",
            path : "/main/pharmacy-datatable"
        },
        {
            id: 2,
            cardColor: "secondary",
            label: "Medicine Purchase",
            ...getBadgeDetails(purchasePercentageChangeFromYesterday),
            percentage: purchasePercentageChangeFromYesterday,
            counter: medicinePurchase,
            link: "View details",
            icon: <RiStethoscopeLine />,
            iconColor: "rgb(64, 81, 137)",
            bgColor: "rgb(64, 81, 137)",
            decimals: 0,
            prefix: "₹",
            separator: ",",
            path : "/main/purchase-list"
        },
        {
            id: 3,
            cardColor: "success",
            label: "Total Bad Stock",
            badgeClass: "success",
            percentage: "",
            counter: totalBadStock,
            link: "View details",
            icon: <RiMedalLine />,
            iconColor: "rgb(41, 156, 219)",
            bgColor: "rgb(41, 156, 219)",
            decimals: 2,
            prefix: "",
        },
        {
            id: 4,
            cardColor: "info",
            label: "Total Medicine Stock",
            badgeClass: "muted",
            percentage: "",
            counter: totalMedicineStock,
            link: "View details",
            icon: <RiFolderLine />,
            iconColor: "rgb(240, 101, 72)",
            bgColor: "rgb(240, 101, 72)",
            decimals: 2,
            prefix: "",
        },
        // {
        //     id: 5,
        //     cardColor: "primary",
        //     label: "Medicines In Stock",
        //     badge: "ri-arrow-right-up-line",
        //     badgeClass: "success",
        //     percentage: "+8.75",
        //     counter: 34560,
        //     link: "View details",
        //     icon: <RiDropLine />,
        //     iconColor: "rgb(247, 184, 75)",
        //     bgColor: "rgb(247, 184, 75)",
        //     decimals: 0,
        //     // prefix: "Items",
        // },
        // {
        //     id: 6,
        //     cardColor: "secondary",
        //     label: "Orders Processed",
        //     badge: "ri-arrow-right-up-line",
        //     badgeClass: "success",
        //     percentage: "+12.85",
        //     counter: 127500,
        //     link: "View details",
        //     icon: <RiCheckboxBlankCircleLine />,
        //     iconColor: "rgb(64, 81, 137)",
        //     bgColor: "rgb(64, 81, 137)",
        //     decimals: 0,
        //     // prefix: "Orders",
        //     separator: ",",
        // },
        // {
        //     // Tracks returned medicines for stock management and customer satisfaction.
        //     id: 7,
        //     cardColor: "success",
        //     label: "Customer Returns",
        //     badge: "ri-arrow-right-down-line",
        //     badgeClass: "danger",
        //     percentage: "-5.45",
        //     counter: 5600,
        //     link: "View details",
        //     icon: <RiDeleteBinLine />,
        //     iconColor: "rgb(10, 179, 156)",
        //     bgColor: "rgb(10, 179, 156)",
        //     decimals: 0,
        //     // prefix: "Items",
        // },
        // {
        //     id: 8,
        //     cardColor: "info",
        //     label: "Revenue from Pharmacy",
        //     badgeClass: "muted",
        //     percentage: "+2.50",
        //     counter: 1450000,
        //     link: "View details",
        //     icon: <MdCurrencyRupee />,
        //     iconColor: "rgb(41, 156, 219)",
        //     bgColor: "rgb(41, 156, 219)",
        //     decimals: 2,
        //     prefix: "₹",
        // }
    ];

    const getAllData = async () => {
        try {
            let data = await dashboardApiService.getAllPharmacyIncome();
            setPharmacyIncome(data.pharmacyIncome);
            setPharmacyIncomePercentageChangeFromYesterday(data.pharmacyPercentageChangeFromYesterday);
            setMedicinePurchase(data.medicinePurchase)
            setPurchasePercentageChangeFromYesterdayData(data.purchasePercentageChangeFromYesterday);
            setTotalBadStockData(data.totalBadStock);
            setTotalMedicineStock(data.totalMedicineStock);
        } catch (error: any) {
            console.log("getAllData Error");
            console.log(error);
        }
    }

    useEffect(() => {
        getAllData();
    }, []);

    return (
        <React.Fragment>
            {pharmacyWidgets.map((item: any, key: any) => (
                <Col xl={3} md={6} key={key}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    {item.percentage && (
                                        <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                                            {item.badge ? <i className={"fs-13 align-middle " + item.badge}></i> : null} {item.percentage}
                                        </h5>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-22 fw-semibold ff-secondary mb-4"><span className="counter-value" data-target="559.25">
                                        <CountUp
                                            start={0}
                                            prefix={item.prefix}
                                            separator={item.separator}
                                            end={item.counter}
                                            decimals={item.decimals}
                                            duration={4}
                                        />
                                    </span></h4>
                                    {/* <Link to="#" className="text-decoration-underline">{item.link}</Link> */}
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
