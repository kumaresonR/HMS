const symptomsData = [
    {
        symptomsType: 'Eating or Weight Problems',
        symptomsTitle: 'Thirst',
        symptomsDescription: 'Thirst is the feeling of needing to drink something. It occurs whenever the body is dehydrated for any reason. Any condition that can result in a loss of body water can lead to thirst or excessive thirst.Feeling sad or downPersonality change in a way that seems different for that person.'
    },
    {
        symptomsType: 'Emotional Problems',
        symptomsTitle: 'Feeling sad or down',
        symptomsDescription: 'Personality change in a way that seems different for that person.'
    },
    {
        symptomsType: 'Muscle or Joint Problem',
        symptomsTitle: 'Cramps and injuries',
        symptomsDescription: 'Muscle pain: Muscle spasms, cramps and injuries can all cause muscle pain. Some infections or tumors may also lead to muscle pain. Tendon and ligament pain: Ligaments and tendons are strong bands of tissue that connect your joints and bones. Sprains, strains and overuse injuries can lead to tendon or ligament pain.'
    },
    {
        symptomsType: 'Skin Problem',
        symptomsTitle: 'Atopic dermatitis (Eczema)',
        symptomsDescription: 'Atopic dermatitis usually develops in early childhood and is more common in people who have a family history of the condition.'
    },
    {
        symptomsType: 'Lung Problems',
        symptomsTitle: 'Asthma',
        symptomsDescription: 'Asthma is a condition in which your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, a whistling sound (wheezing) when you breathe out and shortness of breath. For some people, asthma is a minor nuisance.'
    },
    {
        symptomsType: 'Stomach Problems',
        symptomsTitle: 'Constant or severe abdominal pain.',
        symptomsDescription: 'Diseases that affect the digestive system can also cause chronic abdominal pain. The most common are: gastroesophageal reflux disease (GERD) irritable bowel syndrome or spastic colon (a disorder that causes abdominal pain, cramping, and changes in bowel movements)'
    },
    {
        symptomsType: 'Bladder Problems',
        symptomsTitle: 'Bladder leakage',
        symptomsDescription: 'Urinary incontinence — the loss of bladder control — is a common and often embarrassing problem. The severity ranges from occasionally leaking urine when you cough or sneeze to having an urge to urinate that'
    }
]


const doctorList = [
    {
        doctorId: "HMSDOCTOR01",
        name: "Bejancy"
    },
    {
        doctorId: "HMSDOCTOR02",
        name: "Aswin"
    },
    {
        doctorId: "HMSDOCTOR03",
        name: "Raja"
    }
]

const isOldPatient = [
    {
        code: 'Yes',
    },
    {
        code: 'No'
    }
]

const patientTypeData = [
    {
        type: "OPD"
    },
    {
        type: "IPD"
    },
    {
        type: "Pharmacy"
    },
    {
        type: "Pathology"
    },
    {
        type: "Radiology"
    },
    {
        type: "Blood Bank"
    },
    {
        type: "Ambulance"
    },
]

const bloodGroupDetails = [
    {
        type: "B+"
    },
    {
        type: "A+"
    },
    {
        type: "AB-"
    },
    {
        type: "AB+"
    },
    {
        type: "O-"
    },
    {
        type: "A-"
    },
    {
        type: "B-"
    },
    {
        type: "O+"
    }
]

const genderData = [
    {
        name: "Male",
    },
    {
        name: "Female",
    },
    {
        name: "Other",
    },
]

const timeDurationData = [
    {
        duration : "Daily",
        code : "DAILY"
    },
    {
        duration : "Weekly",
        code : "WEEKLY"
    },
    {
        duration : "Monthly",
        code : "MONTHLY"
    },
    {
        duration : "Yearly",
        code : "YEARLY"
    },
    {
        duration : "Last Year",
        code : "LAST_YEAR"
    },
    {
        duration : "Period",
        code : "Period"
    }
] 

