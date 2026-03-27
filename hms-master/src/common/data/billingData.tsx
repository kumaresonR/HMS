import { faStethoscope, faFlask, faMicroscope, faDroplet, faFireFlameSimple, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const billingData = [
    {
        name: "Appointment",
        path: "/main/appointment-billing",
        icon: <FontAwesomeIcon icon={faCalendarCheck} />,
        code: "appointment"
    },
    {
        name: "OPD",
        path: "/main/opd-income",
        icon: <FontAwesomeIcon icon={faStethoscope} />,
        code: "OPD"
    },
    {
        name: "Pathology",
        path: "/main/pathology-billing",
        icon: <FontAwesomeIcon icon={faFlask} />,
        code: "pathology"
    },
    {
        name: "Radiology",
        path: "/main/radiology-billing",
        icon: <FontAwesomeIcon icon={faMicroscope} />,
        code: "radiology"
    },
    {
        name: "Blood Issue",
        path: "/main/blood-issue-billing",
        icon: <FontAwesomeIcon icon={faDroplet} />,
        code: "bloodIssue"
    },
    {
        name: "Blood Component Issue",
        path: "/main/blood-issue-component-billing",
        icon: <FontAwesomeIcon icon={faFireFlameSimple} />,
        code: "bloodComponentIssue"
    }
]

export {
    billingData
}