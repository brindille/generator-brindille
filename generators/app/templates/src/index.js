import componentManager from './lib/core/ComponentManager'
import Component from 'brindille-component'
import { initRouter } from './lib/router'
import 'whatwg-fetch'
import 'gsap'
import './styles/index.styl'

/* External */
import { View } from 'brindille-router'
/* Section */
import Home from './views/sections/home/Home'
import About from './views/sections/about/About'

componentManager.registerMultiple({
  /* Layouts */
  View,
  /* Sections */
  Home,
  About
})

let rootComponent = new Component(document.body, componentManager.get)
componentManager.setRootComponent(rootComponent)

const router = initRouter(rootComponent)
router.start()
