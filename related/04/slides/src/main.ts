import Slides from './videos/04-effect-for-beginners/slides.svelte'
import '@styles/tailwind.css'

const app = new Slides({
	target: document.getElementById('app'),
})

export default app
