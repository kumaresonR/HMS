import { MdAirlineSeatIndividualSuite } from "react-icons/md"; // Example icon
import { FaBed } from "react-icons/fa";
import { GiBabyBottle } from "react-icons/gi";
import { BsFillPersonFill } from "react-icons/bs";

const LeavesDataWidgets = [
    {
        id: 1,
        cardColor: "primary",
        label: "Casual Leave (7)",
        used: 5,
        available: 2,
        icon: MdAirlineSeatIndividualSuite, // Example icon for casual leave
        bgcolor: "primary",
    },
    {
        id: 2,
        cardColor: "secondary",
        label: "Privilege Leave (8)",
        used: 3,
        available: 5,
        icon: FaBed, // Example icon for privilege leave
        bgcolor: "secondary",
    },
    {
        id: 3,
        cardColor: "success",
        label: "Sick Leave (9)",
        used: 3,
        available: 6,
        icon: FaBed, // Example icon for sick leave
        bgcolor: "success",
    },
    {
        id: 4,
        cardColor: "info",
        label: "Maternity Leave (5)",
        used: 0,
        available: 5,
        icon: GiBabyBottle, // Example icon for maternity leave
        bgcolor: "info",
    },
    {
        id: 5,
        cardColor: "warning",
        label: "Paternity Leave (7)",
        used: 3,
        available: 4,
        icon: BsFillPersonFill, 
        bgcolor: "warning",
    },
    {
        id: 6,
        cardColor: "danger",
        label: "Fever Leave (8)",
        used: 5,
        available: 3,
        icon: FaBed, 
        bgcolor: "danger",
    },
];

export { LeavesDataWidgets };
    