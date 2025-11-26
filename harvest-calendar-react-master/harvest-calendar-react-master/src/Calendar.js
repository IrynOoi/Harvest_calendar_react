// Calendar.js

import React from "react";
import "./Calendar.css";

// SVG Attributes
const 
  margin = 20,
  chartWidth = 915,
  barHeight = 20,
  barFill = "#40da6a",
  bgFillEven = "#fafaff",
  bgFillOdd = "#ededf0",
  barPadding = 1,
  labelMargin = 175,
  labelPadding = 10,
  rowHeight = barHeight + barPadding * 2,
  fontHeight = barHeight * .75,
  gridWidth = chartWidth - margin * 2 - labelMargin,
  gridUnit = gridWidth / 12

// For generating the x-axis labels
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const bgFill = (index) => index % 2 === 0 ? bgFillEven : bgFillOdd;

const calcDate = (date) => {
  const month = date.split("-")[1]
  const day = date.split("-")[2]
  return (day >= 20) 
    ? month
    : (day > 10) 
    ? month - 0.5
    : (day <= 10) 
    ? month - 1
    : null;
}

const calcBarWidth = (start, end) => {
  if (!start || !end) {
    return 0;
  }
  return (calcDate(end) - calcDate(start)) * gridUnit;
}

const calcBarStart = (date) => {
  return calcDate(date) * gridUnit;
}

const calcGridHeight = (cropCount) => {
  return cropCount * rowHeight
}

// Compare function for sorting crops in alpha before rendering
const alphaByCropName = (a, b) => {
  if (a.name.toUpperCase() < b.name.toUpperCase()) {
    return -1;
  }
  if (a.name.toUpperCase() > b.name.toUpperCase()) {
    return 1;
  }
  return 0;
}

function Calendar({ crops }) {
  const gridHeight = calcGridHeight(crops.length)
  return (
    <div id="svg-container">
      <svg 
        className="chart" 
        xmlns="http://www.w3.org/2000/svg"
        viewBox={
          `0 0 ${chartWidth} ${gridHeight + (margin * 2)}`
        }
        height={gridHeight + (margin * 2)}
        width={chartWidth}
      >
        <g 
          className="chart-body"
          transform={
              `translate(${labelMargin}, ${margin})`
          }
          height={gridHeight}
        >
          <g className="x-axis">
            <line
              stroke="black"
              x2={gridWidth}
            />
            {
              months.map((month, index) => {
                return (
                  <g 
                    key={`month-${index}`} 
                    id={`${month.toLowerCase()}`}
                    transform={
                      `translate(${index * gridUnit})`
                    }
                  >
                    <text
                      fontSize={fontHeight * 11 / 16}
                      fontFamily="sans-serif"
                      x="6"
                      y="-3"
                      textAnchor="start"
                    >
                      {month}
                    </text>
                  </g>
                )
              })
            }
          </g>
          {
            crops.slice().sort(alphaByCropName).map((crop, index) => (
              <g
                key={`crop-row-${index}`}
                className="crop"
                transform={
                  `translate(0, ${index * rowHeight})`
                }
              >
                <rect 
                  className="bg-fill"
                  fill={bgFill(index)}
                  height={rowHeight}
                  width={gridWidth}
                />
                {
                  crop.seasons[0]
                    ? (
                      <rect 
                        className="bar season-one"
                        fill={barFill}
                        height={barHeight}
                        width={
                          calcBarWidth(
                            crop.seasons[0].start,
                            crop.seasons[0].end,
                          )}
                        x={calcBarStart(crop.seasons[0].start)}
                        y={barPadding}
                      />
                    )
                    : null
                }
                { crop.seasons[1]
                  ? (
                    <rect 
                      className="bar season-two"
                      fill={barFill}
                      height={barHeight}
                      width={
                        calcBarWidth(
                          crop.seasons[1].start,
                          crop.seasons[1].end,
                        )}
                      x={calcBarStart(crop.seasons[1].start)}
                      y={barPadding}
                    />
                  )
                  : null
                }
                <text
                  className="crop-label"
                  x={-labelPadding}
                  dy={(barHeight / 2) + (fontHeight / 2)}
                  textAnchor="end"
                  fontFamily="sans-serif"
                  fontSize={fontHeight}
                  fill="black"
                >
                  {crop.name}
                </text>
              </g>
            ))
          }
          <g 
            className="grid"
            fill="none"
            transform={
              `translate(${0}, ${(crops.length) * rowHeight})`
            }
            textAnchor="middle"
          >
            <path 
              stroke="black" 
              d={`
                  M 0.5, ${-gridHeight}
                  V 0.5
                  H ${gridWidth + .5} 
                  V ${-gridHeight}
                `}
            />
            {
              months.map((month, index) => {
                return (
                  <line
                    className="tick"
                    key={`month-${index}-tick`} 
                    transform={
                      `translate(${(index + 1) 
                        * gridUnit + .5}, 0)`
                    }
                    stroke="black"
                    y2={`-${gridHeight}`}
                  />
                )
              })
            }
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Calendar;