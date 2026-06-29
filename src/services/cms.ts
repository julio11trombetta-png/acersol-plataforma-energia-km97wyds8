import pb from '@/lib/pocketbase/client'

export const getNews = () => pb.collection('news').getFullList({ sort: '-created' })
export const createNews = (data: any) => pb.collection('news').create(data)
export const updateNews = (id: string, data: any) => pb.collection('news').update(id, data)
export const deleteNews = (id: string) => pb.collection('news').delete(id)

export const getBlogPosts = () => pb.collection('blog_posts').getFullList({ sort: '-created' })
export const createBlogPost = (data: any) => pb.collection('blog_posts').create(data)
export const updateBlogPost = (id: string, data: any) =>
  pb.collection('blog_posts').update(id, data)
export const deleteBlogPost = (id: string) => pb.collection('blog_posts').delete(id)
