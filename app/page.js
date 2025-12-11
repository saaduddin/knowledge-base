import Sidebar from '@/components/Sidebar/index';
import { getCurrentUser } from '@/lib/auth';
import { forumsApi } from '@/lib/forumsApi';
import HomeContent from './HomeContent';

export const metadata = {
    title: 'Demo Foru.ms',
    description: 'A Next.js forum application',
};

export default async function HomePage({ searchParams }) {
    const page = searchParams?.page || 1;
    const forumUser = await getCurrentUser();

    // Fetch threads and posts
    let threads = [];
    let posts = [];
    let nextThreadCursor = null;

    try {
        const [threadsResponse, postsResponse] = await Promise.all([
            forumsApi.threads.fetchAll(page),
            forumsApi.posts.fetchAll(),
        ]);

        threads = threadsResponse.data?.threads || [];
        posts = postsResponse.data?.posts || [];
        nextThreadCursor = threadsResponse.data?.nextThreadCursor || null;
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    return (
        <div className="flex flex-no-wrap">
            <Sidebar data={forumUser} />
            <div className="w-full" id="main-content" role="main">
                <HomeContent 
                    forumUser={forumUser} 
                    initialThreads={threads}
                    posts={posts}
                    currentPage={parseInt(page, 10)}
                    nextThreadCursor={nextThreadCursor}
                />
            </div>
        </div>
    );
}
