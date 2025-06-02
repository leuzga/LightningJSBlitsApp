import Blits from "@lightningjs/blits";
import Loader from "../components/Loader";

const colors = ["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa"];

export default Blits.Component("Home", {
  components: {
    Loader,
  },
  template: `
    <Element :w="$appWidth" :h="$appHeight" color="#1e293b" flex="1" align="center" justify="center">
      <Element :y.transition="$y">
        <!-- Logo centrado -->
        <Element
          src="assets/logo.png"
          w="200"
          h="200"
          :scale.transition="{value: $scale, duration: 500}"
          :rotation.transition="{value: $rotation, duration: 800}"
          :x.transition="{value: $logoX, delay: 200, duration: 1200, easing: 'cubic-bezier(1,-0.64,.39,1.44)'}"
          mount="{x: 0.5}"
          y="320"
          :effects="[$shader('radius', {radius: 8})]"
        />
    
        <!-- Loader dinámico -->
        <Loader
          :x="$appWidth / 2"
          mount="{x: 0.5}"
          y="600"
          w="160"
          :alpha.transition="$loaderAlpha"
          :loaderColor="$color"
        />
    
        <!-- Texto responsivo -->
        <Element y="600" :alpha.transition="$textAlpha">
          <Text size="80" align="center" maxwidth="$appWidth" :x="$appWidth / 2" mount="{x: 0.5}">Hello!</Text>
          <Text
            size="50"
            align="center"
            y="120"
            :x="$appWidth / 2"
            maxwidth="500"
            lineheight="64"
            mount="{x: 0.5}"
            color="#ffffffaa"
            content="Let's get started with Lightning 3 & Blits"
          />
        </Element>
      </Element>
    </Element>`,
  state() {
    return {
      appWidth: window.innerWidth,
      appHeight: window.innerHeight,

      logoX: window.innerWidth / 2,
      // Estados de animaciones
      y: 0,
      rotation: 0,
      scale: 1,
      loaderAlpha: 0,
      textAlpha: 0,
      color: "",
    };
  },
  hooks: {
    init() {
      // Escuchar evento local de resize
      this.$listen("resize-detected", this.handleResizeEvent);

      // Iniciar simulación de redimensionamiento cada segundo
      this.simulateResize();
    },
    ready() {
      this.loaderAlpha = 1;
      this.x = this.appWidth / 2;

      this.$setTimeout(() => {
        this.rotation = 720;
        this.scale = 1.5;
      }, 3000);

      this.$setTimeout(() => {
        this.scale = 1;
      }, 3000 + 300);

      this.$setTimeout(() => {
        this.y = -60;
        this.loaderAlpha = 0;
        this.textAlpha = 1;
      }, 6000);
    },
  },
  methods: {
    simulateResize() {
      const checkSize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (width !== this.appWidth || height !== this.appHeight) {
          this.$emit("resize-detected", { width, height });
        }

        requestAnimationFrame(checkSize);
      };

      checkSize();
    },

    handleResizeEvent() {
      // Actualizar dimensiones
      this.appWidth = window.innerWidth;
      this.appHeight = window.innerHeight;

      // Recalcular posición del logo
      this.logoX = this.appWidth / 2;

      // Notificar a Blits que estas variables han cambiado
      this.$trigger("appWidth");
      this.$trigger("appHeight");
      this.$trigger("logoX");
      this.$trigger("textX");
    },
  },
});
