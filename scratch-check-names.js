const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Response status:", res.statusCode);
    
    // Find the SVG content
    const svgStart = data.indexOf('<svg class="h-full w-full"');
    if (svgStart === -1) {
      console.log("SVG not found in the HTML response!");
      return;
    }
    const svgEnd = data.indexOf('</svg>', svgStart) + 6;
    const svgHtml = data.slice(svgStart, svgEnd);
    
    // Extract all text tags
    const names = [];
    const textRegex = /<text[^>]*>([^<]+)<\/text>/g;
    let match;
    while ((match = textRegex.exec(svgHtml)) !== null) {
      names.push(match[1]);
    }
    
    console.log("Total names in SVG:", names.length);
    console.log("Names in SVG:", names);
  });
}).on('error', (err) => {
  console.error("Error fetching page:", err.message);
});
