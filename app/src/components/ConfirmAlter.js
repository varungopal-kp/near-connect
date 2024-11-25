import React from "react";
import { toast } from "react-toastify";

const ConfirmToast = ({ onConfirm }) => {
  return toast(
    <div>
      <p>Are you sure you?</p>
      <button
        className="btn btn-danger"
        style={{
          marginRight: "10px",
        }}
        onClick={() => {
          onConfirm();
          toast.dismiss();
        }}
      >
        Yes
      </button>
      <button className="btn btn-success" onClick={() => toast.dismiss()}>
        No
      </button>
    </div>,
    { autoClose: false }
  );
};

export default ConfirmToast;
