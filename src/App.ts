import Blits from '@lightningjs/blits'

// import Home from './pages/Home'
import MovieList from './components/MovieList'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>`,
  routes: [{ path: "/", component: MovieList }],

  components: {
    MovieList,
  },

  state() {
    return {
      currentView: "list",
    };
  },

  hooks: {
    ready() {
      console.log("🎉 App ready! Lightning Blits v3 + JSON API simulation");
      console.log("📁 Loading movies from: /src/data/movies.json");
    },
  },

  methods: {
    onShowMovieDetail(movie: { title: any; }) {
      console.log("🎬 Show movie detail:", movie.title);
      // Aquí puedes implementar navegación a vista de detalle
      // O usar el router de Blits para navegar a otra página
    },
  },

  input: {
    // Input global de la aplicación
    back() {
      console.log("🔙 Back pressed");
      // Lógica para volver atrás
    },
  },
});
