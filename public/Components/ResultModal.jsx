import React from "react";

function ResultModal({type, icon, title, message, redirect= null}) {
  return (
    <div
      id="result-modal"
      className="fixed inset-0 z-10000 hidden items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="w-[90%] max-w-md bg-white rounded-2xl p-8 text-center shadow-2xl">
        <div
          id="modal-icon"
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
        >      <img
        src={icon}
        alt={type}
        className="w-10 h-10 mx-auto"
      /></div>

        <h2
          id="modal-title"
          className={type=== "success"? "mb-3 text-xl font-bold text-green-500" : "mb-3 text-xl font-bold text-red-500" }
        >{title}</h2>

        <p id="modal-message" className="mb-6 text-md text-">{message}</p>

        <button
          id="modal-close"
          className="block w-full h-full rounded-lg bg-blue-500 py-3 font-medium text-white transition hover:bg-indigo-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default ResultModal;
