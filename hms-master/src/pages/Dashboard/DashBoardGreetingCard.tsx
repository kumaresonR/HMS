import React, { useState, useEffect } from 'react'; 
import { motion } from 'framer-motion';  
import DoctorImg from "../../assets/images/Doctor_Img.png";
import MaleDoctor from "../../assets/images/Maledoctor.png"
import './dashboard.css';
import moment from 'moment';

const DashBoardGreetingCard = (props:any) => {

    const [greeting, setGreeting] = useState(''); 
    const today = moment().format('Do [of] MMMM, YYYY');
    
    useEffect(() => { 
        const getGreeting = () => {
            const currentHour = new Date().getHours();
            if (currentHour < 12) {
                return 'Good Morning';
            } else if (currentHour < 18) {
                return 'Good Afternoon';
            } else {
                return 'Good Evening';
            }
        };

        setGreeting(getGreeting()); 
    }, []);  

    const name = props.userName; 

    // Animation settings for each letter
    const letterVariants = {
        initial: { opacity: 0, x: 20 },  
        animate: { opacity: 1, x: 1 },   
        exit: { opacity: 0.9, x: 0.9},    
    };

    return (
        <div>
            <div className="row p-4 mt-4">
                <div className="col-12 DashBoardGreetingCard px-4">
                    <div className="d-flex justify-content-between">
                        <div className="greeting-card">
                            <h2>
                                {greeting},
                                {/* Animate each letter of the doctor's name */}
                                <span className="doctorName"> {props.gender === "Male" ? "Mr." : props.gender === "Female" ? "Ms." : "Dr."}
                                    {name.split("").map((letter:any, index:any) => (
                                        <motion.span
                                            key={index}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            variants={letterVariants}
                                            transition={{
                                                delay: index * 0.05,
                                                repeat: Infinity, 
                                                repeatType: "reverse",
                                                duration: 0.8,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </span>
                            </h2>
                            <p className='doctorBtmCont'>
                                <strong>Today, the {today},</strong> presents another opportunity to make a <strong>remarkable difference</strong> in the lives of those you care for. Here’s a quick look at your schedule and tasks for the day—filled with <strong>purpose, compassion,</strong> and the drive to heal.
                            </p>
                            <br />
                        </div>
                        <div className="col-5 d-flex justify-content-end imgGreeting">
                            <img src={props.gender === "Male" ? MaleDoctor : DoctorImg} alt="" className='img-fluid doctorProfileImg' style={{ height: "300px", marginRight: "40px", marginTop: "-100px" }} />
                        </div>
                    </div>
                    <div className="row pe-4 mt-2 mb-0">
                        <div className="col-12">
                            <p className='text-end quotes mb-0'> 
                                "Wherever the art of medicine is loved, there is also a love of humanity." — Hippocrates
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoardGreetingCard;
