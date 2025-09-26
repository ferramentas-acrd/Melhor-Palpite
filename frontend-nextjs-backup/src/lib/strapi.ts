import axios from 'axios'

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const apiToken = process.env.STRAPI_API_TOKEN

const strapi = axios.create({
  baseURL: `${strapiUrl}/api`,
  headers: {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
  },
})

export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface Article {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt?: string
    content: string
    author: string
    categoryName?: string
    readTime: number
    featured: boolean
    views: number
    seoTitle?: string
    seoDescription?: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface Category {
  id: number
  attributes: {
    name: string
    slug: string
    description?: string
    color: string
    icon?: string
    featured: boolean
    order: number
    seoTitle?: string
    seoDescription?: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface Team {
  id: number
  attributes: {
    name: string
    slug: string
    shortName?: string
    nickname?: string
    description?: string
    primaryColor: string
    secondaryColor: string
    founded?: number
    stadium?: string
    city?: string
    state?: string
    country: string
    league?: string
    position?: number
    points: number
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
    website?: string
    socialMedia?: any
    featured: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export const api = {
  // Articles
  getArticles: async (params?: any): Promise<StrapiResponse<Article[]>> => {
    const response = await strapi.get('/articles', { params })
    return response.data
  },

  getArticle: async (id: string | number): Promise<StrapiResponse<Article>> => {
    const response = await strapi.get(`/articles/${id}`)
    return response.data
  },

  getArticleBySlug: async (slug: string): Promise<StrapiResponse<Article[]>> => {
    const response = await strapi.get('/articles', {
      params: {
        'filters[slug][$eq]': slug
      }
    })
    return response.data
  },

  // Categories
  getCategories: async (params?: any): Promise<StrapiResponse<Category[]>> => {
    const response = await strapi.get('/categories', { params })
    return response.data
  },

  getCategory: async (id: string | number): Promise<StrapiResponse<Category>> => {
    const response = await strapi.get(`/categories/${id}`)
    return response.data
  },

  getCategoryBySlug: async (slug: string): Promise<StrapiResponse<Category[]>> => {
    const response = await strapi.get('/categories', {
      params: {
        'filters[slug][$eq]': slug
      }
    })
    return response.data
  },

  // Teams
  getTeams: async (params?: any): Promise<StrapiResponse<Team[]>> => {
    const response = await strapi.get('/teams', { params })
    return response.data
  },

  getTeam: async (id: string | number): Promise<StrapiResponse<Team>> => {
    const response = await strapi.get(`/teams/${id}`)
    return response.data
  },

  getTeamBySlug: async (slug: string): Promise<StrapiResponse<Team[]>> => {
    const response = await strapi.get('/teams', {
      params: {
        'filters[slug][$eq]': slug
      }
    })
    return response.data
  },
}

export default strapi