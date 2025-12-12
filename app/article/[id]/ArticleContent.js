'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { clientApi } from '@/lib/clientApi';
import Threads from '@/components/Threads';
import Posts from '@/components/Posts';

export default function ArticleContent({ forumUser, articleData, articleComments, recentArticles, recentComments, articleId }) {
    const router = useRouter();
    const [isSubmitting, setSubmittingState] = useState(false);
    const [formData, setFormData] = useState({ body: '' });

    const onChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmittingState(true);

        if (!articleId) {
            toast.error('Article ID is missing. Please refresh the page.');
            setSubmittingState(false);
            return;
        }

        if (forumUser?.id) {
            try {
                const data = await clientApi.comments.create(
                    formData.body,
                    articleId,
                    forumUser.id
                );
                
                if (data?.id) {
                    toast.success('Comment successfully added!');
                    router.refresh();
                } else if (data?.message) {
                    toast.error(data.message);
                }
                setSubmittingState(false);
            } catch (error) {
                console.error('Error creating comment:', error);
                setSubmittingState(false);
                toast.error(error.message || 'An error occurred while creating the comment.');
            }
        } else {
            toast.error('You must be logged in to add a comment.');
            setSubmittingState(false);
        }
    };

    return (
        <div className="w-full px-6">
            <div className="lg:flex flex-wrap">
                <div className="py-10 lg:w-2/3 w-full md:pr-6 sm:border-r border-gray-300">
                    <Link href="/">
                        <div className="flex items-center">
                            <div className="mr-3 w-6 h-6 rounded-full text-gray-500 border border-gray-500 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-chevron-left"
                                    width={18}
                                    height={18}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <polyline points="15 6 9 12 15 18" />
                                </svg>
                            </div>
                            <h4 className="text-xl text-gray-900">Knowledge Base</h4>
                        </div>
                    </Link>
                    <h1 className="my-6 text-4xl font-medium text-gray-900">{articleData?.title}</h1>
                    <div className="md:flex items-center">
                        <div className="md:mt-0 mt-4 flex items-center text-gray-600">
                            <p className="text-gray-600 text-xs">
                                by <span className="text-blue-500">{articleData?.user?.username}</span>
                            </p>
                            <div className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
                            <p className="text-gray-600 text-xs">{articleData?.createdAt}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm">{articleData?.body}</p>
                    
                    <form method="POST" onSubmit={onSubmit} className="mt-8 flex flex-col">
                        <textarea
                            name="body"
                            value={formData.body}
                            onChange={onChange}
                            placeholder="Add a comment to this article"
                            className="pl-6 pt-2 bg-gray-100 w-full h-24 resize-none focus:outline-none focus:border-blue-400 border border-transparent text-gray-800"
                        />
                        <div className="w-full pt-3">
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="bg-blue-700 text-sm text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out py-2 px-6 sm:mt-0 mt-4 float-right disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Adding...' : 'Add comment'}
                            </button>
                        </div>
                    </form>
                    
                    {articleData?._count?.Post > 0 && (
                        <>
                            <div className="my-8 text-gray-900 text-xl">Comments</div>
                            <Posts data={articleComments} />
                        </>
                    )}
                </div>
                <div className="py-10 lg:w-1/3 w-full md:pl-6">
                    <h3 className="mb-5 text-gray-900 font-medium text-xl">Related articles</h3>
                    <Threads data={recentArticles} limit={5} />
                </div>
            </div>
        </div>
    );
}
