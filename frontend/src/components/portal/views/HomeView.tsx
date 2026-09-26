import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderGit2,
  Award,
  Cpu,
  Calendar,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Heart,
  Share2,
  ExternalLink,
  Code2,
  MoreHorizontal,
} from 'lucide-react';
import { MemberProfile, MemberPost, PostComment } from '../../types';

interface HomeViewProps {
  profile: MemberProfile;
  posts: MemberPost[];
  onNavigate: (view: 'profile' | 'projects' | 'certificates' | 'settings') => void;
  onOpenUpload: () => void;
}

const CLUB_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Annual Hackathon 2026: Genesis Sprint',
    date: 'Oct 14 - 16, 2026',
    tag: 'Hackathon',
    desc: 'Registration open for all active club divisions. Form teams up to 4 members to build autonomous systems.',
  },
  {
    id: 'ann-2',
    title: 'Distributed Systems & AI Architecture Workshop',
    date: 'This Saturday, 10:00 AM',
    tag: 'Workshop',
    desc: 'Hands-on session with our alumni engineers on large-scale model serving and GPU cluster orchestration.',
  },
  {
    id: 'ann-3',
    title: 'Lab Workstation Cluster Upgrade',
    date: 'Completed',
    tag: 'Infrastructure',
    desc: 'Upgraded 8 compute nodes in Advanced Computing Lab 4. Quota hours refreshed for current semester.',
  },
];

