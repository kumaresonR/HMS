import { useState } from "react";
import "./Idcard.css";
import user from "../../assets/images/user.png"
import logoDark from "../../assets/images/Red_medic.png"
import QRCode from "react-qr-code";

const PatientIdCard = (props: any) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="flip-card">
                <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
                    <div className="flip-card-front">
                        <div className="mb-3">
                            <img src={logoDark} alt="user" width={150} />
                        </div>
                        <div className="d-flex justify-content-around w-100">
                            <div>
                                <img src={user} alt="Patient" className="patient-img" />
                            </div>
                            <div>
                                <h4>{props.data.firstName}</h4>
                                <p>Patient ID: {props.data.patientId}</p>
                                <QRCode value={props.data.patientId || ''} size={50} />
                            </div>
                        </div>

                        <button className="flip-button" onClick={handleFlip}>View Details</button>
                    </div>

                    <div className="flip-card-back">
                        <p>DOB: {props.data.dateOfBirth}</p>
                        <p>Blood Group: {props.data.bloodType}</p>
                        <p>Gender: {props.data.gender}</p>
                        <p>Contact: {props.data.contactNumber}</p>
                        <p>Address: {props.data.address}</p>
                        <button className="flip-button" onClick={handleFlip}>Go Back</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default PatientIdCard;