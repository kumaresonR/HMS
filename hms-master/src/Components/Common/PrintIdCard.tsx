import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const PrintIDCard = (props: any) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
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
                        .flip-card {
                          width: 375px;
                          height: 269px;
                          display: flex;
                          justify-content: space-between; 
                          gap: 20px; 
                        }

                        .flip-card-inner {
                          display: flex;
                          width: 100%;
                          height: 100%;
                          position: relative;
                          transition: none;
                          transform: none;
                        }

                        .flip-card-front {
                          width: 48%; 
                          height: 100%;
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          border-radius: 10px;
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                          text-align: center;
                          padding: 20px;
                        }

                        .flip-card-back {
                          width: 48%; 
                          height: 100%;
                          display: flex;
                          flex-direction: column;
                          align-items: start;
                          justify-content: center;
                          border-radius: 10px;
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                          text-align: center;
                          padding: 20px;
                        }

                        .flip-card-front {
                          background: #3498db;
                          color: white;
                        }

                        .flip-card-back {
                          background: #2ecc71;
                          color: white;
                        }

                        .patient-img {
                          width: 100px;
                          height: 100px;
                          border-radius: 50%;
                          border: 3px solid white;
                          margin-bottom: 10px;
                        }

                        .flip-button {
                          margin-top: 10px;
                          padding: 10px 15px;
                          border: none;
                          background: #fff;
                          color: #3498db;
                          font-size: 14px;
                          font-weight: bold;
                          cursor: pointer;
                          border-radius: 5px;
                        }

                        .flip-button:hover {
                          background: #f0f0f0;
                        }

                        @media print {
                          * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                          }

                          body {
                            margin: 5px;
                            padding: 5px;
                          }

                          .flip-card {
                            display: flex !important;
                            flex-direction: column !important;
                            justify-content: center !important; /* Center the cards horizontally */
                            align-items: center !important;
                            width: 100% !important;
                            height: auto !important;
                            page-break-inside: avoid;
                          }

                          .flip-card-inner {
                            display: flex !important;
                            flex-direction: column !important;
                            justify-content: center !important;
                            align-items: center !important;
                            width: auto !important;
                            height: 100% !important;
                            gap : 5px;
                            transform: none !important;
                            transition: none !important;
                          }

                          .flip-card-front {
                            width: 400px !important; /* Set a fixed width */
                            height: 269px !important; /* Set a fixed height */
                            text-align: center;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: none !important;
                            display: flex !important;
                            justify-content: center;
                            align-items: center;
                          }

                          .flip-card-back {
                            width: 400px !important; /* Set a fixed width */
                            height: 269px !important; /* Set a fixed height */
                            text-align: center;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: none !important;
                            display: flex !important;
                            justify-content: center;
                            align-items: start;
                          }

                          .flip-card-front {
                            background: #3498db !important;
                            color: white !important;
                          }

                          .flip-card-back {
                            background: #2ecc71 !important;
                            color: white !important;
                            transform: none !important;
                          }

                          .flip-button {
                            display: none !important; 
                          }

                          @page {
                            size: A4 portrait;
                            margin: 20mm;
                          }
                        }
                    </style>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    </head>
                    <body onload="window.print(); window.close();">
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
      <Link to="#" className="btn btn-sm btn-soft-dark edit-list mx-1" title="Print"
        onClick={handlePrint}>
        <FontAwesomeIcon icon={faPrint} />
      </Link>
    </>
  );
}
export default PrintIDCard