/**
 * --------------------------------------------------------
 * File        : DotLoader.jsx
 * Description : Displays a loading animation with dots.
 * 
 * Notes:
 * - Renders either small or large dot loaders based on the `size` prop.
 * - Uses CSS classes to animate the dots, with variations in size.
 * --------------------------------------------------------
 */



import React from 'react';

const DotLoader = ({ size }) => {
  if (size) {
    return (
      <div>
        <div className="flex">
          <div className="mr-1">
            <div className="loading-dots">
              <div className="loading-dots--dot"></div>
              <div className="loading-dots--dot"></div>
              <div className="loading-dots--dot"></div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="loading-dots-large" style={{ marginTop: '-60px' }}>
          <div className="loading-dots--dot-large"></div>
          <div className="loading-dots--dot-large"></div>
          <div className="loading-dots--dot-large"></div>
          <div className="loading-dots--dot-large"></div>
        </div>
      </>
    );
  }
};

export default DotLoader;
