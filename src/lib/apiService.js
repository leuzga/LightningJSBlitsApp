// @ts-nocheck
class ApiService {
  static async fetchMovies() {
    try {
      // Simular comportamiento de API real
      console.log('🔄 Fetching movies from local JSON...')

      // En desarrollo, el archivo estará en /src/data/movies.json
      // Vite automáticamente sirve los archivos desde src como estáticos
      const response = await fetch('/data/movies.json')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Simular delay de red (opcional)
      await new Promise((resolve) => setTimeout(resolve, 300))

      console.log('✅ Movies loaded successfully:', data.results.length, 'items')

      return {
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('❌ Error fetching movies:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }
  }

  // Método para filtrar por género
  static async fetchMoviesByGenre(genreId) {
    const result = await this.fetchMovies()

    if (result.success) {
      const filteredMovies = result.data.results.filter(
        (movie) => movie.genre_ids && movie.genre_ids.includes(genreId)
      )

      return {
        ...result,
        data: {
          ...result.data,
          results: filteredMovies,
          total_results: filteredMovies.length,
        },
      }
    }

    return result
  }

  // Método para buscar por título
  static async searchMovies(query) {
    const result = await this.fetchMovies()

    if (result.success && query) {
      const searchResults = result.data.results.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.overview.toLowerCase().includes(query.toLowerCase())
      )

      return {
        ...result,
        data: {
          ...result.data,
          results: searchResults,
          total_results: searchResults.length,
        },
      }
    }

    return result
  }
}

export default ApiService
