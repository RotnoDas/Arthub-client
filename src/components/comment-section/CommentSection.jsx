'use client';

import React, { useState, useEffect } from 'react';
import { Button, Avatar } from '@heroui/react';
import toast from 'react-hot-toast';
import { FaPaperPlane, FaLock } from 'react-icons/fa';
import Link from 'next/link';

const CommentSection = ({ artworkId, session }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/comments/${artworkId}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [artworkId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const commentData = {
                artworkId,
                text: newComment,
                userEmail: session.user.email,
                userName: session.user.name || session.user.email.split('@')[0],
                avatar: session.user.image || `https://ui-avatars.com/api/?name=${session.user.name || session.user.email}&background=random`
            };

            const res = await fetch(`http://localhost:5000/api/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData)
            });

            if (res.ok) {
                const postedComment = await res.json();
                // Optimistically update the UI
                setComments([{ ...commentData, _id: postedComment.insertedId, createdAt: new Date().toISOString() }, ...comments]);
                setNewComment('');
                toast.success('Comment posted!');
            } else {
                toast.error('Failed to post comment.');
            }
        } catch (error) {
            toast.error('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 pt-16 border-t border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-2">
                Discussion <span className="bg-slate-100 text-slate-500 text-sm py-1 px-3 rounded-full">{comments.length}</span>
            </h3>

            {/* Comment Input */}
            <div className="mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
                {!session ? (
                    <div className="text-center py-8">
                        <FaLock className="mx-auto text-slate-300 w-8 h-8 mb-4" />
                        <h4 className="text-lg font-bold text-slate-700 mb-2">Join the conversation</h4>
                        <p className="text-slate-500 mb-6">You must be logged in to leave a comment.</p>
                        <Link href="/login">
                            <Button className="bg-slate-900 text-white font-bold px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                Log In to Comment
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-4 items-start">
                        <Avatar src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name || session.user?.email}&background=random`} />
                        <div className="flex-1 space-y-3">
                            <textarea
                                placeholder="What do you think about this artwork?"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                                className="w-full bg-white text-slate-700 border-2 border-slate-200 shadow-sm hover:border-fuchsia-300 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/20 rounded-2xl transition-all p-4 outline-none resize-y font-medium"
                            />
                            <div className="flex justify-end">
                                <Button 
                                    type="submit" 
                                    isLoading={isSubmitting}
                                    isDisabled={!newComment.trim()}
                                    className="bg-fuchsia-600 text-white font-bold rounded-xl shadow-md shadow-fuchsia-200 hover:shadow-fuchsia-300 hover:bg-fuchsia-700 transition-all"
                                >
                                    {!isSubmitting && <FaPaperPlane className="mr-2 text-xs" />} Post Comment
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="text-center text-slate-400 py-8 font-medium animate-pulse">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-slate-400 py-12 font-medium bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <Avatar src={comment.avatar} className="flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-slate-900">{comment.userName}</span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
