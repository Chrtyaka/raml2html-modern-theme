const getJson = async () => {
  const response = await fetch('version.json')
  return response.json();
}

const getVersionFromUrl = (url) => {
  const startIndex = url.lastIndexOf('/') + 1;
  const endIndex = url.indexOf('_', startIndex);
  return url.slice(startIndex, endIndex);
}

document.addEventListener('DOMContentLoaded', async () => {
  const json = await getJson();
  const { links } = json;
  const linksObject = {};
  links.forEach(link => {
    const version = getVersionFromUrl(link);
    linksObject[version] = link;
  })

  const select = document.getElementById('version-select');

  Object.keys(linksObject).forEach(key => {
    select.options[select.options.length] = new Option(key, linksObject[key]);
  })

  select.addEventListener('change', (event) => {
    document.location.replace(event.target.value);
  })
})
