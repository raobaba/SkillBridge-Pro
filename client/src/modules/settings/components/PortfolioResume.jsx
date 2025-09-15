import React from "react";
import { Calendar } from "lucide-react";

export default function PortfolioResume({ user }) {
  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <Calendar className='w-5 h-5 text-purple-400' /> Portfolio & Resume
      </h2>
      <div className='flex flex-col space-y-2'>
        <div className='flex items-center justify-between'>
          <span>Resume</span>
          {user.resumeUrl?.url ? (
            <a
              href={user.resumeUrl.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-cyan-400 underline'
            >
              View PDF
            </a>
          ) : (
            <span className='text-gray-400'>Not Uploaded</span>
          )}
        </div>
        <div className='flex items-center justify-between'>
          <span>Portfolio</span>
          {user.portfolioUrl ? (
            <a
              href={user.portfolioUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-cyan-400 underline'
            >
              View Portfolio
            </a>
          ) : (
            <span className='text-gray-400'>Not Added</span>
          )}
        </div>
        <div className='flex items-center justify-between'>
          <span>Portfolio Score</span>
          <span>{user.portfolioScore || 0}</span>
        </div>
      </div>
    </section>
  );
}
