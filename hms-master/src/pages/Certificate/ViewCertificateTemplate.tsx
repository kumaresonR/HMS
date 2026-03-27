import React, { useEffect, useState } from 'react'

const ViewCertificateTemplate = (props: any) => {
  
  return (
    <React.Fragment>
      <div
        style={{
          width: `${props.data.ContentWidth}px`,
          padding: "20px",
          border: "2px solid black",
          position: "relative",
          backgroundImage: props?.data?.BackgroundImage ? `url("data:image/png;base64,${props?.data?.BackgroundImage}")` : "none",
          backgroundSize: "cover",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", height: `${props.data.HeaderHeight}px` }}>
          <div dangerouslySetInnerHTML={{ __html: props.data.HeaderLeftText }} />
          <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: props.data.HeaderCenterText }} />
          <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: props.data.HeaderRightText }} />
        </div>

        {/* Body */}
        <div style={{ minHeight: "200px", padding: "20px" }} dangerouslySetInnerHTML={{ __html: props.data.BodyText }} />

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", height: `${props.data.FooterHeight}px`, marginTop: "20px" }}>
          <div dangerouslySetInnerHTML={{ __html: props.data.FooterLeftText }} />
          <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: props.data.FooterCenterText }} />
          <div style={{ textAlign: "right" }} dangerouslySetInnerHTML={{ __html: props.data.FooterRightText }} />
        </div>

        {/* Patient Image */}
        {props.data.IsActivePatientImage === "yes" && props.data.PatientImage && (
          <img
            src={props.data.PatientImage}
            alt="Patient"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              height: `${props.data.PhotoHeight}px`,
            }}
          />
        )}
      </div>
    </React.Fragment>
  )
}

export default ViewCertificateTemplate