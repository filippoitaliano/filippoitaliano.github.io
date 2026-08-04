class Footer {

  /**
   * The last line of the page: the version of the site and nothing else.
   */
  static appendTo(parentNode) {
    appendInnerHtmlTemplate(parentNode, 'footer', `
      <footer class="footer" id="footer">
        <hr />
        <span class="footer-version">v${SITE_VERSION}</span>
      </footer>
    `);
  }

}
