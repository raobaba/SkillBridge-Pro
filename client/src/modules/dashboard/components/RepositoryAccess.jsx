import React, { useState } from "react";
import Button from '../../../components/Button';
import {
  GitBranch,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Download,
  Code,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "react-toastify";

export default function RepositoryAccess({ project, applicationStatus }) {
  const [copied, setCopied] = useState(false);
  const [showCloneInstructions, setShowCloneInstructions] = useState(false);

  // Check if developer has access (accepted or shortlisted)
  const hasAccess = applicationStatus && 
    (applicationStatus.toLowerCase() === 'accepted' || 
     applicationStatus.toLowerCase() === 'shortlisted' ||
     applicationStatus.toLowerCase() === 'hired');

  const repositoryUrl = project?.repositoryUrl || project?.repository_url;

  const handleCopyCloneUrl = () => {
    if (repositoryUrl) {
      // Convert GitHub/GitLab URL to clone URL if needed
      let cloneUrl = repositoryUrl;
      if (repositoryUrl.includes('github.com')) {
        cloneUrl = repositoryUrl.replace('https://github.com/', 'https://github.com/').replace(/\/$/, '') + '.git';
      } else if (repositoryUrl.includes('gitlab.com')) {
        cloneUrl = repositoryUrl.replace('https://gitlab.com/', 'https://gitlab.com/').replace(/\/$/, '') + '.git';
      }
      
      navigator.clipboard.writeText(cloneUrl);
      setCopied(true);
      toast.success("Clone URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyRepositoryUrl = () => {
    if (repositoryUrl) {
      navigator.clipboard.writeText(repositoryUrl);
      setCopied(true);
      toast.success("Repository URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!repositoryUrl) {
    return (
      <div className='bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4'>
        <div className='flex items-center gap-2 text-yellow-400 mb-2'>
          <AlertCircle className='w-5 h-5' />
          <span className='font-medium'>Repository Not Available</span>
        </div>
        <p className='text-sm text-gray-400'>
          The project owner hasn't added a repository URL yet. Contact them to get access.
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className='bg-gray-500/10 border border-gray-500/20 rounded-lg p-4'>
        <div className='flex items-center gap-2 text-gray-400 mb-2'>
          <Lock className='w-5 h-5' />
          <span className='font-medium'>Repository Access Restricted</span>
        </div>
        <p className='text-sm text-gray-400'>
          You need to be accepted or shortlisted to access the repository. Your current status: <span className='text-white font-medium'>{applicationStatus || 'Not Applied'}</span>
        </p>
      </div>
    );
  }

  // Extract repository name from URL
  const getRepoName = (url) => {
    try {
      const match = url.match(/(?:github\.com|gitlab\.com)\/([^\/]+\/[^\/]+)/);
      return match ? match[1] : 'Repository';
    } catch {
      return 'Repository';
    }
  };

  const repoName = getRepoName(repositoryUrl);
  const cloneUrl = repositoryUrl.includes('.git') 
    ? repositoryUrl 
    : repositoryUrl.replace(/\/$/, '') + '.git';

  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center'>
            <GitBranch className='w-6 h-6 text-white' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white'>Repository Access</h3>
            <p className='text-sm text-gray-400'>{repoName}</p>
          </div>
        </div>
        <div className='flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full'>
          <Unlock className='w-4 h-4 text-green-400' />
          <span className='text-sm text-green-400 font-medium'>Access Granted</span>
        </div>
      </div>

      <div className='space-y-4'>
        {/* Repository URL */}
        <div>
          <label className='block text-sm font-medium text-gray-300 mb-2'>Repository URL</label>
          <div className='flex items-center gap-2'>
            <input
              type="text"
              value={repositoryUrl}
              readOnly
              className='flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500'
            />
            <Button
              onClick={handleCopyRepositoryUrl}
              className='px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg flex items-center gap-2'
            >
              {copied ? (
                <>
                  <CheckCircle2 className='w-4 h-4' />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className='w-4 h-4' />
                  Copy
                </>
              )}
            </Button>
            <Button
              onClick={() => window.open(repositoryUrl, '_blank')}
              className='px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg flex items-center gap-2'
            >
              <ExternalLink className='w-4 h-4' />
              Open
            </Button>
          </div>
        </div>

        {/* Clone URL */}
        <div>
          <label className='block text-sm font-medium text-gray-300 mb-2'>Clone URL (HTTPS)</label>
          <div className='flex items-center gap-2'>
            <input
              type="text"
              value={cloneUrl}
              readOnly
              className='flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-blue-500'
            />
            <Button
              onClick={handleCopyCloneUrl}
              className='px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center gap-2'
            >
              {copied ? (
                <>
                  <CheckCircle2 className='w-4 h-4' />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className='w-4 h-4' />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Clone Instructions */}
        <div className='pt-4 border-t border-white/10'>
          <Button
            onClick={() => setShowCloneInstructions(!showCloneInstructions)}
            className='w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg flex items-center justify-center gap-2 mb-3'
          >
            <Code className='w-4 h-4' />
            {showCloneInstructions ? 'Hide' : 'Show'} Clone Instructions
          </Button>

          {showCloneInstructions && (
            <div className='bg-white/5 border border-white/10 rounded-lg p-4 space-y-3'>
              <div>
                <p className='text-sm font-medium text-white mb-2'>Using Git Command Line:</p>
                <div className='bg-black/30 rounded p-3 font-mono text-sm text-green-400'>
                  <code>git clone {cloneUrl}</code>
                </div>
              </div>
              <div>
                <p className='text-sm font-medium text-white mb-2'>Using GitHub Desktop:</p>
                <ol className='list-decimal list-inside text-sm text-gray-300 space-y-1 ml-2'>
                  <li>Open GitHub Desktop</li>
                  <li>Click "File" → "Clone Repository"</li>
                  <li>Paste the repository URL</li>
                  <li>Choose a local path and click "Clone"</li>
                </ol>
              </div>
              <div>
                <p className='text-sm font-medium text-white mb-2'>Using VS Code:</p>
                <ol className='list-decimal list-inside text-sm text-gray-300 space-y-1 ml-2'>
                  <li>Open VS Code</li>
                  <li>Press <kbd className='px-2 py-1 bg-white/10 rounded text-xs'>Ctrl+Shift+P</kbd> (or <kbd className='px-2 py-1 bg-white/10 rounded text-xs'>Cmd+Shift+P</kbd> on Mac)</li>
                  <li>Type "Git: Clone" and select it</li>
                  <li>Paste the repository URL</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className='pt-4 border-t border-white/10'>
          <p className='text-sm font-medium text-white mb-3'>Quick Actions</p>
          <div className='grid grid-cols-2 gap-3'>
            <Button
              onClick={() => window.open(repositoryUrl, '_blank')}
              className='bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg flex items-center justify-center gap-2'
            >
              <ExternalLink className='w-4 h-4' />
              View on GitHub
            </Button>
            <Button
              onClick={handleCopyCloneUrl}
              className='bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded-lg flex items-center justify-center gap-2'
            >
              <Download className='w-4 h-4' />
              Copy Clone URL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

