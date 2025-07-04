/**
 * --------------------------------------------------------
 * File        : WorkFlowLoader.js
 * Description : Conditionally renders a loading spinner (DotLoader).
 * 
 * Notes:
 * - Displays `DotLoader` when `isLoading` is true.
 * - Positions the loader at the center of the screen.
 * - Does not render anything when `isLoading` is false.
 * --------------------------------------------------------
 */


import DotLoader from './DotLoader';

function WorkFlowLoader({ isLoading }) {
  return isLoading ? (
    <div className="absolute customLoader-center">
      <DotLoader size={'sm'} />
    </div>
  ) : null;
}

export default WorkFlowLoader;
