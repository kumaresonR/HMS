import React, { CSSProperties, useRef } from "react";
import { Button, Container } from "reactstrap";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

import logo from "../../assets/images/Logo_medic.jpg";
const DownloadBirthRecord = (props: any) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const content = printRef.current?.innerHTML;
      const styles = `
      <style>
        @page {
          size: A4 portrait;
          }
        html, body {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background: #fff;
          color: #000;
          box-sizing: border-box;
        }
       
        .certificate {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        @media print {
          .hide-print {
            display: none !important;
          }
        }
      </style>
    `;
    
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Birth Certificate</title>
            ${styles}
          </head>
          <body onload="window.print(); window.close();">
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      console.error("Failed to open print window.");
    }
  };

  const openPDF = () => {
    const pdfWindow: any = window.open();
    pdfWindow.document.write(
      `<iframe width='100%' height='100%' src='data:application/pdf;base64,${props.data.documentPhoto}'></iframe>`
    );
  };
  const styles: { [key: string]: CSSProperties } = {
    container: {
      fontFamily: "'Poppins', sans-serif",
      maxWidth: "900px",
      margin: "0 auto",
      padding: "0",
      background: "transparent",
    },
    downloadBirthCertificateMain: {
      backgroundColor: "#fff",
      padding: "20px 40px",
      borderRadius: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    },
    logo: {
      marginRight: "30px",
    },
    hospitalLogo: {
      height: "80px",
      width: "auto",
    },
    hospitalInfo: {
      flex: "1",
    },
    hospitalName: {
      fontSize: "24px",
      fontWeight: "bold",
      margin: "0 0 5px 0",
      color: "#2d3748",
    },
    hospitalAddress: {
      fontSize: "14px",
      margin: "3px 0",
      color: "#718096",
    },
    printButton: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "20px",
    },
    certificate: {
      width: "100%",
      position: "relative",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      overflow: "hidden",
      color: "#2d3748",
    },
    topAccent: {
      height: "8px",
      background: "linear-gradient(90deg, #3182ce, #63b3ed)",
      width: "100%",
    },
    header: {
      padding: "30px 40px",
      background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    titleSection: {
      flex: "1",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#2d3748",
      margin: "0 0 5px 0",
      letterSpacing: "0.5px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#718096",
      margin: "0",
    },
    certificateIdTag: {
      backgroundColor: "#ebf8ff",
      color: "#3182ce",
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
    },
    idIcon: {
      marginRight: "8px",
      fontSize: "18px",
    },
    mainContent: {
      padding: "30px 40px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "40px",
    },
    section: {
      flex: "1",
      minWidth: "300px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#4a5568",
      marginBottom: "20px",
      paddingBottom: "10px",
      borderBottom: "2px solid #edf2f7",
    },
    infoRow: {
      marginBottom: "20px",
    },
    label: {
      fontSize: "13px",
      color: "#718096",
      marginBottom: "5px",
      display: "block",
    },
    value: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#2d3748",
    },
    valueHighlight: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#2d3748",
    },
    photosSection: {
      padding: "0 40px 30px",
    },
    photoGrid: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    photoCard: {
      flex: "1",
      minWidth: "200px",
      backgroundColor: "#f7fafc",
      borderRadius: "8px",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    photoLabel: {
      fontSize: "14px",
      color: "#718096",
      marginBottom: "10px",
    },
    photo: {
      maxHeight: "150px",
      maxWidth: "100%",
      borderRadius: "4px",
      objectFit: "cover",
    },
    footer: {
      padding: "30px 40px",
      background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
      borderTop: "1px solid #e2e8f0",
    },
    signatureGrid: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      flexWrap: "wrap",
    },
    signatureBox: {
      flex: "1",
      minWidth: "200px",
      textAlign: "center",
    },
    signatureLine: {
      margin: "50px auto 10px",
      width: "80%",
      height: "1px",
      backgroundColor: "#cbd5e0",
    },
    signatureTitle: {
      fontSize: "13px",
      color: "#718096",
    },
    watermark: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) rotate(-45deg)",
      fontSize: "120px",
      fontWeight: "bold",
      color: "rgba(226, 232, 240, 0.5)",
      pointerEvents: "none",
      zIndex: 0,
      textTransform: "uppercase",
      letterSpacing: "10px",
      whiteSpace: "nowrap",
    },
    buttonPrimary: {
      backgroundColor: "#3182ce",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      transition: "background-color 0.2s ease",
    },
  };

  return (
    <Container>
      <div ref={printRef}>
        <div id="birth">
          <div style={styles.certificate}>
            <div style={styles.topAccent}></div>
            <div
              style={styles.downloadBirthCertificateMain}
              className="card-headermain"
            >
              <div style={styles.logo} className="logo">
                <img
                  src={logo}
                  alt="Hospital Logo"
                  style={styles.hospitalLogo}
                  className="hospital-logo"
                />
              </div>
              <div style={styles.hospitalInfo} className="hospital-info">
                <h1 style={styles.hospitalName}>I-MEDIC-X</h1>
                <p style={styles.hospitalAddress}>Surgery Clinic</p>
                <p style={styles.hospitalAddress}>
                  45 Wellness Blvd, Lakeview, NY 12000
                </p>
                <p style={styles.hospitalAddress}>
                  Phone: (212) 555-4321 | e-mail: info@riversidemed.com
                </p>
              </div>
            </div>

            <div style={styles.header}>
              <div style={styles.titleSection}>
                <h1 style={styles.title}>Birth Certificate</h1>
                <p style={styles.subtitle}>
                  Official Record of Birth Registration
                </p>
              </div>
              <div style={styles.certificateIdTag}>
                <span style={styles.idIcon}>№</span>
                <span>{props.data.birthRecordId}</span>
              </div>
            </div>
            <div style={styles.mainContent}>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Child Information</h2>

                <div style={styles.infoRow}>
                  <span style={styles.label}>Full Name</span>
                  <div style={styles.valueHighlight}>
                    {props.data.childName}
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.label}>Date & Time of Birth</span>
                  <div style={styles.value}>
                    {moment(props.data.dateOfBirth).format(
                      "DD MMMM YYYY, h:mm A"
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "40px" }}>
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Gender</span>
                    <div style={styles.value}>{props.data.gender}</div>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.label}>Weight</span>
                    <div style={styles.value}>{props.data.weight} Kg</div>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Parents Information</h2>

                <div style={styles.infoRow}>
                  <span style={styles.label}>Mother's Name</span>
                  <div style={styles.value}>{props.data.motherName}</div>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.label}>Father's Name</span>
                  <div style={styles.value}>{props.data.fatherName}</div>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.label}>Contact Phone</span>
                  <div style={styles.value}>{props.data.phone}</div>
                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Medical Information</h2>

                <div style={styles.infoRow}>
                  <span style={styles.label}>IPD/OPD ID</span>
                  <div style={styles.value}>{props.data.ipdOrOpdId}</div>
                </div>

                {/* <div style={styles.infoRow}>
                  <span style={styles.label}>Medical Notes</span>
                  <div style={styles.value}>{props.data.report}</div>
                </div>

                {props.data.documentPhoto && (
                  <div style={styles.infoRow}>
                    <span style={styles.label}>Medical Documents</span>
                    <button onClick={openPDF} style={styles.buttonPrimary}>
                      View Document
                    </button>
                  </div>
                )} */}
              </div>
            </div>
            {/* <div style={styles.photosSection} className="hide-print">
              <h2 style={styles.sectionTitle}>Identification Documents</h2>
              <div style={styles.photoGrid}>
                {props.data.childPhoto && (
                  <div style={styles.photoCard}>
                    <span style={styles.photoLabel}>Child's Photo</span>
                    <img
                      style={styles.photo}
                      src={`data:image;base64,${props.data.childPhoto}`}
                      alt="Child's Photo"
                    />
                  </div>
                )} */}

                {/* {props.data.motherPhoto && (
                  <div style={styles.photoCard}>
                    <span style={styles.photoLabel}>Mother's ID</span>
                    <img
                      style={styles.photo}
                      src={`data:image;base64,${props.data.motherPhoto}`}
                      alt="Mother's ID"
                    />
                  </div>
                )}

                {props.data.fatherPhoto && (
                  <div style={styles.photoCard}>
                    <span style={styles.photoLabel}>Father's ID</span>
                    <img
                      style={styles.photo}
                      src={`data:image;base64,${props.data.fatherPhoto}`}
                      alt="Father's ID"
                    />
                  </div>
                )} */}
              {/* </div> */}
            {/* </div>  */}
            <div style={styles.footer}>
              <div style={styles.signatureGrid}>
                <div style={styles.signatureBox}>
                  <div style={styles.signatureLine}></div>
                  <div style={styles.signatureTitle}> Signature</div>
                </div>

                <div style={styles.signatureBox}>
                  <div style={styles.signatureLine}></div>
                  <div style={styles.signatureTitle}>Official Seal</div>
                </div>

                <div style={styles.signatureBox}>
                  <div style={styles.signatureLine}></div>
                  <div style={styles.signatureTitle}>Date of Issue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={handlePrint}>Print Certificate</Button>
    </Container>
  );
};

export default DownloadBirthRecord;