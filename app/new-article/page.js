import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/Sidebar/index';
import NewArticleForm from './NewArticleForm';

export const metadata = {
    title: 'Create Article - Knowledge Base',
    description: 'Create a new knowledge base article',
};

export default async function NewArticlePage({ searchParams }) {
    // Authenticate server-side to prevent race conditions with cookies
    const forumUser = await getCurrentUser();
    
    if (!forumUser) {
        redirect('/login');
    }

    // Only allow admins to access the create article page
    if (forumUser?.extendedData?.role !== 'admin') {
        redirect('/');
    }

    const initialTitle = searchParams?.title || '';

    return (
        <div className="flex flex-no-wrap">
            <Sidebar data={forumUser} />
            <Suspense fallback={<div className="w-full p-6">Loading...</div>}>
                <NewArticleForm forumUser={forumUser} initialTitle={initialTitle} />
            </Suspense>
        </div>
    );
}
