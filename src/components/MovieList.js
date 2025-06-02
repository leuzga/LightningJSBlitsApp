/* eslint-disable no-case-declarations */
// @ts-nocheck
// Archivo: src/components/MovieList.js - FUENTES CORREGIDAS

import Blits from '@lightningjs/blits'
import ApiService from '../lib/apiService.js'
import MovieItem from './MovieItem.js'

export default Blits.Component('MovieList', {
  template: `
    <Element :w="$appWidth" :h="$appHeight" color="#000000">
      <!-- Header Section con fondo translúcido -->
      <Element x="50" y="30" w="1820" h="90">
        <!-- Fondo translúcido para el header -->
        <Element w="1820" h="90" color="#000000" alpha="0.8" />

        <Text content="🎬 Movies Collection" x="30" y="15" size="24" fontFace="raleway" color="#ffffff" />

        <Text
          content="Press R to reload • Press 1-3 for genres • Press S to search • Page Up/Down to navigate"
          x="30"
          y="45"
          size="16"
          fontFace="lato"
          color="#cccccc"
        />
      </Element>

      <!-- Status Bar con fondo translúcido -->
      <Element x="50" y="130" w="1820" h="35">
        <!-- Fondo translúcido para status -->
        <Element w="1820" h="35" color="#111111" alpha="0.9" />

        <Text :content="$statusText" x="30" y="8" size="16" fontFace="opensans" color="#00ff88" />

        <Text :content="$paginationText" x="1200" y="8" size="14" fontFace="opensans" color="#0099ff" />
      </Element>

      <!-- Loading Indicator -->
      <Element ref="loadingIndicator" x="960" y="400" mount="0.5" :show="$isLoading">
        <Element w="300" h="100" color="#000000" alpha="0.9" mount="0.5">
          <Text content="Loading movies..." x="150" y="30" mount="0.5" size="16" fontFace="lato" color="#ffffff" />
          <Text content="🔄" x="150" y="60" mount="0.5" size="14" fontFace="lato" color="#00ff00" />
        </Element>
      </Element>

      <!-- Error Message -->
      <Element ref="errorMessage" x="960" y="400" mount="0.5" :show="$hasError">
        <Element w="500" h="120" color="#330000" alpha="0.95" mount="0.5">
          <Text
            :content="$errorText"
            x="250"
            y="60"
            mount="0.5"
            size="14"
            fontFace="lato"
            color="#ff9999"
            maxwidth="460"
            maxlines="4"
            align="center"
          />
        </Element>
      </Element>

      <!-- Movies Grid - AREA DEFINIDA -->
      <Element ref="moviesGrid" x="50" y="180" w="1820" h="600" :show="!$isLoading && !$hasError">
        <MovieItem
          :for="(movie, index) in $currentPageMovies"
          :key="$movie.id"
          :movie="$movie"
          :x="($index % $moviesPerRow) * 300"
          :y="Math.floor($index / $moviesPerRow) * 200"
          :ref="'movie' + $index"
          @movieSelected="$onMovieSelected"
        />
      </Element>

      <!-- Navigation Footer con fondo translúcido mejorado -->
      <Element x="50" y="800" w="1820" h="120" :show="!$isLoading && !$hasError">
        <!-- Fondo translúcido para el footer -->
        <Element w="1820" h="120" color="#000000" alpha="0.85" />

        <!-- Línea 1: Navegación básica -->
        <Text
          content="Navigation: Arrow Keys • Enter: Select • Page Up/Down: Change page"
          x="30"
          y="15"
          size="18"
          fontFace="lato"
          color="#aaaaaa"
        />

        <!-- Línea 2: Atajos de teclado -->
        <Text
          content="Shortcuts: R=Reload • 0=All • 1=Drama • 2=Comedy • 3=Action • S=Search"
          x="30"
          y="35"
          size="16"
          fontFace="lato"
          color="#aaaaaa"
        />

        <!-- Línea 3: Estado de navegación -->
        <Text :content="$navigationStatus" x="30" y="55" size="14" fontFace="opensans" color="#888888" />

        <!-- Línea 4: Información adicional -->
        <Text :content="$additionalInfo" x="30" y="75" size="14" fontFace="opensans" color="#666666" />
      </Element>
    </Element>
  `,

  components: {
    MovieItem,
  },

  state() {
    return {
      // Data
      allMovies: [], // Todas las películas
      currentPageMovies: [], // Películas de la página actual
      appWidth: window.innerWidth,
      appHeight: window.innerHeight,
      // UI States
      isLoading: false,
      hasError: false,
      errorText: '',

      // Filter & Search
      currentFilter: 'all',

      // Pagination
      currentPage: 0,
      moviesPerPage: 12, // 2 filas x 6 columnas
      moviesPerRow: 6,

      // Navigation
      focusedIndex: 0,
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.allMovies.length / this.moviesPerPage)
    },

    statusText() {
      const total = this.allMovies.length
      const showing = this.currentPageMovies.length
      const filter = this.currentFilter === 'all' ? 'All Movies' : `Filter: ${this.currentFilter}`
      return `${showing}/${total} movies • ${filter}`
    },

    paginationText() {
      if (this.totalPages <= 1) return ''
      return `Page ${this.currentPage + 1} of ${this.totalPages}`
    },

    navigationStatus() {
      if (this.currentPageMovies.length === 0) return 'No movies to display'

      const focused = this.focusedIndex + 1
      const total = this.currentPageMovies.length
      return `Focus: ${focused}/${total} • Use arrows to navigate grid`
    },

    additionalInfo() {
      const totalMovies = this.allMovies.length
      const currentStart = this.currentPage * this.moviesPerPage + 1
      const currentEnd = Math.min((this.currentPage + 1) * this.moviesPerPage, totalMovies)
      return `Showing movies ${currentStart}-${currentEnd} of ${totalMovies} total • Lightning Blits v3`
    },
  },

  hooks: {
    ready() {
      console.log('🚀 MovieList component ready - loading movies...')
      this.loadMovies()
    },

    focus() {
      // Foco al primer item si existe
      if (this.currentPageMovies.length > 0) {
        this.focusMovieItem(0)
      }
    },
  },

  methods: {
    async loadMovies() {
      this.isLoading = true
      this.hasError = false
      this.errorText = ''

      try {
        const result = await ApiService.fetchMovies()

        if (result.success) {
          this.allMovies = result.data.results
          this.currentFilter = 'all'
          this.currentPage = 0
          this.updateCurrentPage()
          console.log('✅ Movies loaded:', this.allMovies.length)
        } else {
          this.showError(`Failed to load movies: ${result.error}`)
        }
      } catch (error) {
        console.error('💥 Unexpected error:', error)
        this.showError('An unexpected error occurred')
      } finally {
        this.isLoading = false
      }
    },

    async filterByGenre(genreId, genreName) {
      this.isLoading = true
      this.hasError = false

      try {
        const result = await ApiService.fetchMoviesByGenre(genreId)

        if (result.success) {
          this.allMovies = result.data.results
          this.currentFilter = genreName
          this.currentPage = 0
          this.focusedIndex = 0
          this.updateCurrentPage()
          console.log(`🎭 Filtered by ${genreName}:`, this.allMovies.length, 'movies')
        } else {
          this.showError(`Failed to filter movies: ${result.error}`)
        }
      } catch (error) {
        this.showError('Error filtering movies', error)
      } finally {
        this.isLoading = false
      }
    },

    async searchMovies(query) {
      if (!query) {
        this.loadMovies()
        return
      }

      this.isLoading = true
      this.hasError = false

      try {
        const result = await ApiService.searchMovies(query)

        if (result.success) {
          this.allMovies = result.data.results
          this.currentFilter = `Search: "${query}"`
          this.currentPage = 0
          this.focusedIndex = 0
          this.updateCurrentPage()
          console.log(`🔍 Search results for "${query}":`, this.allMovies.length, 'movies')
        } else {
          this.showError(`Search failed: ${result.error}`)
        }
      } catch (error) {
        this.showError('Error searching movies', error)
      } finally {
        this.isLoading = false
      }
    },

    updateCurrentPage() {
      const startIndex = this.currentPage * this.moviesPerPage
      const endIndex = startIndex + this.moviesPerPage
      this.currentPageMovies = this.allMovies.slice(startIndex, endIndex)

      // Resetear focus si estamos fuera del rango
      if (this.focusedIndex >= this.currentPageMovies.length) {
        this.focusedIndex = Math.max(0, this.currentPageMovies.length - 1)
      }

      console.log(
        `📄 Page ${this.currentPage + 1}: showing ${this.currentPageMovies.length} movies`
      )
    },

    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
        this.focusedIndex = 0
        this.updateCurrentPage()
        this.focusMovieItem(0)
      }
    },

    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--
        this.focusedIndex = 0
        this.updateCurrentPage()
        this.focusMovieItem(0)
      }
    },

    showError(message) {
      this.hasError = true
      this.errorText = message
      console.error('❌', message)

      // Auto-hide después de 5 segundos
      this.$setTimeout(() => {
        this.hasError = false
      }, 5000)
    },

    focusMovieItem(index) {
      if (index >= 0 && index < this.currentPageMovies.length) {
        this.focusedIndex = index

        try {
          const movieComponent = this.$select(`movie${index}`)
          if (movieComponent && movieComponent.$focus) {
            movieComponent.$focus()
          }
        } catch (error) {
          console.warn('Could not focus movie item:', index, error)
        }
      }
    },

    onMovieSelected(movie) {
      console.log('🎬 Movie selected in list:', movie.title)
      this.$emit('showMovieDetail', movie)
    },
  },

  input: {
    // Navegación en grid (LIMITADA A PÁGINA ACTUAL)
    right() {
      const currentCol = this.focusedIndex % this.moviesPerRow

      if (
        currentCol < this.moviesPerRow - 1 &&
        this.focusedIndex + 1 < this.currentPageMovies.length
      ) {
        this.focusMovieItem(this.focusedIndex + 1)
      }
    },

    left() {
      const currentCol = this.focusedIndex % this.moviesPerRow

      if (currentCol > 0) {
        this.focusMovieItem(this.focusedIndex - 1)
      }
    },

    down() {
      const newIndex = this.focusedIndex + this.moviesPerRow
      if (newIndex < this.currentPageMovies.length) {
        this.focusMovieItem(newIndex)
      }
    },

    up() {
      const newIndex = this.focusedIndex - this.moviesPerRow
      if (newIndex >= 0) {
        this.focusMovieItem(newIndex)
      }
    },

    // PAGINACIÓN
    pageDown() {
      console.log('📄 Next page requested')
      this.nextPage()
    },

    pageUp() {
      console.log('📄 Previous page requested')
      this.prevPage()
    },

    // Teclas de función
    any(event) {
      switch (event.key.toLowerCase()) {
        case 'r':
          console.log('🔄 Reloading movies...')
          this.loadMovies()
          break
        case '1':
          this.filterByGenre(18, 'Drama')
          break
        case '2':
          this.filterByGenre(35, 'Comedy')
          break
        case '3':
          this.filterByGenre(28, 'Action')
          break
        case 's':
          const queries = ['Anora', 'Captain', 'Lilo', 'Mission', 'Doctor']
          const randomQuery = queries[Math.floor(Math.random() * queries.length)]
          console.log(`🔍 Searching for: ${randomQuery}`)
          this.searchMovies(randomQuery)
          break
        case '0':
          console.log('📋 Showing all movies...')
          this.loadMovies()
          break
        case 'arrowleft':
        case 'arrowright':
        case 'arrowup':
        case 'arrowdown':
          // Estas ya están manejadas por los métodos específicos
          break
        default:
          console.log('🔑 Key pressed:', event.key)
      }
    },
  },
})