const categoryNameData = [
    {
        category: "CAD-AI Research Laboratory.",
        name: "Radiology Charges",
        tax: 18.00,
        standardCharge: 160.00,
        amount: 180.80
    },
    {
        category: "Digital Image Processing",
        name: "Surgical Pathology",
        tax: 18.00,
        standardCharge: 150.00,
        amount: 177.00
    },
    {
        category: "Mammographic Tomosynthesis",
        name: "Mammographic Tomosynthesis",
        tax: 10.00,
        standardCharge: 160.00,
        amount: 180.80
    },
    {
        category: "X-ray",
        name: "X-ray",
        tax: 18.00,
        standardCharge: 150.00,
        amount: 177.00
    },
    {
        category: "Other Charges",
        name: "Other Charges",
        tax: 10.00,
        standardCharge: 130.00,
        amount: 143.00
    }
]

const categoryData = [
    {
        name: "X-RAY CHEST PA VIEW",
    },
    {
        name: "X-RAY PNS (WATER'S VIEW)",
    },
    {
        name: "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS",
    },
    {
        name: "ULTRASOUND WHOLE ABDOMEN",
    },
    {
        name: "DOPPLER PERIPHERAL BILATERAL (VENOUS)"
    },
    {
        name: "CT ORBITS",
    },
    {
        name: "CT CHEST PLAIN",
    },
    {
        name: "CT 3D STUDY",
    },
    {
        name: "M. R. C. P.",
    },
    {
        name: "MRI CARDIAC WITH CONTRAST"
    }
]

const testParameterdata = [
    {
        name: "MRI Cardiac with Contrast",
        referanceRange: "1.5",
        unit: "CT"
    },
    {
        name: "Fluoroscopy",
        referanceRange: "30 mGy/min",
        unit: "(dGy×cm2)"
    },
    {
        name: "Magnetic resonance imaging (MRI)",
        referanceRange: "0.2 and 7 T",
        unit: "Teslas"
    },
    {
        name: "Ultrasound",
        referanceRange: "7 mm",
        unit: "KHz"
    }
]

const paymentModeData = [
    {
        type: "Cash"
    },
    {
        type: "Cheque"
    },
    {
        type: "Transfer To Bank Account"
    },
    {
        type: "UPI"
    },
    {
        type: "Online"
    },
    {
        type: "Other"
    }
]

const pharmacyData = [
    {
        billNo: "PHARMAB420",
        caseId: "6801",
        date: "11/12/2024 12:27 PM",
        patientName: "Olivier Thomas (1)",
        doctorName: "Bejancy",
        discount: "0.00 (0.00%)",
        netAamount: "73.50",
        paidAmount: "73.50",
        refundAmount: "0.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "PHARMAB418",
        caseId: "5827",
        date: "11/08/2024 12:05 PM",
        patientName: "Sneha",
        doctorName: "Bejancy",
        discount: "0.00 (0.00%)",
        netAamount: "73.50",
        paidAmount: "73.50",
        refundAmount: "0.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "PHARMAB417",
        caseId: "6801",
        date: "11/30/2024 05:04 PM",
        patientName: "Kelvin Octamin (886)",
        doctorName: "Bejancy",
        discount: "36.50 (10.00%)",
        netAamount: "336.60",
        paidAmount: "180.00",
        refundAmount: "0.00",
        balanceAmount: "156.60"
    },
    {
        billNo: "PHARMAB416",
        caseId: "",
        date: "11/20/2024 01:30 PM",
        patientName: "MAIREENA GOMAZ (1005)",
        doctorName: "Sansa Gomez (9008)",
        discount: "0.00 (0.00%)",
        netAamount: "183.75",
        paidAmount: "183.75",
        refundAmount: "0.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "PHARMAB415",
        caseId: "5827",
        date: "11/12/2024 12:27 PM",
        patientName: "Maya Agarwal (1084)",
        doctorName: "Bejancy",
        discount: "0.00 (0.00%)",
        netAamount: "73.50",
        paidAmount: "73.50",
        refundAmount: "0.00",
        balanceAmount: "0.00"
    }
]

