// Form.js
import React from "react";
import "./Form.css";

function Form({ crops, updateCrop, deleteCrop, id }) {
  return (
    <form id={id}>
      <div className="row">
        <div className="col-hd name"><h3>Name</h3></div>
        <div className="col-hd season"><h3>Season(s)</h3></div>
      </div>

      {crops.map((crop, index) => (
        <div className="row" key={`crop-row-${index}`}>
          <div className="name">
            <input
              type="text"
              value={crop.name || ""}
              onChange={e => updateCrop(index, { name: e.target.value })}
              placeholder="Add crop name"
            />
          </div>

          <div className="season">
            {crop.seasons.map((season, sIndex) => (
              <div className="season-item" key={sIndex}>
                <input
                  type="date"
                  value={season.start}
                  onChange={e => {
                    const newSeasons = crop.seasons.map((s, i) =>
                      i === sIndex ? { ...s, start: e.target.value } : s
                    );
                    updateCrop(index, { seasons: newSeasons });
                  }}
                />
                <span className="date-divider">~</span>
                <input
                  type="date"
                  value={season.end}
                  onChange={e => {
                    const newSeasons = crop.seasons.map((s, i) =>
                      i === sIndex ? { ...s, end: e.target.value } : s
                    );
                    updateCrop(index, { seasons: newSeasons });
                  }}
                />
              </div>
            ))}

            {/* Add season button */}
            <button
              type="button"
              className="btn btn-secondary add-season"
              onClick={() => {
                const newSeasons = [...crop.seasons, { start: "", end: "" }];
                updateCrop(index, { seasons: newSeasons });
              }}
            >
              + Add Season
            </button>
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
      ))}
    </form>
  );
}

export default Form;
