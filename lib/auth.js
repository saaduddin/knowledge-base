import { cookies } from 'next/headers';
import { forumsApi } from './forumsApi';

/**
 * Get the current user from cookies (server component/route handler)
 * @returns {Promise<Object|null>} The current user or null
 */
export async function getCurrentUser() {
    const cookieStore = cookies();
    const forumUserToken = cookieStore.get('forumUserToken')?.value;

    if (!forumUserToken) {
        return null;
    }

    try {
        const { data } = await forumsApi.auth.fetchCurrentUser(forumUserToken);
        if (data?.id) {
            return data;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }

    return null;
}