const medicineData = [
    {
        madicineName: "Amlodipine",
        medicineCompany: "Johnson & Johnson	",
        medicineComposition: "Amlodipine",
        medicineCategory: "Tablet",
        medicineGroup: "Antimycobacterials",
        unit: "mg/mL",
        availableQty: "500",
    },
    {
        madicineName: "VARICELLA",
        medicineCompany: "Biocon Limited.",
        medicineComposition: "Injection",
        medicineCategory: "Injection",
        medicineGroup: "Antiparasitics",
        unit: "ml",
        availableQty: "73",
    },
    {
        madicineName: "Ftox-DX",
        medicineCompany: "Lupin Limited.",
        medicineComposition: "5 mg",
        medicineCategory: "Syrup",
        medicineGroup: "Antigout agents",
        unit: "mg",
        availableQty: "750",
    },
    {
        madicineName: "Syrup",
        medicineCompany: "medimax",
        medicineComposition: "Dextromethorphan 15 mg",
        medicineCategory: "Syrup",
        medicineGroup: "HIPERIN",
        unit: "g/dl	",
        availableQty: "1488",
    }
]

const medicinePurchaseData = [
    {
        purchaseno: "PCHNO150",
        purchaseDate: "11/20/2024 03:36 PM",
        billNo: "6757",
        supplierName: "VKS Pharmacy",
        total: "26000.00",
        tax: "1170.00",
        discount: "2600.00",
        netAmount: "24570.00"
    },
    {
        purchaseno: "PCHNO149",
        purchaseDate: "11/12/2024 03:34 PM",
        billNo: "45654",
        supplierName: "Anant Pharmacy",
        total: "21000.00",
        tax: "1890.00",
        discount: "52100.00",
        netAmount: "20790.00"
    },
    {
        purchaseno: "PCHNO147",
        purchaseDate: "11/06/2024 03:50 PM",
        billNo: "33",
        supplierName: "SGS Pharmacy",
        total: "10000.00",
        tax: "900.00",
        discount: "1000.00",
        netAmount: "9900.00"
    },
    {
        purchaseno: "PCHNO146",
        purchaseDate: "10/10/2024 01:30 PM",
        billNo: "567",
        supplierName: "Anant Pharmacy",
        total: "16000.00",
        tax: "1440.00",
        discount: "1600.00",
        netAmount: "15840.00"
    },
]

const pathologyData = [
    {
        billNo: "PATHOB488",
        caseId: "6740",
        reportingData: "11/08/2024 12:30 PM	",
        patientName: "Olivier Thomas (1)",
        referenceDoctor: "Sonia Bush (9002)	",
        previousReportValue: "NA",
        discount: "0.00 (0.00%)	",
        amount: "192.00",
        paidAmount: "192.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "PATHOB489",
        caseId: "6801",
        reportingData: "11/12/2024 10:30 AM	",
        patientName: "Katie Strutt (1134)	",
        referenceDoctor: "Sansa Gomez (9008)",
        previousReportValue: "NA",
        discount: "0.00 (0.00%)	",
        amount: "192.00",
        paidAmount: "192.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "PATHOB484",
        caseId: "6740",
        reportingData: "11/30/2024 05:23 PM",
        patientName: "Carolyn Wright (827)",
        referenceDoctor: "Reyan Jain (9011)",
        previousReportValue: "NA",
        discount: "16.00 (10.00%)",
        amount: "172.80",
        paidAmount: "120.00",
        balanceAmount: "52.00"
    },
    {
        billNo: "PATHOB485",
        caseId: "6740",
        reportingData: "11/08/2024 12:30 PM	",
        patientName: "Olivier Thomas (1)",
        referenceDoctor: "Sonia Bush (9002)	",
        previousReportValue: "NA",
        discount: "0.00 (0.00%)	",
        amount: "192.00",
        paidAmount: "192.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "PATHOB486",
        caseId: "6740",
        reportingData: "11/20/2024 02:00 PM",
        patientName: "Cameron Martin (641)",
        referenceDoctor: "Sonia Bush (9002)	",
        previousReportValue: "NA",
        discount: "0.00 (0.00%)	",
        amount: "192.00",
        paidAmount: "192.00",
        balanceAmount: "0.00"
    }
]

