const Generator = require('yeoman-generator')
const yaml = require('js-yaml')
const { toComponentName, toRouteId, toComponentClassName, capitalize } = require('../../utils/names')
const prettier = require('prettier')

function getComponentType(name, fs, destinationPath) {
  const componentName = toComponentName(name)
  const componentClassName = toComponentClassName(name)
  const sectionPath = `${destinationPath}/src/views/sections/${componentName}/${componentClassName}.js`
  const layoutPath = `${destinationPath}/src/views/layouts/${componentName}/${componentClassName}.js`
  const componentPath = `${destinationPath}/src/views/components/${componentName}/${componentClassName}.js`
  const isSection = fs.exists(sectionPath)
  const isLayout = fs.exists(layoutPath)
  const isComponent = fs.exists(componentPath)
  const isExternal = !isSection && !isLayout && !isComponent
  
  if (isComponent) {
    return 'component'
  } else if (isSection) {
    return 'section'
  } else if (isLayout) {
    return 'layout'
  }
  return 'external'
}

module.exports = class extends Generator {
  initializing() {
    this.index = this.fs.read(`${this.destinationPath()}/src/index.js`)
    let views
    this.index.replace(/componentManager.registerMultiple\(\{([\s\S]+)\}\)/g, (match, list) => {
      views = list.trim().replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '').replace(/\n| /gm, '').split(',')
    })
    this.types = {
      external: [],
      component: [],
      section: [],
      layout: []
    }
    this.imports = {
      external: [],
      component: [],
      section: [],
      layout: []
    }

    views.forEach(name => {
      const type = getComponentType(name, this.fs, this.destinationPath())
      this.types[type].push(name)

      const importRegex = new RegExp('(\\/\\*.*\\*\\/\n?)?(import[{ ,]*' + name + '[} ,]*from[ a-zA-Z-\'\"\/\.\_]*)\n', 'g') 
      this.index = this.index.replace(importRegex, (match, comment, importString) => {
        this.imports[type].push(importString)
        return ''
      })
    })
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Component name"
      }, {
        type: "list",
        name: "componentType",
        message: "Which kind of component do you want to create?",
        choices: ["component", "layout", "section"]
      }
    ]);
  }

  writing() {
    const type = this.answers.componentType
    const isLayout = type === 'layout'
    const isSection = type === 'section'
    const folder = type + 's'
    const name = this.answers.name.trim()
    const className = toComponentClassName(name)
    const routeId = toRouteId(name)
    const componentName = toComponentName(name)
    const props = { 
      ...this.props,
      className,
      componentName,
      name,
      isSection,
      isLayout
    }

    this.fs.copyTpl(
      `${this.templatePath()}/Component.js`,
      `${this.destinationPath()}/src/views/${folder}/${componentName}/${className}.js`,
      props
    )
    this.fs.copyTpl(
      `${this.templatePath()}/component.html`,
      `${this.destinationPath()}/src/views/${folder}/${componentName}/${componentName}.html`,
      props
    )
    this.fs.copyTpl(
      `${this.templatePath()}/component.styl`,
      `${this.destinationPath()}/src/views/${folder}/${componentName}/${componentName}.styl`,
      props
    )

    if (this.answers.isSection) {
      const langs = yaml.safeLoad(this.fs.read(`${this.destinationPath()}/data/languages.yaml`))
      const routes = yaml.safeLoad(this.fs.read(`${this.destinationPath()}/data/routes.yaml`)) 
      // const index = this.fs.read(`${this.destinationPath()}/index.js`)
      // Check if component already exists in routes

      routes.push({
        id: routeId,
        path: componentName
      })

      this.fs.write(`${this.destinationPath()}/data/routes.yaml`, yaml.safeDump(routes))

      langs.forEach(lang => {
        this.fs.copyTpl(
          `${this.templatePath()}/component.yaml`,
          `${this.destinationPath()}/data/${lang}/pages/${componentName}.yaml`,
          props
        )
      })
    }

    this.types[type].push(className)
    this.imports[type].push(`import ${className} from './views/${folder}/${componentName}/${className}'`)

    let list = ''
    let imports = ''
    Object.keys(this.types).forEach(type => {
      // Rewrite components imports
      if (this.imports[type].length) {
        imports += '\n/* ' + capitalize(type) + ' */\n'
        imports += this.imports[type].join('\n')
      }

      // Rewrite components registerings
      if (this.types[type].length) {
        if (list !== '') {
          list += ','
        }
        list += '\n  /* ' + capitalize(type) + ' */\n  '
        list += this.types[type].join(',')
      }
    })
    list += '\n'
    imports += '\n\n'
    this.index = this.index.replace(/componentManager.registerMultiple/g, `${imports}componentManager.registerMultiple`)
    this.index = this.index.replace(/componentManager.registerMultiple\(\{([\s\S]+)\}\)/g, `componentManager.registerMultiple({${list}})`)
    
    this.fs.write(`${this.destinationPath()}/src/index.js`, prettier.format(this.index, { semi: false }))
  }
}