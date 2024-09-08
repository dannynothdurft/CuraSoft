import axios from 'axios'

interface GetDataProps {
  tab?: string
  limit?: number
  page?: number
}

export async function getData({ tab = 'all', limit = 10, page = 1 }: GetDataProps) {
  try {
    const response = await axios.get(
      'https://test.cura-go.de/web/v3/go.vital/protocol?filter=all&page=1',
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN}`
        },
        params: {
          limit: limit,
          filter: tab,
          page: page
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Es gab ein Problem mit dem Abrufvorgang:', error)
  }
}
