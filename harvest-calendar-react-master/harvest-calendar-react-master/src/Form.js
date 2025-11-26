// Form.js
import React from "react";
import "./Form.css";

function Form ({ crops, updateCrop, deleteCrop, id }) {
  return (
    <form id={id}>
      <div className="row">
        <div className="col-hd name">
          <h3>Name</h3>
        </div>
        <div className="col-hd season">
          <h3>Season(s)</h3>
        </div>
      </div>
      {
        crops.map((crop, index) => (
          <div className="row" key={`crop-row-${index}`}>
            <div className="name">
              <input
                type="text" 
                name="0-name" 
                value={crop.name ? crop.name : ""} 
                onChange={
                  e => updateCrop(index, {name: e.target.value})
                }
                placeholder="Add crop name"
              />
            </div>
            <div className="season season-one">
              <input
                className="date start"
                type="date" 
                name="0-start-one" 
                value={
                  crop.seasons[0]
                    ? crop.seasons[0].start
                    : "" 
                }
                onChange={
                  e => updateCrop(index, {startOne: e.target.value})
                }
              />
              <span className="date-divider">~</span>
              <input
                className="date end"
                type="date" 
                name="0-end-one" 
                value={
                  crop.seasons[0]
                    ? crop.seasons[0].end
                    : "" 
                }
                onChange={
                  e => updateCrop(index, {endOne: e.target.value})
                }
              />
            </div>
            <div className="season season-two">
              <input	
                className="date start"
                type="date" 	
                name="0-start-two" 	
                value={	
                  crop.seasons[1]	
                    ? crop.seasons[1].start	
                    : "" 	
                }	
                onChange={	
                  e => updateCrop(index, {startTwo: e.target.value})	
                }	
              />	
              <span className="date-divider">~</span>
              <input	
                className="date end"
                type="date" 	
                name="0-end-two" 	
                value={	
                  crop.seasons[1]	
                    ? crop.seasons[1].end	
                    : "" 	
                }	
                onChange={	
                  e => updateCrop(index, {endTwo: e.target.value})	
                }	
              />	
            </div>
            <div className="delete">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => deleteCrop(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      }
    </form>
  );
}

export default Form;