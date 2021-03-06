import MarkdownIt from 'markdown-it'
import MarkdownItContainer from 'markdown-it-container'
            

const md = new MarkdownIt({
  html:  true,
  highlight: function (str, lang) {
    return `<pre data-code-language="${lang}" ${lang ? 'data-executable="true" data-type="programlisting"' : ''}>${md.utils.escapeHtml(str)}</pre>`
   }
}).use( MarkdownItContainer, 'id', {
  validate: function(params) {
    return params.trim().match(/^\#([A-Za-z]+[\w\-\:\.]*)$/);
  },
  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^\#([A-Za-z]+[\w\-\:\.]*)$/);
    if (tokens[idx].nesting === 1) {
      // opening tag 
      return `<div id="${m[1]}">\n`;
    } else {
      // closing tag 
      return '</div>\n';
    }
  }
});



export default md