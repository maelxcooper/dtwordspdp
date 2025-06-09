$(document).ready(function () {

  $('#processBtn').on('click', function () {
    const inputHtml = $('#inputHtml').val().trim();

      if (!inputHtml) {
    alert('No text input');
    return; 
  }
    const container = $('<div></div>').html(inputHtml);

    // Tags to skip processing inside (for safety)
    const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE'];


function processTextNodes(node) {
  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      child.nodeValue = child.nodeValue.replace(/(^|\s)([\p{L}’']{1,3})\s+/gu, (match, leading, word, offset, string) => {
        const stripped = word.replace(/['’]/g, '');

        if (stripped.length === 0 || stripped.length > 3) return match;

        const afterIdx = offset + match.length;
        const nextChar = string[afterIdx] || '';

        // Skip if word ends with apostrophe
        if (/['’]$/.test(word)) return match;

        // Skip if followed by punctuation
        if (/^[-.,!?;:]/.test(nextChar)) return match;

        // Return leading space (or line start), word + &nbsp; (no space after)
        return leading + word + '\u00A0';
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
