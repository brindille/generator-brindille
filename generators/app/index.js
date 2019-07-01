const Generator = require('yeoman-generator')
const { fixDotfiles } = require('./fix-dotfiles')

module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "title",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "author",
        message: "Project's author"
      }
    ]);
  }

  writing() {
    const title = this.answers.title
    const name = this.answers.title.toLowerCase().trim().split(' ').join('-')
    const author = this.answers.author
    const props = { 
      ...this.props,
      title,
      name,
      author
    }

    this.fs.copyTpl(
      `${this.templatePath()}/**/*`,
      this.destinationPath(),
      props
    )

    fixDotfiles(this)

    this.npmInstall()
  }
}