const pathologyTestData = [
    {
        testName: "Appendicitis",
        shortName: "Appendicitis",
        testType: "Appendicitis",
        categoryName: "Hematology",
        subCategory: "Appendicitis",
        method: "open appendectomy	",
        reportDays: "1",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    },
    {
        testName: "Chest X-rays	",
        shortName: "C",
        testType: "Chest X-rays	",
        categoryName: "Clinical Microbiology",
        subCategory: "Chest X-rays",
        method: "Painless imaging test",
        reportDays: "2",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    },
    {
        testName: "Breast Ultrasound",
        shortName: "BU",
        testType: "Breast Ultrasound",
        categoryName: "Clinical Microbiology",
        subCategory: "",
        method: "",
        reportDays: "1",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    },
    {
        testName: "Vascular Sonography",
        shortName: "VSG",
        testType: "VSG",
        categoryName: "Molecular Diagnostics",
        subCategory: "Computed tomography",
        method: "open appendectomy	",
        reportDays: "2",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    },
    {
        testName: "Signal-averaged electrocardiogram",
        shortName: "SAECG",
        testType: "SAECG",
        categoryName: "Clinical Chemistry",
        subCategory: "Computed tomography",
        method: "open appendectomy	",
        reportDays: "1",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    }
]

const radiologyData = [
    {
        billNo: "RADIOB425",
        caseId: "6740",
        reportingData: "11/08/2024 12:30 PM	",
        patientName: "Olivier Thomas (1)",
        referenceDoctor: "Sonia Bush (9002)	",
        previousReportValue: "NA",
        discount: "0.00 (0.00%)	",
        amount: "192.00",
        paidAmount: "192.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "RADIOB424",
        caseId: "6801",
        reportingData: "11/12/2024 10:30 AM	",
        patientName: "Katie Strutt (1134)	",
        referenceDoctor: "Sansa Gomez (9008)",
        previousReportValue: "NA",
        discount: "0.00 (0.00%)	",
        amount: "192.00",
        paidAmount: "192.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "RADIOB423",
        caseId: "6740",
        reportingData: "11/30/2024 05:23 PM",
        patientName: "Carolyn Wright (827)",
        referenceDoctor: "Reyan Jain (9011)",
        previousReportValue: "NA",
        discount: "16.00 (10.00%)",
        amount: "172.80",
        paidAmount: "120.00",
        balanceAmount: "52.00"
    },
    {
        billNo: "RADIOB427",
        caseId: "6740",
        reportingData: "11/08/2024 12:30 PM	",
        patientName: "Olivier Thomas (1)",
        referenceDoctor: "Sonia Bush (9002)	",
        previousReportValue: "NA",
        discount: "0.00 (0.00%)	",
        amount: "192.00",
        paidAmount: "192.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "RADIOB421",
        caseId: "6740",
        reportingData: "11/20/2024 02:00 PM",
        patientName: "Cameron Martin (641)",
        referenceDoctor: "Sonia Bush (9002)	",
        previousReportValue: "NA",
        discount: "0.00 (0.00%)	",
        amount: "192.00",
        paidAmount: "192.00",
        balanceAmount: "0.00"
    }
]

const radiologyTestData = [
    {
        testName: "Resting 12-lead EKG",
        shortName: "RLE",
        testType: "RLE",
        categoryName: "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS",
        subCategory: "RLE / lead EKG",
        reportDays: "1",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    },
    {
        testName: "Magnetic resonance imaging",
        shortName: "MR",
        testType: "Computed Tomography",
        categoryName: "X-RAY CHEST PA VIEW",
        subCategory: "Computed tomography",
        reportDays: "2",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    },
    {
        testName: "Functional MRI (RI)",
        shortName: "FMRI",
        testType: "FMRI",
        categoryName: "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS",
        subCategory: "",
        reportDays: "1",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    },
    {
        testName: "Cardiopulmonary Exercise Test",
        shortName: "CPET",
        testType: "CPET",
        categoryName: "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS	",
        subCategory: "Computed tomography",
        reportDays: "2",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    },
    {
        testName: "Abdomen X-rays",
        shortName: "AX",
        testType: "AX",
        categoryName: "X-RAY CHEST PA VIEW",
        subCategory: "Computed tomography",
        reportDays: "1",
        tax: "20.00",
        charge: "160.00",
        amount: "192.00",
    }
]

