import React, { useState, useEffect, useRef } from "react";

const SvgMapModal = ({ show, modalWidth = 400, description }) => {
  const ref = useRef(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [className, setClassName] = useState("");

  const [modalCurrentHeight, setModalCurrentHeight] = useState(0);

  useEffect(() => {
    const svgContainer = document.getElementById("map-svg-wrapper");

    if (svgContainer) {
      const svgRect = svgContainer?.getBoundingClientRect();

      const centerX = svgRect.height / 2 - modalCurrentHeight - 30;
      const centerY = svgRect.width / 2 - modalWidth / 2 + 30;

      setPosition({ x: centerX, y: centerY });
    }
  }, [modalWidth, modalCurrentHeight]);

  useEffect(() => {
    if (!show) {
      setClassName("");
    } else {
      setClassName("info-text-active");
    }
  }, [show]);

  useEffect(() => {
    setModalCurrentHeight(ref.current?.clientHeight);
  }, [description]);

  if (!show || !description) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`info-text ${className}`}
      style={{ left: position.y, top: position.x, width: modalWidth }}
    >
      {/* Your info text content */}
      <p>{description}</p>
      <div className="arrow-down"></div>
    </div>
  );
};

export default SvgMapModal;
