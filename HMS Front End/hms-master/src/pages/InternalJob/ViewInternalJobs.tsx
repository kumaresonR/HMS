import React, { useState } from "react"
import { Badge, Button, Card, Col, Container, Row } from "reactstrap"
import "./job-portel.css";
import moment from "moment";
import FormHeader from "../../common/FormHeader/FormHeader";
import { minimizePage } from "../../slices/pageResizer/uiSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const jobsData = [
    {
        jobTitle: "Senior Nurse",
        department: "Cardiology",
        location: "Main Hospital",
        jobType: "Full-time",
        jobId: "HN-2024-001",
        postedOn: "2024-07-20",
        numberOfOpenings: 5,
        jobDescription: {
            summary: "Responsible for providing high-quality patient care in the cardiology department.",
            keyResponsibilities: [
                "Assist in patient care and monitoring",
                "Administer medications and IV therapy",
                "Collaborate with doctors and medical staff",
                "Maintain accurate patient records"
            ],
            requiredQualifications: [
                "Bachelor's degree in Nursing (BSN)",
                "Registered Nurse (RN) License"
            ],
            experienceLevel: "3+ years",
            preferredSkills: [
                "Advanced Cardiac Life Support (ACLS) certification",
                "Experience in critical care settings"
            ]
        },
        applicationDetails: {
            applicationDeadline: "2024-08-15",
            howToApply: "Submit your application via the internal HR portal",
            hiringManager: "Dr. John Doe (HR Department)"
        },
        employeeBenefits: {
            salaryRange: "₹60,000 - ₹80,000 per month",
            perks: ["Health Insurance", "Paid Time Off", "Retirement Benefits"]
        }
    },
    {
        jobTitle: "Radiologist",
        department: "Radiology",
        location: "City Hospital",
        jobType: "Full-time",
        jobId: "RD-2024-006",
        postedOn: "2024-07-25",
        numberOfOpenings: 4,
        jobDescription: {
            summary: "Responsible for diagnosing and interpreting medical images to assist in patient care.",
            keyResponsibilities: [
                "Analyze X-rays, MRIs, CT scans, and ultrasounds",
                "Collaborate with medical teams for patient diagnosis",
                "Maintain and update patient reports",
                "Ensure adherence to radiation safety guidelines"
            ],
            requiredQualifications: [
                "MBBS with MD in Radiology",
                "Certified by Medical Council"
            ],
            experienceLevel: "4+ years",
            preferredSkills: ["MRI, CT Scan Interpretation, Ultrasound Imaging"]
        },
        applicationDetails: {
            applicationDeadline: "2024-08-20",
            howToApply: "Submit CV via hospital careers portal",
            hiringManager: "Dr. Richard Brown (Chief Radiologist)"
        },
        employeeBenefits: {
            salaryRange: "₹1,20,000 - ₹1,50,000 per year",
            perks: ["Medical Insurance", "Paid Conferences", "Housing Allowance"]
        }
    },
    {
        jobTitle: "Pharmacist",
        department: "Pharmacy",
        location: "General Hospital",
        jobType: "Full-time",
        jobId: "PH-2024-007",
        numberOfOpenings: 6,
        postedOn: "2024-07-27",
        jobDescription: {
            summary: "Dispense medications and provide guidance on drug usage and side effects.",
            keyResponsibilities: [
                "Prepare and dispense prescriptions",
                "Provide consultation on medication use",
                "Maintain inventory and restock medications",
                "Ensure compliance with healthcare regulations"
            ],
            requiredQualifications: [
                "Bachelor's in Pharmacy (B.Pharm) or Doctor of Pharmacy (PharmD)",
                "Valid pharmacy license"
            ],
            experienceLevel: "2+ years",
            preferredSkills: ["Inventory Management, Drug Safety, Prescription Handling"]
        },
        applicationDetails: {
            applicationDeadline: "2024-08-22",
            howToApply: "Apply through the hospital HR portal",
            hiringManager: "Ms. Emily Watson (Head Pharmacist)"
        },
        employeeBenefits: {
            salaryRange: "₹50,000 - ₹70,000 per month",
            perks: ["Health Insurance", "Performance Bonus", "Training Programs"]
        }
    },
    {
        jobTitle: "Medical Laboratory Technician",
        department: "Pathology",
        location: "Metro Hospital",
        jobType: "Full-time",
        jobId: "MLT-2024-008",
        postedOn: "2024-07-30",
        numberOfOpenings: 6,
        jobDescription: {
            summary: "Perform diagnostic tests and analyze medical samples to assist doctors in treatment plans.",
            keyResponsibilities: [
                "Conduct blood tests, urine tests, and tissue analysis",
                "Maintain laboratory equipment and records",
                "Collaborate with doctors for accurate diagnosis",
                "Ensure adherence to safety and hygiene protocols"
            ],
            requiredQualifications: [
                "Diploma or Bachelor's in Medical Laboratory Technology",
                "Certified by a recognized medical board"
            ],
            experienceLevel: "1+ years",
            preferredSkills: ["Microscopy, Biochemistry, Sample Processing"]
        },
        applicationDetails: {
            applicationDeadline: "2024-08-28",
            howToApply: "Send applications via hospital recruitment email",
            hiringManager: "Dr. Mark Stevens (Lab Director)"
        },
        employeeBenefits: {
            salaryRange: "₹40,000 - ₹60,000 per month",
            perks: ["Medical Insurance", "Paid Leaves", "Skill Development Programs"]
        }
    },

    {
        jobTitle: "HR Manager",
        department: "Human Resources",
        location: "Head Office",
        jobType: "Full-time",
        jobId: "HR-2024-003",
        numberOfOpenings: 1,
        postedOn: "2024-07-20",
        jobDescription: {
            summary: "Oversee recruitment, employee relations, and HR policies.",
            keyResponsibilities: [
                "Manage hiring processes and talent acquisition",
                "Develop and enforce HR policies",
                "Handle employee grievances and conflict resolution",
                "Plan and implement training programs"
            ],
            requiredQualifications: [
                "Master’s degree in Human Resources or related field",
                "Experience in employee relations and policy implementation"
            ],
            experienceLevel: "5+ years",
            preferredSkills: ["HRMS, Payroll Management, Compliance"]
        },
        applicationDetails: {
            applicationDeadline: "2024-08-30",
            howToApply: "Submit resume to HR portal",
            hiringManager: "Ms. Linda Brown (HR Director)"
        },
        employeeBenefits: {
            salaryRange: "₹70,000 - ₹90,000 per month",
            perks: ["401(k) Retirement Plan", "Paid Parental Leave", "Medical Benefits"]
        }
    },
];


