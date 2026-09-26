import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderGit2,
  Calendar,
  ArrowRight,
  MessageSquare,
  Heart,
  Share2,
  ExternalLink,
  Code2,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  X,
  UploadCloud,
} from 'lucide-react';
import { MemberProfile, MemberPost, PostComment, PostMediaItem } from '../../types';
import { PostMediaGallery } from '../PostMediaGallery';

interface HomeViewProps {
  profile: MemberProfile;
  posts: MemberPost[];
  onNavigate: (view: 'profile' | 'projects' | 'certificates' | 'settings') => void;
  onOpenUpload: () => void;
  onAddPost?: (post: MemberPost) => void;
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

export function HomeView({ profile, posts, onNavigate, onOpenUpload, onAddPost }: HomeViewProps) {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newComments, setNewComments] = useState<Record<string, PostComment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Post composer state with multiple media attachments
  const [composerText, setComposerText] = useState('');
  const [mediaItems, setMediaItems] = useState<PostMediaItem[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setMediaItems((prev) => [
          ...prev,
          {
            id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            type: 'image',
            url,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setMediaItems((prev) => [
          ...prev,
          {
            id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            type: 'video',
            url,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && mediaItems.length === 0) return;

    const firstImage = mediaItems.find((m) => m.type === 'image')?.url;
    const firstVideo = mediaItems.find((m) => m.type === 'video')?.url;

    const newPost: MemberPost = {
      id: `post-${Date.now()}`,
      authorName: profile.name,
      authorRole: profile.memberTier || profile.division || 'Core Innovator',
      authorAvatar: profile.avatar,
      timeAgo: 'Just now',
      content: composerText.trim(),
      imageUrl: firstImage,
      videoUrl: firstVideo,
      media: mediaItems,
      likesCount: 0,
      viewsCount: 1,
      commentsCount: 0,
      isLiked: false,
      comments: [],
    };

    if (onAddPost) {
      onAddPost(newPost);
    }
    setComposerText('');
    setMediaItems([]);
  };

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
      {/* Welcome Banner & Post Composer */}
      <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-6 relative overflow-hidden shadow-xl space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A373]/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Welcome sentence */}
        <div className="relative z-10">
          <h1 className="font-heading text-[24px] font-extrabold text-gray-900 dark:text-white tracking-tight">
            Welcome back, {profile.name}
          </h1>
        </div>

        {/* Post Bar below welcome sentence */}
        <div className="relative z-10 pt-4 border-t border-gray-200 dark:border-[#26282A]">
          <form onSubmit={handlePublishPost} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-[#141517] border border-[#D4A373]/40 flex items-center justify-center text-xs font-heading font-bold text-[#D4A373] shrink-0 overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  profile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                )}
              </div>
              <input
                type="text"
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Share a project milestone, research discovery, or hardware benchmark..."
                className="flex-1 bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A] rounded-full px-4 py-2.5 text-xs font-subheading text-gray-900 dark:text-white focus:outline-none focus:border-[#D4A373] transition-colors"
              />
            </div>

            {/* Media Previews Grid / Strip */}
            {mediaItems.length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-1 sm:pl-12">
                {mediaItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-[#26282A] bg-black/40 w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center shadow-md"
                  >
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.name || `Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
                        <video src={item.url} className="w-full h-full object-cover pointer-events-none" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                          <Video className="w-5 h-5 text-white/90" />
                        </div>
                        <span className="absolute bottom-1 left-1.5 px-1 py-0.5 rounded text-[8px] bg-black/70 text-white font-mono-tech truncate max-w-[85%]">
                          {item.name || 'Video'}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(item.id)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
                      title="Remove media"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 right-1.5 px-1 py-0.2 rounded bg-black/70 text-[9px] text-[#D4A373] font-mono-tech pointer-events-none">
                      {item.type === 'video' ? 'VIDEO' : 'IMAGE'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#1E2022]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Image Upload Input & Button (multiple) */}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="text-xs font-subheading text-gray-500 dark:text-[#8E9296] hover:text-[#D4A373] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#141517] transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Photos</span>
                </button>

                {/* Video Upload Input & Button (multiple) */}
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  multiple
                  onChange={handleVideoSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="text-xs font-subheading text-gray-500 dark:text-[#8E9296] hover:text-[#D4A373] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#141517] transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Videos</span>
                </button>

                {/* Attach Project */}
                <button
                  type="button"
                  onClick={onOpenUpload}
                  className="text-xs font-subheading text-gray-500 dark:text-[#8E9296] hover:text-[#D4A373] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#141517] transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span className="hidden sm:inline">Attach Project</span>
                  <span className="sm:hidden">Project</span>
                </button>
              </div>

              {/* Publish Button */}
              <button
                type="submit"
                disabled={!composerText.trim() && mediaItems.length === 0}
                className="px-5 py-1.5 rounded-full bg-[#D4A373] disabled:opacity-40 hover:bg-[#c49363] text-white dark:text-black text-xs font-heading font-bold transition-all shadow-md shadow-[#D4A373]/20 cursor-pointer disabled:cursor-not-allowed"
              >
                Publish
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Announcements & Club Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#D4A373]" />
              <span>Club Activity & Updates</span>
            </h2>
          </div>

          <div className="space-y-4">
            {posts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              return (
                <div
                  key={post.id}
                  className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-5 shadow-xl space-y-3 hover:border-gray-300 dark:hover:border-[#3D4042] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center text-xs font-heading font-bold text-[#D4A373] overflow-hidden shrink-0">
                        {post.authorAvatar ? (
                          <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                        ) : (
                          post.authorName.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-heading text-sm font-bold text-gray-900 dark:text-white">{post.authorName}</h4>
                        <p className="text-[11px] text-gray-500 dark:text-[#8E9296] font-subheading">
                          {post.authorRole} • {post.timeAgo}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === post.id ? null : post.id)}
                        className="text-gray-500 dark:text-[#8E9296] hover:text-gray-900 dark:text-white p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {activeDropdown === post.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] rounded-xl shadow-lg z-10 overflow-hidden text-sm text-gray-700 dark:text-[#D1D5DB] font-subheading">
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1C1F] hover:text-[#D4A373] transition-colors cursor-pointer"
                            onClick={() => { alert('Edit post functionality coming soon!'); setActiveDropdown(null); }}
                          >
                            Edit
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1C1F] hover:text-[#D4A373] transition-colors cursor-pointer"
                            onClick={() => { alert('Save post functionality coming soon!'); setActiveDropdown(null); }}
                          >
                            Save
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1C1F] hover:text-[#D4A373] transition-colors cursor-pointer"
                            onClick={() => { alert('Archive post functionality coming soon!'); setActiveDropdown(null); }}
                          >
                            Archive
                          </button>
                          <div className="h-px w-full bg-gray-200 dark:bg-[#26282A]" />
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

                  <p className="text-xs sm:text-sm text-gray-700 dark:text-[#D1D5DB] font-subheading leading-relaxed">
                    {post.content}
                  </p>

                  {/* Multi-Media Gallery */}
                  <PostMediaGallery media={post.media} imageUrl={post.imageUrl} videoUrl={post.videoUrl} />

                  {post.techStack && post.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.techStack.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-md bg-[#f8f9fa] dark:bg-[#000000] text-gray-900 dark:text-white border border-gray-200 dark:border-[#26282A] text-[10px] font-mono-tech"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200 dark:border-[#26282A] flex items-center justify-between text-xs text-gray-500 dark:text-[#8E9296]">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isLiked ? 'text-red-400' : 'hover:text-gray-900 dark:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{(post.likesCount || 12) + (isLiked ? 1 : 0)}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 hover:text-gray-900 dark:text-white transition-colors cursor-pointer"
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
                        className="flex items-center gap-1.5 hover:text-gray-900 dark:text-white transition-colors cursor-pointer"
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
                        <div className="pt-3 border-t border-gray-200 dark:border-[#26282A] space-y-3">
                          {/* Existing & New Comments */}
                          {(post.comments || []).concat(newComments[post.id] || []).map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center text-[10px] font-heading font-bold text-[#D4A373] shrink-0">
                                {comment.authorName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 dark:bg-[#141517] rounded-xl rounded-tl-none px-3 py-2">
                                  <p className="text-xs font-heading font-bold text-gray-900 dark:text-white mb-0.5">{comment.authorName}</p>
                                  <p className="text-[11px] text-gray-700 dark:text-[#D1D5DB] font-subheading leading-relaxed">{comment.content}</p>
                                </div>
                                <p className="text-[9px] text-gray-500 dark:text-[#8E9296] mt-1 ml-1 font-mono-tech">{comment.timeAgo}</p>
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
                              className="w-full bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] rounded-full pl-4 pr-10 py-1.5 text-xs text-gray-900 dark:text-white placeholder-[#8E9296] focus:outline-none focus:border-[#D4A373]/50 transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#D4A373] flex items-center justify-center text-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e4b585] transition-colors"
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
            <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4A373]" />
              <span>Announcements</span>
            </h2>
          </div>

          <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-5 shadow-xl space-y-4">
            {CLUB_ANNOUNCEMENTS.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A] space-y-2 hover:border-[#D4A373]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-[#141517] text-[#D4A373] text-[10px] font-subheading border border-[#D4A373]/30">
                    {ann.tag}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-[#8E9296] font-mono-tech">{ann.date}</span>
                </div>
                <h4 className="font-heading text-xs font-bold text-gray-900 dark:text-white">{ann.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-[#8E9296] font-subheading leading-normal">{ann.desc}</p>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-[#141517] hover:bg-gray-100 dark:hover:bg-[#1E2022] text-[#D4A373] border border-[#D4A373]/30 text-xs font-subheading flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
