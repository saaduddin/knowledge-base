import Sidebar from '@/components/Sidebar/index';
import { getCurrentUser } from '@/lib/auth';
import { forumsApi } from '@/lib/forumsApi';
import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';

export async function generateMetadata({ params }) {
    const { id } = params;
    
    try {
        const { data } = await forumsApi.articles.fetchById(id);
        return {
            title: `${data?.title || 'Article'} - Knowledge Base`,
        };
    } catch (error) {
        return {
            title: 'Article - Knowledge Base',
        };
    }
}

export default async function ArticlePage({ params }) {
    const { id } = params;
    const forumUser = await getCurrentUser();
    
    // Fetch article data
    let articleData = null;
    try {
        const { data } = await forumsApi.articles.fetchById(id);
        articleData = data;
    } catch (error) {
        console.error('Error fetching article:', error);
        notFound();
    }
    
    // Fetch all data in parallel
    let articleComments = [];
    let recentArticles = [];
    let recentComments = [];

    try {
        const [articleCommentsResponse, recentArticlesResponse, recentCommentsResponse] = await Promise.all([
            forumsApi.articles.fetchComments(id),
            forumsApi.articles.fetchAll(),
            forumsApi.comments.fetchAll(),
        ]);

        articleComments = articleCommentsResponse.data?.posts || [];
        recentArticles = recentArticlesResponse.data?.threads || [];
        recentComments = recentCommentsResponse.data?.posts || [];
    } catch (error) {
        console.error('Error fetching article data:', error);
    }

    return (
        <div className="flex flex-no-wrap">
            <Sidebar data={forumUser} />
            <div className="w-full">
                <ArticleContent 
                    forumUser={forumUser}
                    articleData={articleData}
                    articleComments={articleComments}
                    recentArticles={recentArticles}
                    recentComments={recentComments}
                    articleId={id}
                />
            </div>
        </div>
    );
}
