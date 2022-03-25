/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import logo from "./giphy.gif";
export const Button = ({ type, ...props }) => {
  const buttonStyle = (type) =>
    css({
      border: "none",
      color: "white",
      padding: "14px 28px",
      margin: "3px",
      cursor: "pointer",
      backgroundColor:
        type === "success"
          ? "#04AA6D"
          : type === "info"
          ? "#2196F3"
          : type === "warning"
          ? "#ff9800"
          : type === "danger"
          ? "#f44336"
          : "#e7e7e7",
      ":hover": {
        backgroundColor:
          type === "success"
            ? "#46a049"
            : type === "info"
            ? "#0b7dda"
            : type === "warning"
            ? "#e68a00"
            : type === "danger"
            ? "#da190b"
            : "#ddd",
      },
      ":disabled": {
        cursor: "not-allowed",
      },
    });
  return <button css={buttonStyle(type)} {...props} />;
};
export const Modal = ({ isVisible, closeModal, children }) => {
  const modalStyle = (isVisible) =>
    css({
      display: isVisible ? "blocked" : "none",
      position: "fixed",
      zIndex: 1,
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      overflow: "auto",
      backgroundColor: "rgba(0,0,0,0.9)",
    });

  const closeButtonStyle = () =>
    css({
      position: "absolute",
      top: 15,
      right: 35,
      color: "#f1f1f1",
      fontSize: 40,
      fontWeight: "bold",
      transition: "0.3s",
      ":hover,:focus": {
        color: "#bbb",
        textDecoration: "none",
        cursor: "pointer",
      },
    });
  const contentStyle = () =>
    css({
      margin: "auto",
      display: "block",
      width: "80%",
      maxWidth: 700,
      background: "white",
      minHeight: "20%",
    });

  return (
    <div css={modalStyle(isVisible)}>
      <div css={contentStyle}>
        <span css={closeButtonStyle} onClick={() => closeModal()}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export const Input = (props) => {
  const inputStyle = () =>
    css({
      padding: "15px",
      fontSize: "17px",
      float: "left",
      background: "white",
      border: "1px solid grey",
      ":hover,:focus": {
        borderColor: "1px solid #f1f1f",
        background: "#f1f1f1",
      },
    });
  return <input css={inputStyle} {...props} />;
};

export const Label = (props) => {
  return (
    <span
      css={{
        fontSize: 15,
        textTransform: "capitalize",
      }}
      {...props}
    />
  );
};
export const Separator = () => {
  return <div css={{ border: "1px solid #00000026", marginTop: "10px" }} />;
};
export const Loader = ({ isVisible }) => {
  return (
    <span
      css={{
        display: isVisible ? "block" : "none",
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        color: "white",
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0,0,0,0.9)",
        textAlign: "center",
      }}
    >
      <span>
        <img src={logo} alt="logo" />
      </span>
    </span>
  );
};
