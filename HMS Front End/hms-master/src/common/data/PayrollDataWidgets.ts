import { MdCurrencyRupee } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiArrowDownSLine } from "react-icons/ri";

const PayrollDataWidgets = [
    {
        id: 1,
        cardColor: "primary",
        label: "Total Net Salary Paid",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        percentage: "+16.24",
        counter: 5000000,
        link: "See details",
        bgcolor: "secondary",
        icon: MdCurrencyRupee, // Use the icon component directly (not JSX here)
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
        counter: 4500000,
        link: "See details",
        bgcolor: "secondary",
        icon: GiMoneyStack, // Use the icon component directly
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
        counter: 500000,
        link: "See details",
        bgcolor: "secondary",
        icon: FaHandHoldingUsd, // Use the icon component directly
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
        counter: 5000,
        link: "See details",
        bgcolor: "secondary",
        icon: RiArrowDownSLine, // Use the icon component directly
        decimals: 0,
        prefix: "₹",
        suffix: ""
    }
];

export { PayrollDataWidgets };
