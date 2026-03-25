import DefaultTheme from 'vitepress/theme'
import './custom.css'
import FeatureGrid from './components/FeatureGrid.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FeatureGrid', FeatureGrid)
  }
}
