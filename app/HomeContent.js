'use client';

import { useState } from 'react';
import Link from 'next/link';
import Search from './Search';
import Threads from '@/components/Threads';
import Posts from '@/components/Posts';

export default function HomeContent({ forumUser, initialArticles, comments, currentPage, nextArticleCursor }) {
    const [articlesData, setArticlesData] = useState(initialArticles || []);
    const [title, setTitle] = useState('');

    return (
        <div className="w-full px-6">
            <div className="lg:flex flex-wrap">
                <div className="py-10 lg:w-2/3 w-full md:pr-6">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Link href="/"><h1 className="text-3xl text-gray-900 font-bold">Knowledge Base</h1></Link>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-2">Powered by</span>
                                <a href="https://foru.ms" data-tooltip="Foru.ms" className="tooltip" target="_blank" rel="noopener noreferrer" aria-label="Foru.ms">
                                    <img
                                        src="/foru-ms.svg"
                                        alt="Foru.ms"
                                        title="Foru.ms"
                                        className="h-6 w-auto"
                                    />
                                </a>
                            </div>
                        </div>
                        {forumUser && (<p className="text-gray-600 text-sm">Welcome, {forumUser.username}</p>)}
                        <div className="flex flex-col mt-10 md:flex-row md:items-center">
                            <Search onSearchResults={setArticlesData} />
                            {forumUser?.extendedData?.role === 'admin' && (
                                <div className="w-full md:w-1/2 pt-3 md:pt-0 md:pl-3 md:border-l border-gray-300">
                                    <h3 className="text-xl text-gray-900 mb-2">Create an article</h3>
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="post_thread"
                                            className="text-gray-800 text-sm font-bold leading-tight tracking-normal mb-2"
                                        >
                                            Article title
                                        </label>
                                        <div className="relative w-full mb-2">
                                            <input
                                                id="post_thread"
                                                className="text-gray-600 focus:outline-none focus:border focus:border-blue-700 bg-gray-100 font-normal w-full h-10 flex items-center pl-4 text-sm border-gray-300 rounded border"
                                                placeholder="Type a title"
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="w-full md:w-1/2" />
                                        <div className="w-full md:w-1/2 md:flex md:mb-0 mb-4 justify-end">
                                            <Link
                                                className="bg-blue-700 text-sm text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out py-2 px-6 sm:mt-0 mt-4"
                                                href={{
                                                    pathname: forumUser ? '/new-article' : '/login',
                                                    query: title && { title },
                                                }}
                                            >
                                                Continue
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-6">
                            <Threads data={articlesData} />
                        </div>
                        <div className="flex justify-between mt-6">
                            {currentPage > 1 && (
                                <Link href={`/?page=${currentPage - 1}`} className="text-blue-500">
                                    Previous
                                </Link>
                            )}
                            {nextArticleCursor && (
                                <Link href={`/?page=${currentPage + 1}`} className="text-blue-500">
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
