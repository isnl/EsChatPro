import MarkdownIt from "markdown-it";
import mdKatex from "@traptitech/markdown-it-katex";
import mila from "markdown-it-link-attributes";
import hljs from "highlight.js";
import fs from "fs";

const requestTpl = fs.readFileSync("src/routes/share/request.html", "utf-8");
const replyTpl = fs.readFileSync("src/routes/share/reply.html", "utf-8");
const shareTpl = fs.readFileSync("src/routes/share/shareTemplate.html", "utf-8");

function highlightBlock(str, lang) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`;
}

function getReplyContent(content) {
  const mdi = new MarkdownIt({
    linkify: true,
    highlight(code, language) {
      const validLang = !!(language && hljs.getLanguage(language));
      if (validLang) {
        const lang = language ?? "";
        return highlightBlock(
          hljs.highlight(code, { language: lang }).value,
          lang
        );
      }
      return highlightBlock(hljs.highlightAuto(code).value, "");
    },
  });

  mdi.use(mila, { attrs: { target: "_blank", rel: "noopener" } });
  mdi.use(mdKatex, {
    blockClass: "katexmath-block rounded-md p-[10px]",
    errorColor: " #cc0000",
  });

  return mdi.render(content);
}

function getContentList(list) {
  let contentList = "";
  for (let i = 0; i < list.length; i++) {
    const { role, time, content, id } = list[i];
    if (role === "user") {
      contentList += requestTpl
        .replace("{{id}}", id)
        .replace("{{content}}", content)
        .replace("{{time}}", time);
    } else {
      contentList += replyTpl
        .replace("{{id}}", id)
        .replace("{{content}}", getReplyContent(content))
        .replace("{{time}}", time);
    }
  }
  return contentList;
}
/**
 * 根据shareInfo生成静态html文件
 * @param info
 */
export function generatHtmlByShareInfo(info) {
  const { _id, create_time, title } = info;
  const html = shareTpl
    .replace("{{title}}", `${title} - ${create_time}`)
    .replace("{{keywords}}", title)
    .replace("{{description}}", title)
    .replace("{{content}}", getContentList(info.content))
    .replace("{{ shareInfo }}", encodeURIComponent(JSON.stringify(info)))
  fs.writeFileSync(`shareStatic/${_id}.html`, html);
}
