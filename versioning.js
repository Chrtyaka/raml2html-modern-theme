const getJson = async () => {
  const response = await fetch('version.json')
  return response.json();
}

let currentVersionLink = null;

const initRootVersion =  (linksObject) => {
  const versionsNumber = getVersionsNumber(linksObject);
  const lastVersion = Math.max(...versionsNumber);
  
  linksObject[`v${lastVersion + 1}`] = currentVersionLink;
  return linksObject;
}

const getVersionsNumber = (linksObject) => Object.keys(linksObject).map(key => parseInt(key.slice(1)));

const getVersionFromUrl = (url) => {
  const startIndex = url.lastIndexOf('/') + 1;
  const endIndex = url.indexOf('_', startIndex);
  if (endIndex === -1) {
    currentVersionLink = url;
    return '';
  } 
  return url.slice(startIndex, endIndex);
}

function sortObject(o) {
  return Object.keys(o).sort().reverse().reduce((r, k) => (r[k] = o[k], r), {});
}

document.addEventListener('DOMContentLoaded', async () => {
  const json = await getJson();
  const { links } = json;
  let linksObject = {};
  links.forEach(link => {
    const version = getVersionFromUrl(link);
    if (!version) {
      return;
    }
    linksObject[version] = link;
  })

  linksObject = initRootVersion(linksObject)
  linksObject = sortObject(linksObject);

  const select = document.getElementById('version-select');

  Object.keys(linksObject).forEach(key => {
    select.options[select.options.length] = new Option(key, linksObject[key]);
  })

  select.addEventListener('change', (event) => {
    document.location.replace(event.target.value);
  })
})
