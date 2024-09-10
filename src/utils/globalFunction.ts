interface GetDataProps {
  tab?: string
  limit?: number
  page?: number
}

export async function getLogDataFromAPI({ tab = 'all', limit = 10, page = 1 }: GetDataProps) {
  try {
    const response = await fetch(
      `https://test.cura-go.de/web/v3/go.vital/protocol?limit=${limit}&filter=${tab}&page=${page}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Es gab ein Problem mit dem Abrufvorgang:', error)
  }
}
