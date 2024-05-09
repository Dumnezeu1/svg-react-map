import React, { useState } from "react";
import { svgPathMap } from "./svgMapConstants";

import "./svgMap.css";

const jsxOptions = {
  throwIfNamespace: false,
};

interface ReactSvgMapProps {
  svgPathData?: {
    d: string,
    title: string,
    id: string,
    symbol?: string,
    textPath?: string,
  }[];
  pathColor?: string;
  pathSelectedColor?: string;
  pathStrokeWidth?: number;
  textColor?: string;
  textSelectedColor?: string;
  textFontSize?: number;
  textFontFamily?: string;
  zoomScaleFactor?: number;
  withHiddenMargins?: boolean;
  translateExtraXOffset?: number;
  translateExtraYOffset?: number;
  withZoomControls?: boolean;
  onPathClick?: (path: any) => void;
}

function ReactSvgMap({
  svgPathData = svgPathMap,
  pathColor = "#44bb92",
  pathSelectedColor = "#25e770",
  pathStrokeColor = "white",
  pathStrokeWidth = 0.2,
  textColor = "white",
  textSelectedColor = "white",
  textFontSize = 10,
  textFontFamily,
  zoomScaleFactor = 3,
  withHiddenMargins = true,
  translateExtraXOffset = 0,
  translateExtraYOffset = 0,
  withZoomControls = true,
  onPathClick,
}: ReactSvgMapProps) {
  const [selectedPath, setSelectedPath] = useState(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const handleScrollToPath = (path, isSelectedPath) => {
    const pathElement = document.getElementById(path.id);
    const svgContainer = document.getElementById("map-svg");

    if (pathElement) {
      // Apply zoom by setting the transform attribute of the SVG container

      // we get the elements bounding box
      const mapElementBounding = svgContainer.getBoundingClientRect();
      const pathElementBounding = pathElement.getBoundingClientRect();

      // Calculate the distance to translate
      const translateX =
        pathElementBounding.left -
        mapElementBounding.left - // Adjust for the container's position
        mapElementBounding.width / 2 +
        pathElementBounding.width / 2 +
        translateExtraXOffset;
      const translateY =
        pathElementBounding.top -
        mapElementBounding.top - // Adjust for the container's position
        mapElementBounding.height / 2 +
        pathElementBounding.height / 2 +
        translateExtraYOffset;

      // Apply SVG transform to translate the container
      if (!isSelectedPath) {
        setSelectedPath(path);

        if (!isZoomedIn) {
          // if the path is not zoomed in, we scale, then translate
          svgContainer.setAttribute(
            "transform",
            `scale(${zoomScaleFactor}) translate(${-translateX}, ${-translateY})`
          );
          setIsZoomedIn(true);
        } else {
          // if the path is already zoomed in, we transfer and then scale, if we do otherwise, we are already zoom and will trigger
          // a scale hard reset then animate, a flicker
          svgContainer.setAttribute(
            "transform",
            `translate(${-translateX}, ${-translateY}) scale(${zoomScaleFactor})`
          );
        }
      }
    }
    if (isSelectedPath) {
      svgContainer.removeAttribute("transform");
      setIsZoomedIn(false);
      setSelectedPath(null);
    }
  };

  const handlePathClick = (path) => {
    onPathClick && onPathClick(path);
    handleScrollToPath(path, selectedPath?.id === path.id);
  };

  return (
    <div className="map-svg-container">
      {withZoomControls && isZoomedIn && (
        <button
          onClick={() => {
            handleScrollToPath(selectedPath, true);
          }}
        >
          -
        </button>
      )}
      <div
        className="map-svg-wrapper"
        style={{
          overflow: withHiddenMargins ? "hidden" : "visible",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={"0 0 700.364 550.293"}
          width="750.36395"
          height="550.29416"
          preserveAspectRatio="xMidYMid meet"
          jsx={jsxOptions}
          id="map-svg"
          className="animate-translate"
        >
          {svgPathData.map((item) => {
            const { d, id, title, symbol, textPath } = item;
            return (
              <g key={id}>
                <path
                  d={d}
                  title={title}
                  id={id}
                  fill={selectedPath?.id === id ? pathSelectedColor : pathColor}
                  onClick={() => handlePathClick(item)}
                  style={{
                    stroke: pathStrokeColor,
                    strokeWidth: pathStrokeWidth,
                  }}
                />
                {textPath && symbol && (
                  <text
                    key={symbol}
                    transform={textPath}
                    onClick={() => handlePathClick(item)}
                    style={{
                      fill:
                        selectedPath?.id === id ? textSelectedColor : textColor,
                      fontSize: textFontSize,
                      fontFamily: textFontFamily,
                    }}
                  >
                    {symbol}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default ReactSvgMap;
