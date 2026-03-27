import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoDark from "../../assets/images/Logo_medic.jpg"
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";

const PrintComponent = (props: any) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const qrSVG = `
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                    ${document.querySelector(".qr-code svg")?.outerHTML || ""}
                </svg>
            `;
            const content = document.getElementById(props.contentId)?.innerHTML || '';
            printWindow.document.write(`
                <html>
                    <head>
                        <title>I-MEDIC-X</title>
                         <style>
                        @media print {
                            @page {
                                margin-top: 5px;
                                margin-bottom: 5px;
                            }
                            @page :header {
                                display: none;
                            }
                            @page :footer {
                                display: none;
                            }
                            .hide-print {
                                display: none !important;
                            }
                        }
                    </style>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    </head>
                    <body onload="window.print(); window.close();">
                        <div class="container-fluid">
                            <div class="row align-items-center justify-content-between">
                                <div class="col-auto">
                                    <img src="${logoDark}" class="card-logo card-logo-dark bg-dark" alt="logo dark" height="50" />
                                </div>

                                <div class="col text-center">
                                    <div>
                                        <label class="fw-bold">I-MEDIC-X</label>
                                        <br />
                                        <label>2-261A, WCC Road, </label>
                                        <br>
                                        <label>Nagercoil, India - 629001</label>
                                    </div>
                                </div>

                                <div class="col-auto text-end">
                                    ${qrSVG}
                                </div>
                            </div>
                        </div>

                        <hr />
                        ${content}
                        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>
                    </body>
                </html>
            `);
            printWindow.document.close();

            printWindow.onafterprint = () => props.onClose && props.onClose();
        } else {
            console.error("Failed to open print window.");
        }
    };

    return (
        <>
            <div className="qr-code" style={{ display: "none" }}>
                <QRCode value="I-MEDIC-X" size={50} />
            </div>
            <Link to="#" className="btn btn-sm btn-soft-dark edit-list mx-1" title="Print"
                onClick={handlePrint}>
                <FontAwesomeIcon icon={faPrint} />
            </Link>
        </>
    );
}
export default PrintComponent