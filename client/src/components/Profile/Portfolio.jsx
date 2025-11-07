import React from "react";
import { Briefcase, ExternalLink, TrendingUp, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";

export default function Portfolio({ editing, form, handleChange, userData }) {
  const navigate = useNavigate();

  // Get portfolio URL and score
  // When editing: use form value (which gets updated by handleChange), fallback to userData for initial render
  // When viewing: use userData
  const portfolioUrl = editing 
    ? (form?.portfolioUrl !== undefined ? form.portfolioUrl : (userData?.portfolioUrl || ""))
    : (userData?.portfolioUrl || "");
    
  const portfolioScore = editing
    ? (form?.portfolioScore !== undefined ? form.portfolioScore : (userData?.portfolioScore || 0))
    : (userData?.portfolioScore || 0);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-orange-400" />
          Portfolio
        </h2>
        {portfolioUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/portfolio-sync")}
            className="flex items-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            Sync Portfolio
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          {/* Portfolio URL Input */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Portfolio URL</label>
            <input
              type="url"
              name="portfolioUrl"
              value={portfolioUrl || ""}
              onChange={handleChange}
              placeholder="https://your-portfolio.com"
              className="w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
            />
            {portfolioUrl && (
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm"
              >
                <ExternalLink className="w-3 h-3" />
                Visit Portfolio
              </a>
            )}
          </div>

          {/* Portfolio Score Display (Read-only, calculated from sync) */}
          {portfolioScore > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Portfolio Score
                </label>
                <span className="text-green-400 font-semibold">{portfolioScore}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${portfolioScore}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-xs">
                Score is automatically calculated from your portfolio content
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {portfolioUrl ? (
            <>
              <div className="flex items-center justify-between">
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-medium">View Portfolio</span>
                </a>
                {portfolioScore > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-semibold">{portfolioScore}/100</span>
                  </div>
                )}
              </div>
              {portfolioScore > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                    style={{ width: `${portfolioScore}%` }}
                  ></div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400">No portfolio URL added yet</p>
          )}
        </div>
      )}
    </div>
  );
}