const donorData = [
    {
        donorName: "Gaurav",
        dob: "03/05/2010",
        bloodGroup: "B-",
        gender: "Male",
        contactNo: "87979798967",
        fatherName: "Lokesh Shah",
        address: "",
    },
    {
        donorName: "Anu",
        dob: "11/20/2024",
        bloodGroup: "O+",
        gender: "Female",
        contactNo: "9844165160",
        fatherName: "Lokesh",
        address: "Nagercoil",
    },
    {
        donorName: "Addey",
        dob: "11/20/2024",
        bloodGroup: "B+",
        gender: "Male",
        contactNo: "6578768768",
        fatherName: "Mahesh",
        address: "7 Akbar road, Nagercoil.",
    },
    {
        donorName: "Oliver",
        dob: "11/24/2024",
        bloodGroup: "B-",
        gender: "Male",
        contactNo: "8978567676",
        fatherName: "George",
        address: "Main Street, Apt. Central Brooklyn",
    },
]

const bloodIssueData = [
    {
        billNo: "BIB623",
        caseId: "6801",
        issueDate: "11/16/2024 12:28 PM	",
        receivedTo: "Katie Strutt (1134)",
        bloodGroup: "B+",
        gender: "Female",
        donorName: "Meera",
        bags: "36201 (220 1)",
        bloodQty: "2unit",
        netAmount: "121.00",
        paidAmount: "121.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "BIB615",
        caseId: "4468",
        issueDate: "11/30/2024 01:30 PM	",
        receivedTo: "Carolyn Wright (827)",
        bloodGroup: "B-",
        gender: "Female",
        donorName: "Stephen",
        bags: "4744 (220 1)",
        bloodQty: "",
        netAmount: "121.00",
        paidAmount: "121.00",
        balanceAmount: "0.00"
    },
    {
        billNo: "BIB614",
        caseId: "5912",
        issueDate: "11/25/2024 08:30 PM	",
        receivedTo: "David Hussan (539)",
        bloodGroup: "B-",
        gender: "Male",
        donorName: "Stephen",
        bags: "897 (220 1)",
        bloodQty: "2unit",
        netAmount: "108.90",
        paidAmount: "108.90",
        balanceAmount: "0.00"
    },
    {
        billNo: "BIB613",
        caseId: "",
        issueDate: "11/20/2024 03:30 PM	",
        receivedTo: "Robin Dahlberg (844)",
        bloodGroup: "O+",
        gender: "Male",
        donorName: "Abhishek Khanna",
        bags: "6745 (220 1)",
        bloodQty: "",
        netAmount: "121.00",
        paidAmount: "121.00",
        balanceAmount: "0.00"
    },
]

const componentData = [
    {
        name: "White Cells & Granulocytes",
        bloodGroup: "B-",
        bags: "36201 (220 1)",
        lot: "2",
        institution: "Blood Bank Unit",
    },
    {
        name: "Platelets",
        bloodGroup: "O+",
        bags: "2211 (220 g/dl)	",
        lot: "2",
        institution: "Blood Red Cross Society",
    },
    {
        name: "Plasma",
        bloodGroup: "B+",
        bags: "4222 (220 (ML))",
        lot: "2",
        institution: "Blood Bank Unit",
    },
    {
        name: "Red Cells",
        bloodGroup: "B-",
        bags: "755 (220 g/dl)",
        lot: "2",
        institution: "Blood Red Cross Society",
    },
]