const ViewInternalJobs = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [selectedJob, setSelectedJob] = useState<any>(jobsData[0]);

    return (
        <React.Fragment>
            <Container fluid>
                <FormHeader title="View Jobs"
                    pageTitle="Internal Jobs"
                    onMinimize={() => dispatch(minimizePage({
                        route: location.pathname,
                        pageName: "View Jobs",
                    }))} />
                <Row>
                    <Col>
                        {jobsData.map((item: any, idx: any) => (
                            <div className="job-portal-container my-3"
                                onClick={() => setSelectedJob(item)}
                                style={{
                                    border: selectedJob.jobId === item.jobId ? "2px solid blue" : "1px solid #ccc",
                                }}>
                                <div className="text-end">
                                    <span>{moment(item.postedOn).format("MMMM DD, YYYY")}</span>
                                </div>
                                <div className="card-header">
                                    <span>{item.jobTitle}</span>
                                </div>
                                <div className="flex gap-3">
                                    <Badge className="my-2">{item.jobType} </Badge>
                                </div>
                                <span>Openings - {item.numberOfOpenings}</span>
                            </div>
                        ))}
                    </Col>
                    <Col md={8}>
                        <div className="job-portal-container-1 my-3">
                            {selectedJob ? (
                                <>
                                    <h4>{selectedJob.jobTitle}</h4>
                                    <p><strong>Department:</strong> {selectedJob.department}</p>
                                    <p><strong>Location:</strong> {selectedJob.location}</p>
                                    <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
                                    <p><strong>Summary:</strong> {selectedJob.jobDescription.summary}</p>

                                    <h5>Key Responsibilities:</h5>
                                    <ul>
                                        {selectedJob.jobDescription.keyResponsibilities.map((resp: any, i: any) => (
                                            <li key={i}>{resp}</li>
                                        ))}
                                    </ul>

                                    <h5>Required Qualifications:</h5>
                                    <ul>
                                        {selectedJob.jobDescription.requiredQualifications.map((qual: any, i: any) => (
                                            <li key={i}>{qual}</li>
                                        ))}
                                    </ul>

                                    <h5>Salary & Benefits:</h5>
                                    <p><strong>Salary Range:</strong> {selectedJob.employeeBenefits.salaryRange}</p>
                                    <ul>
                                        {selectedJob.employeeBenefits.perks.map((perk: any, i: any) => (
                                            <li key={i}>{perk}</li>
                                        ))}
                                    </ul>
                                    <div className="text-center">
                                        <Button>Apply Now</Button>
                                    </div>
                                </>
                            ) : (
                                <p>Select a job to see details.</p>
                            )}

                        </div>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default ViewInternalJobs