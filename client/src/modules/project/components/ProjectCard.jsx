import React from 'react';
import { 
  Briefcase, 
  Heart, 
  Share2, 
  Bookmark, 
  DollarSign, 
  Clock 
} from 'lucide-react';
import { Button } from '../../../components';

/**
 * Reusable Project Card component for grid view
 * @param {Object} props
 * @param {Object} props.project - Project data object
 * @param {boolean} props.isPublicOnly - Whether in public-only mode
 * @param {Array} props.appliedProjects - Array of applied project IDs
 * @param {Function} props.onApply - Apply button click handler
 * @param {Function} props.onViewDetails - View details click handler
 * @param {Function} props.onSave - Save button click handler
 * @param {Function} props.onFavorite - Favorite button click handler
 * @param {Function} props.onShare - Share button click handler
 * @param {Function} props.isProjectSaved - Function to check if project is saved
 * @param {Function} props.isProjectFavorited - Function to check if project is favorited
 * @param {number} props.savingProjectId - ID of project being saved
 */
const ProjectCard = ({
  project,
  isPublicOnly,
  appliedProjects,
  onApply,
  onViewDetails,
  onSave,
  onFavorite,
  onShare,
  isProjectSaved,
  isProjectFavorited,
  savingProjectId
}) => {
  return (
    <div className='relative h-full'>
      {/* Urgent badge */}
      {project.isUrgent && (
        <div className='absolute top-3 right-3 z-10 px-2 py-1 text-[10px] rounded-full bg-red-500/20 text-red-300 border border-red-500/30'>
          Urgent
        </div>
      )}

      {/* Compact Card */}
      <div className='bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/5 transition-all duration-300 h-full flex flex-col'>
        {/* Header */}
        <div className='p-4 sm:p-5 border-b border-white/10'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex items-start gap-3 min-w-0 flex-1'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shrink-0'>
                <Briefcase className='w-4 h-4 text-white' />
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='text-white font-semibold text-sm sm:text-base leading-tight line-clamp-2'>
                  {project.title}
                </h3>
                <div className='mt-2 flex items-center gap-1.5 flex-wrap'>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      project.status === "active"
                        ? "bg-green-500/20 text-green-300"
                        : project.status === "upcoming"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {project.statusDisplay}
                  </span>
                  {project.isFeatured && (
                    <span className='px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-500/20 text-yellow-300'>
                      Featured
                    </span>
                  )}
                  {project.benefits && (
                    <span className='px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-500/20 text-green-300'>
                      Rewards
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isPublicOnly && (
              <div className='flex gap-1.5 sm:gap-2 shrink-0'>
                <Button
                  onClick={() => onSave(project.id)}
                  disabled={savingProjectId === project.id}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-300 ${
                    isProjectSaved(project.id)
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-white/10 text-gray-400 hover:bg-white/20"
                  } ${savingProjectId === project.id ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={
                    savingProjectId === project.id
                      ? "Saving..."
                      : isProjectSaved(project.id)
                        ? "Saved"
                        : "Save"
                  }
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isProjectSaved(project.id) ? "fill-current" : ""}`}
                  />
                </Button>
                <Button
                  onClick={() => onFavorite(project.id)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-300 ${
                    isProjectFavorited(project.id)
                      ? "bg-pink-500/20 text-pink-400"
                      : "bg-white/10 text-gray-400 hover:bg-white/20"
                  }`}
                  title={
                    isProjectFavorited(project.id)
                      ? "Favorited"
                      : "Favorite"
                  }
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isProjectFavorited(project.id) ? "fill-current" : ""}`}
                  />
                </Button>
                <Button
                  className='p-1.5 sm:p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300'
                  onClick={() => onShare(project)}
                >
                  <Share2 className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Body minimal info */}
        <div className='p-4 sm:p-5 flex-1 flex flex-col gap-3'>
          {/* Tags (up to 3) */}
          <div className='flex flex-wrap gap-1.5'>
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className='px-2 py-0.5 rounded-full text-[10px] text-white bg-gradient-to-r from-blue-500 to-purple-500'
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className='px-2 py-0.5 rounded-full text-[10px] text-gray-300 bg-white/10'>
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Meta Row (2 items only for compactness) */}
          <div className='flex items-center justify-between text-xs text-gray-400'>
            <span className='flex items-center gap-1 truncate'>
              <DollarSign className='w-3 h-3 flex-shrink-0' />
              <span className='truncate'>{project.budget}</span>
            </span>
            <span className='flex items-center gap-1 flex-shrink-0 ml-2'>
              <Clock className='w-3 h-3' />
              {project.duration}
            </span>
          </div>
        </div>

        {/* Footer actions pinned */}
        <div className='p-4 sm:p-5 pt-0 mt-auto'>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => onViewDetails(project)}
              className='flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors duration-300'
            >
              <span className='hidden sm:inline'>View Details</span>
              <span className='sm:hidden'>View</span>
            </Button>
            {!isPublicOnly && (
              <Button
                onClick={() => onApply(project.id)}
                variant="apply-grid"
                isApplied={appliedProjects.includes(project.id)}
                className='text-xs sm:text-sm'
              >
                {appliedProjects.includes(project.id) ? "Applied" : "Apply"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;