const customStyles = {
    multiValue: (styles: any, { data }: any) => {
        return {
            ...styles,
            backgroundColor: "#3762ea",
        };
    },
    multiValueLabel: (styles: any, { data }: any) => ({
        ...styles,
        backgroundColor: "#405189",
        color: "white",
    }),
    multiValueRemove: (styles: any, { data }: any) => ({
        ...styles,
        color: "white",
        backgroundColor: "#405189",
        ':hover': {
            backgroundColor: "#405189",
            color: 'white',
        },
    }),
}

const roleData = [
    {
        name: "Admin"
    },
    {
        name: "Accountant"
    },
    {
        name: "Doctor"
    },
    {
        name: "Pharmacist"
    },
    {
        name: "Pathologist"
    },
    {
        name: "Radiologist"
    },
    {
        name: "Super Admin"
    },
    {
        name: "Receptionist"
    },
    {
        name: "Nurse"
    }
]

const dischargeStatusData = [
    {
        status: "Death"
    },
    {
        status: "Referral"
    },
    {
        status: "Normal"
    }
]

const billSummaryData = [
    {
        IPDChargesData: [
            {
                service: "ICU",
                charge: "1050.00",
                qty: "3 per day",
                discount: "0.00 (0.00%)",
                tax: "315.00 (30.00%)",
                amount: "1365.00"
            },
            {
                service: "Eye Check-up",
                charge: "1050.00",
                qty: "3 per day",
                discount: "0.00 (0.00%)",
                tax: "315.00 (30.00%)",
                amount: "1365.00"
            },
            {
                service: "Operation service",
                charge: "1050.00",
                qty: "3 per day",
                discount: "0.00 (0.00%)",
                tax: "315.00 (30.00%)",
                amount: "1365.00"
            },
            {
                service: "Others Charges",
                charge: "1050.00",
                qty: "3 per day",
                discount: "0.00 (0.00%)",
                tax: "315.00 (30.00%)",
                amount: "1365.00"
            },
            {
                service: "Cylinder Charges",
                charge: "1050.00",
                qty: "3 per day",
                discount: "0.00 (0.00%)",
                tax: "315.00 (30.00%)",
                amount: "1365.00"
            }
        ],
        pharmacyBill: [
            {
                billNo: "PHARMAB327",
                charge: "500.00",
                qty: "1",
                discount: "50.00 (10.00%)",
                tax: "50.00 (11.11%)",
                amount: "500.00"
            },
            {
                billNo: "PHARMAB329",
                charge: "500.00",
                qty: "1",
                discount: "70.00 (10.00%)",
                tax: "55.00 (8.73%)",
                amount: "500.00"
            },
            {
                billNo: "PHARMAB354",
                charge: "700.00",
                qty: "1",
                discount: "34.00 (10.00%)",
                tax: "36.00 (6.67%)",
                amount: "576.00"
            }
        ],
        transaction: [
            {
                transactionID: "TRANID4661",
                paymentDate: "02/06/2023 04:41 PM",
                paymentMode: "Cash",
                amount: "500.00"
            },
            {
                transactionID: "TRANID5555",
                paymentDate: "07/25/2023 01:30 PM",
                paymentMode: "Transfer to Bank Account",
                amount: "500.00"
            },
            {
                transactionID: "TRANID5563",
                paymentDate: "09/15/2023 05:30 AM",
                paymentMode: "Other",
                amount: "576.00"
            }
        ]
    }
]

export {
    symptomsData,
    customStyles,
    doctorList,
    isOldPatient,
    categoryNameData,
    categoryData,
    testParameterdata,
    paymentModeData,
    roleData,
    dischargeStatusData,
    billSummaryData,
    pharmacyData,
    radiologyData,
    pathologyData,
    radiologyTestData,
    pathologyTestData,
    medicineData,
    medicinePurchaseData,
    donorData,
    bloodIssueData,
    componentData,
    bloodGroupDetails,
    genderData,
    patientTypeData,
    timeDurationData
}