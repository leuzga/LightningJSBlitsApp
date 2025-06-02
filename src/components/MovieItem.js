// @ts-nocheck

// Archivo: src/components/MovieItem.js - VERSIÓN COMPACTA

import Blits from '@lightningjs/blits'

export default Blits.Component('MovieItem', {
  template: `
    <Element w="280" h="180" color="#1a1a1a" alpha="0.8">
      <!-- Fondo translúcido para mejor contraste -->
      <Element w="280" h="180" color="#000000" alpha="0.4" />

      <!-- Poster de la película -->
      <Element ref="poster" w="120" h="160" x="10" y="10" color="#333333">
        <Element :show="$posterLoaded" w="120" h="160" :src="$posterUrl" />
        <Text :show="!$posterLoaded" content="🎬" x="60" y="80" mount="0.5" size="18" fontFace="regular" color="#666666" />
      </Element>

      <!-- Información de la película (al lado del poster) -->
      <Element x="140" y="10" w="130" h="160">
        <!-- Fondo translúcido para el texto -->
        <Element w="130" h="160" color="#000000" alpha="0.6" />

        <Text
          ref="title"
          :content="$movie.title"
          x="5"
          y="5"
          size="16"
          fontFace="bold"
          color="#ffffff"
          maxwidth="120"
          maxlines="2"
        />

        <Text :content="$ratingText" x="5" y="30" size="18" fontFace="regular" color="#ffd700" />

        <Text :content="$genreText" x="5" y="45" size="16" fontFace="regular" color="#aaaaaa" maxwidth="120" maxlines="1" />

        <Text :content="$yearText" x="5" y="60" size="12" fontFace="regular" color="#888888" />

        <Text :content="$typeText" x="5" y="75" size="12" fontFace="regular" color="#00aaff" />

        <!-- Descripción breve con fondo -->
        <Text
          :content="$briefDescription"
          x="5"
          y="95"
          size="12"
          fontFace="regular"
          color="#cccccc"
          maxwidth="120"
          maxlines="4"
        />
      </Element>

      <!-- Indicador de foco -->
      <Element ref="focusIndicator" w="280" h="180" color="#00ff00" alpha="0" />
    </Element>
  `,

  props: ['movie'],

  state() {
    return {
      posterLoaded: false,
      genreMap: {
        18: 'Drama',
        35: 'Comedy',
        10749: 'Romance',
        27: 'Horror',
        53: 'Thriller',
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        80: 'Crime',
        9648: 'Mystery',
        10751: 'Family',
        878: 'Sci-Fi',
        14: 'Fantasy',
        10759: 'Action & Adventure',
        10765: 'Sci-Fi & Fantasy',
      },
    }
  },

  computed: {
    posterUrl() {
      if (this.movie && this.movie.poster_path) {
        return `https://image.tmdb.org/t/p/w200${this.movie.poster_path}`
      }
      return ''
    },

    ratingText() {
      if (this.movie && this.movie.vote_average) {
        return `⭐ ${this.movie.vote_average.toFixed(1)}`
      }
      return 'No rating'
    },

    genreText() {
      if (this.movie && this.movie.genre_ids && this.movie.genre_ids.length > 0) {
        const genres = this.movie.genre_ids
          .slice(0, 2)
          .map((id) => this.genreMap[id] || 'Unknown')
          .join(', ')
        return genres
      }
      return 'No genre'
    },

    yearText() {
      if (this.movie) {
        const date = this.movie.release_date || this.movie.first_air_date
        if (date) {
          return new Date(date).getFullYear().toString()
        }
      }
      return ''
    },

    typeText() {
      if (this.movie) {
        return this.movie.media_type === 'tv' ? '📺 TV Series' : '🎬 Movie'
      }
      return ''
    },

    briefDescription() {
      if (this.movie && this.movie.overview) {
        // Mostrar solo los primeros 80 caracteres
        const brief = this.movie.overview.substring(0, 80)
        return brief.length < this.movie.overview.length ? brief + '...' : brief
      }
      return 'No description available'
    },
  },

  hooks: {
    ready() {
      // Simular carga de poster más rápida
      if (this.posterUrl) {
        this.$setTimeout(
          () => {
            this.posterLoaded = true
          },
          Math.random() * 500 + 200
        )
      }
    },

    focus() {
      console.log('🎬 Movie focused:', this.movie?.title)
      // Animación de foco más sutil
      this.$select('focusIndicator').setSmooth('alpha', 0.2, { duration: 150 })
      this.setSmooth('scale', 1.02, { duration: 150 })
      this.setSmooth('alpha', 1, { duration: 150 })
    },

    unfocus() {
      // Animación de pérdida de foco
      this.$select('focusIndicator').setSmooth('alpha', 0, { duration: 150 })
      this.setSmooth('scale', 1, { duration: 150 })
      this.setSmooth('alpha', 0.8, { duration: 150 })
    },
  },

  input: {
    enter() {
      console.log('🚀 Movie selected:', this.movie?.title)
      // Animación de selección
      this.setSmooth('scale', 0.98, { duration: 100 })
      this.$setTimeout(() => {
        this.setSmooth('scale', 1.02, { duration: 100 })
      }, 100)

      // Emitir evento al componente padre
      this.$emit('movieSelected', this.movie)
    },
  },
})
