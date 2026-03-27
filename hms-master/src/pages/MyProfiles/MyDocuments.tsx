import React, { useState } from 'react'
import { FaDownload, FaEye } from 'react-icons/fa';
import { Button, Card, CardBody, CardHeader, Col, Modal, ModalBody, Row } from 'reactstrap'

const MyDocuments = (props: any) => {
    const data = props.data;

    const [preview, setPreview] = useState({ isOpen: false, url: "", type: "" });

    // Document data
    const documentsData = [
        { label: "Resume", value: data.resume || "", fileName: "Resume.pdf" },
        { label: "Resignation Letter", value: data.resignationLetter || "", fileName: "Resignation_Letter.pdf" },
        { label: "Joining Letter", value: data.joiningLetter || "", fileName: "Joining_Letter.pdf" },
        { label: "Other Documents", value: data.otherDocuments || "", fileName: "Other_Documents.pdf" },
    ];

    // Filter valid documents
    const filteredDocumentsData = documentsData.filter(item => item.value);

    // Convert Base64 to Blob and create a URL
    const handlePreview = (base64Data:any, fileType:any) => {
        try {
            // Remove metadata if present (data:application/pdf;base64,)
            const cleanBase64 = base64Data.split(",")[1] || base64Data;

            // Convert Base64 to binary
            const byteCharacters = atob(cleanBase64);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            // Create Blob
            const blob = new Blob([byteNumbers], { type: fileType });
            const blobUrl = URL.createObjectURL(blob);

            // Open preview modal
            setPreview({ isOpen: true, url: blobUrl, type: fileType });
        } catch (error) {
            console.error("Error processing Base64 data:", error);
        }
    };

    // Download document
    const handleDownload = (base64Data:any, fileName:any, fileType:any) => {
        try {
            const cleanBase64 = base64Data.split(",")[1] || base64Data;
            const byteCharacters = atob(cleanBase64);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: fileType });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Error downloading the document:", error);
        }
    };

    return (
        <React.Fragment>
            <Card>
                <CardHeader className="border-0">
                    <h4>My Documents</h4>
                </CardHeader>
                <CardBody>
                    <Row>
                        {filteredDocumentsData.map((item, index) => (
                            <Col md={4} key={index}>
                                <Card className="p-3 text-center">
                                    <h6>{item.label}</h6>
                                    <div className="d-flex justify-content-center mt-2">
                                        {/* Preview Button */}
                                        <Button color="primary" className="me-2" onClick={() => handlePreview(item.value, "application/pdf")}>
                                            <FaEye /> Preview
                                        </Button>

                                        {/* Download Button */}
                                        <Button color="success" onClick={() => handleDownload(item.value, item.fileName, "application/pdf")}>
                                            <FaDownload /> Download
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </CardBody>
            </Card>

            {/* Preview Modal */}
            <Modal isOpen={preview.isOpen} toggle={() => setPreview({ ...preview, isOpen: false })} size="xl">
                <ModalBody>
                    {preview.type.includes("pdf") ? (
                        <iframe src={preview.url} width="100%" height="500px" title="Preview" />
                    ) : (
                        <img src={preview.url} alt="Preview" style={{ width: "100%" }} />
                    )}
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default MyDocuments