export function HomeView({ profile, posts, onNavigate, onOpenUpload }: HomeViewProps) {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newComments, setNewComments] = useState<Record<string, PostComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    
    const comment: PostComment = {
      id: `comment-${Date.now()}`,
      authorName: profile.name,
      content,
      timeAgo: 'Just now'
    };

    setNewComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));
    
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <div className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A373]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-heading text-[24px] font-extrabold text-white tracking-tight">
            Welcome back, {profile.name}
          </h1>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#26282A]">
          <div
            onClick={() => onNavigate('projects')}
            className="p-3.5 rounded-xl bg-[#000000] border border-[#26282A] hover:border-[#D4A373]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[#8E9296] mb-1">
              <span className="text-xs font-subheading">Projects</span>
              <FolderGit2 className="w-4 h-4 text-[#D4A373] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-heading text-xl font-bold text-white">
              {profile.uploadedProjects?.length || 0}
            </div>
            <span className="text-[10px] text-[#8E9296]">View repository</span>
          </div>

          <div
            onClick={() => onNavigate('certificates')}
            className="p-3.5 rounded-xl bg-[#000000] border border-[#26282A] hover:border-[#D4A373]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[#8E9296] mb-1">
              <span className="text-xs font-subheading">Certificates</span>
              <Award className="w-4 h-4 text-[#D4A373] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-heading text-xl font-bold text-white">
              {profile.certificates?.length || 0}
            </div>
            <span className="text-[10px] text-emerald-400">Verified Credentials</span>
          </div>

          <div
            onClick={() => onNavigate('profile')}
            className="p-3.5 rounded-xl bg-[#000000] border border-[#26282A] hover:border-[#D4A373]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[#8E9296] mb-1">
              <span className="text-xs font-subheading">Lab Quota</span>
              <Cpu className="w-4 h-4 text-[#D4A373] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-heading text-xl font-bold text-white">
              {profile.hardwarePass?.allocatedHours || 40} hrs
            </div>
            <span className="text-[10px] text-[#8E9296]">{profile.hardwarePass?.assignedLab}</span>
          </div>

          <div
            onClick={() => onNavigate('profile')}
            className="p-3.5 rounded-xl bg-[#000000] border border-[#26282A] hover:border-[#D4A373]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[#8E9296] mb-1">
              <span className="text-xs font-subheading">Standing</span>
              <TrendingUp className="w-4 h-4 text-[#D4A373] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-heading text-xl font-bold text-[#D4A373]">
              {profile.memberTier || 'Core Member'}
            </div>
            <span className="text-[10px] text-[#8E9296]">{profile.division}</span>
          </div>
        </div>
      </div>

      {/* Announcements & Club Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#D4A373]" />
              <span>Club Activity & Updates</span>
            </h2>
          </div>

          <div className="space-y-4">
            {posts.slice(0, 4).map((post) => {
              const isLiked = !!likedPosts[post.id];
              return (
                <div
                  key={post.id}
                  className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-5 shadow-xl space-y-3 hover:border-[#3D4042] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#141517] border border-[#26282A] flex items-center justify-center text-xs font-heading font-bold text-[#D4A373]">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-heading text-sm font-bold text-white">{post.authorName}</h4>
                        <p className="text-[11px] text-[#8E9296] font-subheading">
                          {post.authorRole} • {post.timeAgo}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === post.id ? null : post.id)}
                        className="text-[#8E9296] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {activeDropdown === post.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-[#141517] border border-[#26282A] rounded-xl shadow-lg z-10 overflow-hidden text-sm text-[#D1D5DB] font-subheading">
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-[#1A1C1F] hover:text-[#D4A373] transition-colors cursor-pointer"
                            onClick={() => { alert('Edit post functionality coming soon!'); setActiveDropdown(null); }}
                          >
                            Edit
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-[#1A1C1F] hover:text-[#D4A373] transition-colors cursor-pointer"
                            onClick={() => { alert('Save post functionality coming soon!'); setActiveDropdown(null); }}
                          >
                            Save
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-[#1A1C1F] hover:text-[#D4A373] transition-colors cursor-pointer"
                            onClick={() => { alert('Archive post functionality coming soon!'); setActiveDropdown(null); }}
                          >
                            Archive
                          </button>
                          <div className="h-px w-full bg-[#26282A]" />
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-red-950/40 text-red-400 transition-colors cursor-pointer"
                            onClick={() => { alert('Delete post functionality coming soon!'); setActiveDropdown(null); }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#D1D5DB] font-subheading leading-relaxed">
                    {post.content}
                  </p>

                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-[#26282A] max-h-64 w-full bg-[#000000]">
                      <img src={post.imageUrl} alt="Post preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {post.techStack && post.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.techStack.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-md bg-[#000000] text-white border border-[#26282A] text-[10px] font-mono-tech"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#26282A] flex items-center justify-between text-xs text-[#8E9296]">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isLiked ? 'text-red-400' : 'hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{(post.likesCount || 12) + (isLiked ? 1 : 0)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{(post.commentsCount || 3) + (newComments[post.id]?.length || 0)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: `Ascent Post by ${post.authorName}`,
                              text: post.content,
                              url: window.location.href,
                            }).catch(console.error);
                          } else {
                            navigator.clipboard?.writeText(window.location.href);
                            alert('Post link copied to clipboard!');
                          }
                        }}
                        className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                    </div>

                    {post.githubUrl && (
                      <a
                        href={post.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[#D4A373] hover:underline text-[11px]"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedComments[post.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3"
                      >
                        <div className="pt-3 border-t border-[#26282A] space-y-3">
                          {/* Existing & New Comments */}
                          {(post.comments || []).concat(newComments[post.id] || []).map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#141517] border border-[#26282A] flex items-center justify-center text-[10px] font-heading font-bold text-[#D4A373] shrink-0">
                                {comment.authorName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="bg-[#141517] rounded-xl rounded-tl-none px-3 py-2">
                                  <p className="text-xs font-heading font-bold text-white mb-0.5">{comment.authorName}</p>
                                  <p className="text-[11px] text-[#D1D5DB] font-subheading leading-relaxed">{comment.content}</p>
                                </div>
                                <p className="text-[9px] text-[#8E9296] mt-1 ml-1 font-mono-tech">{comment.timeAgo}</p>
                              </div>
                            </div>
                          ))}

                          {/* Comment Input */}
                          <div className="flex gap-2 mt-3 relative">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id);
                              }}
                              className="w-full bg-[#141517] border border-[#26282A] rounded-full pl-4 pr-10 py-1.5 text-xs text-white placeholder-[#8E9296] focus:outline-none focus:border-[#D4A373]/50 transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#D4A373] flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e4b585] transition-colors"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Announcements & Quick Access */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4A373]" />
              <span>Announcements</span>
            </h2>
          </div>

          <div className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-5 shadow-xl space-y-4">
            {CLUB_ANNOUNCEMENTS.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-xl bg-[#000000] border border-[#26282A] space-y-2 hover:border-[#D4A373]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-[#141517] text-[#D4A373] text-[10px] font-subheading border border-[#D4A373]/30">
                    {ann.tag}
                  </span>
                  <span className="text-[10px] text-[#8E9296] font-mono-tech">{ann.date}</span>
                </div>
                <h4 className="font-heading text-xs font-bold text-white">{ann.title}</h4>
                <p className="text-[11px] text-[#8E9296] font-subheading leading-normal">{ann.desc}</p>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#141517] hover:bg-[#1E2022] text-[#D4A373] border border-[#D4A373]/30 text-xs font-subheading flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore Member Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
