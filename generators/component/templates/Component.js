import Component from 'brindille-component'
<% if (isSection) { %>import classes from 'dom-classes'<% } %>

export default class <%= className %> extends Component {<% if (isSection) { %>
  transitionIn (callback) {
    setTimeout(callback, 0)
    classes.remove(this.$el, 'hidden')
  }

  transitionOut (callback) {
    setTimeout(callback, 0)
  }
<% } %>}