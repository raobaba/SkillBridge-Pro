import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

const VideoCard = ({
  thumbnail,
  title,
  link,
  onClick,
  isClickable,
  className,  
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      if (link.startsWith("http")) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        navigate(link);
      }
    }
  };

  const cardClasses = classNames(
    "w-40 flex-shrink-0 cursor-pointer",
    className
  );

  return (
    <div className={isClickable ? cardClasses : "w-50 flex-shrink-0"}>
      <div className="relative" onClick={handleNavigation}>
        <img
          src={thumbnail}
          alt={`Thumbnail for ${title}`}
          className="h-38 w-48 rounded-lg object-cover"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 bg-cyan-500 rounded-full flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 fill-white ml-1"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

VideoCard.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
  isClickable: PropTypes.bool,
  className: PropTypes.string,
};

VideoCard.defaultProps = {
  description: "",
  link: "",
  onClick: null,
  isClickable: true,
  className: "",
};

export default VideoCard;
