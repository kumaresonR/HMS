// import React from "react"
// import Barcode from "react-barcode"

// const ViewPatientIdTemplate = (props: any) => {

//   return (
//     <React.Fragment>
//       <div
//         className="w-[340px] h-[210px] border-2 border-gray-500 rounded-lg shadow-lg bg-white relative overflow-hidden flex flex-col"
//         style={{
//           backgroundImage: `url(data:image/png;base64,${props.data.BackgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {/* Header */}
//         <div
//           className="text-white text-center py-1"
//           style={{ backgroundColor: props.data.HeaderColor }}
//         >
//           <h3
//             className="text-base font-bold"
//             dangerouslySetInnerHTML={{ __html: props.data.PatientIdCardTitle }}
//           ></h3>
//         </div>

//         <div className="p-3">
//           {/* Hospital Info */}
//           <div className="text-center mt-1">
//             <div
//               dangerouslySetInnerHTML={{ __html: props.data.HospitalName }}
//               className="text-sm font-semibold"
//             ></div>
//             <div
//               dangerouslySetInnerHTML={{ __html: props.data.HospitalAddress }}
//               className="text-xs text-gray-600"
//             ></div>
//           </div>

//           {/* Patient Details */}
//           <div className="mt-1 text-xs grid grid-cols-2 gap-1">
//             {props.data.PatientName && <p><strong>Name:</strong> John Doe</p>}
//             {props.data.PatientId && <p><strong>ID:</strong> 123456</p>}
//             {props.data.GuardianName && <p><strong>Guardian:</strong> Jane Doe</p>}
//             {props.data.PatientAddress && <p><strong>Address:</strong> Bhopal, India</p>}
//             {props.data.Phone && <p><strong>Phone:</strong> +91-9876543210</p>}
//             {props.data.DateOfBirth && <p><strong>DOB:</strong> 01/01/1990</p>}
//             {props.data.BloodGroup && <p><strong>Blood Group:</strong> O+</p>}
//           </div>

//           {/* Barcode */}
//           {props.data.Barcode && (
//             <div className="mt-1 flex justify-center">
//               <Barcode value="123456" height={30} width={1.5} />
//             </div>
//           )}

//           {/* Signature */}
//           {props.data.Signature && (
//             <div className="absolute bottom-1 right-3 text-center">
//               <img
//                 src={`data:image/png;base64,${props.data.Signature}`}
//                 alt="Signature"
//                 className="w-16 h-6"
//               />
//               <p className="text-[10px]">Signature</p>
//             </div>
//           )}
//         </div>

//       </div>
//     </React.Fragment>
//   )
// }

// export default ViewPatientIdTemplate

import React, { useRef } from "react"
import Barcode from "react-barcode"
import img from "../../assets/images/Doctor_Img.png";
import { useReactToPrint } from "react-to-print";
import bg from "../../assets/images/login/login-bg.jpg"

const ViewPatientIdTemplate = (props: any) => {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const printFront: any = useReactToPrint({ contentRef: frontRef });
  const printBack: any = useReactToPrint({ contentRef: backRef });

  const cardStyle = {
    width: "85.6mm",
    height: "53.98mm",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <React.Fragment>
      <h4 className="text-center mt-2">Patient ID Card</h4>
      <div className="d-flex justify-content-center  items-center gap-4">
        <div
          ref={frontRef}
          className="border rounded-lg shadow bg-white overflow-hidden relative"
          style={{
            ...cardStyle,
            backgroundImage: `url(data:image/png;base64,${props.data.BackgroundImage})`,
          }}
        >
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <div>
                <img src={`data:image/png;base64,${props.data?.Logo}`} alt="" height="50px" />
              </div>
            </div>
          </div>

          <div className="p-2 text-xs space-y-1">
            {props.data.PatientName && (
              <p>
                <strong>Name:   {props.data.PatientName}{" "}</strong>

              </p>
            )}
            {props.data.PatientId && (
              <p>
                <strong>ID:  {props.data.PatientId}{" "}</strong>
              </p>
            )}
            {props.data.BloodGroup && (
              <p>
                <strong>Blood Group:  {props.data.BloodGroup}{" "}</strong>
              </p>
            )}
            {props.data.BloodGroup && (
              <p>
                <strong>Phone:     {props.data.Phone}{" "}</strong>
              </p>
            )}
          </div>
        </div>

        <br />
        <br />

        <div
          ref={backRef}
          className="border rounded-lg shadow bg-white overflow-hidden relative"
          style={{
            ...cardStyle,
            backgroundImage: `url(data:image/png;base64,${props.data.BackgroundImage})`,
          }}
        >
          <div
            className="text-center text-white py-1 px-2"
            style={{ backgroundColor: props.data.HeaderColor }}
          >
            <h6
              style={{
                fontSize: "15px",
                color: "aliceblue",
                marginBottom: "0px",
              }}
            >
              {props.data.HospitalName}
            </h6>
            <div className="text-xs text-gray-200">
              {props.data.HospitalAddress}{" "}
            </div>
          </div>
          <div className="p-3 text-xs  ">
            {props.data.PatientAddress && (
              <p>
                <strong>Address: {props.data.PatientAddress}</strong>
              </p>
            )}

            {/* {props.data.DateOfBirth && (
              <p className="mb-1">
              <strong>DOB: {props.data.PatientAddress}</strong> 
              </p>
            )} */}

            <div className="row px-0">
              {props.data.Barcode && (
                <div className="col-6 ps-1">
                  <div className="flex justify-center">
                    <Barcode value="123456" height={10} width={1.5} />
                  </div>
                </div>
              )}

              {/* {props.data.Signature && (
                <div className="col-6 ps-0">
                  <div className="  right-2 text-center">
                    <img
                      src={`data:image/png;base64,${props.data.Signature}`}
                      alt="Signature"
                      width={30}
                    />
                    <p className="text-[10px]">Signature</p>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center  gap-2 mt-2">
        <button className="btn btn-primary btn-sm me-3" onClick={printFront}>
          Print Front
        </button>
        <button className="btn btn-secondary btn-sm" onClick={printBack}>
          Print Back
        </button>
      </div>

    </React.Fragment>
  )
}
export default ViewPatientIdTemplate