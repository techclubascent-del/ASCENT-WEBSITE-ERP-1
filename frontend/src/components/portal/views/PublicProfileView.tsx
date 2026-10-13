import React, { useState } from 'react';
import { Camera, Edit3, ShieldCheck, Copy, Check, User, Calendar, MapPin, Mail, Phone, MessageSquare, FolderGit2, Award, Download, Users, PlusCircle, UserPlus } from 'lucide-react';
import { MemberProfile, ClubProject, MemberCertificate, MemberPost } from '../../../types';
import { PostMediaGallery } from '../PostMediaGallery';

interface PublicProfileViewProps {
  profile: MemberProfile;
  posts: MemberPost[];
  onMessageClick?: () => void;
  onViewPeerProfile?: (usn: string) => void;
}

export function PublicProfileView({ profile, posts, onMessageClick, onViewPeerProfile }: PublicProfileViewProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'certificates'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followedSimilarMembers, setFollowedSimilarMembers] = useState<Record<string, boolean>>({});

  // Derive cover styles exactly as the portal does
  const isCustomCover = !!profile.coverStyle && profile.coverStyle.startsWith('http');
  const currentCover = {
    gradientClass: 'from-[#0C0D0E] via-[#141517] to-[#1E2022]',
    accentGlow: 'radial-gradient(circle at 70% 30%, rgba(212, 163, 115, 0.15) 0%, transparent 60%)',
    bgPattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34l-.83.83H.83l-.83-.83V.83L.83 0h53.797zm-1.83 2H3.197v56h49.6V2z\' fill=\'%23D4A373\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    bgSize: '30px 30px'
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Filter posts created by this user
  const userPosts = posts.filter(p => p.authorName === profile.name || p.authorUsn === profile.usn);

  return (
    <div className="space-y-6">
      {/* 3. HERO COVER BANNER & PROFILE HEADER */}
      <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Panoramic Cover Banner */}
        <div
          className={`h-28 sm:h-36 w-full relative overflow-hidden transition-all duration-300 ${!isCustomCover ? `bg-gradient-to-r ${currentCover.gradientClass}` : ''}`}
          style={{
            backgroundImage: isCustomCover 
              ? `url(${profile.coverStyle})` 
              : `${currentCover.accentGlow}, ${currentCover.bgPattern}`,
            backgroundSize: isCustomCover ? 'cover' : `auto, ${currentCover.bgSize}`,
            backgroundPosition: isCustomCover ? 'center' : 'initial',
          }}
        >
          {/* Subtle tech gridlines overlay */}
          {!isCustomCover && <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />}
        </div>

        {/* Profile Identity Bar: Overlapping Avatar, Name & Action Buttons */}
        <div className="px-5 pb-4 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            {/* Left: Avatar (Overlapping) & User Headline */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 sm:-mt-12">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f8f9fa] dark:bg-[#000000] border-3 sm:border-4 border-[#0C0D0E] ring-2 ring-[#D4A373] shadow-xl flex items-center justify-center text-xl sm:text-2xl font-heading font-extrabold text-[#D4A373] overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  )}
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center sm:text-left mb-0.5">
                <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight flex items-center gap-2 justify-center sm:justify-start">
                  {profile.name}
                  <ShieldCheck className="w-5 h-5 text-[#D4A373]" title="Verified Member" />
                </h1>
                <p className="font-subheading text-xs sm:text-sm text-[#D4A373] font-medium">
                  {profile.role} • {profile.department}
                </p>
              </div>
            </div>

            {/* Right: Actions (Follow, Message) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-1.5 rounded-full text-xs font-subheading font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isFollowing 
                    ? 'bg-gray-50 dark:bg-[#141517] text-gray-900 dark:text-white border border-gray-200 dark:border-[#26282A] hover:bg-gray-100 dark:hover:bg-[#1E2022]' 
                    : 'bg-[#D4A373] text-white dark:text-black hover:bg-[#c49363] border border-transparent shadow-md shadow-[#D4A373]/20'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onMessageClick}
                className="px-3.5 py-1.5 rounded-full bg-[#f8f9fa] dark:bg-[#000000] hover:bg-gray-50 dark:bg-[#141517] text-gray-900 dark:text-white border border-gray-200 dark:border-[#26282A] hover:border-[#D4A373]/50 text-xs font-subheading font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THREE-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ABOUT CARD */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-[#26282A]">About</h3>

            {profile.bio && (
              <p className="font-subheading text-xs text-[#A3A3A3] leading-relaxed">
                {profile.bio}
              </p>
            )}

            <div className="space-y-3 font-subheading text-xs text-gray-700 dark:text-[#D1D5DB]">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>{profile.gender || 'Technical Member'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>Joined {profile.joinDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span className="truncate">{profile.location || 'Ascent Labs'}</span>
              </div>
              
              {/* Followers Stats */}
              <div className="flex items-center gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-[#26282A]">
                <div className="text-center">
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">{profile.followersCount || 124}</span>
                  <span className="text-[10px] text-gray-500 dark:text-[#8E9296]">Followers</span>
                </div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">{profile.followingCount || 89}</span>
                  <span className="text-[10px] text-gray-500 dark:text-[#8E9296]">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: MAIN WORKSPACE FEED */}
        <div className="lg:col-span-6 space-y-6">
          {/* Tab Navigation Header */}
          <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-2 flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded-xl text-xs font-subheading font-medium transition-all cursor-pointer ${
                activeTab === 'posts' ? 'bg-[#D4A373] text-white dark:text-black font-bold' : 'text-gray-500 dark:text-[#8E9296] hover:text-gray-900 dark:text-white'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-xl text-xs font-subheading font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'projects' ? 'bg-[#D4A373] text-white dark:text-black font-bold' : 'text-gray-500 dark:text-[#8E9296] hover:text-gray-900 dark:text-white'
              }`}
            >
              <span>Projects</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#f8f9fa] dark:bg-[#000000]/20 font-bold">{profile.uploadedProjects.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-xl text-xs font-subheading font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'certificates' ? 'bg-[#D4A373] text-white dark:text-black font-bold' : 'text-gray-500 dark:text-[#8E9296] hover:text-gray-900 dark:text-white'
              }`}
            >
              <span>Certificates</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#f8f9fa] dark:bg-[#000000]/20 font-bold">{profile.certificates.length}</span>
            </button>
          </div>

          {/* POSTS TAB CONTENT */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {userPosts.length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-3xl text-center space-y-2">
                  <MessageSquare className="w-8 h-8 text-[#545454] mx-auto" />
                  <p className="text-xs font-subheading text-gray-500 dark:text-[#8E9296]">
                    {profile.name} hasn't published any updates yet.
                  </p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-3xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#141517] border border-[#D4A373]/40 flex items-center justify-center text-xs font-heading font-bold text-[#D4A373] shrink-0">
                        {post.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0 leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-bold text-sm text-gray-900 dark:text-white truncate">
                            {post.authorName}
                          </span>
                        </div>
                        <span className="text-[10px] font-subheading text-gray-500 dark:text-[#8E9296] block truncate">
                          {post.authorRole} • {post.timeAgo}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-subheading text-gray-700 dark:text-[#D1D5DB] leading-relaxed break-words whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Post Media Gallery */}
                    <PostMediaGallery media={post.media} imageUrl={post.imageUrl} videoUrl={post.videoUrl} />
                  </div>
                ))
              )}
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {profile.uploadedProjects.length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-3xl text-center space-y-2">
                  <FolderGit2 className="w-8 h-8 text-[#545454] mx-auto" />
                  <p className="text-xs font-subheading text-gray-500 dark:text-[#8E9296]">
                    No uploaded projects found.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.uploadedProjects.map((proj) => (
                    <div key={proj.id} className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white leading-tight">
                          {proj.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-[#8E9296] line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-[10px] text-gray-500 dark:text-[#8E9296]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CERTIFICATES TAB */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              {profile.certificates.length === 0 ? (
                <div className="p-8 bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-3xl text-center space-y-2">
                  <Award className="w-8 h-8 text-[#545454] mx-auto" />
                  <p className="text-xs font-subheading text-gray-500 dark:text-[#8E9296]">
                    No verified certificates yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {profile.certificates.map((cert) => (
                    <div key={cert.id} className="flex flex-col sm:flex-row gap-3 p-3 bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl">
                      <div className="w-full sm:w-28 h-20 bg-gray-50 dark:bg-[#141517] rounded-xl flex flex-col items-center justify-center shrink-0 border border-gray-200 dark:border-[#26282A] relative overflow-hidden group">
                        <Award className="w-6 h-6 text-[#D4A373] mb-1" />
                        <span className="text-[8px] font-mono-tech text-gray-500 dark:text-[#8E9296] text-center px-2">
                          VERIFIED
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                        <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white mb-0.5 truncate">
                          {cert.title}
                        </h4>
                        <span className="text-[10px] font-subheading text-[#D4A373] mb-1 block">
                          {cert.issuer} • {cert.issueDate}
                        </span>
                        <p className="text-[11px] text-gray-500 dark:text-[#8E9296] leading-relaxed line-clamp-2">
                          {cert.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Mutual Connections / Similar Roles */}
        <div className="hidden xl:block lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-3xl p-5 shadow-xl">
            <h3 className="font-heading text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4A373]" />
              Similar Members
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Sarah Chen', usn: '1MS21IS011', role: 'AI Researcher', dept: 'CSE' },
                { name: 'Jordan Smith', usn: '1MS23EC089', role: 'Hardware Lead', dept: 'ECE' }
              ].map((m, i) => {
                const isMemberFollowed = followedSimilarMembers[m.usn];
                return (
                  <div key={i} className="flex items-center justify-between group">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => onViewPeerProfile?.(m.usn)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center text-xs text-[#D4A373] font-bold">
                        {m.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#D4A373] transition-colors">{m.name}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-[#8E9296]">{m.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFollowedSimilarMembers(prev => ({
                          ...prev,
                          [m.usn]: !prev[m.usn]
                        }));
                      }}
                      className={`p-1.5 rounded-md border transition-all ${
                        isMemberFollowed
                          ? 'bg-gray-50 dark:bg-[#141517] text-[#D4A373] border-[#D4A373]/30'
                          : 'bg-gray-50 dark:bg-[#141517] text-gray-500 dark:text-[#8E9296] hover:text-gray-900 dark:text-white border-gray-200 dark:border-[#26282A] hover:border-[#D4A373]/30'
                      }`}
                    >
                      {isMemberFollowed ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
