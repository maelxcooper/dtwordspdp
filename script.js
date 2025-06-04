$(document).ready(function () {

  $('#processBtn').on('click', function () {
    const inputHtml = $('#inputHtml').val().trim();

      if (!inputHtml) {
    alert('No text input');
    return; // stop processing
  }
    const container = $('<div></div>').html(inputHtml);

    // Tags to skip processing inside (for safety)
    const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE'];

    function processTextNodes(node) {
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          // Add &nbsp; after 1-3 letter words, even at end of text
          child.nodeValue = child.nodeValue.replace(/\b([a-zA-Z]{1,3})(\s|$)/g, (match, p1, p2) => {
            return p1 + '\u00A0';
          });
        } else if (child.nodeType === Node.ELEMENT_NODE && !skipTags.includes(child.tagName)) {
          processTextNodes(child);
        }
      });
    }

    processTextNodes(container[0]);

    // Get the processed HTML string
    let outputHtml = container.html();

    // Add self-closing slashes to <source> and <img> tags (XHTML style)
    // This is a simple regex fix, works in typical cases
    outputHtml = outputHtml.replace(/<(source|img)([^>]*)>/g, (match, tagName, attrs) => {
      // If already self-closed, leave it
      if (match.endsWith('/>')) return match;
      // Else add slash before >
      return `<${tagName}${attrs} />`;
    });

    // Show output with fixed self-closing tags
    $('#outputBox').text(outputHtml);
    $('#copyBtn').show();
  });

  $('#copyBtn').on('click', function () {
    const textToCopy = $('#outputBox').text();
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Output HTML copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy. Try manually.');
    });
  });

  $('#clearBtn').on('click', function () {
    $('#inputHtml').val('');
    $('#outputBox').empty();
    $('#copyBtn').hide();
  });
});
